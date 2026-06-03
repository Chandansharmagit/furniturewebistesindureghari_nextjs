import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaBoxOpen, FaCheckCircle, FaSyncAlt, FaTruckLoading } from 'react-icons/fa';
import { buildApiUrl, PRODUCT_ENDPOINTS } from '../../../config/api';
import authService from '../../../services/authService';
import './RestockPanel.css';

const LOW_STOCK_LIMIT = 5;

const RestockPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [restockingId, setRestockingId] = useState(null);
  const [notice, setNotice] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl(PRODUCT_ENDPOINTS.LIST), {
        credentials: 'include',
        headers: authService.getCredentials?.() || undefined
      });

      if (!response.ok) throw new Error('Unable to load products');

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setNotice(error.message || 'Unable to load restock data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, [loadProducts]);

  const restockProducts = useMemo(() => (
    products
      .filter((product) => Number(product.stock || 0) <= LOW_STOCK_LIMIT)
      .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
      .slice(0, 6)
  ), [products]);

  const outOfStockCount = products.filter((product) => Number(product.stock || 0) <= 0).length;
  const lowStockCount = products.filter((product) => {
    const stock = Number(product.stock || 0);
    return stock > 0 && stock <= LOW_STOCK_LIMIT;
  }).length;

  const handleRestock = async (product) => {
    const quantity = parseInt(quantities[product.id] || (Number(product.stock || 0) <= 0 ? 10 : 5), 10);

    if (Number.isNaN(quantity) || quantity <= 0) {
      setNotice('Enter a restock quantity greater than 0.');
      return;
    }

    try {
      setRestockingId(product.id);
      setNotice('');

      const response = await fetch(
        buildApiUrl(PRODUCT_ENDPOINTS.RESTOCK.replace(':id', product.id)),
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(authService.getCredentials?.() || {})
          },
          body: JSON.stringify({
            quantity,
            note: `Restocked from admin products dashboard`
          })
        }
      );
      const payload = await response.json();

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || payload.error || 'Restock failed');
      }

      setNotice(`${product.name} restocked to ${payload.product?.stock ?? 'updated'} units.`);
      setQuantities((current) => ({ ...current, [product.id]: '' }));
      loadProducts();
    } catch (error) {
      setNotice(error.message || 'Restock failed');
    } finally {
      setRestockingId(null);
    }
  };

  return (
    <section className="restock-panel" aria-label="Inventory restock">
      <div className="restock-panel__header">
        <div>
          <span className="restock-panel__eyebrow">Inventory Recovery</span>
          <h3>Restock low and out-of-stock products</h3>
        </div>
        <button type="button" onClick={loadProducts} disabled={loading} className="restock-panel__refresh">
          <FaSyncAlt /> Refresh
        </button>
      </div>

      <div className="restock-panel__summary">
        <span><FaBoxOpen /> {outOfStockCount} out of stock</span>
        <span><FaTruckLoading /> {lowStockCount} low stock</span>
      </div>

      {notice && <p className="restock-panel__notice">{notice}</p>}

      {loading ? (
        <div className="restock-panel__empty">Checking inventory...</div>
      ) : restockProducts.length === 0 ? (
        <div className="restock-panel__empty restock-panel__empty--healthy">
          <FaCheckCircle />
          Inventory looks healthy right now.
        </div>
      ) : (
        <div className="restock-panel__grid">
          {restockProducts.map((product) => {
            const stock = Number(product.stock || 0);
            const image = product.imageUrl || product.images?.[0];

            return (
              <article className="restock-card" key={product.id}>
                {image ? (
                  <img src={image} alt={product.name} />
                ) : (
                  <span className="restock-card__fallback"><FaBoxOpen /></span>
                )}
                <div className="restock-card__body">
                  <strong>{product.name}</strong>
                  <small>{product.sku || `ID ${product.id}`}</small>
                  <span className={stock <= 0 ? 'restock-card__stock danger' : 'restock-card__stock'}>
                    {stock <= 0 ? 'Out of stock' : `${stock} left`}
                  </span>
                </div>
                <div className="restock-card__actions">
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || ''}
                    onChange={(event) => setQuantities((current) => ({
                      ...current,
                      [product.id]: event.target.value
                    }))}
                    placeholder={stock <= 0 ? '10' : '5'}
                    aria-label={`Restock quantity for ${product.name}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRestock(product)}
                    disabled={restockingId === product.id}
                  >
                    {restockingId === product.id ? 'Saving...' : 'Restock'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RestockPanel;
