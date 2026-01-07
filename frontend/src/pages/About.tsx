import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>
      <h1>About Us</h1>
      
      <div className="card">
        <h2>Our Story</h2>
        <p>
          Welcome to Wholesale Business, your premier destination for quality foodstuffs at wholesale prices.
          Since our establishment, we have been committed to providing businesses with the best products
          from trusted suppliers around the world.
        </p>
        <p>
          Our mission is to bridge the gap between producers and businesses, ensuring that restaurants,
          grocery stores, and food service providers have access to premium quality ingredients at
          competitive wholesale prices.
        </p>
      </div>

      <div className="card">
        <h2>Our Mission</h2>
        <p>
          To deliver excellence in wholesale food distribution by providing:
        </p>
        <ul style={{ marginLeft: '2rem' }}>
          <li>High-quality products sourced from trusted suppliers</li>
          <li>Competitive pricing that helps businesses thrive</li>
          <li>Reliable and timely delivery services</li>
          <li>Outstanding customer service and support</li>
        </ul>
      </div>

      <div className="card">
        <h2>Why Choose Us?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          <div>
            <h3>🌟 Quality Assurance</h3>
            <p>Every product undergoes strict quality control to meet industry standards.</p>
          </div>
          <div>
            <h3>💼 Business Focus</h3>
            <p>We understand business needs and provide flexible ordering options.</p>
          </div>
          <div>
            <h3>🚚 Fast Delivery</h3>
            <p>Efficient logistics ensure your products arrive fresh and on time.</p>
          </div>
          <div>
            <h3>📈 Competitive Pricing</h3>
            <p>Wholesale prices that help your business maintain healthy margins.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Our Values</h2>
        <ul style={{ marginLeft: '2rem' }}>
          <li><strong>Integrity:</strong> We conduct business with honesty and transparency</li>
          <li><strong>Quality:</strong> We never compromise on product quality</li>
          <li><strong>Customer Focus:</strong> Your success is our success</li>
          <li><strong>Innovation:</strong> We continuously improve our services</li>
          <li><strong>Sustainability:</strong> We support environmentally responsible practices</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
