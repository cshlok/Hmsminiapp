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
  Description as QuoteIcon,
  AttachMoney as MoneyIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock quote data
const mockQuotes = [
  {
    id: 1,
    quoteNumber: 'QT-001',
    patientName: 'John Doe',
    date: '2024-06-05',
    validUntil: '2024-06-12',
    amount: 225,
    status: 'pending',
    services: ['General Consultation', 'ECG Test']
  },
  {
    id: 2,
    quoteNumber: 'QT-002',
    patientName: 'Sarah Smith',
    date: '2024-06-04',
    validUntil: '2024-06-11',
    amount: 150,
    status: 'accepted',
    services: ['General Consultation']
  },
  {
    id: 3,
    quoteNumber: 'QT-003',
    patientName: 'Michael Johnson',
    date: '2024-06-03',
    validUntil: '2024-06-10',
    amount: 300,
    status: 'expired',
    services: ['Physiotherapy Session', 'General Consultation', 'Blood Pressure Check']
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'accepted': return 'success';
    case 'pending': return 'warning';
    case 'expired': return 'error';
    case 'rejected': return 'default';
    default: return 'primary';
  }
};

const QuoteList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quote Generator
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/quotes/new')}
          sx={{ minHeight: 44 }}
        >
          Create Quote
        </Button>
      </Box>

      <Grid container spacing={3}>
        {mockQuotes.map((quote) => (
          <Grid item xs={12} sm={6} md={4} key={quote.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <QuoteIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                      {quote.quoteNumber}
                    </Typography>
                  </Box>
                  <Chip 
                    label={quote.status.toUpperCase()} 
                    color={getStatusColor(quote.status) as any}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body1" gutterBottom>
                  Patient: {quote.patientName}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Created: {quote.date}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Valid Until: {quote.validUntil}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                  <MoneyIcon sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
                  <Typography variant="h6" color="success.main">
                    ${quote.amount}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Services: {quote.services.join(', ')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/quotes/${quote.id}`)}>
                  View Quote
                </Button>
                <Button size="small" onClick={() => navigate(`/quotes/${quote.id}/convert`)}>
                  Convert to Bill
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuoteList;
