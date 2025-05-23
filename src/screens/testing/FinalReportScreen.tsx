import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Card, Button, List, useTheme, Divider } from 'react-native-paper';

const FinalReportScreen = () => {
  const theme = useTheme();

  // Mock project summary data
  const projectSummary = {
    modulesCompleted: 6,
    totalFeatures: 24,
    totalScreens: 32,
    totalComponents: 48,
    codeQuality: 'A',
    performanceScore: 92,
  };

  // Mock module completion data
  const moduleCompletionData = [
    { name: 'Patient Management', status: 'Completed', features: 5 },
    { name: 'Appointment Scheduling', status: 'Completed', features: 4 },
    { name: 'Service Management', status: 'Completed', features: 4 },
    { name: 'Quote Generator', status: 'Completed', features: 4 },
    { name: 'Billing System', status: 'Completed', features: 4 },
    { name: 'Data Export & Settings', status: 'Completed', features: 3 },
  ];

  // Mock test results
  const testResults = {
    total: 67,
    passed: 60,
    failed: 4,
    skipped: 3,
    passRate: '90%',
  };

  // Mock performance metrics
  const performanceMetrics = [
    { name: 'App Startup Time', value: '1.2s', improvement: '-35%' },
    { name: 'Memory Usage', value: '45MB', improvement: '-22%' },
    { name: 'Average Render Time', value: '0.8s', improvement: '+45%' },
    { name: 'Storage Size', value: '5.2MB', improvement: '-18%' },
    { name: 'Battery Impact', value: 'Low', improvement: '-15%' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text style={styles.title}>Clinic Management App</Text>
          <Text style={styles.subtitle}>Final Project Report</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{projectSummary.modulesCompleted}</Text>
              <Text style={styles.statLabel}>Modules</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{projectSummary.totalFeatures}</Text>
              <Text style={styles.statLabel}>Features</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{projectSummary.totalScreens}</Text>
              <Text style={styles.statLabel}>Screens</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{projectSummary.codeQuality}</Text>
              <Text style={styles.statLabel}>Code Quality</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Project Completion</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.progressValue}>100%</Text>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Module Completion Status</Text>
          <Divider style={styles.divider} />
          
          {moduleCompletionData.map((module, index) => (
            <View key={index} style={styles.moduleItem}>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleName}>{module.name}</Text>
                <Text style={styles.moduleFeatures}>{module.features} features</Text>
              </View>
              <View style={styles.moduleStatus}>
                <Text style={[styles.statusText, { color: theme.colors.primary }]}>
                  {module.status}
                </Text>
                <List.Icon icon="check-circle" color={theme.colors.primary} />
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
      
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Testing Summary</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.testSummary}>
            <View style={styles.testCircle}>
              <Text style={styles.testPassRate}>{testResults.passRate}</Text>
              <Text style={styles.testPassLabel}>Pass Rate</Text>
            </View>
            
            <View style={styles.testDetails}>
              <View style={styles.testRow}>
                <Text style={styles.testLabel}>Total Tests:</Text>
                <Text style={styles.testValue}>{testResults.total}</Text>
              </View>
              <View style={styles.testRow}>
                <Text style={styles.testLabel}>Passed:</Text>
                <Text style={[styles.testValue, { color: theme.colors.primary }]}>
                  {testResults.passed}
                </Text>
              </View>
              <View style={styles.testRow}>
                <Text style={styles.testLabel}>Failed:</Text>
                <Text style={[styles.testValue, { color: theme.colors.error }]}>
                  {testResults.failed}
                </Text>
              </View>
              <View style={styles.testRow}>
                <Text style={styles.testLabel}>Skipped:</Text>
                <Text style={[styles.testValue, { color: theme.colors.secondary }]}>
                  {testResults.skipped}
                </Text>
              </View>
            </View>
          </View>
          
          <Button 
            mode="outlined" 
            style={styles.button}
            onPress={() => console.log('View detailed test results')}
          >
            View Detailed Test Results
          </Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <Divider style={styles.divider} />
          
          {performanceMetrics.map((metric, index) => (
            <View key={index} style={styles.metricRow}>
              <Text style={styles.metricName}>{metric.name}</Text>
              <View style={styles.metricValues}>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricImprovement}>{metric.improvement}</Text>
              </View>
            </View>
          ))}
          
          <Button 
            mode="outlined" 
            style={styles.button}
            onPress={() => console.log('View performance details')}
          >
            View Performance Details
          </Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <Divider style={styles.divider} />
          
          <List.Item
            title="1. Review Final Code"
            description="Review the complete codebase in the GitHub repository"
            left={props => <List.Icon {...props} icon="github" />}
          />
          <List.Item
            title="2. Build and Deploy"
            description="Follow the deployment guide to build and publish the app"
            left={props => <List.Icon {...props} icon="rocket-launch" />}
          />
          <List.Item
            title="3. User Testing"
            description="Conduct user acceptance testing with real users"
            left={props => <List.Icon {...props} icon="account-group" />}
          />
          <List.Item
            title="4. App Store Submission"
            description="Prepare and submit the app to Apple App Store and Google Play Store"
            left={props => <List.Icon {...props} icon="store" />}
          />
        </Card.Content>
      </Card>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          style={[styles.button, styles.mainButton]}
          onPress={() => console.log('Download complete report')}
        >
          Download Complete Report
        </Button>
        
        <Button 
          mode="outlined" 
          style={styles.button}
          onPress={() => console.log('View GitHub repository')}
        >
          View GitHub Repository
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
  headerCard: {
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressValue: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  moduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  moduleFeatures: {
    fontSize: 12,
    color: '#666',
  },
  moduleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginRight: 4,
    fontWeight: 'bold',
  },
  testSummary: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  testCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  testPassRate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  testPassLabel: {
    fontSize: 10,
    color: '#666',
  },
  testDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  testRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  testLabel: {
    fontSize: 14,
    color: '#666',
  },
  testValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricName: {
    fontSize: 14,
    color: '#666',
  },
  metricValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  metricImprovement: {
    fontSize: 12,
    color: '#4CAF50',
  },
  button: {
    marginTop: 8,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  mainButton: {
    marginBottom: 8,
  },
});

export default FinalReportScreen;
