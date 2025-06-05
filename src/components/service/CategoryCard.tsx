import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface CategoryCardProps {
  category: any;
  onPress: (category: any) => void;
  onEdit: (category: any) => void;
  onDelete: (categoryId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  onEdit,
  onDelete,
}) => {
  return (
    <Card onClick={() => onPress(category)} sx={{ mb: 1, cursor: 'pointer' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">
              {category?.name || 'Category'}
            </Typography>
            <Typography variant="body2">
              {category?.description || 'No description'}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={(e) => { e.stopPropagation(); onEdit(category); }}>
              <Edit />
            </IconButton>
            <IconButton onClick={(e) => { e.stopPropagation(); onDelete(category?.id || ''); }}>
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
