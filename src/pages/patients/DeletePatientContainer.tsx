import React from 'react';
import { useAppDispatch } from '../../store';
import { deletePatient } from '../../store/slices/patientSlice';
import { useNavigate } from 'react-router-dom';

interface DeletePatientProps {
  patientId: string;
}

const DeletePatientContainer: React.FC<DeletePatientProps> = ({ patientId }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      // Simulate API call with setTimeout
      setTimeout(() => {
        try {
          // Delete patient from Redux store
          dispatch(deletePatient(patientId));
          
          // Navigate back to patients list
          navigate('/patients');
        } catch (error) {
          console.error('Failed to delete patient:', error);
          // Error handling would be implemented here
        }
      }, 500);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
    >
      Delete Patient
    </button>
  );
};

export default DeletePatientContainer;
