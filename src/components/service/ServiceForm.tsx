import React from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { IService, IServiceCategory } from '../../models/ServiceModel';

interface ServiceFormProps {
  initialValues?: Partial<IService>;
  categories: IServiceCategory[];
  onSubmit: (values: IService) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const handleSubmit = () => {
    onSubmit({
      id: 'temp-id',
      name: '',
      description: '',
      price: 0,
      category: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Service Form
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
      
      <TextField
        label="Price"
        type="number"
        fullWidth
        margin="normal"
      />
      
      <TextField
        label="Duration (minutes)"
        type="number"
        fullWidth
        margin="normal"
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select label="Category">
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
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

export default ServiceForm;
