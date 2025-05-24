import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import styled from '@emotion/styled';

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
    <Container>
      <StyledPaper elevation={4}>
        <Title variant="h5">
          {isUpdate ? 'Update PIN' : 'Setup PIN'}
        </Title>
        
        <Description>
          {isUpdate 
            ? 'Update your PIN to secure access to the app.' 
            : 'Create a PIN to secure access to the app.'}
        </Description>
        
        {showCurrentPin && (
          <>
            <StyledTextField
              label="Current PIN"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              type="password"
              inputProps={{ maxLength: 6, inputMode: 'numeric' }}
              variant="outlined"
              fullWidth
            />
          </>
        )}
        
        {!showCurrentPin && (
          <>
            <StyledTextField
              label="New PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type="password"
              inputProps={{ maxLength: 6, inputMode: 'numeric' }}
              variant="outlined"
              fullWidth
            />
            
            <StyledTextField
              label="Confirm PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              type="password"
              inputProps={{ maxLength: 6, inputMode: 'numeric' }}
              variant="outlined"
              fullWidth
            />
          </>
        )}
        
        {error ? <ErrorText>{error}</ErrorText> : null}
        
        <ButtonContainer>
          <StyledButton
            variant="outlined"
            onClick={onCancel}
            color="secondary"
          >
            Cancel
          </StyledButton>
          
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            color="primary"
          >
            {showCurrentPin ? 'Next' : 'Save'}
          </StyledButton>
        </ButtonContainer>
      </StyledPaper>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

const StyledPaper = styled(Paper)`
  padding: 24px;
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
`;

const Title = styled(Typography)`
  margin-bottom: 16px;
  font-weight: bold;
  text-align: center;
`;

const Description = styled(Typography)`
  margin-bottom: 24px;
  text-align: center;
  color: #666;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 16px;
`;

const ErrorText = styled(Typography)`
  color: #f44336;
  margin-bottom: 16px;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

const StyledButton = styled(Button)`
  flex: 1;
  margin: 0 4px;
`;

export default SetupPinScreen;
