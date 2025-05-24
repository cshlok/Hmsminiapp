import React from 'react';
// Replace React Native imports with web-compatible alternatives
import { Card, Button, List, Divider, useTheme } from '@mui/material';
import { styled } from '@emotion/styled';

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
    <Container>
      <HeaderCard>
        <CardContent>
          <Title>Clinic Management App</Title>
          <Subtitle>Final Project Report</Subtitle>
          
          <StatsContainer>
            <StatItem>
              <StatValue>{projectSummary.modulesCompleted}</StatValue>
              <StatLabel>Modules</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{projectSummary.totalFeatures}</StatValue>
              <StatLabel>Features</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{projectSummary.totalScreens}</StatValue>
              <StatLabel>Screens</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{projectSummary.codeQuality}</StatValue>
              <StatLabel>Code Quality</StatLabel>
            </StatItem>
          </StatsContainer>
          
          <ProgressContainer>
            <ProgressLabel>Project Completion</ProgressLabel>
            <ProgressBar>
              <ProgressFill style={{ width: '100%' }} />
            </ProgressBar>
            <ProgressValue>100%</ProgressValue>
          </ProgressContainer>
        </CardContent>
      </HeaderCard>
      
      <SectionCard>
        <CardContent>
          <SectionTitle>Module Completion Status</SectionTitle>
          <Divider style={{ margin: '16px 0' }} />
          
          {moduleCompletionData.map((module, index) => (
            <ModuleItem key={index}>
              <ModuleInfo>
                <ModuleName>{module.name}</ModuleName>
                <ModuleFeatures>{module.features} features</ModuleFeatures>
              </ModuleInfo>
              <ModuleStatus>
                <StatusText style={{ color: theme.palette.primary.main }}>
                  {module.status}
                </StatusText>
                <StatusIcon style={{ color: theme.palette.primary.main }}>✓</StatusIcon>
              </ModuleStatus>
            </ModuleItem>
          ))}
        </CardContent>
      </SectionCard>
      
      <SectionCard>
        <CardContent>
          <SectionTitle>Testing Summary</SectionTitle>
          <Divider style={{ margin: '16px 0' }} />
          
          <TestSummary>
            <TestCircle>
              <TestPassRate>{testResults.passRate}</TestPassRate>
              <TestPassLabel>Pass Rate</TestPassLabel>
            </TestCircle>
            
            <TestDetails>
              <TestRow>
                <TestLabel>Total Tests:</TestLabel>
                <TestValue>{testResults.total}</TestValue>
              </TestRow>
              <TestRow>
                <TestLabel>Passed:</TestLabel>
                <TestValue style={{ color: theme.palette.primary.main }}>
                  {testResults.passed}
                </TestValue>
              </TestRow>
              <TestRow>
                <TestLabel>Failed:</TestLabel>
                <TestValue style={{ color: theme.palette.error.main }}>
                  {testResults.failed}
                </TestValue>
              </TestRow>
              <TestRow>
                <TestLabel>Skipped:</TestLabel>
                <TestValue style={{ color: theme.palette.secondary.main }}>
                  {testResults.skipped}
                </TestValue>
              </TestRow>
            </TestDetails>
          </TestSummary>
          
          <Button 
            variant="outlined" 
            style={{ marginTop: '8px' }}
            onClick={() => console.log('View detailed test results')}
          >
            View Detailed Test Results
          </Button>
        </CardContent>
      </SectionCard>
      
      <SectionCard>
        <CardContent>
          <SectionTitle>Performance Metrics</SectionTitle>
          <Divider style={{ margin: '16px 0' }} />
          
          {performanceMetrics.map((metric, index) => (
            <MetricRow key={index}>
              <MetricName>{metric.name}</MetricName>
              <MetricValues>
                <MetricValue>{metric.value}</MetricValue>
                <MetricImprovement>{metric.improvement}</MetricImprovement>
              </MetricValues>
            </MetricRow>
          ))}
          
          <Button 
            variant="outlined" 
            style={{ marginTop: '8px' }}
            onClick={() => console.log('View performance details')}
          >
            View Performance Details
          </Button>
        </CardContent>
      </SectionCard>
      
      <SectionCard>
        <CardContent>
          <SectionTitle>Next Steps</SectionTitle>
          <Divider style={{ margin: '16px 0' }} />
          
          <ListContainer>
            <ListItem>
              <ListItemContent>
                <ListItemIcon style={{ color: theme.palette.primary.main }}>
                  <IconSpan>📦</IconSpan>
                </ListItemIcon>
                <ListItemText>
                  <ListItemTitle>1. Review Final Code</ListItemTitle>
                  <ListItemDescription>Review the complete codebase in the GitHub repository</ListItemDescription>
                </ListItemText>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemContent>
                <ListItemIcon style={{ color: theme.palette.primary.main }}>
                  <IconSpan>🚀</IconSpan>
                </ListItemIcon>
                <ListItemText>
                  <ListItemTitle>2. Build and Deploy</ListItemTitle>
                  <ListItemDescription>Follow the deployment guide to build and publish the app</ListItemDescription>
                </ListItemText>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemContent>
                <ListItemIcon style={{ color: theme.palette.primary.main }}>
                  <IconSpan>👥</IconSpan>
                </ListItemIcon>
                <ListItemText>
                  <ListItemTitle>3. User Testing</ListItemTitle>
                  <ListItemDescription>Conduct user acceptance testing with real users</ListItemDescription>
                </ListItemText>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemContent>
                <ListItemIcon style={{ color: theme.palette.primary.main }}>
                  <IconSpan>🏪</IconSpan>
                </ListItemIcon>
                <ListItemText>
                  <ListItemTitle>4. App Store Submission</ListItemTitle>
                  <ListItemDescription>Prepare and submit the app to Apple App Store and Google Play Store</ListItemDescription>
                </ListItemText>
              </ListItemContent>
            </ListItem>
          </ListContainer>
        </CardContent>
      </SectionCard>
      
      <ButtonContainer>
        <Button 
          variant="contained" 
          style={{ marginBottom: '8px' }}
          onClick={() => console.log('Download complete report')}
        >
          Download Complete Report
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={() => console.log('View GitHub repository')}
        >
          View GitHub Repository
        </Button>
      </ButtonContainer>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding: 16px;
`;

const HeaderCard = styled(Card)`
  margin-bottom: 16px;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.h2`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 24px;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const StatItem = styled.div`
  align-items: center;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
`;

const ProgressContainer = styled.div`
  margin-bottom: 8px;
`;

const ProgressLabel = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 4px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #4CAF50;
  border-radius: 4px;
`;

const ProgressValue = styled.div`
  font-size: 12px;
  color: #666;
  text-align: right;
`;

const SectionCard = styled(Card)`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const ModuleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModuleInfo = styled.div`
  flex: 1;
`;

const ModuleName = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const ModuleFeatures = styled.div`
  font-size: 12px;
  color: #666;
`;

const ModuleStatus = styled.div`
  display: flex;
  align-items: center;
`;

const StatusText = styled.span`
  margin-right: 4px;
  font-weight: bold;
`;

const StatusIcon = styled.span`
  font-size: 18px;
`;

const TestSummary = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const TestCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const TestPassRate = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #4CAF50;
`;

const TestPassLabel = styled.div`
  font-size: 10px;
  color: #666;
`;

const TestDetails = styled.div`
  flex: 1;
  justify-content: center;
`;

const TestRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const TestLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const TestValue = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const MetricName = styled.div`
  font-size: 14px;
  color: #666;
`;

const MetricValues = styled.div`
  display: flex;
  align-items: center;
`;

const MetricValue = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-right: 8px;
`;

const MetricImprovement = styled.div`
  font-size: 12px;
  color: #4CAF50;
`;

const ButtonContainer = styled.div`
  margin-bottom: 32px;
`;

const ListContainer = styled.div`
  padding: 0;
`;

const ListItem = styled.div`
  padding: 8px 0;
`;

const ListItemContent = styled.div`
  display: flex;
  align-items: center;
`;

const ListItemIcon = styled.div`
  margin-right: 16px;
`;

const IconSpan = styled.span`
  font-size: 24px;
`;

const ListItemText = styled.div`
  flex: 1;
`;

const ListItemTitle = styled.div`
  font-weight: bold;
`;

const ListItemDescription = styled.div`
  font-size: 14px;
  color: #666;
`;

export default FinalReportScreen;
