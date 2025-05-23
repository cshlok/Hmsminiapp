import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, Card, Divider, Button, List, Chip, useTheme } from 'react-native-paper';
import { IAuthLog } from '../../models/SettingsModel';
import { format } from 'date-fns';

interface AuthLogsScreenProps {
  authLogs: IAuthLog[];
  loading: boolean;
  onClearLogs: () => void;
}

const AuthLogsScreen: React.FC<AuthLogsScreenProps> = ({
  authLogs,
  loading,
  onClearLogs,
}) => {
  const theme = useTheme();

  const getStatusColor = (success: boolean) => {
    return success ? theme.colors.primary : theme.colors.error;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
        return 'login';
      case 'logout':
        return 'logout';
      case 'failed_login':
        return 'alert-circle';
      default:
        return 'shield-account';
    }
  };

  const renderAuthLog = ({ item }: { item: IAuthLog }) => {
    const formattedDate = item.timestamp ? format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm:ss') : 'Unknown';
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Text variant="titleMedium" style={styles.title}>
              {item.action === 'login' ? 'Login' : 
               item.action === 'logout' ? 'Logout' : 
               'Failed Login Attempt'}
            </Text>
            <Chip 
              mode="flat" 
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.success) + '20' }]}
              textStyle={{ color: getStatusColor(item.success) }}
            >
              {item.success ? 'Success' : 'Failed'}
            </Chip>
          </View>
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Time"
            description={formattedDate}
            left={props => <List.Icon {...props} icon="clock-outline" />}
            style={styles.listItem}
          />
          
          <List.Item
            title="Method"
            description={item.method === 'pin' ? 'PIN Authentication' : 'Biometric Authentication'}
            left={props => <List.Icon {...props} icon={item.method === 'pin' ? 'dialpad' : 'fingerprint'} />}
            style={styles.listItem}
          />
          
          {!item.success && item.errorMessage && (
            <List.Item
              title="Error"
              description={item.errorMessage}
              left={props => <List.Icon {...props} icon="alert-circle" color={theme.colors.error} />}
              style={styles.listItem}
            />
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {authLogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No authentication logs found.</Text>
          <Text style={styles.emptySubtext}>
            Authentication activity will be recorded here when you use PIN or biometric authentication.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Button
              mode="contained"
              onPress={onClearLogs}
              style={styles.clearButton}
              icon="delete"
              loading={loading}
              disabled={loading}
            >
              Clear All Logs
            </Button>
          </View>
          
          <FlatList
            data={authLogs}
            renderItem={renderAuthLog}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  clearButton: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  statusChip: {
    height: 28,
  },
  divider: {
    marginVertical: 16,
  },
  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

export default AuthLogsScreen;
