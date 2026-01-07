import React, { useState, useEffect } from 'react';
import { orderService } from '../services';
import { Order } from '../types';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAll();
      setOrders(response.orders);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setError('');
      setSuccess('');
      await orderService.updateStatus(orderId, newStatus);
      setSuccess('Order status updated successfully!');
      fetchOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status');
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

  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

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
        <h1>Manage Orders</h1>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
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
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {orders.filter(o => o.status === 'approved').length}
          </div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {orders.filter(o => o.status === 'completed').length}
          </div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="card">
        <h2>Orders List ({filteredOrders.length})</h2>
        {filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>
                      {typeof order.customerId === 'object'
                        ? order.customerId.name
                        : 'N/A'}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <details>
                        <summary style={{ cursor: 'pointer' }}>
                          {order.items.length} items
                        </summary>
                        <ul style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.productName} - Qty: {item.quantity} - $
                              {item.subtotal.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={getStatusBadge(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="form-select"
                        style={{ minWidth: '120px', padding: '0.25rem' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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

export default AdminOrders;
