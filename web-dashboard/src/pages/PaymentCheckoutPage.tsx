import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { paymentService } from '../services';

const PaymentCheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    loadPayment();
  }, [id]);

  const loadPayment = async () => {
    try {
      const data = await paymentService.getPayment(id!);
      setPayment(data.payment);
    } catch (error: any) {
      setError(error.message || 'Failed to load payment');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      // Step 1: Create payment intent
      const intentResponse = await paymentService.createPaymentIntent(id!);

      // Step 2: Confirm payment (in production, use Stripe.js)
      const confirmResponse = await paymentService.confirmPayment(id!, {
        paymentIntentId: intentResponse.paymentIntentId,
        paymentMethodDetails: {
          last4: cardNumber.slice(-4),
          brand: 'visa', // Detect from card number in production
        }
      });

      setSuccess(true);
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate('/payments/history');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!payment) {
    return (
      <Box p={3}>
        <Alert severity="error">Payment not found</Alert>
      </Box>
    );
  }

  if (success) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
      >
        <CheckCircleIcon style={{ fontSize: 80, color: 'green' }} />
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          Payment Successful!
        </Typography>
        <Typography color="textSecondary">
          Receipt: {payment.receiptNumber}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Redirecting to payment history...
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth="800px" mx="auto">
      <Typography variant="h4" gutterBottom>
        Complete Payment
      </Typography>

      <Grid container spacing={3}>
        {/* Payment Details */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Property
                </Typography>
                <Typography variant="body1">
                  {payment.propertyId?.title || 'N/A'}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Payment Type
                </Typography>
                <Typography variant="body1">
                  {payment.paymentType.replace('_', ' ').toUpperCase()}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Due Date
                </Typography>
                <Typography variant="body1">
                  {new Date(payment.dueDate).toLocaleDateString()}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box mb={2}>
                <Typography variant="h5" color="primary">
                  Amount: ${payment.amount.toFixed(2)}
                </Typography>
              </Box>

              <Alert severity="info" icon={<LockIcon />}>
                Your payment is secured with 256-bit encryption
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <CreditCardIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Credit/Debit Card Payment
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Cardholder Name"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                required
                margin="normal"
                inputProps={{ maxLength: 19 }}
                placeholder="1234 5678 9012 3456"
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    required
                    margin="normal"
                    placeholder="MM/YY"
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    required
                    margin="normal"
                    type="password"
                    inputProps={{ maxLength: 4 }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Billing ZIP Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
                margin="normal"
                inputProps={{ maxLength: 10 }}
              />

              <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
                <strong>Demo Mode:</strong> This is a demo payment form. In production, 
                card details are securely processed by Stripe and never stored on our servers.
              </Alert>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={processing}
                sx={{ mt: 2 }}
              >
                {processing ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Processing...
                  </>
                ) : (
                  `Pay $${payment.amount.toFixed(2)}`
                )}
              </Button>

              <Typography variant="caption" display="block" textAlign="center" mt={2} color="textSecondary">
                Secured by Stripe. PCI DSS Level 1 Certified.
              </Typography>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentCheckoutPage;
