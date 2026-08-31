import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Product,
  ProductionOrder,
  ProductionFilterState,
  DynamicGoalBreakdown,
  ProductionSummaryKpis,
  OrderPriority,
  OrderStatus,
} from '../types/production';
import { SEED_PRODUCTS, SEED_ORDERS } from '../data/seedProducts';
import {
  calculateDynamicGoal,
  calculateFactoryKpis,
  simulateProductionTick,
} from '../services/productionEngine';

export interface NewOrderFormData {
  productId: string;
  customer: string;
  orderAmount: number;
  deadlineType: 'TODAY_END_OF_SHIFT' | 'TODAY_MIDNIGHT' | 'TOMORROW_NOON' | 'IN_2_DAYS' | 'IN_4_DAYS';
  priority: OrderPriority;
  shiftAssigned: string;
  notes: string;
}

export const useProductionState = () => {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [orders, setOrders] = useState<ProductionOrder[]>(SEED_ORDERS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [explainerProductId, setExplainerProductId] = useState<string | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);
  const [preselectedProductIdForNewOrder, setPreselectedProductIdForNewOrder] = useState<string | undefined>(undefined);

  // Simulation controls
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // 1x, 5x, 10x

  // Filters & Search
  const [filterState, setFilterState] = useState<ProductionFilterState>({
    searchQuery: '',
    categoryFilter: 'ALL',
    statusFilter: 'ALL',
    viewMode: 'grid',
    sortBy: 'goal_progress',
  });

  // Calculate dynamic goals for all products
  const dynamicGoalsMap = useMemo(() => {
    const map = new Map<string, DynamicGoalBreakdown>();
    products.forEach((product) => {
      map.set(product.id, calculateDynamicGoal(product, orders));
    });
    return map;
  }, [products, orders]);

  // Overall factory KPI summary
  const summaryKpis: ProductionSummaryKpis = useMemo(() => {
    return calculateFactoryKpis(products, orders);
  }, [products, orders]);

  // Selected product object & breakdown
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  const selectedProductGoal = useMemo(() => {
    if (!selectedProduct) return null;
    return dynamicGoalsMap.get(selectedProduct.id) || null;
  }, [selectedProduct, dynamicGoalsMap]);

  const explainerProduct = useMemo(() => {
    return products.find((p) => p.id === explainerProductId) || null;
  }, [products, explainerProductId]);

  const explainerProductGoal = useMemo(() => {
    if (!explainerProduct) return null;
    return dynamicGoalsMap.get(explainerProduct.id) || null;
  }, [explainerProduct, dynamicGoalsMap]);

  // Filtered & sorted products list
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter
        if (filterState.searchQuery.trim() !== '') {
          const q = filterState.searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesCode = p.code.toLowerCase().includes(q);
          const matchesPkg = p.packageType.toLowerCase().includes(q);
          const matchesCat = p.categoryLabel.toLowerCase().includes(q);
          if (!matchesName && !matchesCode && !matchesPkg && !matchesCat) return false;
        }

        // Category filter
        if (filterState.categoryFilter !== 'ALL' && p.category !== filterState.categoryFilter) {
          return false;
        }

        // Status filter
        if (filterState.statusFilter !== 'ALL' && p.status !== filterState.statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const goalA = dynamicGoalsMap.get(a.id);
        const goalB = dynamicGoalsMap.get(b.id);

        switch (filterState.sortBy) {
          case 'goal_progress':
            return (goalA?.progressPercent || 0) - (goalB?.progressPercent || 0); // Behind first
          case 'uph_speed':
            return b.currentUph - a.currentUph;
          case 'order_volume':
            return (goalB?.totalDailyGoal || 0) - (goalA?.totalDailyGoal || 0);
          case 'urgency':
            return (goalA?.paceDeltaUph || 0) - (goalB?.paceDeltaUph || 0);
          case 'name':
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [products, filterState, dynamicGoalsMap]);

  // Production simulation ticker (runs every 2 seconds)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const { updatedProducts, updatedOrders } = simulateProductionTick(
        products,
        orders,
        simulationSpeed
      );
      setProducts(updatedProducts);
      setOrders(updatedOrders);
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, products, orders]);

  // Handlers for Order Operations
  const handleAddNewOrder = useCallback((formData: NewOrderFormData) => {
    const product = products.find((p) => p.id === formData.productId);
    if (!product) return;

    let deadlineHours = 4.0;
    let deadlineLabel = 'Today 21:00 (End of Shift 2)';

    switch (formData.deadlineType) {
      case 'TODAY_END_OF_SHIFT':
        deadlineHours = 3.5;
        deadlineLabel = 'Today 21:00 (End of Shift 2)';
        break;
      case 'TODAY_MIDNIGHT':
        deadlineHours = 6.5;
        deadlineLabel = 'Today 23:59 (Midnight)';
        break;
      case 'TOMORROW_NOON':
        deadlineHours = 18.0;
        deadlineLabel = 'Tomorrow 12:00';
        break;
      case 'IN_2_DAYS':
        deadlineHours = 48.0;
        deadlineLabel = 'In 2 Days (48 Hours)';
        break;
      case 'IN_4_DAYS':
        deadlineHours = 96.0;
        deadlineLabel = 'In 4 Days (96 Hours)';
        break;
    }

    const newOrder: ProductionOrder = {
      id: `ORD-2026-${Math.floor(Math.random() * 8999 + 1000)}`,
      productId: product.id,
      productName: product.name,
      customer: formData.customer.trim() || 'Priority Customer Account',
      orderAmount: formData.orderAmount,
      completedAmount: 0,
      orderDate: new Date().toISOString(),
      deadline: deadlineLabel,
      deadlineHoursRemaining: deadlineHours,
      priority: formData.priority,
      status: formData.priority === 'CRITICAL_RUSH' ? 'EXPEDITED' : 'IN_PRODUCTION',
      shiftAssigned: formData.shiftAssigned || 'Shift 2 (Afternoon)',
      lotBatchId: `LOT-${product.code.split('//')[0].trim()}-${Math.floor(Math.random() * 8999 + 1000)}`,
      revenueUsd: formData.orderAmount * product.unitPriceUsd,
      notes: formData.notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setIsNewOrderModalOpen(false);
  }, [products]);

  const handleUpdateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  }, []);

  const handleDeleteOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  const handleUpdateBaseQuota = useCallback((productId: string, newBaseQuota: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, baseDailyQuota: Math.max(50, newBaseQuota) } : p))
    );
  }, []);

  const handleOpenNewOrderModal = useCallback((productId?: string) => {
    setPreselectedProductIdForNewOrder(productId);
    setIsNewOrderModalOpen(true);
  }, []);

  return {
    products,
    orders,
    filteredProducts,
    dynamicGoalsMap,
    summaryKpis,
    selectedProduct,
    selectedProductGoal,
    selectedProductId,
    setSelectedProductId,
    explainerProduct,
    explainerProductGoal,
    explainerProductId,
    setExplainerProductId,
    filterState,
    setFilterState,
    isSimulating,
    setIsSimulating,
    simulationSpeed,
    setSimulationSpeed,
    isNewOrderModalOpen,
    setIsNewOrderModalOpen,
    preselectedProductIdForNewOrder,
    handleAddNewOrder,
    handleUpdateOrderStatus,
    handleDeleteOrder,
    handleUpdateBaseQuota,
    handleOpenNewOrderModal,
  };
};
