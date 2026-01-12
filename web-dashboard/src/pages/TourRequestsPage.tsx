import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  CalendarToday as CalendarIcon,
  Schedule as TimeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TourRequestsPage: React.FC = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [actionDialog, setActionDialog] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [actionType, setActionType] = useState<'approved' | 'rejected' | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadTours();
  }, [selectedTab]);

  const loadTours = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const statusMap = ['pending', 'approved', 'rejected', 'completed', 'all'];
      const status = statusMap[selectedTab];
      
      const params = status === 'all' ? {} : { status };
      
      const response = await axios.get(`${API_URL}/tours`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      
      setTours(response.data.tours || []);
    } catch (error) {
      console.error('Error loading tours:', error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenActionDialog = (tour: any, action: 'approved' | 'rejected') => {
    setSelectedTour(tour);
    setActionType(action);
    setActionDialog(true);
    setStatusNote('');
  };

  const handleCloseActionDialog = () => {
    setActionDialog(false);
    setSelectedTour(null);
    setActionType(null);
    setStatusNote('');
  };

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${API_URL}/tours/${selectedTour._id}/status`,
        {
          status: actionType,
          statusNote
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccessMessage(`Tour ${actionType} successfully!`);
      handleCloseActionDialog();
      loadTours();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating tour status:', error);
      alert(error.response?.data?.message || 'Error updating tour status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'completed': return 'info';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getTimeSlotLabel = (time: string) => {
    switch (time) {
      case 'morning': return '9:00 AM - 12:00 PM';
      case 'afternoon': return '12:00 PM - 5:00 PM';
      case 'evening': return '5:00 PM - 8:00 PM';
      default: return time;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading tour requests...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tour Requests Management
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
          <Tab label={`Pending (${tours.filter(t => t.status === 'pending').length})`} />
          <Tab label="Approved" />
          <Tab label="Rejected" />
          <Tab label="Completed" />
          <Tab label="All" />
        </Tabs>
      </Box>

      {tours.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              No tour requests found
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Tenant Info</TableCell>
                <TableCell>Preferred Date & Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tours.map((tour) => (
                <TableRow key={tour._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {tour.propertyId?.title || 'Property'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {tour.propertyId?.address?.city}, {tour.propertyId?.address?.state}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon fontSize="small" />
                        <Typography variant="body2">{tour.tenantInfo.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EmailIcon fontSize="small" />
                        <Typography variant="caption">{tour.tenantInfo.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon fontSize="small" />
                        <Typography variant="caption">{tour.tenantInfo.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <CalendarIcon fontSize="small" />
                      <Typography variant="body2">
                        {formatDate(tour.preferredDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimeIcon fontSize="small" />
                      <Typography variant="caption">
                        {getTimeSlotLabel(tour.preferredTime)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tour.status.toUpperCase()}
                      color={getStatusColor(tour.status)}
                      size="small"
                    />
                    {tour.statusNote && (
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        Note: {tour.statusNote}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {tour.message || 'No message'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {tour.status === 'pending' && (
                      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<ApproveIcon />}
                          onClick={() => handleOpenActionDialog(tour, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<RejectIcon />}
                          onClick={() => handleOpenActionDialog(tour, 'rejected')}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                    {tour.status === 'approved' && (
                      <Chip label="Waiting for tour" color="info" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Action Dialog */}
      <Dialog open={actionDialog} onClose={handleCloseActionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approved' ? 'Approve Tour Request' : 'Reject Tour Request'}
        </DialogTitle>
        <DialogContent>
          {selectedTour && (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>Property:</strong> {selectedTour.propertyId?.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Tenant:</strong> {selectedTour.tenantInfo.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Date:</strong> {formatDate(selectedTour.preferredDate)}
              </Typography>
              <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                <strong>Time:</strong> {getTimeSlotLabel(selectedTour.preferredTime)}
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                label={actionType === 'approved' ? 'Additional Notes (Optional)' : 'Rejection Reason'}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder={
                  actionType === 'approved'
                    ? 'Add any special instructions or notes...'
                    : 'Please provide a reason for rejection...'
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseActionDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color={actionType === 'approved' ? 'success' : 'error'}
          >
            Confirm {actionType === 'approved' ? 'Approval' : 'Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TourRequestsPage;
