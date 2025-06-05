import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Receipt as BillIcon,
  AttachMoney as MoneyIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock billing data
const mockBills = [
  {
    id: 1,
    patientName: 'John Doe',
    billNumber: 'INV-001',
    date: '2024-06-01',
    amount: 225,
    status: 'paid',
    services: ['General Consultation', 'ECG Test']
  },
  {
    id: 2,
    patientName: 'Sarah Smith',
    billNumber: 'INV-002',
    date: '2024-05-28',
    amount: 150,
    status: 'pending',
    services: ['General Consultation']
  },
  {
    id: 3,
    patientName: 'Michael Johnson',
    billNumber: 'INV-003',
    date: '2024-05-30',
    amount: 175,
    status: 'overdue',
    services: ['Blood Pressure Check', 'General Consultation']
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'success';
    case 'pending': return 'warning';
    case 'overdue': return 'error';
    case 'cancelled': return 'default';
    default: return 'primary';
  }
};

const BillList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Billing System
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/billing/new')}
          sx={{ minHeight: 44 }}
        >
          Create Bill
        </Button>
      </Box>

      <Grid container spacing={3}>
        {mockBills.map((bill) => (
          <Grid item xs={12} sm={6} md={4} key={bill.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BillIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                      {bill.billNumber}
                    </Typography>
                  </Box>
                  <Chip 
                    label={bill.status.toUpperCase()} 
                    color={getStatusColor(bill.status) as any}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body1" gutterBottom>
                  Patient: {bill.patientName}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date: {bill.date}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                  <MoneyIcon sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
                  <Typography variant="h6" color="success.main">
                    ${bill.amount}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Services: {bill.services.join(', ')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/billing/${bill.id}`)}>
                  View Invoice
                </Button>
                <Button size="small" onClick={() => navigate(`/billing/${bill.id}/payment`)}>
                  Payment
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BillList;
