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
  AlertTriangle
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
    'Flash Sale',
    'Chicken Snacks',
    'Kebabs',
    'Momos',
    'Sausages & Cold Cuts',
    'Mutton',
    'Family Packs'
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
        matchesCat = prod.category.toLowerCase() === selectedCategory.toLowerCase();
      }

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Handle Add Product Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const price = Number(formData.get('price'));
    const originalPrice = Number(formData.get('originalPrice')) || price;
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    addProduct({
      name: formData.get('name'),
      sku: formData.get('sku'),
      category: formData.get('category'),
      price,
      originalPrice,
      discountPercent,
      stock: Number(formData.get('stock')),
      unit: formData.get('unit'),
      protein: formData.get('protein'),
      description: formData.get('description'),
      isBestseller: formData.get('isBestseller') === 'on',
      isFlashSale: formData.get('isFlashSale') === 'on'
    });

    setShowAddModal(false);
  };

  // Handle Edit Product Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(e.target);
    const price = Number(formData.get('price'));
    const originalPrice = Number(formData.get('originalPrice')) || price;
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    updateProduct(editingProduct.id, {
      name: formData.get('name'),
      sku: formData.get('sku'),
      category: formData.get('category'),
      price,
      originalPrice,
      discountPercent,
      stock: Number(formData.get('stock')),
      unit: formData.get('unit'),
      protein: formData.get('protein'),
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
          <p className="eyebrow">CATALOG &bull; BLAST-FROZEN INVENTORY</p>
          <h1>
            Products <span className="heading-count">{products.length} SKUs</span>
          </h1>
          <p className="subheading">
            Manage recipes, batch stock, blast-freeze status, and flash sale pricing.
          </p>
        </div>

        <div className="heading-actions">
          <button className="primary-button" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add New SKU
          </button>
        </div>
      </section>

      {/* Toolbar & Category Chips */}
      <div className="products-toolbar">
        <div className="search-box">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search snacks, SKUs, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="view-toggle-btns">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <Grid size={16} />
          </button>
          <button
            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-chips-row">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-chip ${selectedCategory === cat ? 'selected' : ''}`}
          >
            {cat === 'Bestsellers' && <Star size={12} className="text-sun" />}
            {cat === 'Flash Sale' && <Flame size={12} className="text-coral" />}
            {cat}
          </button>
        ))}
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products found matching "{searchQuery}" in {selectedCategory}.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="products-card-grid">
          {filteredProducts.map((prod) => {
            const isLowStock = prod.stock <= 20 && prod.stock > 0;
            const isOutOfStock = prod.stock === 0;

            return (
              <div key={prod.id} className="product-card">
                <div className="product-card-top">
                  <div className="product-badges">
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
                    className="icon-btn-subtle"
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
              <span>SKU & Product</span>
              <span>Category & Unit</span>
              <span>Price / Discount</span>
              <span>Stock Status</span>
              <span>Quick Adjust</span>
              <span>Action</span>
            </div>

            {filteredProducts.map((prod) => (
              <div key={prod.id} className="workspace-table-row prod-table-row">
                <div>
                  <strong>{prod.name}</strong>
                  <small>{prod.sku}</small>
                </div>
                <div>
                  <span>{prod.category}</span>
                  <small>{prod.unit}</small>
                </div>
                <div>
                  <strong>₹{prod.price}</strong>
                  {prod.originalPrice > prod.price && (
                    <small className="discount-text">{prod.discountPercent}% OFF (₹{prod.originalPrice})</small>
                  )}
                </div>
                <div>
                  <span className={`stock-status-pill ${prod.stock <= 20 ? 'low' : 'good'}`}>
                    {prod.stock} units
                  </span>
                </div>
                <div className="stock-counter-sm">
                  <button onClick={() => adjustStock(prod.id, -1)}>-</button>
                  <span>{prod.stock}</span>
                  <button onClick={() => adjustStock(prod.id, 1)}>+</button>
                </div>
                <div>
                  <button
                    className="icon-btn-subtle"
                    onClick={() => setEditingProduct(prod)}
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <form className="modal" onSubmit={handleAddSubmit}>
            <button type="button" className="modal-close" onClick={() => setShowAddModal(false)}>
              <X size={20} />
            </button>
            <p className="eyebrow">NEW SKU</p>
            <h2>Add Product</h2>
            <p className="modal-copy">Add a fresh recipe to the Akira Fresh blast-frozen catalog.</p>

            <div className="form-group">
              <label>Product Name *</label>
              <input name="name" required placeholder="e.g. Chicken Cheese Poppers" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select name="category" defaultValue="Chicken Snacks">
                  <option value="Chicken Snacks">Chicken Snacks</option>
                  <option value="Kebabs">Kebabs</option>
                  <option value="Momos">Momos</option>
                  <option value="Sausages & Cold Cuts">Sausages & Cold Cuts</option>
                  <option value="Mutton">Mutton</option>
                  <option value="Family Packs">Family Packs</option>
                </select>
              </div>
              <div className="form-group">
                <label>SKU Code</label>
                <input name="sku" placeholder="e.g. AF-POP-02" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Sale Price (₹) *</label>
                <input name="price" type="number" required placeholder="190" />
              </div>
              <div className="form-group">
                <label>Regular Price (₹)</label>
                <input name="originalPrice" type="number" placeholder="220" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Initial Stock (Units) *</label>
                <input name="stock" type="number" required defaultValue="30" />
              </div>
              <div className="form-group">
                <label>Pack Size / Unit</label>
                <input name="unit" defaultValue="10 pcs (250g)" />
              </div>
            </div>

            <div className="form-group">
              <label>Protein & Nutritional Highlights</label>
              <input name="protein" defaultValue="20g protein / 100g" />
            </div>

            <div className="form-group">
              <label>Product Description</label>
              <textarea name="description" rows={2} placeholder="Artisanal snack blast frozen at source..." />
            </div>

            <div className="form-checkbox-row">
              <label className="checkbox-label">
                <input name="isBestseller" type="checkbox" />
                <span>Mark as Bestseller</span>
              </label>
              <label className="checkbox-label">
                <input name="isFlashSale" type="checkbox" />
                <span>Include in Flash Sale</span>
              </label>
            </div>

            <button type="submit" className="primary-button full-width">
              Save to Catalog <ArrowRight size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setEditingProduct(null)}>
          <form className="modal" onSubmit={handleEditSubmit}>
            <button type="button" className="modal-close" onClick={() => setEditingProduct(null)}>
              <X size={20} />
            </button>
            <p className="eyebrow">EDIT RECIPE</p>
            <h2>Edit {editingProduct.name}</h2>
            <p className="modal-copy">Update price, description, and tags.</p>

            <div className="form-group">
              <label>Product Name</label>
              <input name="name" defaultValue={editingProduct.name} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" defaultValue={editingProduct.category}>
                  <option value="Chicken Snacks">Chicken Snacks</option>
                  <option value="Kebabs">Kebabs</option>
                  <option value="Momos">Momos</option>
                  <option value="Sausages & Cold Cuts">Sausages & Cold Cuts</option>
                  <option value="Mutton">Mutton</option>
                  <option value="Family Packs">Family Packs</option>
                </select>
              </div>
              <div className="form-group">
                <label>SKU Code</label>
                <input name="sku" defaultValue={editingProduct.sku} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Sale Price (₹)</label>
                <input name="price" type="number" defaultValue={editingProduct.price} required />
              </div>
              <div className="form-group">
                <label>Regular Price (₹)</label>
                <input name="originalPrice" type="number" defaultValue={editingProduct.originalPrice} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Stock (Units)</label>
                <input name="stock" type="number" defaultValue={editingProduct.stock} required />
              </div>
              <div className="form-group">
                <label>Pack Size</label>
                <input name="unit" defaultValue={editingProduct.unit} />
              </div>
            </div>

            <div className="form-group">
              <label>Protein Highlights</label>
              <input name="protein" defaultValue={editingProduct.protein} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" rows={2} defaultValue={editingProduct.description} />
            </div>

            <div className="form-checkbox-row">
              <label className="checkbox-label">
                <input name="isBestseller" type="checkbox" defaultChecked={editingProduct.isBestseller} />
                <span>Bestseller</span>
              </label>
              <label className="checkbox-label">
                <input name="isFlashSale" type="checkbox" defaultChecked={editingProduct.isFlashSale} />
                <span>Flash Sale</span>
              </label>
            </div>

            <button type="submit" className="primary-button full-width">
              Update Product <Check size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
