# Network Connectivity & Security Testing

This directory contains tools for testing network connectivity, firewall rules, and security configuration.

## Test Connectivity Script

The `test-connectivity.js` script performs comprehensive network and security tests on your backend API.

### Usage

```bash
# Default (tests localhost)
npm run test:connectivity

# Test production API
API_URL=https://api.yourdomain.com npm run test:connectivity

# Test with custom origins
API_URL=https://api.yourdomain.com \
CORS_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com \
npm run test:connectivity
```

### Tests Performed

1. **Backend Health Check**
   - Tests if the `/health` endpoint is accessible
   - Verifies API is running and responding

2. **CORS Configuration**
   - Tests CORS headers for multiple origins
   - Checks if CORS is properly configured
   - Warns about wildcard CORS in production

3. **API Endpoints Accessibility**
   - Tests various API endpoints
   - Verifies proper HTTP status codes
   - Checks authentication protection

4. **DNS Resolution**
   - Tests DNS resolution for critical services
   - Verifies network connectivity
   - Checks MongoDB, Stripe, AWS connectivity

5. **SSL/TLS Certificate**
   - Validates SSL certificate if using HTTPS
   - Ensures secure connections

6. **Rate Limiting**
   - Tests if rate limiting is active
   - Helps prevent abuse and DDoS attacks

7. **Security Headers**
   - Checks for security headers
   - Validates best practices implementation

### Example Output

```
╔════════════════════════════════════════════════════════════╗
║   Network Connectivity & Security Test Utility           ║
║   Rental Property Management System                      ║
╚════════════════════════════════════════════════════════════╝

Testing API: http://localhost:5000
Test Origins: http://localhost:3000, http://localhost:19006

=== Testing Backend Health ===
✓ Health Endpoint: Backend is healthy (status: OK)

=== Testing CORS Configuration ===
✓ CORS: http://localhost:3000: Access allowed (http://localhost:3000)
✓ CORS: http://localhost:19006: Access allowed (http://localhost:19006)

=== Testing API Endpoints ===
✓ GET /api/properties: Responded with expected status 200
✓ POST /api/auth/login: Responded with expected status 400
✓ GET /api/applications: Responded with expected status 401

=== Test Summary ===
Passed: 15
Failed: 0
Warnings: 2
Total: 17

Success Rate: 88.2%

⚠ All critical tests passed, but there are warnings.
```

### Exit Codes

- `0` - All tests passed
- `1` - One or more critical tests failed

### Integration with CI/CD

Add to your GitHub Actions workflow:

```yaml
- name: Test API Connectivity
  run: |
    cd backend
    npm run test:connectivity
  env:
    API_URL: ${{ secrets.API_URL }}
```

## Firewall Configuration

See [docs/SECURITY.md](../docs/SECURITY.md) for:
- AWS Security Group templates
- UFW (Ubuntu Firewall) configuration
- CORS best practices
- SSL/TLS setup
- Rate limiting configuration
- Security headers

## Troubleshooting

### Test Fails with "Connection refused"

**Problem**: Backend is not running or firewall is blocking
**Solution**: 
1. Ensure backend is running: `npm start`
2. Check firewall rules: `sudo ufw status`
3. Verify port is open: `netstat -tlnp | grep 5000`

### CORS Test Fails

**Problem**: CORS is not properly configured
**Solution**:
1. Check `.env` file has `CORS_ORIGIN` set
2. Verify origins match exactly (no trailing slashes)
3. Review `src/server.js` CORS configuration

### DNS Resolution Fails

**Problem**: Network connectivity or DNS issues
**Solution**:
1. Check internet connection
2. Test DNS: `nslookup mongodb.net`
3. Try different DNS server: `8.8.8.8` (Google)

### SSL Certificate Error

**Problem**: Invalid or expired SSL certificate
**Solution**:
1. Renew certificate: `sudo certbot renew`
2. Check certificate: `openssl s_client -connect api.yourdomain.com:443`
3. Verify certificate files in Nginx config

## Manual Testing

### Test CORS manually

```bash
curl -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  -v https://api.yourdomain.com/api/properties
```

### Test Authentication

```bash
# Should fail (401)
curl -X GET https://api.yourdomain.com/api/applications

# Should succeed
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

### Test Rate Limiting

```bash
# Send multiple rapid requests
for i in {1..20}; do
  curl -X GET https://api.yourdomain.com/api/properties
done
```

## Security Best Practices

Before deploying to production:

- [ ] Set explicit CORS origins (no wildcards)
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Use strong JWT secrets
- [ ] Enable MongoDB authentication
- [ ] Set up monitoring and alerts
- [ ] Regular security updates

See [docs/SECURITY.md](../docs/SECURITY.md) for complete checklist.
