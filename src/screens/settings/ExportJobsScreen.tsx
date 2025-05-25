import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Divider, 
  Button, 
  Chip, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  CircularProgress
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon, 
  EventAvailable as CalendarCheckIcon, 
  Error as AlertIcon, 
  Share as ShareIcon, 
  Delete as DeleteIcon
} from '@mui/icons-material';
import { IExportJob } from '../../models/SettingsModel';
import { format } from 'date-fns';

interface ExportJobsScreenProps {
  exportJobs: IExportJob[];
  loading: boolean;
  onDeleteJob: (id: string) => void;
  onShareExport: (filePath: string) => void;
}

const ExportJobsScreen: React.FC<ExportJobsScreenProps> = ({
  exportJobs,
  loading,
  onDeleteJob,
  onShareExport,
}) => {
  const getStatusColor = (status: string): 'primary' | 'secondary' | 'info' | 'error' | 'warning' | 'success' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'info';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const renderExportJob = (item: IExportJob) => {
    const formattedDate = item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm') : 'Unknown';
    const formattedCompletedDate = item.completedAt ? format(new Date(item.completedAt), 'MMM dd, yyyy HH:mm') : null;
    
    return (
      <Card sx={{ mb: 2 }} key={item.id}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Export
            </Typography>
            <Chip 
              label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              color={getStatusColor(item.status)}
              size="small"
              variant="outlined"
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <List disablePadding>
            <ListItem disablePadding sx={{ pb: 1 }}>
              <ListItemIcon>
                <CalendarIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Created" 
                secondary={formattedDate} 
              />
            </ListItem>
            
            {formattedCompletedDate && (
              <ListItem disablePadding sx={{ pb: 1 }}>
                <ListItemIcon>
                  <CalendarCheckIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Completed" 
                  secondary={formattedCompletedDate} 
                />
              </ListItem>
            )}
          </List>
          
          {item.status === 'processing' && (
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <CircularProgress size={20} />
              <Typography sx={{ ml: 1 }}>Processing export...</Typography>
            </Box>
          )}
          
          {item.status === 'failed' && item.error && (
            <ListItem disablePadding sx={{ pb: 1 }}>
              <ListItemIcon>
                <AlertIcon color="error" />
              </ListItemIcon>
              <ListItemText 
                primary="Error" 
                secondary={item.error} 
              />
            </ListItem>
          )}
          
          {item.status === 'completed' && item.filePath && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => onShareExport(item.filePath || '')}
                startIcon={<ShareIcon />}
                sx={{ mr: 1, flex: 1 }}
              >
                Share
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => onDeleteJob(item.id)}
                startIcon={<DeleteIcon />}
                sx={{ ml: 1, flex: 1 }}
              >
                Delete
              </Button>
            </Box>
          )}
          
          {(item.status === 'failed' || item.status === 'pending') && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => onDeleteJob(item.id)}
                startIcon={<DeleteIcon />}
                fullWidth
              >
                Delete
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ 
      flex: 1, 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh', 
      p: 2 
    }}>
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '70vh' 
        }}>
          <CircularProgress size={40} />
          <Typography sx={{ mt: 2 }}>Loading export history...</Typography>
        </Box>
      ) : exportJobs.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '70vh', 
          p: 3 
        }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
            No export jobs found.
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
            When you export data from the Settings screen, your export history will appear here.
          </Typography>
        </Box>
      ) : (
        <Box>
          {exportJobs.map(item => renderExportJob(item))}
        </Box>
      )}
    </Box>
  );
};

export default ExportJobsScreen;
