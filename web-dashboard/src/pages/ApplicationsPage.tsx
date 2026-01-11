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
} from '@mui/material';
import { applicationService } from '../services';

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await applicationService.getApplications();
      setApplications(data.applications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Applications Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Income</TableCell>
              <TableCell>Move-in Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applied</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app._id}>
                <TableCell>{app.propertyId?.title || 'N/A'}</TableCell>
                <TableCell>
                  {app.tenantId?.profile?.firstName} {app.tenantId?.profile?.lastName}
                </TableCell>
                <TableCell>${app.employmentInfo?.income?.toLocaleString()}</TableCell>
                <TableCell>
                  {new Date(app.moveInDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={app.status.toUpperCase()}
                    color={getStatusColor(app.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(app.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ApplicationsPage;
