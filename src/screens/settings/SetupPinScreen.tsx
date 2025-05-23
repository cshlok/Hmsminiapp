import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme } from 'react-native-paper';

interface SetupPinScreenProps {
  isUpdate?: boolean;
  onSuccess: (pin: string) => void;
  onCancel: () => void;
}

const SetupPinScreen: React.FC<SetupPinScreenProps> = ({
  isUpdate = false,
  onSuccess,
  onCancel,
}) => {
  const theme = useTheme();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(isUpdate);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Reset error
    setError('');

    // Validate PIN
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    // In a real app, we would verify the current PIN here
    if (isUpdate && showCurrentPin) {
      // Mock verification - in a real app, this would check against stored PIN
      const mockStoredPin = '1234'; // This would come from secure storage
      if (currentPin !== mockStoredPin) {
        setError('Current PIN is incorrect');
        return;
      }
      setShowCurrentPin(false);
      return;
    }

    // Success
    onSuccess(pin);
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Text variant="headlineSmall" style={styles.title}>
          {isUpdate ? 'Update PIN' : 'Setup PIN'}
        </Text>
        
        <Text style={styles.description}>
          {isUpdate 
            ? 'Update your PIN to secure access to the app.' 
            : 'Create a PIN to secure access to the app.'}
        </Text>
        
        {showCurrentPin && (
          <>
            <TextInput
              label="Current PIN"
              value={currentPin}
              onChangeText={setCurrentPin}
              style={styles.input}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              mode="outlined"
            />
          </>
        )}
        
        {!showCurrentPin && (
          <>
            <TextInput
              label="New PIN"
              value={pin}
              onChangeText={setPin}
              style={styles.input}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              mode="outlined"
            />
            
            <TextInput
              label="Confirm PIN"
              value={confirmPin}
              onChangeText={setConfirmPin}
              style={styles.input}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              mode="outlined"
            />
          </>
        )}
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onCancel}
            style={[styles.button, styles.cancelButton]}
          >
            Cancel
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
          >
            {showCurrentPin ? 'Next' : 'Save'}
          </Button>
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  surface: {
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    borderColor: '#ccc',
  },
});

export default SetupPinScreen;
