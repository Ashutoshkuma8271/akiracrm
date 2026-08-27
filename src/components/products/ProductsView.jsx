import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Grid,
  List,
  Edit2,
  Snowflake,
  Flame,
  Star,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Clock,
  Sparkles,
  Percent
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function ProductsView() {
  const { products, addProduct, updateProduct, adjustStock, showToast } = useCrm();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = [
    'All',
    'Bestsellers',
    'Raw Meats & Seafood',
    'Kebabs & Tikkas',
    'Momos & Dimsums',
    'Chicken Snacks',
    'Mutton Delicacies',
    'Family Packs (1kg)',
    'Flash Sale'
  ];

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        prod.name.toLowerCase().includes(q) ||
        prod.sku.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q) ||
        (prod.description && prod.description.toLowerCase().includes(q));

      let matchesCat = true;
      if (selectedCategory === 'Bestsellers') {
        matchesCat = Boolean(prod.isBestseller);
      } else if (selectedCategory === 'Flash Sale') {
        matchesCat = Boolean(prod.isFlashSale);
      } else if (selectedCategory !== 'All') {
        const prodCat = (prod.category || '').toLowerCase();
        const selCat = selectedCategory.toLowerCase();
        matchesCat =
          prodCat === selCat ||
          prodCat.includes(selCat) ||
          selCat.includes(prodCat);
      }

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Inventory & Margin Metrics
  const totalSkus = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);
  const lowStockCount = products.filter(p => p.stock <= 20).length;

  // Handle Add Product Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const price = Number(formData.get('price'));
    const costPrice = Number(formData.get('costPrice')) || Math.round(price * 0.55);
    const originalPrice = Number(formData.get('originalPrice')) || price;
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    addProduct({
      name: formData.get('name'),
      sku: formData.get('sku') || `AF-${Date.now().toString().slice(-4)}`,
      category: formData.get('category'),
      price,
      costPrice,
      originalPrice,
      discountPercent,
      stock: Number(formData.get('stock')),
      dailyVelocity: Number(formData.get('dailyVelocity')) || 10,
      unit: formData.get('unit'),
      protein: formData.get('protein'),
      image: formData.get('image') || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80',
      description: formData.get('description'),
      isBestseller: formData.get('isBestseller') === 'on',
      isFlashSale: formData.get('isFlashSale') === 'on',
      blastFrozen: true
    });

    setShowAddModal(false);
  };

  // Handle Edit Product Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(e.target);
    const price = Number(formData.get('price'));
    const costPrice = Number(formData.get('costPrice')) || editingProduct.costPrice || Math.round(price * 0.55);
    const originalPrice = Number(formData.get('originalPrice')) || price;
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    updateProduct(editingProduct.id, {
      name: formData.get('name'),
      sku: formData.get('sku'),
      category: formData.get('category'),
      price,
      costPrice,
      originalPrice,
      discountPercent,
      stock: Number(formData.get('stock')),
      dailyVelocity: Number(formData.get('dailyVelocity')) || editingProduct.dailyVelocity || 10,
      unit: formData.get('unit'),
      protein: formData.get('protein'),
      image: formData.get('image') || editingProduct.image,
      description: formData.get('description'),
      isBestseller: formData.get('isBestseller') === 'on',
      isFlashSale: formData.get('isFlashSale') === 'on'
    });

    setEditingProduct(null);
  };

  return (
    <div className="products-view-container">
      {/* Header */}
      <section className="page-heading">
        <div>
          <p className="eyebrow">AKIRA FRESH CATALOG & INVENTORY INTELLIGENCE</p>
          <h1>
            Gourmet Frozen Catalog
            <span className="heading-count">{totalSkus} SKUs</span>
          </h1>
          <p className="subheading">
            Live cold-chain inventory, profit margin tracking, and automated restock predictor.
          </p>
        </div>

        <div className="heading-actions">
          <button
            className="secondary-button"
            onClick={() => showToast(`Total inventory valuation: ₹${totalInventoryValue.toLocaleString('en-IN')}`)}
          >
            <DollarSign size={14} /> Valuation: ₹{(totalInventoryValue / 100000).toFixed(1)}L
          </button>
          <button className="primary-button" onClick={() => setShowAddModal(true)}>
            <Plus size={15} /> Add New SKU
          </button>
        </div>
      </section>

      {/* Inventory KPI Summary */}
      <section className="metric-grid">
        <div className="metric-card">
          <div className="metric-icon coral">
            <Package size={20} />
          </div>
          <div className="metric-copy">
            <span>Total Stock</span>
            <strong>{totalStockUnits} units</strong>
            <p>
              Across <b>{totalSkus} product lines</b>
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon sage">
            <TrendingUp size={20} />
          </div>
          <div className="metric-copy">
            <span>Inventory Value</span>
            <strong>₹{totalInventoryValue.toLocaleString('en-IN')}</strong>
            <p>
              <b>Avg 48% Gross Margin</b>
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon sun">
            <Flame size={20} />
          </div>
          <div className="metric-copy">
            <span>Bestsellers</span>
            <strong>{products.filter(p => p.isBestseller).length} SKUs</strong>
            <p>
              Generates <b>68% of orders</b>
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon blue">
            <AlertTriangle size={20} />
          </div>
          <div className="metric-copy">
            <span>Low Stock Alert</span>
            <strong className={lowStockCount > 0 ? 'text-coral' : ''}>{lowStockCount} items</strong>
            <p className={lowStockCount > 0 ? 'negative' : ''}>
              <b>&le; 20 units</b> remaining
            </p>
          </div>
        </div>
      </section>

      {/* Toolbar & Categories */}
      <div className="products-toolbar">
        <div className="search-box">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search SKUs, names, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={13} />
            </button>
          )}
        </div>

        <div className="view-toggle-btns">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid Cards View"
          >
            <Grid size={15} />
          </button>
          <button
            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table List View"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-chips-row">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${selectedCategory === cat ? 'selected' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'Bestsellers' && <Star size={12} className="text-sun" />}
            {cat === 'Flash Sale' && <Flame size={12} className="text-coral" />}
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="products-card-grid">
          {filteredProducts.map((prod) => {
            const isLowStock = prod.stock <= 20 && prod.stock > 0;
            const isOutOfStock = prod.stock === 0;
            const cost = prod.costPrice || Math.round(prod.price * 0.55);
            const marginAmount = prod.price - cost;
            const marginPercent = Math.round((marginAmount / prod.price) * 100);
            const daysLeft = Math.max(1, Math.round(prod.stock / (prod.dailyVelocity || 10)));

            return (
              <div key={prod.id} className="product-card">
                {/* Product Image Banner */}
                <div className="product-image-container">
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80'}
                    alt={prod.name}
                    className="product-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="product-img-overlay-badges">
                    <span className="sku-badge">{prod.sku}</span>
                    {prod.isBestseller && (
                      <span className="badge-bestseller">
                        <Star size={10} /> Bestseller
                      </span>
                    )}
                    {prod.isFlashSale && (
                      <span className="badge-flash">
                        <Flame size={10} /> Flash Sale
                      </span>
                    )}
                  </div>
                  <button
                    className="product-edit-floating-btn"
                    onClick={() => setEditingProduct(prod)}
                    title="Edit Product"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>

                <div className="product-card-body">
                  <div className="product-category-text">{prod.category}</div>
                  <h3 className="product-title">{prod.name}</h3>
                  <p className="product-desc">{prod.description}</p>

                  <div className="product-nutrition-tag">
                    <Snowflake size={12} className="text-coral" />
                    <span>{prod.protein || 'High Protein'} &bull; {prod.unit}</span>
                  </div>

                  {/* Profit & Restock Intelligence Bar */}
                  <div className="product-intel-bar">
                    <div className="intel-pill margin-pill">
                      <Percent size={11} />
                      <span>{marginPercent}% Margin (+₹{marginAmount})</span>
                    </div>
                    <div className={`intel-pill velocity-pill ${daysLeft <= 3 ? 'velocity-urgent' : ''}`}>
                      <Clock size={11} />
                      <span>~{daysLeft}d stock left</span>
                    </div>
                  </div>
                </div>

                <div className="product-card-footer">
                  <div className="product-pricing">
                    <strong className="current-price">₹{prod.price}</strong>
                    {prod.originalPrice > prod.price && (
                      <>
                        <span className="orig-price">₹{prod.originalPrice}</span>
                        <span className="discount-tag">{prod.discountPercent}% OFF</span>
                      </>
                    )}
                  </div>

                  <div className="product-stock-control">
                    <div className="stock-counter">
                      <button onClick={() => adjustStock(prod.id, -5)} title="Decrease 5 units">
                        -
                      </button>
                      <span className={`stock-val ${isLowStock ? 'low-stock' : ''} ${isOutOfStock ? 'out-stock' : ''}`}>
                        {prod.stock} left
                      </span>
                      <button onClick={() => adjustStock(prod.id, 5)} title="Add 5 units">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="workspace-card table-workspace">
          <div className="workspace-table">
            <div className="workspace-table-head prod-table-head">
              <span>Product & SKU</span>
              <span>Category & Unit</span>
              <span>Price & Margin</span>
              <span>Stock & Run Rate</span>
              <span>Stock Stepper</span>
              <span>Action</span>
            </div>

            {filteredProducts.map((prod) => {
              const cost = prod.costPrice || Math.round(prod.price * 0.55);
              const marginAmount = prod.price - cost;
              const marginPercent = Math.round((marginAmount / prod.price) * 100);

              return (
                <div key={prod.id} className="workspace-table-row prod-table-row">
                  <div className="prod-table-meta-cell">
                    <img
                      src={prod.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80'}
                      alt=""
                      className="prod-table-thumb"
                    />
                    <div>
                      <strong>{prod.name}</strong>
                      <small>{prod.sku} &bull; {prod.protein}</small>
                    </div>
                  </div>

                  <div>
                    <span>{prod.category}</span>
                    <small>{prod.unit}</small>
                  </div>

                  <div>
                    <strong>₹{prod.price}</strong>
                    <small className="margin-text">{marginPercent}% Margin (+₹{marginAmount})</small>
                  </div>

                  <div>
                    <span className={`stock-status-pill ${prod.stock <= 20 ? 'low' : 'good'}`}>
                      {prod.stock} units left
                    </span>
                    <small className="velocity-sub">~{Math.round(prod.stock / (prod.dailyVelocity || 10))} days left</small>
                  </div>

                  <div>
                    <div className="stock-counter-sm">
                      <button onClick={() => adjustStock(prod.id, -5)}>-</button>
                      <span>{prod.stock}</span>
                      <button onClick={() => adjustStock(prod.id, 5)}>+</button>
                    </div>
                  </div>

                  <div>
                    <button
                      className="icon-btn-subtle"
                      onClick={() => setEditingProduct(prod)}
                      title="Edit Product"
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddModal(false)}>
              <X size={18} />
            </button>

            <h2>Add New SKU</h2>
            <p className="modal-copy">Create a blast-frozen ready-to-cook product line.</p>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Kashmiri Mutton Seekh Kebab"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>SKU Code</label>
                  <input name="sku" type="text" placeholder="e.g. AF-SEEKH-02" />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select name="category" required defaultValue="Chicken Snacks">
                    <option value="Chicken Snacks">Chicken Snacks</option>
                    <option value="Kebabs">Kebabs</option>
                    <option value="Momos">Momos</option>
                    <option value="Family Packs (1kg)">Family Packs (1kg)</option>
                    <option value="Mutton Delicacies">Mutton Delicacies</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Selling Price (₹)</label>
                  <input name="price" type="number" required placeholder="240" min="1" />
                </div>

                <div className="form-group">
                  <label>Cost Price (₹)</label>
                  <input name="costPrice" type="number" placeholder="120" min="1" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>MRP / Original Price (₹)</label>
                  <input name="originalPrice" type="number" placeholder="280" min="1" />
                </div>

                <div className="form-group">
                  <label>Initial Stock (Units)</label>
                  <input name="stock" type="number" required placeholder="50" min="0" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Packaging Unit</label>
                  <input name="unit" type="text" placeholder="e.g. 4 skewers (300g)" />
                </div>

                <div className="form-group">
                  <label>Protein Info</label>
                  <input name="protein" type="text" placeholder="e.g. 24g protein / 100g" />
                </div>
              </div>

              <div className="form-group">
                <label>Photo Image URL (Optional)</label>
                <input
                  name="image"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Artisanal recipe details, marination spices, cooking instructions..."
                ></textarea>
              </div>

              <div className="form-checkbox-row">
                <label className="checkbox-label">
                  <input type="checkbox" name="isBestseller" />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="isFlashSale" />
                  <span>Flash Sale Offer</span>
                </label>
              </div>

              <button type="submit" className="primary-button full-width">
                <Check size={16} /> Save Product to Catalog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditingProduct(null)}>
              <X size={18} />
            </button>

            <h2>Edit SKU: {editingProduct.name}</h2>
            <p className="modal-copy">Update price, stock, description and imagery.</p>

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={editingProduct.name}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>SKU Code</label>
                  <input name="sku" type="text" defaultValue={editingProduct.sku} />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select name="category" required defaultValue={editingProduct.category}>
                    <option value="Chicken Snacks">Chicken Snacks</option>
                    <option value="Kebabs">Kebabs</option>
                    <option value="Momos">Momos</option>
                    <option value="Family Packs (1kg)">Family Packs (1kg)</option>
                    <option value="Mutton Delicacies">Mutton Delicacies</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Selling Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    required
                    defaultValue={editingProduct.price}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Cost Price (₹)</label>
                  <input
                    name="costPrice"
                    type="number"
                    defaultValue={editingProduct.costPrice || Math.round(editingProduct.price * 0.55)}
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>MRP / Original Price (₹)</label>
                  <input
                    name="originalPrice"
                    type="number"
                    defaultValue={editingProduct.originalPrice}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Count</label>
                  <input
                    name="stock"
                    type="number"
                    required
                    defaultValue={editingProduct.stock}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Packaging Unit</label>
                  <input name="unit" type="text" defaultValue={editingProduct.unit} />
                </div>

                <div className="form-group">
                  <label>Protein Info</label>
                  <input name="protein" type="text" defaultValue={editingProduct.protein} />
                </div>
              </div>

              <div className="form-group">
                <label>Photo Image URL</label>
                <input
                  name="image"
                  type="url"
                  defaultValue={editingProduct.image}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProduct.description}
                ></textarea>
              </div>

              <div className="form-checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isBestseller"
                    defaultChecked={editingProduct.isBestseller}
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isFlashSale"
                    defaultChecked={editingProduct.isFlashSale}
                  />
                  <span>Flash Sale Offer</span>
                </label>
              </div>

              <button type="submit" className="primary-button full-width">
                <Check size={16} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
