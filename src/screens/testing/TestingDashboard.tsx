import React from 'react';
// Replace React Native imports with web-compatible alternatives
import { Card, Button, Divider, useTheme } from '@mui/material';

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
  const totalTests = Object.values(testResults).reduce((acc: number, curr: any) => acc + curr.total, 0);
  const totalPassed = Object.values(testResults).reduce((acc: number, curr: any) => acc + curr.passed, 0);
  const totalFailed = Object.values(testResults).reduce((acc: number, curr: any) => acc + curr.failed, 0);
  const totalSkipped = Object.values(testResults).reduce((acc: number, curr: any) => acc + curr.skipped, 0);
  const passRate = Math.round((totalPassed / totalTests) * 100);

  // Mock performance metrics
  const performanceMetrics = {
    startupTime: '1.2s',
    memoryUsage: '45MB',
    cpuUsage: '12%',
    renderTime: '0.8s',
    storageSize: '5.2MB',
  };

  const renderTestCategory = (category: string, data: any) => (
    <Card className="categoryCard">
      <div className="card-content">
        <h3 className="categoryTitle">{category}</h3>
        <div className="statsRow">
          <div className="statItem">
            <div className="statValue">{data.total}</div>
            <div className="statLabel">Total</div>
          </div>
          <div className="statItem">
            <div className="statValue" style={{ color: theme.palette.primary.main }}>{data.passed}</div>
            <div className="statLabel">Passed</div>
          </div>
          <div className="statItem">
            <div className="statValue" style={{ color: theme.palette.error.main }}>{data.failed}</div>
            <div className="statLabel">Failed</div>
          </div>
          <div className="statItem">
            <div className="statValue" style={{ color: theme.palette.secondary.main }}>{data.skipped}</div>
            <div className="statLabel">Skipped</div>
          </div>
        </div>
        <div className="progressBar">
          <div 
            className="progressFill"
            style={{
              width: `${(data.passed / data.total) * 100}%`, 
              backgroundColor: theme.palette.primary.main 
            }}
          />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container">
      <Card className="summaryCard">
        <div className="card-content">
          <h1 className="title">Testing Dashboard</h1>
          <h2 className="subtitle">Overall Test Results</h2>
          
          <div className="overallStats">
            <div className="statCircle">
              <div className="passRateText">{passRate}%</div>
              <div className="passRateLabel">Pass Rate</div>
            </div>
            
            <div className="statsColumn">
              <div className="statsRow">
                <div className="statItem">
                  <div className="statValue">{totalTests}</div>
                  <div className="statLabel">Total Tests</div>
                </div>
                <div className="statItem">
                  <div className="statValue" style={{ color: theme.palette.primary.main }}>{totalPassed}</div>
                  <div className="statLabel">Passed</div>
                </div>
              </div>
              <div className="statsRow">
                <div className="statItem">
                  <div className="statValue" style={{ color: theme.palette.error.main }}>{totalFailed}</div>
                  <div className="statLabel">Failed</div>
                </div>
                <div className="statItem">
                  <div className="statValue" style={{ color: theme.palette.secondary.main }}>{totalSkipped}</div>
                  <div className="statLabel">Skipped</div>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="contained" 
            className="button"
            onClick={() => console.log('Run all tests')}
          >
            Run All Tests
          </Button>
        </div>
      </Card>
      
      <h2 className="sectionTitle">Test Categories</h2>
      {renderTestCategory('Integration Tests', testResults.integration)}
      {renderTestCategory('Performance Tests', testResults.performance)}
      {renderTestCategory('UI Tests', testResults.ui)}
      {renderTestCategory('Accessibility Tests', testResults.accessibility)}
      
      <Card className="metricsCard">
        <div className="card-content">
          <h3 className="categoryTitle">Performance Metrics</h3>
          <Divider className="divider" />
          
          <div className="metricRow">
            <div className="metricLabel">App Startup Time:</div>
            <div className="metricValue">{performanceMetrics.startupTime}</div>
          </div>
          <div className="metricRow">
            <div className="metricLabel">Memory Usage:</div>
            <div className="metricValue">{performanceMetrics.memoryUsage}</div>
          </div>
          <div className="metricRow">
            <div className="metricLabel">CPU Usage:</div>
            <div className="metricValue">{performanceMetrics.cpuUsage}</div>
          </div>
          <div className="metricRow">
            <div className="metricLabel">Average Render Time:</div>
            <div className="metricValue">{performanceMetrics.renderTime}</div>
          </div>
          <div className="metricRow">
            <div className="metricLabel">Storage Size:</div>
            <div className="metricValue">{performanceMetrics.storageSize}</div>
          </div>
          
          <Button 
            variant="outlined" 
            className="button"
            onClick={() => console.log('Run performance analysis')}
          >
            Run Performance Analysis
          </Button>
        </div>
      </Card>
      
      <div className="buttonContainer">
        <Button 
          variant="contained" 
          className="button exportButton"
          onClick={() => console.log('Export test results')}
        >
          Export Test Results
        </Button>
        
        <Button 
          variant="outlined" 
          className="button"
          onClick={() => console.log('Generate test report')}
        >
          Generate Test Report
        </Button>
      </div>

      <style jsx>{`
        .container {
          flex: 1;
          background-color: #f5f5f5;
          padding: 16px;
        }
        .summaryCard {
          margin-bottom: 16px;
        }
        .card-content {
          padding: 16px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .subtitle {
          font-size: 16px;
          color: #666;
          margin-bottom: 16px;
        }
        .overallStats {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .statCircle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #f0f0f0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 16px;
        }
        .passRateText {
          font-size: 24px;
          font-weight: bold;
          color: #4CAF50;
        }
        .passRateLabel {
          font-size: 12px;
          color: #666;
        }
        .statsColumn {
          flex: 1;
        }
        .statsRow {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .statItem {
          align-items: center;
          text-align: center;
          flex: 1;
        }
        .statValue {
          font-size: 18px;
          font-weight: bold;
        }
        .statLabel {
          font-size: 12px;
          color: #666;
        }
        .button {
          margin-top: 8px;
        }
        .sectionTitle {
          font-size: 18px;
          font-weight: bold;
          margin: 16px 0;
        }
        .categoryCard {
          margin-bottom: 16px;
        }
        .categoryTitle {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 16px;
        }
        .progressBar {
          height: 8px;
          background-color: #e0e0e0;
          border-radius: 4px;
          margin-top: 8px;
          overflow: hidden;
        }
        .progressFill {
          height: 100%;
          border-radius: 4px;
        }
        .metricsCard {
          margin-top: 8px;
          margin-bottom: 16px;
        }
        .divider {
          margin-bottom: 16px;
        }
        .metricRow {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .metricLabel {
          font-size: 14px;
          color: #666;
        }
        .metricValue {
          font-size: 14px;
          font-weight: bold;
        }
        .buttonContainer {
          margin-bottom: 32px;
        }
        .exportButton {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default TestingDashboard;
