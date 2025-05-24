import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { 
  setCategories,
  setSelectedCategory,
  setLoading, 
  setError,
  addCategory,
  updateCategory,
  deleteCategory,
  IServiceCategory
} from '../../store/slices/serviceSlice';
import CategoryList from './CategoryList';
import { v4 as uuidv4 } from 'uuid';

const CategoryListContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(state => state.service);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<IServiceCategory | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({ name: '' });
  
  // Handle add category
  const handleAddCategory = () => {
    // Validate form
    if (!formData.name.trim()) {
      setFormErrors({ name: 'Category name is required' });
      return;
    }
    
    // Create new category
    const newCategory: IServiceCategory = {
      id: uuidv4(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Dispatch action to add category
    dispatch(addCategory(newCategory));
    
    // Reset form and close modal
    setFormData({ name: '', description: '' });
    setFormErrors({ name: '' });
    setIsAddModalOpen(false);
  };
  
  // Handle edit category
  const handleEditCategory = () => {
    // Validate form
    if (!formData.name.trim()) {
      setFormErrors({ name: 'Category name is required' });
      return;
    }
    
    if (!currentCategory) return;
    
    // Create updated category
    const updatedCategory: IServiceCategory = {
      ...currentCategory,
      name: formData.name.trim(),
      description: formData.description.trim(),
      updatedAt: new Date().toISOString(),
    };
    
    // Dispatch action to update category
    dispatch(updateCategory(updatedCategory));
    
    // Reset form and close modal
    setFormData({ name: '', description: '' });
    setFormErrors({ name: '' });
    setIsEditModalOpen(false);
    setCurrentCategory(null);
  };
  
  // Handle delete category
  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? Services in this category will not be deleted but will need to be reassigned.')) {
      dispatch(deleteCategory(categoryId));
    }
  };
  
  // Open edit modal with category data
  const openEditModal = (category: IServiceCategory) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setFormErrors({ name: '' });
    setIsEditModalOpen(true);
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error if field was in error
    if (name === 'name' && formErrors.name) {
      setFormErrors({ name: '' });
    }
  };
  
  return (
    <CategoryList
      categories={categories}
      loading={loading}
      error={error}
      isAddModalOpen={isAddModalOpen}
      isEditModalOpen={isEditModalOpen}
      formData={formData}
      formErrors={formErrors}
      onOpenAddModal={() => setIsAddModalOpen(true)}
      onCloseAddModal={() => {
        setIsAddModalOpen(false);
        setFormData({ name: '', description: '' });
        setFormErrors({ name: '' });
      }}
      onOpenEditModal={openEditModal}
      onCloseEditModal={() => {
        setIsEditModalOpen(false);
        setCurrentCategory(null);
        setFormData({ name: '', description: '' });
        setFormErrors({ name: '' });
      }}
      onInputChange={handleInputChange}
      onAddCategory={handleAddCategory}
      onEditCategory={handleEditCategory}
      onDeleteCategory={handleDeleteCategory}
    />
  );
};

export default CategoryListContainer;
