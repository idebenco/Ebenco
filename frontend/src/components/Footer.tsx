import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>
              We are a leading wholesale supplier of premium foodstuffs,
              serving businesses with quality products at competitive prices.
            </p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <p><a href="/products">Products</a></p>
            <p><a href="/about">About Us</a></p>
            <p><a href="/contact">Contact</a></p>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>📧 info@wholesale.com</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>📍 123 Business Street, NY 10001</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Wholesale Business. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
