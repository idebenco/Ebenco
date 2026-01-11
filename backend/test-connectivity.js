#!/usr/bin/env node
/**
 * Network Connectivity & Security Test Utility
 * Tests backend API endpoints, CORS configuration, and network accessibility
 */

const https = require('https');
const http = require('http');
const dns = require('dns').promises;

// Configuration
const config = {
  apiBaseUrl: process.env.API_URL || 'http://localhost:5000',
  webDashboardUrl: process.env.WEB_URL || 'http://localhost:3000',
  mobileAppUrl: process.env.MOBILE_URL || 'http://localhost:19006',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-management',
  testOrigins: [
    'http://localhost:3000',
    'http://localhost:19006',
    'https://yourdomain.com',
    'https://admin.yourdomain.com'
  ]
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

/**
 * Make HTTP request
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 5000
    };

    const req = protocol.request(reqOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

/**
 * Test result logger
 */
function logTest(name, passed, message, level = 'info') {
  const symbol = passed ? '✓' : '✗';
  const color = passed ? colors.green : (level === 'warning' ? colors.yellow : colors.red);
  
  console.log(`${color}${symbol}${colors.reset} ${name}: ${message}`);
  
  results.tests.push({ name, passed, message, level });
  
  if (passed) {
    results.passed++;
  } else if (level === 'warning') {
    results.warnings++;
  } else {
    results.failed++;
  }
}

/**
 * Test 1: Backend Health Check
 */
async function testHealthEndpoint() {
  console.log(`\n${colors.cyan}=== Testing Backend Health ===${colors.reset}`);
  
  try {
    const response = await makeRequest(`${config.apiBaseUrl}/health`);
    
    if (response.statusCode === 200) {
      const body = JSON.parse(response.body);
      logTest(
        'Health Endpoint',
        true,
        `Backend is healthy (status: ${body.status})`
      );
    } else {
      logTest(
        'Health Endpoint',
        false,
        `Unexpected status code: ${response.statusCode}`
      );
    }
  } catch (error) {
    logTest('Health Endpoint', false, `Connection failed: ${error.message}`);
  }
}

/**
 * Test 2: CORS Configuration
 */
async function testCORSConfiguration() {
  console.log(`\n${colors.cyan}=== Testing CORS Configuration ===${colors.reset}`);
  
  for (const origin of config.testOrigins) {
    try {
      const response = await makeRequest(`${config.apiBaseUrl}/api/properties`, {
        method: 'OPTIONS',
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      const corsHeader = response.headers['access-control-allow-origin'];
      
      if (corsHeader === origin || corsHeader === '*') {
        logTest(
          `CORS: ${origin}`,
          true,
          `Access allowed (${corsHeader})`
        );
      } else {
        logTest(
          `CORS: ${origin}`,
          false,
          `Access denied (received: ${corsHeader || 'none'})`
        );
      }
      
      // Warning if using wildcard in production
      if (corsHeader === '*') {
        logTest(
          'CORS Security',
          false,
          'Warning: Wildcard CORS (*) detected - not recommended for production',
          'warning'
        );
      }
    } catch (error) {
      logTest(`CORS: ${origin}`, false, `Test failed: ${error.message}`);
    }
  }
}

/**
 * Test 3: API Endpoints Accessibility
 */
async function testAPIEndpoints() {
  console.log(`\n${colors.cyan}=== Testing API Endpoints ===${colors.reset}`);
  
  const endpoints = [
    { path: '/api/properties', method: 'GET', expectCode: 200 },
    { path: '/api/auth/login', method: 'POST', expectCode: 400 }, // Expecting 400 for missing body
    { path: '/api/applications', method: 'GET', expectCode: 401 }, // Expecting 401 for no auth
    { path: '/api/payments', method: 'GET', expectCode: 401 },
    { path: '/nonexistent', method: 'GET', expectCode: 404 }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${config.apiBaseUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.statusCode === endpoint.expectCode) {
        logTest(
          `${endpoint.method} ${endpoint.path}`,
          true,
          `Responded with expected status ${endpoint.expectCode}`
        );
      } else {
        logTest(
          `${endpoint.method} ${endpoint.path}`,
          false,
          `Expected ${endpoint.expectCode}, got ${response.statusCode}`,
          'warning'
        );
      }
    } catch (error) {
      logTest(
        `${endpoint.method} ${endpoint.path}`,
        false,
        `Connection failed: ${error.message}`
      );
    }
  }
}

/**
 * Test 4: DNS Resolution
 */
async function testDNSResolution() {
  console.log(`\n${colors.cyan}=== Testing DNS Resolution ===${colors.reset}`);
  
  const hosts = [
    new URL(config.apiBaseUrl).hostname,
    'mongodb.net',
    'stripe.com',
    's3.amazonaws.com'
  ];
  
  for (const host of hosts) {
    try {
      const addresses = await dns.resolve4(host);
      logTest(
        `DNS: ${host}`,
        true,
        `Resolved to ${addresses[0]}`
      );
    } catch (error) {
      logTest(
        `DNS: ${host}`,
        false,
        `Resolution failed: ${error.message}`
      );
    }
  }
}

/**
 * Test 5: SSL/TLS Certificate
 */
async function testSSLCertificate() {
  console.log(`\n${colors.cyan}=== Testing SSL/TLS ===${colors.reset}`);
  
  const url = new URL(config.apiBaseUrl);
  
  if (url.protocol === 'https:') {
    try {
      const response = await makeRequest(config.apiBaseUrl);
      logTest(
        'SSL Certificate',
        true,
        'Valid SSL certificate detected'
      );
    } catch (error) {
      if (error.message.includes('certificate')) {
        logTest(
          'SSL Certificate',
          false,
          `Certificate error: ${error.message}`
        );
      } else {
        logTest(
          'SSL Certificate',
          false,
          `Connection error: ${error.message}`,
          'warning'
        );
      }
    }
  } else {
    logTest(
      'SSL Certificate',
      false,
      'Not using HTTPS - SSL not configured',
      'warning'
    );
  }
}

/**
 * Test 6: Rate Limiting
 */
async function testRateLimiting() {
  console.log(`\n${colors.cyan}=== Testing Rate Limiting ===${colors.reset}`);
  
  const requests = [];
  const numRequests = 10;
  
  for (let i = 0; i < numRequests; i++) {
    requests.push(
      makeRequest(`${config.apiBaseUrl}/api/properties`).catch(e => ({ error: e }))
    );
  }
  
  try {
    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r.statusCode === 429);
    
    if (rateLimited) {
      logTest(
        'Rate Limiting',
        true,
        'Rate limiting is active (429 response detected)'
      );
    } else {
      logTest(
        'Rate Limiting',
        false,
        'No rate limiting detected - consider implementing',
        'warning'
      );
    }
  } catch (error) {
    logTest(
      'Rate Limiting',
      false,
      `Test failed: ${error.message}`,
      'warning'
    );
  }
}

/**
 * Test 7: Security Headers
 */
async function testSecurityHeaders() {
  console.log(`\n${colors.cyan}=== Testing Security Headers ===${colors.reset}`);
  
  try {
    const response = await makeRequest(config.apiBaseUrl);
    const headers = response.headers;
    
    const securityHeaders = {
      'x-frame-options': 'X-Frame-Options',
      'x-content-type-options': 'X-Content-Type-Options',
      'strict-transport-security': 'Strict-Transport-Security (HSTS)',
      'x-xss-protection': 'X-XSS-Protection'
    };
    
    for (const [header, name] of Object.entries(securityHeaders)) {
      if (headers[header]) {
        logTest(
          `Header: ${name}`,
          true,
          `Present (${headers[header]})`
        );
      } else {
        logTest(
          `Header: ${name}`,
          false,
          'Not present - consider adding',
          'warning'
        );
      }
    }
  } catch (error) {
    logTest(
      'Security Headers',
      false,
      `Test failed: ${error.message}`,
      'warning'
    );
  }
}

/**
 * Print summary
 */
function printSummary() {
  console.log(`\n${colors.cyan}=== Test Summary ===${colors.reset}`);
  console.log(`${colors.green}Passed:${colors.reset} ${results.passed}`);
  console.log(`${colors.red}Failed:${colors.reset} ${results.failed}`);
  console.log(`${colors.yellow}Warnings:${colors.reset} ${results.warnings}`);
  console.log(`Total: ${results.tests.length}`);
  
  const successRate = (results.passed / results.tests.length * 100).toFixed(1);
  console.log(`\nSuccess Rate: ${successRate}%`);
  
  if (results.failed === 0 && results.warnings === 0) {
    console.log(`\n${colors.green}✓ All tests passed! System is properly configured.${colors.reset}`);
  } else if (results.failed === 0) {
    console.log(`\n${colors.yellow}⚠ All critical tests passed, but there are warnings.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}✗ Some tests failed. Please review the configuration.${colors.reset}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   Network Connectivity & Security Test Utility           ║${colors.reset}`);
  console.log(`${colors.blue}║   Rental Property Management System                      ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  
  console.log(`\nTesting API: ${colors.cyan}${config.apiBaseUrl}${colors.reset}`);
  console.log(`Test Origins: ${config.testOrigins.join(', ')}`);
  
  await testHealthEndpoint();
  await testCORSConfiguration();
  await testAPIEndpoints();
  await testDNSResolution();
  await testSSLCertificate();
  await testRateLimiting();
  await testSecurityHeaders();
  
  printSummary();
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
if (require.main === module) {
  main().catch((error) => {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = { makeRequest, testHealthEndpoint, testCORSConfiguration };
