import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { IQuote } from '../../models/QuoteModel';
import { IService } from '../../models/ServiceModel';
import { IPatient } from '../../models/PatientModel';

interface QuoteFormProps {
  initialValues?: Partial<IQuote>;
  patients: IPatient[];
  services: IService[];
  onSubmit: (values: IQuote) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const handleSubmit = () => {
    onSubmit({
      id: 'temp-id',
      patientId: '',
      date: new Date(),
      validUntil: new Date(),
      items: [],
      total: 0,
      status: 'draft',
      notes: '',
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Quote Form (Simplified)
      </Typography>
      
      <TextField
        label="Patient"
        fullWidth
        margin="normal"
        placeholder="Select patient..."
      />
      
      <TextField
        label="Date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      
      <TextField
        label="Valid Until"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      
      <TextField
        label="Total Amount"
        type="number"
        fullWidth
        margin="normal"
      />
      
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default QuoteForm;
