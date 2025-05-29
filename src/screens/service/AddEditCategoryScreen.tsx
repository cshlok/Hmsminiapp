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

// Define navigation props interface
interface NavigationProps {
  // navigate: (screen: string, params?: any) => void; // Keep if needed elsewhere, but not used here
  goBack: () => void;
}

// Define route props interface
interface RouteProps {
  params?: {
    category?: IServiceCategory;
  };
}

// Define screen props using the interfaces
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
  
  const handleSubmit = (values: Partial<IServiceCategory>) => {
    // Create a new category object or update existing one
    const categoryData: IServiceCategory = {
      id: isEditing ? category?.id : uuidv4(), // Use optional chaining for safety
      name: values.name || '', // Ensure name is not undefined
      description: values.description || '',
      createdAt: isEditing ? category?.createdAt : new Date(), // Use optional chaining
      updatedAt: new Date(),
    };
    
    // Ensure onSave is called with a complete IServiceCategory object
    // We might need to fetch the full category if editing, or ensure handleSubmit receives all necessary fields
    // For now, assuming values contains name/description and we construct the rest
    if (typeof onSave === 'function') { // Check if onSave is provided and is a function
        onSave(categoryData);
    } else {
        console.warn("onSave prop is not a function or not provided to AddEditCategoryScreen");
    }
    navigation.goBack();
  };
  
  const handleCancel = () => {
    navigation.goBack();
  };

  // Prepare initial values for the form
  const initialValues: Partial<IServiceCategory> = isEditing ? {
    name: category?.name,
    description: category?.description,
  } : {
    name: '',
    description: '',
  };

  return (
    <Box sx={{ 
      flex: 1, 
      bgcolor: 'background.default', // Use theme background color
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCancel} // Use handleCancel for back button
            aria-label="back"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Render CategoryForm within a Box for padding/margin if needed */}
      <Box sx={{ p: 3, overflowY: 'auto' }}>
        <CategoryForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default AddEditCategoryScreen;

