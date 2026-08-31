import {
  Product,
  ProductionOrder,
  DynamicGoalBreakdown,
  DynamicOrderAllocation,
  ProductionSummaryKpis,
  OrderPriority,
} from '../types/production';

// Multipliers based on order priority
const PRIORITY_MULTIPLIER: Record<OrderPriority, number> = {
  CRITICAL_RUSH: 1.25, // 25% extra allocation surge
  HIGH: 1.10,          // 10% extra allocation surge
  MEDIUM: 1.0,         // Normal allocation
  STANDARD: 0.90,      // Standard smoothed allocation
};

/**
 * Calculates the dynamic daily goal for a product based on its fixed base quota
 * and active customer orders with approaching deadlines.
 */
export const calculateDynamicGoal = (
  product: Product,
  orders: ProductionOrder[],
  currentShiftHoursRemaining: number = 4.5
): DynamicGoalBreakdown => {
  const productOrders = orders.filter(
    (o) => o.productId === product.id && o.status !== 'COMPLETED' && o.status !== 'PAUSED'
  );

  let totalDynamicAddedUnits = 0;
  const orderAllocations: DynamicOrderAllocation[] = [];

  productOrders.forEach((order) => {
    const remainingUnits = Math.max(0, order.orderAmount - order.completedAmount);
    if (remainingUnits <= 0) return;

    let dynamicUnits = 0;
    let urgencyReason = '';
    const mult = PRIORITY_MULTIPLIER[order.priority] || 1.0;

    // Evaluate deadline urgency
    const hours = order.deadlineHoursRemaining;

    if (hours <= 6) {
      // Due Today in current shift! Full allocation needed today + priority surge
      dynamicUnits = Math.round(remainingUnits * mult);
      urgencyReason = `Due in ${hours.toFixed(1)}h (Today). 100% active order demand + ${Math.round((mult - 1) * 100)}% priority surge buffer.`;
    } else if (hours <= 24) {
      // Due Today / Overnight shift: 60% assigned to today's quota
      dynamicUnits = Math.round(remainingUnits * 0.60 * mult);
      urgencyReason = `Due within 24h. 60% workload (${Math.round(remainingUnits * 0.60)} units) allocated to today's schedule.`;
    } else if (hours <= 48) {
      // Due Tomorrow: 35% assigned to today's quota
      dynamicUnits = Math.round(remainingUnits * 0.35 * mult);
      urgencyReason = `Due tomorrow (${hours.toFixed(0)}h). 35% pre-staging workload allocated today.`;
    } else {
      // Due in 3+ days: Smooth distributed daily chunk
      const days = Math.max(2, Math.ceil(hours / 24));
      const dailyFraction = 1 / days;
      dynamicUnits = Math.round(remainingUnits * dailyFraction * mult);
      urgencyReason = `Due in ${days} days. Daily smoothed run-rate allocation (${Math.round(dailyFraction * 100)}%).`;
    }

    totalDynamicAddedUnits += dynamicUnits;

    orderAllocations.push({
      orderId: order.id,
      customer: order.customer,
      orderAmount: order.orderAmount,
      remainingAmount: remainingUnits,
      deadlineLabel: order.deadline,
      priority: order.priority,
      dynamicAddedUnits: dynamicUnits,
      urgencyReason,
    });
  });

  const totalDailyGoal = product.baseDailyQuota + totalDynamicAddedUnits;
  const producedToday = product.currentProducedToday;
  const remainingToday = Math.max(0, totalDailyGoal - producedToday);
  const progressPercent = totalDailyGoal > 0 ? Math.min(100, Math.round((producedToday / totalDailyGoal) * 100)) : 100;

  // Pace & UPH calculations
  const hoursLeft = Math.max(0.5, currentShiftHoursRemaining);
  const requiredUph = Math.round(remainingToday / hoursLeft);
  const currentUph = product.currentUph;
  const paceDeltaUph = currentUph - requiredUph;

  let paceStatus: DynamicGoalBreakdown['paceStatus'] = 'on_track';
  if (producedToday >= totalDailyGoal) {
    paceStatus = 'completed';
  } else if (paceDeltaUph >= 10) {
    paceStatus = 'ahead';
  } else if (paceDeltaUph >= -5) {
    paceStatus = 'on_track';
  } else if (paceDeltaUph >= -25) {
    paceStatus = 'behind';
  } else {
    paceStatus = 'critical';
  }

  // Estimated completion time
  let estimatedCompletionTime = 'On Schedule';
  if (producedToday >= totalDailyGoal) {
    estimatedCompletionTime = 'Goal Completed Today';
  } else if (currentUph > 0) {
    const hoursToComplete = remainingToday / currentUph;
    if (hoursToComplete <= hoursLeft) {
      const finishDate = new Date(Date.now() + hoursToComplete * 3600 * 1000);
      const timeStr = finishDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      estimatedCompletionTime = `Est. Finish: ${timeStr} Today (${hoursToComplete.toFixed(1)}h)`;
    } else {
      const overrunHours = (hoursToComplete - hoursLeft).toFixed(1);
      estimatedCompletionTime = `Overrun Risk: +${overrunHours}h past shift end`;
    }
  }

  return {
    productId: product.id,
    productName: product.name,
    baseDailyQuota: product.baseDailyQuota,
    totalDynamicAddedUnits,
    totalDailyGoal,
    producedToday,
    remainingToday,
    progressPercent,
    orderAllocations,
    hoursRemainingInShift: hoursLeft,
    requiredUph,
    currentUph,
    paceDeltaUph,
    paceStatus,
    estimatedCompletionTime,
  };
};

/**
 * Computes top-level factory KPI metrics across all products and orders
 */
export const calculateFactoryKpis = (
  products: Product[],
  orders: ProductionOrder[]
): ProductionSummaryKpis => {
  let totalFactoryLiveUph = 0;
  let totalFactoryTargetUph = 0;
  let totalProducedToday = 0;
  let totalDailyDynamicGoal = 0;
  let totalYieldWeighted = 0;
  let totalDailyRevenueUsd = 0;

  products.forEach((product) => {
    const goalBreakdown = calculateDynamicGoal(product, orders);
    totalFactoryLiveUph += product.currentUph;
    totalFactoryTargetUph += product.targetUph;
    totalProducedToday += product.currentProducedToday;
    totalDailyDynamicGoal += goalBreakdown.totalDailyGoal;
    totalYieldWeighted += product.yieldRate * product.currentProducedToday;
    totalDailyRevenueUsd += product.currentProducedToday * product.unitPriceUsd;
  });

  const activeOrders = orders.filter((o) => o.status !== 'COMPLETED');
  const totalActiveOrders = activeOrders.length;
  const totalBacklogUnits = activeOrders.reduce(
    (sum, o) => sum + Math.max(0, o.orderAmount - o.completedAmount),
    0
  );
  const urgentOrdersCount = activeOrders.filter(
    (o) => o.priority === 'CRITICAL_RUSH' || o.deadlineHoursRemaining <= 6
  ).length;

  const overallGoalProgressPercent =
    totalDailyDynamicGoal > 0
      ? Math.min(100, Math.round((totalProducedToday / totalDailyDynamicGoal) * 100))
      : 100;

  const averageFactoryYield =
    totalProducedToday > 0
      ? parseFloat((totalYieldWeighted / totalProducedToday).toFixed(1))
      : 98.6;

  return {
    totalFactoryLiveUph,
    totalFactoryTargetUph,
    totalProducedToday,
    totalDailyDynamicGoal,
    overallGoalProgressPercent,
    totalActiveOrders,
    totalBacklogUnits,
    urgentOrdersCount,
    averageFactoryYield,
    totalDailyRevenueUsd,
  };
};

/**
 * Simulates a single time tick in the production lines:
 * Increments units produced, applies minor realistic telemetry drift to UPH,
 * updates order fulfillment, and updates hourly records.
 */
export const simulateProductionTick = (
  products: Product[],
  orders: ProductionOrder[],
  speedMultiplier: number = 1
): { updatedProducts: Product[]; updatedOrders: ProductionOrder[] } => {
  // Base tick represents roughly ~15 seconds of real production in 1 simulation second
  const tickHoursFraction = (15 / 3600) * speedMultiplier;

  // 1. Update orders first
  const updatedOrders = orders.map((order) => {
    if (order.status === 'COMPLETED' || order.status === 'PAUSED') return order;

    // Decrement deadline hours slightly
    const newDeadlineHours = Math.max(0.1, order.deadlineHoursRemaining - tickHoursFraction);

    // Find the product producing this order
    const product = products.find((p) => p.id === order.productId);
    if (!product || product.status !== 'ACTIVE_RUNNING') {
      return { ...order, deadlineHoursRemaining: newDeadlineHours };
    }

    // Units produced in this tick
    const unitsProducedInTick = Math.max(1, Math.round(product.currentUph * tickHoursFraction));
    const newCompleted = Math.min(order.orderAmount, order.completedAmount + unitsProducedInTick);
    const isFinished = newCompleted >= order.orderAmount;

    return {
      ...order,
      completedAmount: newCompleted,
      status: isFinished ? ('COMPLETED' as const) : order.status,
      deadlineHoursRemaining: newDeadlineHours,
    };
  });

  // 2. Update products
  const updatedProducts = products.map((product) => {
    if (product.status === 'MAINTENANCE_HOLD' || product.status === 'CHANGEOVER') {
      return product;
    }

    // Natural subtle noise on UPH (±3%)
    const noise = (Math.random() - 0.5) * 0.04;
    const targetWithNoise = product.targetUph * (1 + noise);
    // Smooth transition towards target
    const newUph = Math.min(
      product.nominalUph,
      Math.max(20, Math.round(product.currentUph * 0.95 + targetWithNoise * 0.05))
    );

    const unitsProducedInTick = Math.max(1, Math.round(newUph * tickHoursFraction));
    const newProducedToday = product.currentProducedToday + unitsProducedInTick;
    const newPeak = Math.max(product.peakUphToday, newUph);

    // Update the last hourly record if present
    const history = [...product.hourlyHistory];
    if (history.length > 0) {
      const lastIdx = history.length - 1;
      history[lastIdx] = {
        ...history[lastIdx],
        actualUph: newUph,
      };
    }

    return {
      ...product,
      currentUph: newUph,
      currentProducedToday: newProducedToday,
      peakUphToday: newPeak,
      hourlyHistory: history,
    };
  });

  return {
    updatedProducts,
    updatedOrders,
  };
};
