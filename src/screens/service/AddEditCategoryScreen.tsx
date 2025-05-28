import React from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton 
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import CategoryForm from '../../components/service/CategoryForm';
import { IServiceCategory } from '../../models/ServiceModel';

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
}

interface RouteProps {
  params?: {
    category?: IServiceCategory;
  };
}

interface AddEditCategoryScreenProps {
  navigation: NavigationProps;
  route: RouteProps;
  onSave: (category: IServiceCategory) => void;
  isLoading?: boolean;
}

const AddEditCategoryScreen: React.FC<AddEditCategoryScreenProps> = ({
  navigation,
  route,
  onSave,
  isLoading = false,
}) => {
  const { category } = route.params || {};
  const isEditing = !!category;
  
  const handleSubmit = (values: any) => {
    // Create a new category object or update existing one
    const categoryData: IServiceCategory = {
      id: isEditing ? category.id : uuidv4(),
      name: values.name,
      description: values.description || '',
      createdAt: isEditing ? category.createdAt : new Date(),
      updatedAt: new Date(),
    };
    
    onSave(categoryData);
    navigation.goBack();
  };
  
  const handleCancel = () => {
    navigation.goBack();
  };

  // Prepare initial values
  const initialValues = isEditing ? {
    name: category.name,
    description: category.description,
  } : {
    name: '',
    description: '',
  };

  return (
    <Box sx={{ 
      flex: 1, 
      bgcolor: '#fff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigation.goBack()}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <CategoryForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default AddEditCategoryScreen;
