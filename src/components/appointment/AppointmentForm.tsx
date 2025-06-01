import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme, Chip, SegmentedButtons } from 'react-native-paper';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { IAppointment } from '../../store/slices/appointmentSlice';
import { FormikErrors } from 'formik'; // Import FormikErrors
import DateTimePickerModal from 'react-native-modal-datetime-picker';
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
  const theme = useTheme();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [timeSlotError, setTimeSlotError] = useState('');

  const handleDateConfirm = (date: Date, setFieldValue: (field: string, value: any) => void): void => {
    setFieldValue('date', date);
    setDatePickerVisible(false);
  };

  const handleStartTimeConfirm = (time: Date, setFieldValue: (field: string, value: any) => void, values: Partial<IAppointment>): void => {
    const formattedTime = format(time, 'HH:mm');
    setFieldValue('startTime', formattedTime);
    
    // Calculate end time based on duration
    const endTime = new Date(time);
    endTime.setMinutes(endTime.getMinutes() + values.duration);
    setFieldValue('endTime', format(endTime, 'HH:mm'));
    
    setStartTimePickerVisible(false);
    
    // Check time slot availability
    checkAvailability(values.date, formattedTime, format(endTime, 'HH:mm'), values.id, setFieldValue);
  };

  const handleEndTimeConfirm = (time: Date, setFieldValue: (field: string, value: any) => void, values: Partial<IAppointment>): void => {
    const formattedTime = format(time, 'HH:mm');
    setFieldValue('endTime', formattedTime);
    
    // Calculate duration based on start and end time
    if (values.startTime) {
      const startParts = values.startTime.split(':');
      const endParts = formattedTime.split(':');
      
      const startDate = new Date();
      startDate.setHours(parseInt(startParts[0], 10), parseInt(startParts[1], 10), 0);
      
      const endDate = new Date();
      endDate.setHours(parseInt(endParts[0], 10), parseInt(endParts[1], 10), 0);
      
      const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
      setFieldValue('duration', durationMinutes > 0 ? durationMinutes : 0);
    }
    
    setEndTimePickerVisible(false);
    
    // Check time slot availability
    if (values.startTime) {
      checkAvailability(values.date, values.startTime, formattedTime, values.id, setFieldValue);
    }
  };

  const handleDurationChange = (duration: string, setFieldValue: (field: string, value: any) => void, values: Partial<IAppointment>): void => {
    const durationValue = parseInt(duration, 10);
    setFieldValue('duration', durationValue);
    
    // Update end time based on new duration
    if (values.startTime) {
      const startParts = values.startTime.split(':');
      const startDate = new Date();
      startDate.setHours(parseInt(startParts[0], 10), parseInt(startParts[1], 10), 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + durationValue);
      
      const newEndTime = format(endDate, 'HH:mm');
      setFieldValue('endTime', newEndTime);
      
      // Check time slot availability
      checkAvailability(values.date, values.startTime, newEndTime, values.id, setFieldValue);
    }
  };

  const checkAvailability = (date: Date, startTime: string, endTime: string, appointmentId: string | undefined, setFieldValue: (field: string, value: any) => void): void => {
    const isAvailable = checkTimeSlotAvailability(date, startTime, endTime, appointmentId);
    
    if (!isAvailable) {
      setTimeSlotError('This time slot conflicts with an existing appointment');
    } else {
      setTimeSlotError('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={AppointmentSchema}
        onSubmit={onSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }: FormikProps<Partial<IAppointment>>) => (
          <View style={styles.formContainer}>
            {/* Patient Selection */}
            <Text style={styles.label}>Patient</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.patientScroll}>
              {patients.map((patient) => (
                <Chip
                  key={patient.id}
                  selected={values.patientId === patient.id}
                  onPress={() => setFieldValue('patientId', patient.id)}
                  style={styles.patientChip}
                  mode={values.patientId === patient.id ? 'flat' : 'outlined'}
                >
                  {patient.name}
                </Chip>
              ))}
            </ScrollView>
            {touched.patientId && errors.patientId && (
              <HelperText type="error">{errors.patientId}</HelperText>
            )}

            {/* Date Picker */}
            <Text style={styles.label}>Date</Text>
            <Button
              mode="outlined"
              onPress={() => setDatePickerVisible(true)}
              style={styles.dateButton}
            >
              {values.date ? format(values.date, 'EEEE, MMMM dd, yyyy') : 'Select Date'}
            </Button>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(date) => handleDateConfirm(date, setFieldValue)}
              onCancel={() => setDatePickerVisible(false)}
              date={values.date || new Date()}
            />
            {touched.date && errors.date && (
              <HelperText type="error">{errors.date}</HelperText>
            )}

            {/* Time Pickers */}
            <View style={styles.timeContainer}>
              <View style={styles.timeField}>
                <Text style={styles.label}>Start Time</Text>
                <Button
                  mode="outlined"
                  onPress={() => setStartTimePickerVisible(true)}
                  style={styles.timeButton}
                >
                  {values.startTime || 'Select Time'}
                </Button>
                <DateTimePickerModal
                  isVisible={isStartTimePickerVisible}
                  mode="time"
                  onConfirm={(time) => handleStartTimeConfirm(time, setFieldValue, values)}
                  onCancel={() => setStartTimePickerVisible(false)}
                />
                {touched.startTime && errors.startTime && (
                  <HelperText type="error">{errors.startTime}</HelperText>
                )}
              </View>

              <View style={styles.timeField}>
                <Text style={styles.label}>End Time</Text>
                <Button
                  mode="outlined"
                  onPress={() => setEndTimePickerVisible(true)}
                  style={styles.timeButton}
                >
                  {values.endTime || 'Select Time'}
                </Button>
                <DateTimePickerModal
                  isVisible={isEndTimePickerVisible}
                  mode="time"
                  onConfirm={(time) => handleEndTimeConfirm(time, setFieldValue, values)}
                  onCancel={() => setEndTimePickerVisible(false)}
                />
                {touched.endTime && errors.endTime && (
                  <HelperText type="error">{errors.endTime}</HelperText>
                )}
              </View>
            </View>

            {/* Time Slot Error */}
            {timeSlotError ? (
              <HelperText type="error">{timeSlotError}</HelperText>
            ) : null}

            {/* Duration */}
            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput
              value={String(values.duration)}
              onChangeText={(text) => handleDurationChange(text, setFieldValue, values)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            {touched.duration && errors.duration && (
              <HelperText type="error">{errors.duration}</HelperText>
            )}

            {/* Status */}
            <Text style={styles.label}>Status</Text>
            <SegmentedButtons
              value={values.status}
              onValueChange={(value) => setFieldValue('status', value)}
              buttons={[
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'no-show', label: 'No Show' },
              ]}
              style={styles.segmentedButtons}
            />
            {touched.status && errors.status && (
              <HelperText type="error">{errors.status}</HelperText>
            )}

            {/* Notes */}
            <TextInput
              label="Notes (Optional)"
              value={values.notes}
              onChangeText={handleChange('notes')}
              onBlur={handleBlur('notes')}
              style={styles.input}
              multiline
              numberOfLines={3}
              mode="outlined"
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={onCancel}
                style={styles.button}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                loading={isLoading}
                disabled={isLoading || !!timeSlotError}
              >
                Save
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  patientScroll: {
    marginBottom: 16,
  },
  patientChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  dateButton: {
    marginBottom: 16,
    justifyContent: 'flex-start',
    height: 50,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeField: {
    flex: 1,
    marginRight: 8,
  },
  timeButton: {
    justifyContent: 'flex-start',
    height: 50,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default AppointmentForm;
