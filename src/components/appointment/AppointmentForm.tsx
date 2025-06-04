import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormHelperText,
  Grid,
  Chip,
  Stack,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  ScrollView // Keep ScrollView import if needed for layout, otherwise remove
} from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
// Use the model definition, not the slice definition here
import { IAppointment } from '../../models/AppointmentModel'; 
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

interface AppointmentFormProps {
  initialValues?: Partial<IAppointment>;
  patients: Array<{id: string, name: string}>;
  onSubmit: (values: Partial<IAppointment>) => void;
  onCancel: () => void;
  checkTimeSlotAvailability: (date: Date, startTime: string, endTime: string, appointmentId?: string) => boolean;
  isLoading?: boolean;
}

// Validation schema for appointment form
const AppointmentSchema = Yup.object().shape({
  patientId: Yup.string().required('Patient is required'),
  date: Yup.date().required('Date is required'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
  duration: Yup.number()
    .required('Duration is required')
    .positive('Duration must be positive')
    .integer('Duration must be a whole number'),
  status: Yup.string().required('Status is required'),
  notes: Yup.string(),
});

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialValues = {
    patientId: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    duration: 30,
    status: 'scheduled',
    notes: '',
    reminderSent: false,
  },
  patients,
  onSubmit,
  onCancel,
  checkTimeSlotAvailability,
  isLoading = false,
}) => {
  const [timeSlotError, setTimeSlotError] = useState('');

  // Keep the Material-UI version of handlers
  const handleDateChange = (date: Date | null, setFieldValue: (field: string, value: any) => void) => {
    if (date) {
      setFieldValue('date', date);
      // Re-check availability if start/end times exist
      if (values.startTime && values.endTime) {
        checkAvailability(date, values.startTime, values.endTime, values.id, setFieldValue);
      }
    }
  };

  const handleStartTimeChange = (time: Date | null, setFieldValue: (field: string, value: any) => void, values: Partial<IAppointment>) => {
    if (time && values.date) { // Ensure date is selected
      const formattedTime = format(time, 'HH:mm');
      setFieldValue('startTime', formattedTime);
      
      // Calculate end time based on duration
      const endTime = new Date(time);
      endTime.setMinutes(endTime.getMinutes() + (values.duration || 0));
      const formattedEndTime = format(endTime, 'HH:mm');
      setFieldValue('endTime', formattedEndTime);
      
      // Check time slot availability
      checkAvailability(values.date, formattedTime, formattedEndTime, values.id, setFieldValue);
    }
  };

  const handleEndTimeChange = (time: Date | null, setFieldValue: (field: string, value: any) => void, values: Partial<IAppointment>) => {
    if (time && values.date && values.startTime) { // Ensure date and start time exist
      const formattedTime = format(time, 'HH:mm');
      setFieldValue('endTime', formattedTime);
      
      // Calculate duration based on start and end time
      const startParts = values.startTime.split(':');
      const endParts = formattedTime.split(':');
      
      const startDate = new Date(values.date);
      startDate.setHours(parseInt(startParts[0], 10), parseInt(startParts[1], 10), 0);
      
      const endDate = new Date(values.date);
      endDate.setHours(parseInt(endParts[0], 10), parseInt(endParts[1], 10), 0);
      
      const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
      setFieldValue('duration', durationMinutes > 0 ? durationMinutes : 0);
      
      // Check time slot availability
      checkAvailability(values.date, values.startTime, formattedTime, values.id, setFieldValue);
    }
  };

  const handleDurationChange = (duration: string, setFieldValue: (field: string, value: any) => void, values: Partial<IAppointment>) => {
    const durationValue = parseInt(duration, 10);
    if (!isNaN(durationValue) && durationValue >= 0) { // Basic validation
        setFieldValue('duration', durationValue);
        
        // Update end time based on new duration
        if (values.startTime && values.date) {
            const startParts = values.startTime.split(':');
            const startDate = new Date(values.date);
            startDate.setHours(parseInt(startParts[0], 10), parseInt(startParts[1], 10), 0);
            
            const endDate = new Date(startDate);
            endDate.setMinutes(endDate.getMinutes() + durationValue);
            
            const newEndTime = format(endDate, 'HH:mm');
            setFieldValue('endTime', newEndTime);
            
            // Check time slot availability
            checkAvailability(values.date, values.startTime, newEndTime, values.id, setFieldValue);
        }
    }
  };

  // Explicitly type setFieldValue parameter
  const checkAvailability = (date: Date, startTime: string, endTime: string, appointmentId: string | undefined, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<Partial<IAppointment>>>) => {
    const isAvailable = checkTimeSlotAvailability(date, startTime, endTime, appointmentId);
    
    if (!isAvailable) {
      setTimeSlotError('This time slot conflicts with an existing appointment');
    } else {
      setTimeSlotError('');
    }
  };

  return (
    <Box sx={{ 
      flex: 1, 
      bgcolor: '#fff', 
      p: 2,
      // Use overflow: 'auto' for scrolling within the Box if needed
      overflow: 'auto' 
    }}>
      <Formik
        initialValues={initialValues}
        validationSchema={AppointmentSchema}
        onSubmit={onSubmit}
        // Enable reinitialization if initialValues change (e.g., when editing)
        enableReinitialize 
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values, // Add values here to use in handlers
          errors,
          touched,
        }: FormikProps<Partial<IAppointment>>) => (
          // Keep the Material-UI Form structure
          <Form>
            <Box sx={{ p: 2 }}>
              {/* Patient Selection */}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Patient
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                mb: 2 
              }}>
                {patients.map((patient) => (
                  <Chip
                    key={patient.id}
                    label={patient.name}
                    onClick={() => setFieldValue('patientId', patient.id)}
                    color={values.patientId === patient.id ? 'primary' : 'default'}
                    variant={values.patientId === patient.id ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
              {touched.patientId && errors.patientId && (
                <FormHelperText error>{errors.patientId as string}</FormHelperText>
              )}

              {/* Date Picker */}
              <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={values.date}
                  onChange={(date) => handleDateChange(date, setFieldValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      variant: "outlined",
                      error: touched.date && !!errors.date,
                      helperText: touched.date && errors.date as string
                    }
                  }}
                />
              </LocalizationProvider>

              {/* Time Pickers */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Start Time
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      value={values.startTime ? parseTimeString(values.startTime) : null}
                      onChange={(time) => handleStartTimeChange(time, setFieldValue, values)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "normal",
                          variant: "outlined",
                          error: touched.startTime && !!errors.startTime,
                          helperText: touched.startTime && errors.startTime as string
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    End Time
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      value={values.endTime ? parseTimeString(values.endTime) : null}
                      onChange={(time) => handleEndTimeChange(time, setFieldValue, values)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "normal",
                          variant: "outlined",
                          error: touched.endTime && !!errors.endTime,
                          helperText: touched.endTime && errors.endTime as string
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>

              {/* Time Slot Error */}
              {timeSlotError && (
                <FormHelperText error sx={{ mt: 1 }}>{timeSlotError}</FormHelperText>
              )}

              {/* Duration */}
              <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                Duration (minutes)
              </Typography>
              <TextField
                value={String(values.duration)}
                onChange={(e) => handleDurationChange(e.target.value, setFieldValue, values)}
                type="number"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.duration && !!errors.duration}
                helperText={touched.duration && errors.duration as string}
                InputProps={{ inputProps: { min: 0 } }} // Ensure non-negative duration
              />

              {/* Status */}
              <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                Status
              </Typography>
              <ToggleButtonGroup
                value={values.status}
                exclusive
                onChange={(e, value) => value && setFieldValue('status', value)}
                aria-label="appointment status"
                fullWidth
                sx={{ mb: 2 }}
              >
                <ToggleButton value="scheduled">Scheduled</ToggleButton>
                <ToggleButton value="completed">Completed</ToggleButton>
                <ToggleButton value="cancelled">Cancelled</ToggleButton>
                <ToggleButton value="no-show">No Show</ToggleButton>
              </ToggleButtonGroup>
              {touched.status && errors.status && (
                <FormHelperText error>{errors.status as string}</FormHelperText>
              )}

              {/* Notes */}
              <TextField
                label="Notes (Optional)"
                value={values.notes}
                onChange={handleChange('notes')}
                onBlur={handleBlur('notes')}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={3}
              />

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mt: 4,
                mb: 4
              }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  sx={{ flex: 1, mx: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  // Use handleSubmit from Formik props
                  onClick={() => handleSubmit()}
                  sx={{ flex: 1, mx: 1 }}
                  disabled={isLoading || !!timeSlotError}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

// Helper function to parse time string to Date object
const parseTimeString = (timeString: string): Date | null => {
  if (!timeString || !/^[0-2][0-9]:[0-5][0-9]$/.test(timeString)) return null; // Basic validation
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export default AppointmentForm;

