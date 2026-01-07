import React from 'react';

const WholesalePricing: React.FC = () => {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1>Wholesale Pricing</h1>
      <p className="text-center" style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
        Competitive bulk pricing designed to help your business thrive
      </p>

      <div className="card">
        <h2>How Wholesale Pricing Works</h2>
        <p>
          Our wholesale pricing structure is designed to reward bulk purchases while maintaining
          the highest quality standards. The more you order, the better your per-unit pricing becomes.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div className="card" style={{ background: 'var(--light-color)' }}>
            <h3>🎯 Minimum Orders</h3>
            <p>Each product has a minimum order quantity to qualify for wholesale pricing.</p>
          </div>
          <div className="card" style={{ background: 'var(--light-color)' }}>
            <h3>💰 Volume Discounts</h3>
            <p>Larger orders receive better per-unit pricing automatically applied at checkout.</p>
          </div>
          <div className="card" style={{ background: 'var(--light-color)' }}>
            <h3>📦 Bulk Packaging</h3>
            <p>Products are packed in bulk units (bags, cartons, cases) for efficient handling.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Pricing Tiers</h2>
        <p>Our tiered pricing structure ensures you get the best value for your business:</p>
        
        <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Order Size</th>
                <th>Discount Level</th>
                <th>Example Savings</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Minimum Order</td>
                <td>Standard Price</td>
                <td>Base price as listed</td>
                <td>Small businesses, testing</td>
              </tr>
              <tr>
                <td>10-50 units</td>
                <td>5% off</td>
                <td>$5 per $100 spent</td>
                <td>Restaurants, cafes</td>
              </tr>
              <tr>
                <td>51-100 units</td>
                <td>10% off</td>
                <td>$10 per $100 spent</td>
                <td>Small chains, retailers</td>
              </tr>
              <tr>
                <td>100+ units</td>
                <td>15% off</td>
                <td>$15 per $100 spent</td>
                <td>Large operations, distributors</td>
              </tr>
              <tr>
                <td>Custom Orders</td>
                <td>Contact us</td>
                <td>Custom negotiated rates</td>
                <td>Enterprise, long-term contracts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Sample Pricing Examples</h2>
        <p>Here are real examples from our product catalog:</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div className="product-card">
            <div className="product-info">
              <h3 className="product-name">Premium Rice</h3>
              <div className="product-category">Grains</div>
              <div className="product-price">$45.99</div>
              <div className="product-unit">per bag (25kg)</div>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--light-color)', borderRadius: '4px' }}>
                <strong>Minimum Order: 10 bags</strong>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  • 10 bags: $45.99 each = $459.90<br />
                  • 50 bags: $43.69 each = $2,184.50 (5% off)<br />
                  • 100 bags: $39.09 each = $3,909.00 (15% off)
                </div>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="product-info">
              <h3 className="product-name">Olive Oil</h3>
              <div className="product-category">Oils</div>
              <div className="product-price">$125.00</div>
              <div className="product-unit">per carton (12 x 1L)</div>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--light-color)', borderRadius: '4px' }}>
                <strong>Minimum Order: 5 cartons</strong>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  • 5 cartons: $125.00 each = $625.00<br />
                  • 20 cartons: $118.75 each = $2,375.00 (5% off)<br />
                  • 60 cartons: $106.25 each = $6,375.00 (15% off)
                </div>
              </div>
            </div>
          </div>

          <div className="product-card">
            <div className="product-info">
              <h3 className="product-name">Black Beans</h3>
              <div className="product-category">Legumes</div>
              <div className="product-price">$42.00</div>
              <div className="product-unit">per bag (25kg)</div>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--light-color)', borderRadius: '4px' }}>
                <strong>Minimum Order: 8 bags</strong>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  • 8 bags: $42.00 each = $336.00<br />
                  • 40 bags: $39.90 each = $1,596.00 (5% off)<br />
                  • 80 bags: $35.70 each = $2,856.00 (15% off)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Additional Benefits</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h4>🚚 Free Shipping</h4>
            <p>Orders over $1,000 qualify for free standard shipping nationwide.</p>
          </div>
          <div>
            <h4>📅 Flexible Payment</h4>
            <p>Net 30 payment terms available for established business customers.</p>
          </div>
          <div>
            <h4>🔄 Consistent Supply</h4>
            <p>Lock in prices with regular scheduled deliveries.</p>
          </div>
          <div>
            <h4>🎁 Loyalty Rewards</h4>
            <p>Earn points on every purchase for future discounts.</p>
          </div>
          <div>
            <h4>📞 Dedicated Support</h4>
            <p>Personal account manager for orders over $5,000/month.</p>
          </div>
          <div>
            <h4>🔍 Quality Guarantee</h4>
            <p>100% satisfaction guarantee on all wholesale orders.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Getting Started</h2>
        <p>Ready to take advantage of our wholesale pricing?</p>
        <ol style={{ marginLeft: '2rem', marginTop: '1rem', lineHeight: '2' }}>
          <li><strong>Register:</strong> Create a free business account</li>
          <li><strong>Browse:</strong> Explore our product catalog with wholesale pricing</li>
          <li><strong>Order:</strong> Add products meeting minimum order quantities</li>
          <li><strong>Save:</strong> Automatic discounts applied based on order size</li>
          <li><strong>Deliver:</strong> Fast, reliable delivery to your business location</li>
        </ol>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a href="/register" className="btn btn-primary" style={{ marginRight: '1rem' }}>
            Register for Wholesale
          </a>
          <a href="/products" className="btn btn-secondary">
            View Products
          </a>
        </div>
      </div>

      <div className="card" style={{ background: 'var(--light-color)' }}>
        <h2>Have Questions?</h2>
        <p>
          Our sales team is here to help you find the best pricing for your business needs.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <p><strong>📧 Email:</strong> sales@wholesale.com</p>
          <p><strong>📞 Phone:</strong> +1 (555) 123-4567</p>
          <p><strong>💬 Chat:</strong> Available Mon-Fri, 9am-6pm EST</p>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <a href="/contact" className="btn btn-primary">
            Contact Sales Team
          </a>
        </div>
      </div>
    </div>
  );
};

export default WholesalePricing;
