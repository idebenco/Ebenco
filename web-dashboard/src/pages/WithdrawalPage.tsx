import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';
import {
  AccountBalance,
  CurrencyBitcoin,
  AttachMoney,
  CheckCircle,
  Pending,
  Cancel
} from '@mui/icons-material';
import api from '../services';

const WithdrawalPage: React.FC = () => {
  const [balance, setBalance] = useState({ totalEarnings: 0, totalWithdrawn: 0, availableBalance: 0 });
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    method: '',
    walletAddress: '',
    network: '',
    bankAccount: {
      accountNumber: '',
      routingNumber: '',
      bankName: '',
      accountHolderName: '',
      accountType: 'checking'
    },
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  useEffect(() => {
    fetchBalance();
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    // Calculate fees when amount or method changes
    const amount = parseFloat(formData.amount) || 0;
    if (amount > 0 && formData.method) {
      let fee = 0;
      if (formData.method.startsWith('crypto_')) {
        fee = amount * 0.02; // 2% for crypto
      } else {
        fee = Math.max(amount * 0.01, 2); // 1% for bank, minimum $2
      }
      setCalculatedFee(fee);
      setNetAmount(amount - fee);
    } else {
      setCalculatedFee(0);
      setNetAmount(0);
    }
  }, [formData.amount, formData.method]);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/withdrawals/balance');
      setBalance(response.data);
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/withdrawals');
      setWithdrawals(response.data.withdrawals);
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validation
    const amount = parseFloat(formData.amount);
    if (!amount || amount < 50) {
      setError('Minimum withdrawal amount is $50');
      return;
    }

    if (amount > balance.availableBalance) {
      setError(`Insufficient balance. Available: $${balance.availableBalance.toFixed(2)}`);
      return;
    }

    if (!formData.method) {
      setError('Please select a withdrawal method');
      return;
    }

    if (formData.method.startsWith('crypto_') && !formData.walletAddress) {
      setError('Please enter your wallet address');
      return;
    }

    if (formData.method === 'bank_transfer' && (!formData.bankAccount.accountNumber || !formData.bankAccount.routingNumber)) {
      setError('Please enter your bank account details');
      return;
    }

    try {
      await api.post('/withdrawals/request', formData);
      setSuccess('Withdrawal request submitted successfully! Admin will review and process it soon.');
      setDialogOpen(false);
      fetchBalance();
      fetchWithdrawals();
      // Reset form
      setFormData({
        amount: '',
        method: '',
        walletAddress: '',
        network: '',
        bankAccount: {
          accountNumber: '',
          routingNumber: '',
          bankName: '',
          accountHolderName: '',
          accountType: 'checking'
        },
        notes: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error submitting withdrawal request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'approved': case 'processing': return 'info';
      case 'pending': return 'warning';
      case 'rejected': case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getMethodLabel = (method: string) => {
    const labels: any = {
      'crypto_btc': 'Bitcoin (BTC)',
      'crypto_usdt_trc20': 'USDT (TRC20)',
      'crypto_usdt_erc20': 'USDT (ERC20)',
      'crypto_eth': 'Ethereum (ETH)',
      'bank_transfer': 'Bank Transfer'
    };
    return labels[method] || method;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Withdrawals
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Balance Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AttachMoney color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Earnings</Typography>
              </Box>
              <Typography variant="h4">${balance.totalEarnings.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccountBalance color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Available Balance</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                ${balance.availableBalance.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setDialogOpen(true)}
                disabled={balance.availableBalance < 50}
              >
                Request Withdrawal
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <CheckCircle color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Withdrawn</Typography>
              </Box>
              <Typography variant="h4">${balance.totalWithdrawn.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Withdrawal History */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Withdrawal History
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : withdrawals.length === 0 ? (
            <Alert severity="info">No withdrawals yet</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Fee</TableCell>
                    <TableCell>Net Amount</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal._id}>
                      <TableCell>
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${withdrawal.amount.toFixed(2)}</TableCell>
                      <TableCell>${withdrawal.fee.toFixed(2)}</TableCell>
                      <TableCell>${withdrawal.netAmount.toFixed(2)}</TableCell>
                      <TableCell>{getMethodLabel(withdrawal.method)}</TableCell>
                      <TableCell>
                        <Chip
                          label={withdrawal.status}
                          color={getStatusColor(withdrawal.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {withdrawal.transactionHash && (
                          <Typography variant="caption" display="block">
                            TX: {withdrawal.transactionHash.substring(0, 10)}...
                          </Typography>
                        )}
                        {withdrawal.confirmationNumber && (
                          <Typography variant="caption" display="block">
                            Conf: {withdrawal.confirmationNumber}
                          </Typography>
                        )}
                        {withdrawal.rejectionReason && (
                          <Typography variant="caption" color="error" display="block">
                            {withdrawal.rejectionReason}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Request Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Withdrawal</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount (USD)"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            margin="normal"
            helperText={`Available: $${balance.availableBalance.toFixed(2)} | Minimum: $50`}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Withdrawal Method</InputLabel>
            <Select
              value={formData.method}
              label="Withdrawal Method"
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            >
              <MenuItem value="crypto_btc">
                <Box display="flex" alignItems="center">
                  <CurrencyBitcoin sx={{ mr: 1 }} />
                  Bitcoin (BTC) - 2% fee
                </Box>
              </MenuItem>
              <MenuItem value="crypto_usdt_trc20">USDT (TRC20) - 2% fee + low network fee</MenuItem>
              <MenuItem value="crypto_usdt_erc20">USDT (ERC20) - 2% fee + network fee</MenuItem>
              <MenuItem value="crypto_eth">Ethereum (ETH) - 2% fee</MenuItem>
              <MenuItem value="bank_transfer">
                <Box display="flex" alignItems="center">
                  <AccountBalance sx={{ mr: 1 }} />
                  Bank Transfer - 1% fee (min $2)
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {formData.method.startsWith('crypto_') && (
            <>
              <TextField
                fullWidth
                label="Wallet Address"
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                margin="normal"
                helperText="Enter your cryptocurrency wallet address"
              />
              {formData.method.includes('usdt') && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Network</InputLabel>
                  <Select
                    value={formData.network}
                    label="Network"
                    onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  >
                    <MenuItem value="trc20">TRC20 (TRON) - Lower fees</MenuItem>
                    <MenuItem value="erc20">ERC20 (Ethereum)</MenuItem>
                  </Select>
                </FormControl>
              )}
            </>
          )}

          {formData.method === 'bank_transfer' && (
            <>
              <TextField
                fullWidth
                label="Account Holder Name"
                value={formData.bankAccount.accountHolderName}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  bankAccount: { ...formData.bankAccount, accountHolderName: e.target.value }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Bank Name"
                value={formData.bankAccount.bankName}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  bankAccount: { ...formData.bankAccount, bankName: e.target.value }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Account Number"
                value={formData.bankAccount.accountNumber}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  bankAccount: { ...formData.bankAccount, accountNumber: e.target.value }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Routing Number"
                value={formData.bankAccount.routingNumber}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  bankAccount: { ...formData.bankAccount, routingNumber: e.target.value }
                })}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={formData.bankAccount.accountType}
                  label="Account Type"
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    bankAccount: { ...formData.bankAccount, accountType: e.target.value }
                  })}
                >
                  <MenuItem value="checking">Checking</MenuItem>
                  <MenuItem value="savings">Savings</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <TextField
            fullWidth
            label="Notes (Optional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />

          {calculatedFee > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Fee:</strong> ${calculatedFee.toFixed(2)}<br />
                <strong>You will receive:</strong> ${netAmount.toFixed(2)}
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WithdrawalPage;
