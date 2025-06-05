import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

interface AppointmentFormProps {
  initialValues?: any;
  patients: any[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
  checkTimeSlotAvailability: (date: Date, startTime: string, endTime: string, appointmentId?: string) => boolean;
  isLoading?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Appointment Form
      </Typography>
      
      <TextField
        label="Date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      
      <TextField
        label="Start Time"
        type="time"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      
      <TextField
        label="End Time"
        type="time"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={() => onSubmit({})}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default AppointmentForm;
