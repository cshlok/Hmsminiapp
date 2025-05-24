import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { 
  setAppointments, 
  setLoading, 
  setError,
  IAppointment
} from '../../store/slices/appointmentSlice';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

// Setup the localizer for the calendar
const localizer = momentLocalizer(moment);

const AppointmentCalendarContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { appointments, loading, error } = useAppSelector(state => state.appointment);
  const { patients } = useAppSelector(state => state.patient);
  
  // Format appointments for the calendar
  const getCalendarEvents = () => {
    return appointments.map(appointment => {
      // Find patient name
      const patient = patients.find(p => p.id === appointment.patientId);
      const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
      
      // Create start and end dates
      const startDate = new Date(`${appointment.date}T${appointment.startTime}`);
      const endDate = new Date(`${appointment.date}T${appointment.endTime}`);
      
      // Get color based on status
      let backgroundColor = '#3B82F6'; // blue for scheduled
      if (appointment.status === 'confirmed') backgroundColor = '#10B981'; // green
      if (appointment.status === 'completed') backgroundColor = '#6B7280'; // gray
      if (appointment.status === 'cancelled') backgroundColor = '#EF4444'; // red
      if (appointment.status === 'no-show') backgroundColor = '#F59E0B'; // amber
      
      return {
        id: appointment.id,
        title: `${appointment.title} - ${patientName}`,
        start: startDate,
        end: endDate,
        backgroundColor,
        appointment
      };
    });
  };
  
  // Load appointments on component mount
  useEffect(() => {
    if (appointments.length === 0) {
      dispatch(setLoading(true));
      
      // Simulate API call with setTimeout
      setTimeout(() => {
        try {
          // In a real app, this would be an API call
          // For now, we're using the appointments already in the store
          dispatch(setLoading(false));
        } catch (err) {
          dispatch(setError('Failed to load appointments for calendar'));
          console.error(err);
        }
      }, 1000);
    }
  }, [dispatch, appointments.length]);
  
  // Handle event click
  const handleEventClick = (event: any) => {
    navigate(`/appointments/${event.id}`);
  };
  
  // Handle slot select (clicking on an empty time slot)
  const handleSlotSelect = ({ start, end }: { start: Date; end: Date }) => {
    // Format date and times for the new appointment form
    const date = start.toISOString().split('T')[0];
    const startTime = start.toTimeString().substring(0, 5);
    const endTime = end.toTimeString().substring(0, 5);
    
    // Navigate to new appointment form with pre-filled date and times
    navigate(`/appointments/new?date=${date}&startTime=${startTime}&endTime=${endTime}`);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            to="/appointments"
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Appointment Calendar</h1>
        </div>
        
        <Link
          to="/appointments/new"
          className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          New Appointment
        </Link>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Calendar */}
      <div className="bg-white rounded-lg shadow p-4">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={getCalendarEvents()}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleEventClick}
              onSelectSlot={handleSlotSelect}
              selectable
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: event.backgroundColor,
                },
              })}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="week"
              defaultDate={new Date()}
              step={15}
              timeslots={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCalendarContainer;
