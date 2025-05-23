import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, Card, Divider, Button, List, Chip, useTheme, ActivityIndicator } from 'react-native-paper';
import { IExportJob } from '../../models/SettingsModel';
import { format } from 'date-fns';

interface ExportJobsScreenProps {
  exportJobs: IExportJob[];
  loading: boolean;
  onDeleteJob: (id: string) => void;
  onShareExport: (filePath: string) => void;
}

const ExportJobsScreen: React.FC<ExportJobsScreenProps> = ({
  exportJobs,
  loading,
  onDeleteJob,
  onShareExport,
}) => {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.primary;
      case 'processing':
        return theme.colors.secondary;
      case 'pending':
        return theme.colors.tertiary;
      case 'failed':
        return theme.colors.error;
      default:
        return theme.colors.backdrop;
    }
  };

  const renderExportJob = ({ item }: { item: IExportJob }) => {
    const formattedDate = item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm') : 'Unknown';
    const formattedCompletedDate = item.completedAt ? format(new Date(item.completedAt), 'MMM dd, yyyy HH:mm') : null;
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Text variant="titleMedium" style={styles.title}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Export
            </Text>
            <Chip 
              mode="flat" 
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
              textStyle={{ color: getStatusColor(item.status) }}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Chip>
          </View>
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Created"
            description={formattedDate}
            left={props => <List.Icon {...props} icon="calendar" />}
            style={styles.listItem}
          />
          
          {formattedCompletedDate && (
            <List.Item
              title="Completed"
              description={formattedCompletedDate}
              left={props => <List.Icon {...props} icon="calendar-check" />}
              style={styles.listItem}
            />
          )}
          
          {item.status === 'processing' && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.processingText}>Processing export...</Text>
            </View>
          )}
          
          {item.status === 'failed' && item.error && (
            <List.Item
              title="Error"
              description={item.error}
              left={props => <List.Icon {...props} icon="alert-circle" color={theme.colors.error} />}
              style={styles.listItem}
            />
          )}
          
          {item.status === 'completed' && item.filePath && (
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => onShareExport(item.filePath)}
                style={styles.button}
                icon="share"
              >
                Share
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => onDeleteJob(item.id)}
                style={styles.button}
                icon="delete"
              >
                Delete
              </Button>
            </View>
          )}
          
          {(item.status === 'failed' || item.status === 'pending') && (
            <Button
              mode="outlined"
              onPress={() => onDeleteJob(item.id)}
              style={styles.button}
              icon="delete"
            >
              Delete
            </Button>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading export history...</Text>
        </View>
      ) : exportJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No export jobs found.</Text>
          <Text style={styles.emptySubtext}>
            When you export data from the Settings screen, your export history will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={exportJobs}
          renderItem={renderExportJob}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  processingText: {
    marginLeft: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default ExportJobsScreen;
