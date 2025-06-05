import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface PatientCardProps {
  patient: any;
  onPress: (patient: any) => void;
  onEdit: (patient: any) => void;
  onDelete: (patientId: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onPress }) => {
  return (
    <Card onClick={() => onPress(patient)} sx={{ mb: 1, cursor: 'pointer' }}>
      <CardContent>
        <Typography variant="h6">{patient?.name || 'Patient'}</Typography>
        <Typography variant="body2">Patient details...</Typography>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
