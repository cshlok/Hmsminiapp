import React from 'react';
import { Box, Typography } from '@mui/material';

interface AppointmentCalendarProps {
  appointments: any[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  selectedDate,
}) => {
  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h6">Calendar</Typography>
      <Typography variant="body2">Selected: {selectedDate.toDateString()}</Typography>
      <Typography variant="body2" color="text.secondary">
        Full calendar functionality coming soon...
      </Typography>
    </Box>
  );
};

export default AppointmentCalendar;
