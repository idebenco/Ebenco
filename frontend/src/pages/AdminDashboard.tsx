import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, orderService, userService } from '../services';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [products, orders, users] = await Promise.all([
        productService.getAll(),
        orderService.getAll(),
        userService.getAll(),
      ]);

      setStats({
        totalProducts: products.products.length,
        totalOrders: orders.orders.length,
        pendingOrders: orders.orders.filter((o: any) => o.status === 'pending').length,
        totalCustomers: users.users.filter((u: any) => u.role === 'customer').length,
      });

      setRecentOrders(orders.orders.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
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
        <h1>Admin Dashboard</h1>
        <p>Manage your wholesale business</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalProducts}</div>
          <div className="stat-label">Total Products</div>
          <Link to="/admin/products" className="btn btn-primary mt-2">
            Manage Products
          </Link>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
          <Link to="/admin/orders" className="btn btn-primary mt-2">
            View Orders
          </Link>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pendingOrders}</div>
          <div className="stat-label">Pending Orders</div>
          <Link to="/admin/orders" className="btn btn-primary mt-2">
            Process Orders
          </Link>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalCustomers}</div>
          <div className="stat-label">Total Customers</div>
          <Link to="/admin/customers" className="btn btn-primary mt-2">
            View Customers
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerId?.name || 'N/A'}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${
                        order.status === 'completed' ? 'success' :
                        order.status === 'pending' ? 'warning' :
                        order.status === 'approved' ? 'info' :
                        'secondary'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link to="/admin/products" className="btn btn-primary">
            Add New Product
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary">
            Manage Orders
          </Link>
          <Link to="/admin/customers" className="btn btn-secondary">
            View Customers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
