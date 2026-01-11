import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  InputAdornment,
  Divider,
  Chip,
} from '@mui/material';
import {
  Home as HomeIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const steps = ['Personal Info', 'Employment Details', 'References', 'Review & Submit'];

const PublicApplicationForm: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Employment Info
    employer: '',
    position: '',
    income: '',
    employmentStartDate: '',
    // References
    references: [
      { name: '', phone: '', relationship: '', email: '' },
      { name: '', phone: '', relationship: '', email: '' },
    ],
    // Additional Info
    moveInDate: '',
    additionalNotes: '',
  });

  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      const response = await axios.get(`${API_URL}/properties/${propertyId}`);
      setProperty(response.data.property);
    } catch (err) {
      setError('Failed to load property details');
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleReferenceChange = (index: number, field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newReferences = [...formData.references];
    newReferences[index] = { ...newReferences[index], [field]: event.target.value };
    setFormData({ ...formData, references: newReferences });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        propertyId,
        applicantInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        employmentInfo: {
          employer: formData.employer,
          position: formData.position,
          income: parseFloat(formData.income),
          startDate: formData.employmentStartDate,
        },
        references: formData.references.filter(ref => ref.name && ref.phone),
        moveInDate: formData.moveInDate,
        additionalNotes: formData.additionalNotes,
      };

      await axios.post(`${API_URL}/applications/public`, payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="First Name"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange('lastName')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Phone Number"
          value={formData.phone}
          onChange={handleChange('phone')}
        />
      </Grid>
    </Grid>
  );

  const renderEmploymentInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Employment Information
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Employer Name"
          value={formData.employer}
          onChange={handleChange('employer')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <WorkIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Position/Title"
          value={formData.position}
          onChange={handleChange('position')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Annual Income"
          type="number"
          value={formData.income}
          onChange={handleChange('income')}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Employment Start Date"
          type="date"
          value={formData.employmentStartDate}
          onChange={handleChange('employmentStartDate')}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Desired Move-in Date"
          type="date"
          value={formData.moveInDate}
          onChange={handleChange('moveInDate')}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  );

  const renderReferences = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          References
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Please provide at least one reference (previous landlord, employer, or personal reference)
        </Typography>
      </Grid>
      {formData.references.map((ref, index) => (
        <Grid item xs={12} key={index}>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>
              Reference {index + 1}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={ref.name}
                  onChange={handleReferenceChange(index, 'name')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={ref.phone}
                  onChange={handleReferenceChange(index, 'phone')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={ref.email}
                  onChange={handleReferenceChange(index, 'email')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Relationship"
                  value={ref.relationship}
                  onChange={handleReferenceChange(index, 'relationship')}
                  size="small"
                >
                  <MenuItem value="landlord">Previous Landlord</MenuItem>
                  <MenuItem value="employer">Employer</MenuItem>
                  <MenuItem value="personal">Personal Reference</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Additional Notes (Optional)"
          value={formData.additionalNotes}
          onChange={handleChange('additionalNotes')}
          placeholder="Any additional information you'd like to share..."
        />
      </Grid>
    </Grid>
  );

  const renderReview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Review Your Application
        </Typography>
      </Grid>
      
      {property && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Typography variant="subtitle1">
              <HomeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Applying for: {property.title}
            </Typography>
            <Typography variant="body2">
              {property.address.street}, {property.address.city}, {property.address.state}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              ${property.price}/month
            </Typography>
          </Paper>
        </Grid>
      )}

      <Grid item xs={12}>
        <Divider>
          <Chip label="Personal Information" />
        </Divider>
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Name:</strong> {formData.firstName} {formData.lastName}</Typography>
          <Typography><strong>Email:</strong> {formData.email}</Typography>
          <Typography><strong>Phone:</strong> {formData.phone}</Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Divider>
          <Chip label="Employment Details" />
        </Divider>
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Employer:</strong> {formData.employer}</Typography>
          <Typography><strong>Position:</strong> {formData.position}</Typography>
          <Typography><strong>Annual Income:</strong> ${formData.income}</Typography>
          <Typography><strong>Move-in Date:</strong> {formData.moveInDate}</Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Divider>
          <Chip label="References" />
        </Divider>
        <Box sx={{ mt: 2 }}>
          {formData.references.filter(ref => ref.name).map((ref, idx) => (
            <Typography key={idx}>
              <strong>{ref.name}</strong> ({ref.relationship}) - {ref.phone}
            </Typography>
          ))}
        </Box>
      </Grid>
    </Grid>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderEmploymentInfo();
      case 2:
        return renderReferences();
      case 3:
        return renderReview();
      default:
        return 'Unknown step';
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Application Submitted!
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Thank you for your application. The property owner will review your information and
              contact you soon.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              You will receive a confirmation email at <strong>{formData.email}</strong>
            </Typography>
          </Paper>
        </Container>
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
      <Container maxWidth="md">
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <DescriptionIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Rental Application
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Complete this form to apply for the property
            </Typography>
          </Box>

          {property && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <strong>{property.title}</strong> - ${property.price}/month
              <br />
              {property.address.city}, {property.address.state}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>{getStepContent(activeStep)}</Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                size="large"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext} size="large">
                Next
              </Button>
            )}
          </Box>
        </Paper>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'white' }}>
            © 2026 Rental Management System. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PublicApplicationForm;
