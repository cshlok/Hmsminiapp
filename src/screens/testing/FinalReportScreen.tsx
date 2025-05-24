import React from 'react';
// Replace React Native imports with web-compatible alternatives
import { Card, Button, List, Divider, useTheme } from '@mui/material';

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
    <div className="container">
      <Card className="headerCard">
        <div className="card-content">
          <h1 className="title">Clinic Management App</h1>
          <h2 className="subtitle">Final Project Report</h2>
          
          <div className="statsContainer">
            <div className="statItem">
              <div className="statValue">{projectSummary.modulesCompleted}</div>
              <div className="statLabel">Modules</div>
            </div>
            <div className="statItem">
              <div className="statValue">{projectSummary.totalFeatures}</div>
              <div className="statLabel">Features</div>
            </div>
            <div className="statItem">
              <div className="statValue">{projectSummary.totalScreens}</div>
              <div className="statLabel">Screens</div>
            </div>
            <div className="statItem">
              <div className="statValue">{projectSummary.codeQuality}</div>
              <div className="statLabel">Code Quality</div>
            </div>
          </div>
          
          <div className="progressContainer">
            <div className="progressLabel">Project Completion</div>
            <div className="progressBar">
              <div className="progressFill" style={{ width: '100%' }} />
            </div>
            <div className="progressValue">100%</div>
          </div>
        </div>
      </Card>
      
      <Card className="sectionCard">
        <div className="card-content">
          <h2 className="sectionTitle">Module Completion Status</h2>
          <Divider className="divider" />
          
          {moduleCompletionData.map((module, index) => (
            <div key={index} className="moduleItem">
              <div className="moduleInfo">
                <div className="moduleName">{module.name}</div>
                <div className="moduleFeatures">{module.features} features</div>
              </div>
              <div className="moduleStatus">
                <span className="statusText" style={{ color: theme.palette.primary.main }}>
                  {module.status}
                </span>
                <span className="statusIcon" style={{ color: theme.palette.primary.main }}>✓</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="sectionCard">
        <div className="card-content">
          <h2 className="sectionTitle">Testing Summary</h2>
          <Divider className="divider" />
          
          <div className="testSummary">
            <div className="testCircle">
              <div className="testPassRate">{testResults.passRate}</div>
              <div className="testPassLabel">Pass Rate</div>
            </div>
            
            <div className="testDetails">
              <div className="testRow">
                <div className="testLabel">Total Tests:</div>
                <div className="testValue">{testResults.total}</div>
              </div>
              <div className="testRow">
                <div className="testLabel">Passed:</div>
                <div className="testValue" style={{ color: theme.palette.primary.main }}>
                  {testResults.passed}
                </div>
              </div>
              <div className="testRow">
                <div className="testLabel">Failed:</div>
                <div className="testValue" style={{ color: theme.palette.error.main }}>
                  {testResults.failed}
                </div>
              </div>
              <div className="testRow">
                <div className="testLabel">Skipped:</div>
                <div className="testValue" style={{ color: theme.palette.secondary.main }}>
                  {testResults.skipped}
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outlined" 
            className="button"
            onClick={() => console.log('View detailed test results')}
          >
            View Detailed Test Results
          </Button>
        </div>
      </Card>
      
      <Card className="sectionCard">
        <div className="card-content">
          <h2 className="sectionTitle">Performance Metrics</h2>
          <Divider className="divider" />
          
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="metricRow">
              <div className="metricName">{metric.name}</div>
              <div className="metricValues">
                <div className="metricValue">{metric.value}</div>
                <div className="metricImprovement">{metric.improvement}</div>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outlined" 
            className="button"
            onClick={() => console.log('View performance details')}
          >
            View Performance Details
          </Button>
        </div>
      </Card>
      
      <Card className="sectionCard">
        <div className="card-content">
          <h2 className="sectionTitle">Next Steps</h2>
          <Divider className="divider" />
          
          <List>
            <List.Item className="listItem">
              <div className="listItemContent">
                <div className="listItemIcon" style={{ color: theme.palette.primary.main }}>
                  <span className="icon">📦</span>
                </div>
                <div className="listItemText">
                  <div className="listItemTitle">1. Review Final Code</div>
                  <div className="listItemDescription">Review the complete codebase in the GitHub repository</div>
                </div>
              </div>
            </List.Item>
            <List.Item className="listItem">
              <div className="listItemContent">
                <div className="listItemIcon" style={{ color: theme.palette.primary.main }}>
                  <span className="icon">🚀</span>
                </div>
                <div className="listItemText">
                  <div className="listItemTitle">2. Build and Deploy</div>
                  <div className="listItemDescription">Follow the deployment guide to build and publish the app</div>
                </div>
              </div>
            </List.Item>
            <List.Item className="listItem">
              <div className="listItemContent">
                <div className="listItemIcon" style={{ color: theme.palette.primary.main }}>
                  <span className="icon">👥</span>
                </div>
                <div className="listItemText">
                  <div className="listItemTitle">3. User Testing</div>
                  <div className="listItemDescription">Conduct user acceptance testing with real users</div>
                </div>
              </div>
            </List.Item>
            <List.Item className="listItem">
              <div className="listItemContent">
                <div className="listItemIcon" style={{ color: theme.palette.primary.main }}>
                  <span className="icon">🏪</span>
                </div>
                <div className="listItemText">
                  <div className="listItemTitle">4. App Store Submission</div>
                  <div className="listItemDescription">Prepare and submit the app to Apple App Store and Google Play Store</div>
                </div>
              </div>
            </List.Item>
          </List>
        </div>
      </Card>
      
      <div className="buttonContainer">
        <Button 
          variant="contained" 
          className="button mainButton"
          onClick={() => console.log('Download complete report')}
        >
          Download Complete Report
        </Button>
        
        <Button 
          variant="outlined" 
          className="button"
          onClick={() => console.log('View GitHub repository')}
        >
          View GitHub Repository
        </Button>
      </div>

      <style jsx>{`
        .container {
          flex: 1;
          background-color: #f5f5f5;
          padding: 16px;
        }
        .card-content {
          padding: 16px;
        }
        .headerCard {
          margin-bottom: 16px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 8px;
        }
        .subtitle {
          font-size: 16px;
          color: #666;
          text-align: center;
          margin-bottom: 24px;
        }
        .statsContainer {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .statItem {
          align-items: center;
          text-align: center;
        }
        .statValue {
          font-size: 20px;
          font-weight: bold;
        }
        .statLabel {
          font-size: 12px;
          color: #666;
        }
        .progressContainer {
          margin-bottom: 8px;
        }
        .progressLabel {
          font-size: 14px;
          margin-bottom: 8px;
        }
        .progressBar {
          height: 8px;
          background-color: #e0e0e0;
          border-radius: 4px;
          margin-bottom: 4px;
        }
        .progressFill {
          height: 100%;
          background-color: #4CAF50;
          border-radius: 4px;
        }
        .progressValue {
          font-size: 12px;
          color: #666;
          text-align: right;
        }
        .sectionCard {
          margin-bottom: 16px;
        }
        .sectionTitle {
          font-size: 18px;
          font-weight: bold;
        }
        .divider {
          margin: 16px 0;
        }
        .moduleItem {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .moduleInfo {
          flex: 1;
        }
        .moduleName {
          font-size: 16px;
          font-weight: bold;
        }
        .moduleFeatures {
          font-size: 12px;
          color: #666;
        }
        .moduleStatus {
          display: flex;
          align-items: center;
        }
        .statusText {
          margin-right: 4px;
          font-weight: bold;
        }
        .statusIcon {
          font-size: 18px;
        }
        .testSummary {
          display: flex;
          margin-bottom: 16px;
        }
        .testCircle {
          width: 80px;
          height: 80px;
          border-radius: 40px;
          background-color: #f0f0f0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 16px;
        }
        .testPassRate {
          font-size: 20px;
          font-weight: bold;
          color: #4CAF50;
        }
        .testPassLabel {
          font-size: 10px;
          color: #666;
        }
        .testDetails {
          flex: 1;
          justify-content: center;
        }
        .testRow {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .testLabel {
          font-size: 14px;
          color: #666;
        }
        .testValue {
          font-size: 14px;
          font-weight: bold;
        }
        .metricRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .metricName {
          font-size: 14px;
          color: #666;
        }
        .metricValues {
          display: flex;
          align-items: center;
        }
        .metricValue {
          font-size: 14px;
          font-weight: bold;
          margin-right: 8px;
        }
        .metricImprovement {
          font-size: 12px;
          color: #4CAF50;
        }
        .button {
          margin-top: 8px;
        }
        .buttonContainer {
          margin-bottom: 32px;
        }
        .mainButton {
          margin-bottom: 8px;
        }
        .listItem {
          padding: 8px 0;
        }
        .listItemContent {
          display: flex;
          align-items: center;
        }
        .listItemIcon {
          margin-right: 16px;
        }
        .icon {
          font-size: 24px;
        }
        .listItemText {
          flex: 1;
        }
        .listItemTitle {
          font-weight: bold;
        }
        .listItemDescription {
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default FinalReportScreen;
