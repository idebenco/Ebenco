import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <>
      <div className="hero">
        <div className="container">
          <h1>Welcome to Premium Wholesale</h1>
          <p>Your trusted partner for quality foodstuffs at wholesale prices</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
            <Link to="/register" className="btn btn-outline">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '4rem 1rem' }}>
        <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2>Why Choose Us?</h2>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value">500+</div>
              <div className="stat-label">Quality Products</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">1000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">Fast</div>
              <div className="stat-label">Delivery Service</div>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Our Services</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card">
              <h3>🌾 Premium Quality</h3>
              <p>All our products are sourced from trusted suppliers and undergo strict quality control.</p>
            </div>
            <div className="card">
              <h3>💰 Competitive Pricing</h3>
              <p>We offer wholesale prices that help your business grow while maintaining quality.</p>
            </div>
            <div className="card">
              <h3>🚚 Reliable Delivery</h3>
              <p>Fast and secure delivery to ensure your products arrive fresh and on time.</p>
            </div>
            <div className="card">
              <h3>📞 Customer Support</h3>
              <p>Our dedicated team is always ready to assist you with orders and inquiries.</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2>Ready to Start?</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Join hundreds of businesses that trust us for their wholesale needs
          </p>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.25rem', padding: '1rem 2rem' }}>
            Register Now
          </Link>
        </section>
      </div>
    </>
  );
};

export default Home;
