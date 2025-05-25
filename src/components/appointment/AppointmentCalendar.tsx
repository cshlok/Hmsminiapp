import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, CalendarProps } from 'react-native-calendars';
import { useTheme } from 'react-native-paper';
import { format } from 'date-fns';
import { IAppointment } from '../../models/AppointmentModel';

interface AppointmentCalendarProps {
  appointments: IAppointment[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  selectedDate,
  onDateSelect,
}) => {
  const theme = useTheme();
  
  // Format the selected date for the calendar
  const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
  
  // Prepare marked dates for the calendar
  const getMarkedDates = () => {
    interface MarkedDate {
      selected?: boolean;
      selectedColor?: string;
      marked?: boolean;
      dotColor?: string;
      dots?: Array<{key: string, color: string}>;
    }
    
    const markedDates: Record<string, MarkedDate> = {};
    
    // Mark the selected date
    markedDates[formattedSelectedDate] = {
      selected: true,
      selectedColor: theme.colors.primary,
    };
    
    // Mark dates with appointments
    appointments.forEach(appointment => {
      const dateString = format(appointment.date, 'yyyy-MM-dd');
      
      // If this date is already in markedDates (could be the selected date)
      if (markedDates[dateString]) {
        // If it's the selected date, we need to preserve the 'selected' property
        if (dateString === formattedSelectedDate) {
          markedDates[dateString] = {
            ...markedDates[dateString],
            marked: true,
            dotColor: getStatusColor(appointment.status),
          };
        } else {
          // If it's already marked with another appointment, update the dots
          const existingDots = markedDates[dateString].dots || [];
          markedDates[dateString] = {
            ...markedDates[dateString],
            dots: [
              ...existingDots,
              { key: appointment.id, color: getStatusColor(appointment.status) },
            ],
          };
        }
      } else {
        // If this date is not yet in markedDates
        markedDates[dateString] = {
          marked: true,
          dotColor: getStatusColor(appointment.status),
        };
      }
    });
    
    return markedDates;
  };
  
  // Get color based on appointment status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return theme.colors.primary;
      case 'completed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      case 'no-show':
        return theme.colors.warning;
      default:
        return theme.colors.primary;
    }
  };
  
  // Handle date selection
  const handleDayPress: CalendarProps['onDayPress'] = (day) => {
    const selectedDate = new Date(day.timestamp);
    onDateSelect(selectedDate);
  };
  
  return (
    <View style={styles.container}>
      <Calendar
        current={formattedSelectedDate}
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: theme.colors.primary,
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: theme.colors.primary,
          selectedDotColor: '#ffffff',
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.primary,
          indicatorColor: theme.colors.primary,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
});

export default AppointmentCalendar;
