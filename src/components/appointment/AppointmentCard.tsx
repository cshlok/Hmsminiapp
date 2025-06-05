import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface AppointmentCardProps {
  appointment: any;
  patient: any;
  onPress: (appointment: any) => void;
  onEdit: (appointment: any) => void;
  onDelete: (appointmentId: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  patient,
  onPress,
  onEdit,
  onDelete,
}) => {
  return (
    <Card onClick={() => onPress(appointment)} sx={{ mb: 1, cursor: 'pointer' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">
              {appointment?.startTime || 'Time'} - {appointment?.endTime || 'Time'}
            </Typography>
            <Typography variant="body2">
              Patient: {patient?.name || 'Unknown'}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={(e) => { e.stopPropagation(); onEdit(appointment); }}>
              <Edit />
            </IconButton>
            <IconButton onClick={(e) => { e.stopPropagation(); onDelete(appointment?.id || ''); }}>
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
