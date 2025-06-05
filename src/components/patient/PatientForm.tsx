import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface PatientFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Patient Form
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Patient form coming soon...
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
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

export default PatientForm;
