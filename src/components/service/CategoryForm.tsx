import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { IServiceCategory } from '../../models/ServiceModel';

interface CategoryFormProps {
  initialValues?: Partial<IServiceCategory>;
  onSubmit: (values: IServiceCategory) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const handleSubmit = () => {
    onSubmit({
      id: 'temp-id',
      name: '',
      description: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Category Form
      </Typography>
      
      <TextField
        label="Name"
        fullWidth
        margin="normal"
      />
      
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        multiline
        rows={3}
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

export default CategoryForm;
