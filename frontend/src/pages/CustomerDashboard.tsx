import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { orderService, productService } from '../services';
import { Order, Product } from '../types';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
  });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        orderService.getAll(),
        productService.getAll({ available: true }),
      ]);
      setOrders(ordersRes.orders);
      setProducts(productsRes.products);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (orderItems.length === 0) {
      setError('Please add at least one item to your order');
      return;
    }

    try {
      await orderService.create({
        items: orderItems,
        deliveryAddress,
        notes,
      });
      setSuccess('Order submitted successfully!');
      setShowOrderForm(false);
      setOrderItems([]);
      setNotes('');
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit order');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      pending: 'badge-warning',
      approved: 'badge-info',
      completed: 'badge-success',
      rejected: 'badge-danger',
      cancelled: 'badge-secondary',
    };
    return `badge ${badges[status] || 'badge-secondary'}`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{orders.length}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div className="stat-label">Pending Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {orders.filter(o => o.status === 'completed').length}
          </div>
          <div className="stat-label">Completed Orders</div>
        </div>
      </div>

      <div className="card">
        <div className="flex-between">
          <h2>Submit New Order</h2>
          <button
            onClick={() => setShowOrderForm(!showOrderForm)}
            className="btn btn-primary"
          >
            {showOrderForm ? 'Cancel' : 'New Order'}
          </button>
        </div>

        {showOrderForm && (
          <form onSubmit={handleSubmitOrder} style={{ marginTop: '1.5rem' }}>
            <h3>Order Items</h3>
            {orderItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'end' }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label">Product</label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">Select a product</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} - ${product.price} per {product.unit} (Min: {product.minimumOrder})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    className="form-input"
                    min="1"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddItem} className="btn btn-secondary mb-3">
              Add Item
            </button>

            <h3>Delivery Address</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Street</label>
                <input
                  type="text"
                  value={deliveryAddress.street}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  value={deliveryAddress.state}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Zip Code</label>
                <input
                  type="text"
                  value={deliveryAddress.zipCode}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea"
                placeholder="Any special instructions or notes"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit Order
            </button>
          </form>
        )}
      </div>

      <div className="card">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.items.length} items</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={getStatusBadge(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.status === 'pending' && (
                        <button
                          onClick={async () => {
                            if (confirm('Cancel this order?')) {
                              try {
                                await orderService.delete(order._id);
                                setSuccess('Order cancelled');
                                fetchData();
                              } catch (err: any) {
                                setError('Failed to cancel order');
                              }
                            }
                          }}
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.75rem' }}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
