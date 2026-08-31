// =========================================================================
// VECTOR.AI - PRODUCTION & PRODUCT TYPES
// Throughput (UPH), Order Workloads, and Dynamic Daily Goal Engine
// =========================================================================

export type ProductCategory =
  | 'AI_ACCELERATOR'
  | 'POWER_SEMICONDUCTOR'
  | 'RF_COMMUNICATION'
  | 'HIGH_BANDWIDTH_MEMORY'
  | 'INDUSTRIAL_MCU'
  | 'MEMS_SENSOR';

export type ProductStatus =
  | 'ACTIVE_RUNNING'
  | 'THROTTLED'
  | 'CHANGEOVER'
  | 'MAINTENANCE_HOLD'
  | 'QUEUED';

export type OrderPriority =
  | 'CRITICAL_RUSH' // 1.25x surge allocation multiplier
  | 'HIGH'          // 1.1x surge allocation multiplier
  | 'MEDIUM'        // 1.0x surge allocation multiplier
  | 'STANDARD';      // Standard allocation

export type OrderStatus =
  | 'IN_PRODUCTION'
  | 'SCHEDULED'
  | 'EXPEDITED'
  | 'COMPLETED'
  | 'PAUSED';

export interface HourlyUphRecord {
  hour: string;           // e.g. "08:00", "09:00"
  actualUph: number;      // measured units per hour
  targetUph: number;      // target rate
  yieldPercent: number;   // e.g. 98.6%
  scrapUnits: number;     // e.g. 2 units
}

export interface ProductionOrder {
  id: string;             // e.g. "ORD-2026-8801"
  productId: string;      // references Product.id
  productName: string;
  customer: string;       // e.g. "Tesla Motors", "NVIDIA Corp"
  orderAmount: number;    // total units ordered
  completedAmount: number;// units produced towards this order
  orderDate: string;      // ISO string
  deadline: string;       // ISO string or deadline label
  deadlineHoursRemaining: number; // estimated hours until deadline
  priority: OrderPriority;
  status: OrderStatus;
  shiftAssigned: string;  // e.g. "Shift 1 (Day)"
  lotBatchId: string;     // e.g. "LOT-9921-A"
  revenueUsd: number;     // e.g. $450,000
  notes?: string;
}

export interface Product {
  id: string;             // e.g. "PRD-AI9-1156"
  code: string;           // e.g. "PRD-AI9 // TENSOR NEURAL PROCESSOR"
  name: string;           // e.g. "Vector-X9 Neural Accelerator"
  category: ProductCategory;
  categoryLabel: string;  // e.g. "AI & Neural Processors"
  packageType: string;    // e.g. "FCBGA-1156 (35x35mm)"
  waferTechnology: string;// e.g. "3nm FinFET + 2.5D CoWoS"
  dieSizeMm2: number;     // e.g. 814 mm²
  diesPerWafer: number;   // e.g. 74 dies
  
  // Baseline Quotas & Targets
  baseDailyQuota: number; // Fixed base daily goal (e.g. 800 units/day)
  currentProducedToday: number; // Actual units produced today so far
  
  // Live Throughput (UPH) Telemetry
  nominalUph: number;     // Max nameplate design speed (e.g. 120 UPH)
  currentUph: number;     // Real-time instantaneous speed in Units Per Hour
  targetUph: number;      // Target operational speed
  peakUphToday: number;   // Peak speed recorded today
  shiftAverageUph: number;// Average speed across current shift
  cycleTimeSeconds: number; // Cycle time per unit in seconds
  
  // Quality & Financials
  yieldRate: number;      // e.g. 98.4 (%)
  scrapRate: number;      // e.g. 1.6 (%)
  unitCostUsd: number;    // e.g. $145.00
  unitPriceUsd: number;   // e.g. $420.00
  inventoryOnHand: number;// e.g. 1,420 units
  
  // Routing & Status
  assignedMachines: string[]; // e.g. ['WS-01', 'DA-01', 'WB-01', 'MP-01', 'TH-01']
  status: ProductStatus;
  statusMessage: string;
  
  // Historical Analytics
  hourlyHistory: HourlyUphRecord[];
}

export interface DynamicOrderAllocation {
  orderId: string;
  customer: string;
  orderAmount: number;
  remainingAmount: number;
  deadlineLabel: string;
  priority: OrderPriority;
  dynamicAddedUnits: number; // how many units this order adds to today's goal
  urgencyReason: string;     // explanation of the dynamic addition
}

export interface DynamicGoalBreakdown {
  productId: string;
  productName: string;
  baseDailyQuota: number;     // Fixed base goal
  totalDynamicAddedUnits: number; // Total units added from active orders
  totalDailyGoal: number;     // Base + Dynamic Added Units
  producedToday: number;      // Progress done today
  remainingToday: number;     // Total Goal - Produced Today
  progressPercent: number;    // (Produced / Total Daily Goal) * 100%
  orderAllocations: DynamicOrderAllocation[];
  
  // Shift & Pace Analysis
  hoursRemainingInShift: number;
  requiredUph: number;        // Required speed to hit dynamic goal today
  currentUph: number;         // Current live speed
  paceDeltaUph: number;       // Current UPH - Required UPH (+ahead / -behind)
  paceStatus: 'ahead' | 'on_track' | 'behind' | 'critical' | 'completed';
  estimatedCompletionTime: string; // e.g. "19:45 Today" or "Exceeds Shift End"
}

export interface ProductionSummaryKpis {
  totalFactoryLiveUph: number;
  totalFactoryTargetUph: number;
  totalProducedToday: number;
  totalDailyDynamicGoal: number;
  overallGoalProgressPercent: number;
  totalActiveOrders: number;
  totalBacklogUnits: number;
  urgentOrdersCount: number;
  averageFactoryYield: number;
  totalDailyRevenueUsd: number;
}

export interface ProductionFilterState {
  searchQuery: string;
  categoryFilter: ProductCategory | 'ALL';
  statusFilter: ProductStatus | 'ALL';
  viewMode: 'grid' | 'table';
  sortBy: 'goal_progress' | 'uph_speed' | 'order_volume' | 'name' | 'urgency';
}
