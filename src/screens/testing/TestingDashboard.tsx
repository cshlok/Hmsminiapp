import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Card, Button, Divider, useTheme } from 'react-native-paper';

const TestingDashboard = () => {
  const theme = useTheme();

  // Mock test results
  const testResults = {
    integration: {
      total: 24,
      passed: 22,
      failed: 2,
      skipped: 0,
    },
    performance: {
      total: 15,
      passed: 13,
      failed: 1,
      skipped: 1,
    },
    ui: {
      total: 18,
      passed: 17,
      failed: 0,
      skipped: 1,
    },
    accessibility: {
      total: 10,
      passed: 8,
      failed: 1,
      skipped: 1,
    },
  };

  // Calculate overall stats
  const totalTests = Object.values(testResults).reduce((acc, curr) => acc + curr.total, 0);
  const totalPassed = Object.values(testResults).reduce((acc, curr) => acc + curr.passed, 0);
  const totalFailed = Object.values(testResults).reduce((acc, curr) => acc + curr.failed, 0);
  const totalSkipped = Object.values(testResults).reduce((acc, curr) => acc + curr.skipped, 0);
  const passRate = Math.round((totalPassed / totalTests) * 100);

  // Mock performance metrics
  const performanceMetrics = {
    startupTime: '1.2s',
    memoryUsage: '45MB',
    cpuUsage: '12%',
    renderTime: '0.8s',
    storageSize: '5.2MB',
  };

  const renderTestCategory = (category, data) => (
    <Card style={styles.categoryCard}>
      <Card.Content>
        <Text style={styles.categoryTitle}>{category}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>{data.passed}</Text>
            <Text style={styles.statLabel}>Passed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.error }]}>{data.failed}</Text>
            <Text style={styles.statLabel}>Failed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.secondary }]}>{data.skipped}</Text>
            <Text style={styles.statLabel}>Skipped</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(data.passed / data.total) * 100}%`, backgroundColor: theme.colors.primary }
            ]} 
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.title}>Testing Dashboard</Text>
          <Text style={styles.subtitle}>Overall Test Results</Text>
          
          <View style={styles.overallStats}>
            <View style={styles.statCircle}>
              <Text style={styles.passRateText}>{passRate}%</Text>
              <Text style={styles.passRateLabel}>Pass Rate</Text>
            </View>
            
            <View style={styles.statsColumn}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{totalTests}</Text>
                  <Text style={styles.statLabel}>Total Tests</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.primary }]}>{totalPassed}</Text>
                  <Text style={styles.statLabel}>Passed</Text>
                </View>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.error }]}>{totalFailed}</Text>
                  <Text style={styles.statLabel}>Failed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.colors.secondary }]}>{totalSkipped}</Text>
                  <Text style={styles.statLabel}>Skipped</Text>
                </View>
              </View>
            </View>
          </View>
          
          <Button 
            mode="contained" 
            style={styles.button}
            onPress={() => console.log('Run all tests')}
          >
            Run All Tests
          </Button>
        </Card.Content>
      </Card>
      
      <Text style={styles.sectionTitle}>Test Categories</Text>
      {renderTestCategory('Integration Tests', testResults.integration)}
      {renderTestCategory('Performance Tests', testResults.performance)}
      {renderTestCategory('UI Tests', testResults.ui)}
      {renderTestCategory('Accessibility Tests', testResults.accessibility)}
      
      <Card style={styles.metricsCard}>
        <Card.Content>
          <Text style={styles.categoryTitle}>Performance Metrics</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>App Startup Time:</Text>
            <Text style={styles.metricValue}>{performanceMetrics.startupTime}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Memory Usage:</Text>
            <Text style={styles.metricValue}>{performanceMetrics.memoryUsage}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>CPU Usage:</Text>
            <Text style={styles.metricValue}>{performanceMetrics.cpuUsage}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Average Render Time:</Text>
            <Text style={styles.metricValue}>{performanceMetrics.renderTime}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Storage Size:</Text>
            <Text style={styles.metricValue}>{performanceMetrics.storageSize}</Text>
          </View>
          
          <Button 
            mode="outlined" 
            style={styles.button}
            onPress={() => console.log('Run performance analysis')}
          >
            Run Performance Analysis
          </Button>
        </Card.Content>
      </Card>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          style={[styles.button, styles.exportButton]}
          onPress={() => console.log('Export test results')}
        >
          Export Test Results
        </Button>
        
        <Button 
          mode="outlined" 
          style={styles.button}
          onPress={() => console.log('Generate test report')}
        >
          Generate Test Report
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
  passRateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  passRateLabel: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  categoryCard: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricsCard: {
    marginTop: 8,
    marginBottom: 16,
  },
  divider: {
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 32,
  },
  exportButton: {
    marginBottom: 8,
  },
});

export default TestingDashboard;
