import React from 'react';
import { useAppDispatch } from '../../store';
import { deleteAppointment } from '../../store/slices/appointmentSlice';
import { useNavigate } from 'react-router-dom';

interface DeleteAppointmentProps {
  appointmentId: string;
}

const DeleteAppointmentContainer: React.FC<DeleteAppointmentProps> = ({ appointmentId }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      // Simulate API call with setTimeout
      setTimeout(() => {
        try {
          // Delete appointment from Redux store
          dispatch(deleteAppointment(appointmentId));
          
          // Navigate back to appointments list
          navigate('/appointments');
        } catch (error) {
          console.error('Failed to delete appointment:', error);
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
      Delete Appointment
    </button>
  );
};

export default DeleteAppointmentContainer;
