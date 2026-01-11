import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  TextField,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PublicPropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    state: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
  });
  const [tourDialog, setTourDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [tourForm, setTourForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: '',
  });
  const [tourSuccess, setTourSuccess] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async (customFilters = {}) => {
    try {
      setLoading(true);
      const params = { ...filters, ...customFilters, status: 'available' };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await axios.get(`${API_URL}/properties`, { params });
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    loadProperties();
  };

  const handleApply = (propertyId: string) => {
    // Store the intended destination for after login
    localStorage.setItem('redirectAfterLogin', `/apply/${propertyId}`);
    navigate(`/apply/${propertyId}`);
  };

  const handleScheduleTour = (property: any) => {
    setSelectedProperty(property);
    setTourDialog(true);
    setTourSuccess(false);
  };

  const handleTourFormChange = (field: string, value: string) => {
    setTourForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTourSubmit = async () => {
    try {
      // In a real application, this would send the tour request to the backend
      // For now, we'll just show a success message
      console.log('Tour request:', {
        property: selectedProperty._id,
        ...tourForm,
      });
      
      setTourSuccess(true);
      
      // Reset form after 2 seconds and close dialog
      setTimeout(() => {
        setTourDialog(false);
        setTourForm({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          message: '',
        });
        setTourSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error scheduling tour:', error);
    }
  };

  const handleCloseDialog = () => {
    setTourDialog(false);
    setTourForm({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      message: '',
    });
    setTourSuccess(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" sx={{ color: 'white' }}>
          Loading properties...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <HomeIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            Available Properties
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Find your perfect rental home
          </Typography>
        </Box>

        {/* Search and Filters Card */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by keyword..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  placeholder="City"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  placeholder="State"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Beds</InputLabel>
                  <Select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    label="Beds"
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="1">1+</MenuItem>
                    <MenuItem value="2">2+</MenuItem>
                    <MenuItem value="3">3+</MenuItem>
                    <MenuItem value="4">4+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Baths</InputLabel>
                  <Select
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    label="Baths"
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="1">1+</MenuItem>
                    <MenuItem value="2">2+</MenuItem>
                    <MenuItem value="3">3+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  placeholder="Min Price"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  placeholder="Max Price"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                    },
                  }}
                >
                  Search Properties
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Properties Count */}
        <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
          {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Available
        </Typography>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <HomeIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No properties found matching your criteria
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your filters
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {properties.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <HomeIcon sx={{ fontSize: 80, color: 'white', opacity: 0.7 }} />
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {property.title}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {property.address.city}, {property.address.state}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, flexGrow: 1 }}
                    >
                      {property.description?.substring(0, 100)}
                      {property.description?.length > 100 && '...'}
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Chip
                        icon={<BedIcon />}
                        label={`${property.bedrooms} Beds`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<BathtubIcon />}
                        label={`${property.bathrooms} Baths`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>

                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea', mb: 2 }}>
                        ${property.price}
                        <Typography component="span" variant="body2" color="text.secondary">
                          /mo
                        </Typography>
                      </Typography>
                      
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          startIcon={<AssignmentIcon />}
                          onClick={() => handleApply(property._id)}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                            },
                          }}
                        >
                          APPLY
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          startIcon={<CalendarIcon />}
                          onClick={() => handleScheduleTour(property)}
                          sx={{
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': {
                              borderColor: '#5568d3',
                              backgroundColor: 'rgba(102, 126, 234, 0.04)',
                            },
                          }}
                        >
                          SCHEDULE TOUR
                        </Button>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 6, pb: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Questions? Contact us at support@rentalmanagement.com
          </Typography>
        </Box>
      </Container>

      {/* Schedule Tour Dialog */}
      <Dialog open={tourDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarIcon sx={{ color: '#667eea' }} />
            <Typography variant="h6">Schedule a Tour</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {tourSuccess ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Tour request submitted successfully! We'll contact you soon to confirm.
            </Alert>
          ) : (
            <>
              {selectedProperty && (
                <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {selectedProperty.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedProperty.address.city}, {selectedProperty.address.state}
                  </Typography>
                </Box>
              )}
              
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Full Name"
                  required
                  value={tourForm.name}
                  onChange={(e) => handleTourFormChange('name', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  value={tourForm.email}
                  onChange={(e) => handleTourFormChange('email', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  required
                  value={tourForm.phone}
                  onChange={(e) => handleTourFormChange('phone', e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Preferred Date"
                  type="date"
                  required
                  value={tourForm.date}
                  onChange={(e) => handleTourFormChange('date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Preferred Time"
                  type="time"
                  required
                  value={tourForm.time}
                  onChange={(e) => handleTourFormChange('time', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Message (Optional)"
                  multiline
                  rows={3}
                  value={tourForm.message}
                  onChange={(e) => handleTourFormChange('message', e.target.value)}
                  placeholder="Any specific questions or requirements?"
                />
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {!tourSuccess && (
            <>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleTourSubmit}
                disabled={!tourForm.name || !tourForm.email || !tourForm.phone || !tourForm.date || !tourForm.time}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                Schedule Tour
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PublicPropertiesPage;
