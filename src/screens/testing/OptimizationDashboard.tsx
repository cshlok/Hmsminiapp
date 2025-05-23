import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Card, Button, List, useTheme } from 'react-native-paper';

const OptimizationDashboard = () => {
  const theme = useTheme();

  // Mock optimization tasks
  const optimizationTasks = [
    {
      id: '1',
      category: 'Performance',
      title: 'Optimize List Rendering',
      description: 'Implement virtualized lists and optimize render performance',
      status: 'completed',
      improvement: '+45% rendering speed',
    },
    {
      id: '2',
      category: 'Performance',
      title: 'Reduce Bundle Size',
      description: 'Remove unused dependencies and optimize imports',
      status: 'in_progress',
      improvement: '-2.3MB bundle size',
    },
    {
      id: '3',
      category: 'Memory',
      title: 'Fix Memory Leaks',
      description: 'Address memory leaks in appointment calendar component',
      status: 'completed',
      improvement: '-15% memory usage',
    },
    {
      id: '4',
      category: 'Storage',
      title: 'Optimize Database Queries',
      description: 'Improve Realm query performance with proper indexing',
      status: 'completed',
      improvement: '+60% query speed',
    },
    {
      id: '5',
      category: 'UI',
      title: 'Reduce Re-renders',
      description: 'Implement React.memo and useCallback for optimization',
      status: 'in_progress',
      improvement: 'Pending measurement',
    },
    {
      id: '6',
      category: 'UI',
      title: 'Optimize Image Loading',
      description: 'Implement progressive image loading and caching',
      status: 'not_started',
      improvement: 'Not measured',
    },
    {
      id: '7',
      category: 'Storage',
      title: 'Implement Data Pagination',
      description: 'Add pagination for large data sets to improve performance',
      status: 'completed',
      improvement: '+75% load time for large lists',
    },
  ];

  // Calculate stats
  const totalTasks = optimizationTasks.length;
  const completedTasks = optimizationTasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = optimizationTasks.filter(task => task.status === 'in_progress').length;
  const notStartedTasks = optimizationTasks.filter(task => task.status === 'not_started').length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  // Mock performance improvements
  const performanceImprovements = {
    startupTime: '-35%',
    memoryUsage: '-22%',
    renderSpeed: '+45%',
    storageSize: '-18%',
    batteryUsage: '-15%',
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return theme.colors.primary;
      case 'in_progress':
        return theme.colors.secondary;
      case 'not_started':
        return theme.colors.error;
      default:
        return theme.colors.backdrop;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'not_started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  const renderTaskItem = (task) => (
    <List.Item
      key={task.id}
      title={task.title}
      description={task.description}
      left={props => (
        <List.Icon
          {...props}
          color={getStatusColor(task.status)}
          icon={
            task.status === 'completed'
              ? 'check-circle'
              : task.status === 'in_progress'
              ? 'progress-clock'
              : 'alert-circle-outline'
          }
        />
      )}
      right={props => (
        <View style={styles.taskRight}>
          <Text style={[styles.taskStatus, { color: getStatusColor(task.status) }]}>
            {getStatusText(task.status)}
          </Text>
          <Text style={styles.taskImprovement}>{task.improvement}</Text>
        </View>
      )}
      style={styles.taskItem}
    />
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.title}>Optimization Dashboard</Text>
          <Text style={styles.subtitle}>Performance Optimization Progress</Text>
          
          <View style={styles.overallStats}>
            <View style={styles.statCircle}>
              <Text style={styles.completionRateText}>{completionRate}%</Text>
              <Text style={styles.completionRateLabel}>Complete</Text>
            </View>
            
            <View style={styles.statsColumn}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{totalTasks}</Text>
                  <Text style={styles.statLabel}>Total Tasks</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.primary }]}>{completedTasks}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.secondary }]}>{inProgressTasks}</Text>
                  <Text style={styles.statLabel}>In Progress</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.error }]}>{notStartedTasks}</Text>
                  <Text style={styles.statLabel}>Not Started</Text>
                </View>
              </View>
            </View>
          </View>
          
          <Button 
            mode="contained" 
            style={styles.button}
            onPress={() => console.log('Run performance analysis')}
          >
            Run Performance Analysis
          </Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.improvementsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Performance Improvements</Text>
          
          <View style={styles.improvementRow}>
            <View style={styles.improvementItem}>
              <Text style={styles.improvementValue}>{performanceImprovements.startupTime}</Text>
              <Text style={styles.improvementLabel}>Startup Time</Text>
            </View>
            <View style={styles.improvementItem}>
              <Text style={styles.improvementValue}>{performanceImprovements.memoryUsage}</Text>
              <Text style={styles.improvementLabel}>Memory Usage</Text>
            </View>
            <View style={styles.improvementItem}>
              <Text style={styles.improvementValue}>{performanceImprovements.renderSpeed}</Text>
              <Text style={styles.improvementLabel}>Render Speed</Text>
            </View>
          </View>
          
          <View style={styles.improvementRow}>
            <View style={styles.improvementItem}>
              <Text style={styles.improvementValue}>{performanceImprovements.storageSize}</Text>
              <Text style={styles.improvementLabel}>Storage Size</Text>
            </View>
            <View style={styles.improvementItem}>
              <Text style={styles.improvementValue}>{performanceImprovements.batteryUsage}</Text>
              <Text style={styles.improvementLabel}>Battery Usage</Text>
            </View>
            <View style={styles.improvementItem}>
              <Text style={styles.improvementValue}>6/7</Text>
              <Text style={styles.improvementLabel}>Modules Optimized</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.tasksCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Optimization Tasks</Text>
          
          <List.Section>
            {optimizationTasks.map(renderTaskItem)}
          </List.Section>
          
          <Button 
            mode="outlined" 
            style={styles.button}
            onPress={() => console.log('Add new optimization task')}
          >
            Add New Optimization Task
          </Button>
        </Card.Content>
      </Card>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          style={[styles.button, styles.generateButton]}
          onPress={() => console.log('Generate optimization report')}
        >
          Generate Optimization Report
        </Button>
        
        <Button 
          mode="outlined" 
          style={styles.button}
          onPress={() => console.log('Export metrics')}
        >
          Export Metrics
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  overallStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  completionRateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  completionRateLabel: {
    fontSize: 12,
    color: '#666',
  },
  statsColumn: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  button: {
    marginTop: 8,
  },
  improvementsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  improvementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  improvementItem: {
    alignItems: 'center',
    flex: 1,
  },
  improvementValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  improvementLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  tasksCard: {
    marginBottom: 16,
  },
  taskItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  taskRight: {
    alignItems: 'flex-end',
  },
  taskStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskImprovement: {
    fontSize: 12,
    color: '#4CAF50',
  },
  buttonContainer: {
    marginBottom: 32,
  },
  generateButton: {
    marginBottom: 8,
  },
});

export default OptimizationDashboard;
