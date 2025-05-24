import React from 'react';
// Replace React Native imports with web-compatible alternatives
import { Card, Button, Divider, useTheme } from '@mui/material';
import { styled } from '@emotion/styled';

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
    <Container>
      <SummaryCard>
        <CardContent>
          <Title>Testing Dashboard</Title>
          <Subtitle>Overall Test Results</Subtitle>
          
          <OverallStats>
            <StatCircle>
              <PassRateText>{passRate}%</PassRateText>
              <PassRateLabel>Pass Rate</PassRateLabel>
            </StatCircle>
            
            <StatsColumn>
              <StatsRow>
                <StatItem>
                  <StatValue>{totalTests}</StatValue>
                  <StatLabel>Total Tests</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue style={{ color: theme.palette.primary.main }}>{totalPassed}</StatValue>
                  <StatLabel>Passed</StatLabel>
                </StatItem>
              </StatsRow>
              <StatsRow>
                <StatItem>
                  <StatValue style={{ color: theme.palette.error.main }}>{totalFailed}</StatValue>
                  <StatLabel>Failed</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue style={{ color: theme.palette.secondary.main }}>{totalSkipped}</StatValue>
                  <StatLabel>Skipped</StatLabel>
                </StatItem>
              </StatsRow>
            </StatsColumn>
          </OverallStats>
          
          <Button 
            variant="contained" 
            className="button"
            onClick={() => console.log('Run all tests')}
          >
            Run All Tests
          </Button>
        </CardContent>
      </SummaryCard>
      
      <SectionTitle>Test Categories</SectionTitle>
      {renderTestCategory('Integration Tests', testResults.integration)}
      {renderTestCategory('Performance Tests', testResults.performance)}
      {renderTestCategory('UI Tests', testResults.ui)}
      {renderTestCategory('Accessibility Tests', testResults.accessibility)}
      
      <MetricsCard>
        <CardContent>
          <CategoryTitle>Performance Metrics</CategoryTitle>
          <Divider className="divider" />
          
          <MetricRow>
            <MetricLabel>App Startup Time:</MetricLabel>
            <MetricValue>{performanceMetrics.startupTime}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>Memory Usage:</MetricLabel>
            <MetricValue>{performanceMetrics.memoryUsage}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>CPU Usage:</MetricLabel>
            <MetricValue>{performanceMetrics.cpuUsage}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>Average Render Time:</MetricLabel>
            <MetricValue>{performanceMetrics.renderTime}</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>Storage Size:</MetricLabel>
            <MetricValue>{performanceMetrics.storageSize}</MetricValue>
          </MetricRow>
          
          <Button 
            variant="outlined" 
            className="button"
            onClick={() => console.log('Run performance analysis')}
          >
            Run Performance Analysis
          </Button>
        </CardContent>
      </MetricsCard>
      
      <ButtonContainer>
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

const SummaryCard = styled(Card)`
  margin-bottom: 16px;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Subtitle = styled.h2`
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
`;

const OverallStats = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const StatCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const PassRateText = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
`;

const PassRateLabel = styled.div`
  font-size: 12px;
  color: #666;
`;

const StatsColumn = styled.div`
  flex: 1;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatItem = styled.div`
  align-items: center;
  text-align: center;
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 16px 0;
`;

const CategoryTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const MetricsCard = styled(Card)`
  margin-top: 8px;
  margin-bottom: 16px;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const MetricLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const MetricValue = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  margin-bottom: 32px;
`;

export default TestingDashboard;
