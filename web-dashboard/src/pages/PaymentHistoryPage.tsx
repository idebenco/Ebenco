import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import { paymentService } from '../services';

const PaymentHistoryPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentsData, statsData] = await Promise.all([
        paymentService.getPayments(),
        paymentService.getStatistics(),
      ]);
      setPayments(paymentsData.payments);
      setStatistics(statsData.statistics);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'warning';
      case 'processing':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'application_fee':
        return 'primary';
      case 'rent':
        return 'secondary';
      case 'deposit':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      const receipt = await paymentService.getReceipt(paymentId);
      // In production, download the PDF
      console.log('Receipt:', receipt);
      alert('Receipt downloaded! (Mock mode - implement PDF download in production)');
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  const filterPayments = () => {
    switch (tabValue) {
      case 1:
        return payments.filter((p) => p.paymentType === 'application_fee');
      case 2:
        return payments.filter((p) => p.paymentType === 'rent');
      case 3:
        return payments.filter((p) => p.paymentType === 'deposit');
      default:
        return payments;
    }
  };

  const filteredPayments = filterPayments();

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Payment History
      </Typography>

      {/* Statistics Cards */}
      {statistics && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Paid
                </Typography>
                <Typography variant="h4">
                  ${statistics.totalRevenue.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Payments
                </Typography>
                <Typography variant="h4">
                  {statistics.totalPayments}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed
                </Typography>
                <Typography variant="h4" color="success.main">
                  {statistics.paymentsByStatus.find((s: any) => s._id === 'completed')?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {statistics.paymentsByStatus.find((s: any) => s._id === 'pending')?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Stripe Integration:</strong> In production mode, all payment processing 
        is handled securely by Stripe with PCI DSS compliance.
      </Alert>

      {/* Tabs for filtering */}
      <Paper>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="All Payments" />
          <Tab label="Application Fees" />
          <Tab label="Rent" />
          <Tab label="Deposits" />
        </Tabs>
      </Paper>

      {/* Payments Table */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Receipt #</TableCell>
              <TableCell>Property</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="textSecondary">No payments found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <ReceiptIcon fontSize="small" sx={{ mr: 1 }} />
                      {payment.receiptNumber}
                    </Box>
                  </TableCell>
                  <TableCell>{payment.propertyId?.title || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      ${payment.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.paymentType.replace('_', ' ').toUpperCase()}
                      color={getPaymentTypeColor(payment.paymentType)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <CreditCardIcon fontSize="small" sx={{ mr: 1 }} />
                      {payment.cardBrand?.toUpperCase()} ****{payment.cardLast4}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleDateString()
                      : new Date(payment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status.toUpperCase()}
                      color={getStatusColor(payment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {payment.status === 'completed' && (
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadReceipt(payment._id)}
                        title="Download Receipt"
                      >
                        <DownloadIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentHistoryPage;
