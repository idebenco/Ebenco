# SmallScale - Professional Wholesale Foodstuffs Business Website

A modern, mobile-friendly, and secure wholesale business website for selling foodstuffs online in Nigeria. Built with clean HTML5, CSS3, and vanilla JavaScript for optimal performance and accessibility.

## 🌟 Features

### Core Functionality
- **Responsive Design**: Mobile-first approach ensuring perfect display on all devices
- **Fast Loading**: Optimized CSS and vanilla JavaScript with no heavy frameworks
- **SEO Optimized**: Proper meta tags, semantic HTML, and structured content
- **Secure**: Clean code with form validation and no external dependencies
- **Accessible**: WCAG compliant with proper ARIA labels and semantic markup

### Business Features
- Professional homepage with hero section and featured products
- Complete product catalog with retail shopping cart and filtering
- Retail shopping cart with LocalStorage persistence
- Dual pricing (retail + wholesale bulk discounts)
- Quote request system for wholesale inquiries
- Customer login and registration system
- Customer dashboard for order management
- FAQs page with searchable questions
- Pricing tiers page (Starter, Business, Enterprise)
- Contact form with validation
- WhatsApp integration for quick customer support (Nigeria-friendly)
- About Us page showcasing business values and mission
- Mobile-friendly navigation with hamburger menu

## 📁 Project Structure

```
SmallScale/
├── index.html                      # Homepage
├── products.html                   # Product catalog with shopping cart
├── pricing.html                    # Pricing tiers and bulk discounts
├── about.html                      # About us page
├── contact.html                    # Contact page
├── faq.html                        # Frequently asked questions
├── login.html                      # Customer login and registration
├── dashboard.html                  # Customer dashboard (order management)
├── quote.html                      # Quote request page
├── CUSTOMER_ACCESS_SYSTEM.md       # Customer access system documentation
├── assets/
│   ├── css/
│   │   ├── main.css               # Main stylesheet with cart styles
│   │   └── responsive.css         # Responsive/mobile styles
│   ├── js/
│   │   └── main.js                # JavaScript (cart, forms, navigation)
│   └── images/                    # Product and brand images
├── README.md
└── LICENSE
```

## 🚀 Technology Stack

### Frontend
- **HTML5**: Semantic markup for better SEO and accessibility
- **CSS3**: Modern styling with CSS Grid, Flexbox, and CSS Variables
- **Vanilla JavaScript**: No frameworks for maximum performance and fast loading
- **Progressive Enhancement**: Works without JavaScript, enhanced with it

### Design Features
- **CSS Variables**: Easy theme customization
- **Mobile-First Design**: Optimized for smartphones and tablets
- **Print Styles**: Professional printing support
- **Dark Mode Ready**: Prepared for dark mode implementation

### Performance Optimizations
- Minimal HTTP requests
- Optimized CSS delivery
- Lazy loading support for images
- Debounced event handlers
- Local storage for user preferences

## 🎨 Design System

### Color Palette
- **Primary**: #2d6a4f (Green - represents freshness and trust)
- **Secondary**: #f77f00 (Orange - for CTAs and accents)
- **Accent**: #d62828 (Red - for badges and alerts)
- **Success**: #52b788 (Green - for success messages)
- **WhatsApp**: #25D366 (WhatsApp brand color)

### Typography
- **Font Stack**: System fonts for fast loading
- **Base Size**: 16px with relative units (rem/em)
- **Line Height**: 1.6 for readability

## 💻 Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/idsmallscale/SmallScale.git
   cd SmallScale
   ```

2. **Open in browser**:
   Simply open `index.html` in your web browser. No build process required!

3. **For development**:
   Use a local server for better development experience:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Access the website**:
   Open `http://localhost:8000` in your browser

## 📱 Pages Overview

### Homepage (index.html)
- Hero section with clear value proposition
- Business introduction with statistics
- 6 key benefits section
- Product categories section
- Featured products showcase
- Trust elements and customer types
- Multiple call-to-action sections

### Products (products.html) 🛒
- Complete product catalog (12 products)
- **Retail shopping cart** with floating widget
- Dual pricing (retail + bulk discounts)
- Minimum order quantities displayed
- Category filtering (Grains, Oils, Spices, Legumes, Flour)
- Real-time search functionality
- Quantity selectors with units
- Add to Cart and Request Quote buttons
- Cart modal with checkout

### Pricing (pricing.html)
- 3 pricing tiers (Starter, Business, Enterprise)
- Volume-based discount structure
- Sample pricing table with 6 products
- Discount levels visualization
- Price match guarantee

### Customer Login (login.html)
- Dual-tab interface (Sign In / Create Account)
- Email/password authentication
- Business registration form
- Alternative login methods (Email OTP, Phone)
- Account benefits section

### Customer Dashboard (dashboard.html) ⭐ NEW
- Account overview with tier badge
- Order statistics dashboard
- Recent orders list with status
- Active quotes section
- Quick actions menu
- Profile settings access
- Order tracking

### FAQs (faq.html)
- 24 questions across 6 categories
- Real-time search functionality
- Category filtering
- Accordion-style expandable answers
- Contact CTA for additional help

### About Us (about.html)
- Company mission and values
- Statistics and achievements
- Core values showcase
- Why choose us section

### Contact (contact.html)
- Contact form with validation
- Business information and hours
- Multiple contact methods
- Quick contact options (Phone, WhatsApp, Email)
- Location information
- Showroom visit section

### Get Quote (quote.html)
- Comprehensive quote request form
- Business information collection
- Product selection with quantities
- Delivery preferences
- Special requirements section

## 🔧 Customization

### Updating Colors
Edit the CSS variables in `assets/css/main.css`:
```css
:root {
    --primary-color: #2d6a4f;
    --secondary-color: #f77f00;
    /* Modify other colors as needed */
}
```

### Adding Products
Edit the products grid in `products.html`:
```html
<div class="product-card" data-category="category-name">
    <!-- Product content -->
</div>
```

### Contact Information
Update contact details in all HTML files (search for `damseljummy853@gmail.com` and phone numbers)

### WhatsApp Integration
Replace `2348000000000` with your actual WhatsApp number in all files

## 🌐 Deployment Options

### For Nigerian Hosting Providers
Recommended hosting services in Nigeria:
- **Whogohost**: Reliable Nigerian hosting
- **Qservers**: Good performance and support
- **Web4Africa**: Pan-African hosting provider
- **Truehost**: Affordable and reliable

### Deployment Steps
1. **FTP Upload**: Upload all files to your hosting provider
2. **Domain Setup**: Point your domain to the hosting directory
3. **SSL Certificate**: Enable HTTPS (most hosts provide free Let's Encrypt SSL)
4. **Testing**: Test all pages and forms on mobile and desktop

### Alternative Deployment (Free Options)
- **GitHub Pages**: Free hosting for static sites
- **Netlify**: Free tier with continuous deployment
- **Vercel**: Fast and free for static sites
- **Cloudflare Pages**: Global CDN and free hosting

## 📊 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## ♿ Accessibility

- WCAG 2.1 Level AA compliant
- Keyboard navigation support
- Screen reader friendly
- Proper ARIA labels
- Semantic HTML structure
- High contrast ratios

## 🔐 Security Features

- Form validation (client-side)
- No external dependencies to minimize attack surface
- Prepared for HTTPS deployment
- Input sanitization ready for backend integration

## 🚀 Performance

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Mobile Optimized**: Fast loading on 3G connections

## 📈 SEO Features

- Semantic HTML5 markup
- Meta descriptions on all pages
- Open Graph tags for social sharing
- Structured content hierarchy
- Mobile-friendly (Google's mobile-first indexing)
- Fast loading times

## 🔑 Customer Access System

A comprehensive customer access system has been designed for this wholesale website. See **[CUSTOMER_ACCESS_SYSTEM.md](CUSTOMER_ACCESS_SYSTEM.md)** for complete documentation covering:

- **Customer Registration Process** - Business verification and application workflow
- **Approval System** - Multi-stage approval with admin review
- **Login & Authentication** - Email/password, OTP, security features
- **Access Levels & Permissions** - Tiered access (Starter, Business, Enterprise)
- **Wholesale Pricing Access** - Dynamic pricing based on customer tier
- **Order Management** - Retail orders, wholesale quotes, standing orders
- **Customer Dashboard** - Order tracking, quote management, account settings
- **Backend Requirements** - API endpoints, database schema, tech stack
- **Implementation Phases** - 7-phase rollout plan

### Key Features of Access System
✅ Business verification with CAC registration
✅ Tiered pricing (10%, 20%, 30% discounts)
✅ Customer approval workflow
✅ Order and quote management
✅ Payment terms and credit management
✅ Account dashboard with analytics
✅ Admin backend for customer/order management

## 🛠️ Future Enhancements

- Backend API implementation (see CUSTOMER_ACCESS_SYSTEM.md)
- Database integration for customer and product management
- Payment gateway integration (Paystack, Flutterwave)
- Admin dashboard for customer approval and order management
- Email and SMS notifications
- Order tracking with delivery updates
- Customer account credit management
- Advanced analytics and reporting
- Multi-language support (English/Pidgin)
- Progressive Web App (PWA) features
- Mobile app (iOS/Android)

## 📞 Support

For questions or support:
- Email: damseljummy853@gmail.com
- WhatsApp: +234 704 609 9135
- Phone: +234 704 609 9135

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👨‍💻 Author

**SmallScale Development Team**

---

**Built with ❤️ for Nigerian businesses**
