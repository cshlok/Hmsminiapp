import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { IBill } from '../../models/BillingModel';
import { IService } from '../../models/ServiceModel';
import { IPatient } from '../../models/PatientModel';
import { IQuote } from '../../models/QuoteModel';

interface BillFormProps {
  initialValues?: Partial<IBill>;
  patients: IPatient[];
  services: IService[];
  quotes: IQuote[];
  onSubmit: (values: IBill) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const BillForm: React.FC<BillFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const handleSubmit = () => {
    onSubmit({
      id: 'temp-id',
      patientId: '',
      date: new Date(),
      dueDate: new Date(),
      items: [],
      total: 0,
      amountPaid: 0,
      balance: 0,
      status: 'unpaid',
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Bill Form (Simplified)
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
        label="Due Date"
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

export default BillForm;
