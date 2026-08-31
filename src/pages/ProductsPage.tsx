import React from 'react';
import {
  useProductionState,
  ProductHeader,
  ProductKpiStrip,
  ProductCard,
  ProductTableView,
  NewOrderModal,
  DynamicGoalExplainerModal,
  ProductDetailDrawer,
} from '../features/production';
import '../features/production/styles/production.css';

interface ProductsPageProps {
  onNavigate?: (tab: string, machineId?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = () => {
  const {
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
  } = useProductionState();

  return (
    <div className="production-root" role="region" aria-label="Vector.ai Products & Throughput Catalog">
      {/* 1. Top KPI Summary Strip: Real-time UPH, Dynamic Goal Hit %, Orders Backlog, Line Yield */}
      <ProductKpiStrip
        kpis={summaryKpis}
        onOpenExplainerModal={() => {
          if (products.length > 0) {
            setExplainerProductId(products[0].id);
          }
        }}
      />

      {/* 2. Control Toolbar: Search, Category & Status Filters, Grid/Table Toggle, Simulation Controls, + New Order */}
      <ProductHeader
        filterState={filterState}
        onFilterChange={(newFilters) => setFilterState((prev) => ({ ...prev, ...newFilters }))}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        simulationSpeed={simulationSpeed}
        onSetSimulationSpeed={setSimulationSpeed}
        onOpenNewOrderModal={() => handleOpenNewOrderModal()}
      />

      {/* 3. Main View: Grid of Product Cards OR Dense Table View */}
      {filteredProducts.length === 0 ? (
        <div
          className="tech-card"
          style={{
            padding: '48px',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          <span className="corner-tl">+</span>
          <span className="corner-tr">+</span>
          <span className="corner-bl">+</span>
          <span className="corner-br">+</span>
          NO PRODUCTS MATCH THE ACTIVE SEARCH OR FILTER CRITERIA.
        </div>
      ) : filterState.viewMode === 'grid' ? (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const goalBreakdown = dynamicGoalsMap.get(product.id);
            if (!goalBreakdown) return null;

            return (
              <ProductCard
                key={product.id}
                product={product}
                goalBreakdown={goalBreakdown}
                onSelectProduct={(id) => setSelectedProductId(id)}
                onOpenNewOrder={(id) => handleOpenNewOrderModal(id)}
                onOpenExplainer={(id) => setExplainerProductId(id)}
              />
            );
          })}
        </div>
      ) : (
        <ProductTableView
          products={filteredProducts}
          dynamicGoalsMap={dynamicGoalsMap}
          onSelectProduct={(id) => setSelectedProductId(id)}
          onOpenNewOrder={(id) => handleOpenNewOrderModal(id)}
          onOpenExplainer={(id) => setExplainerProductId(id)}
        />
      )}

      {/* 4. New Production Order Modal Dialog with Real-Time Goal Preview */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        products={products}
        preselectedProductId={preselectedProductIdForNewOrder}
        onSubmitOrder={handleAddNewOrder}
      />

      {/* 5. Dynamic Goal Mathematical Explainer Modal */}
      <DynamicGoalExplainerModal
        isOpen={explainerProductId !== null}
        onClose={() => setExplainerProductId(null)}
        product={explainerProduct}
        goalBreakdown={explainerProductGoal}
      />

      {/* 6. Product Deep-Dive Inspector Drawer */}
      <ProductDetailDrawer
        isOpen={selectedProductId !== null}
        onClose={() => setSelectedProductId(null)}
        product={selectedProduct}
        goalBreakdown={selectedProductGoal}
        orders={orders}
        onOpenNewOrder={(id) => handleOpenNewOrderModal(id)}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        onUpdateBaseQuota={handleUpdateBaseQuota}
      />
    </div>
  );
};

export default ProductsPage;
