// No React import needed with modern JSX transform
// Replace React Native imports with web-compatible alternatives
import { Card, Button, useTheme } from '@mui/material';
import styled from '@emotion/styled';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.palette.primary.main;
      case 'in_progress':
        return theme.palette.secondary.main;
      case 'not_started':
        return theme.palette.error.main;
      default:
        return theme.palette.text.disabled;
    }
  };

  const getStatusText = (status: string) => {
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

  const renderTaskItem = (task: any) => (
    <TaskItem key={task.id}>
      <TaskContent>
        <TaskIcon style={{ color: getStatusColor(task.status) }}>
          {task.status === 'completed' ? '✓' : 
           task.status === 'in_progress' ? '⟳' : '⚠'}
        </TaskIcon>
        <TaskInfo>
          <TaskTitle>{task.title}</TaskTitle>
          <TaskDescription>{task.description}</TaskDescription>
        </TaskInfo>
        <TaskRight>
          <TaskStatus style={{ color: getStatusColor(task.status) }}>
            {getStatusText(task.status)}
          </TaskStatus>
          <TaskImprovement>{task.improvement}</TaskImprovement>
        </TaskRight>
      </TaskContent>
    </TaskItem>
  );

  return (
    <Container>
      <SummaryCard>
        <CardContent>
          <Title>Optimization Dashboard</Title>
          <Subtitle>Performance Optimization Progress</Subtitle>
          
          <OverallStats>
            <StatCircle>
              <CompletionRateText>{completionRate}%</CompletionRateText>
              <CompletionRateLabel>Complete</CompletionRateLabel>
            </StatCircle>
            
            <StatsColumn>
              <StatsRow>
                <StatItem>
                  <StatValue>{totalTasks}</StatValue>
                  <StatLabel>Total Tasks</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue style={{ color: theme.palette.primary.main }}>{completedTasks}</StatValue>
                  <StatLabel>Completed</StatLabel>
                </StatItem>
              </StatsRow>
              <StatsRow>
                <StatItem>
                  <StatValue style={{ color: theme.palette.secondary.main }}>{inProgressTasks}</StatValue>
                  <StatLabel>In Progress</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue style={{ color: theme.palette.error.main }}>{notStartedTasks}</StatValue>
                  <StatLabel>Not Started</StatLabel>
                </StatItem>
              </StatsRow>
            </StatsColumn>
          </OverallStats>
          
          <Button 
            variant="contained" 
            style={{ marginTop: '8px' }}
            onClick={() => console.log('Run performance analysis')}
          >
            Run Performance Analysis
          </Button>
        </CardContent>
      </SummaryCard>
      
      <ImprovementsCard>
        <CardContent>
          <SectionTitle>Performance Improvements</SectionTitle>
          
          <ImprovementRow>
            <ImprovementItem>
              <ImprovementValue>{performanceImprovements.startupTime}</ImprovementValue>
              <ImprovementLabel>Startup Time</ImprovementLabel>
            </ImprovementItem>
            <ImprovementItem>
              <ImprovementValue>{performanceImprovements.memoryUsage}</ImprovementValue>
              <ImprovementLabel>Memory Usage</ImprovementLabel>
            </ImprovementItem>
            <ImprovementItem>
              <ImprovementValue>{performanceImprovements.renderSpeed}</ImprovementValue>
              <ImprovementLabel>Render Speed</ImprovementLabel>
            </ImprovementItem>
          </ImprovementRow>
          
          <ImprovementRow>
            <ImprovementItem>
              <ImprovementValue>{performanceImprovements.storageSize}</ImprovementValue>
              <ImprovementLabel>Storage Size</ImprovementLabel>
            </ImprovementItem>
            <ImprovementItem>
              <ImprovementValue>{performanceImprovements.batteryUsage}</ImprovementValue>
              <ImprovementLabel>Battery Usage</ImprovementLabel>
            </ImprovementItem>
            <ImprovementItem>
              <ImprovementValue>6/7</ImprovementValue>
              <ImprovementLabel>Modules Optimized</ImprovementLabel>
            </ImprovementItem>
          </ImprovementRow>
        </CardContent>
      </ImprovementsCard>
      
      <TasksCard>
        <CardContent>
          <SectionTitle>Optimization Tasks</SectionTitle>
          
          <TaskList>
            {optimizationTasks.map(renderTaskItem)}
          </TaskList>
          
          <Button 
            variant="outlined" 
            style={{ marginTop: '8px' }}
            onClick={() => console.log('Add new optimization task')}
          >
            Add New Optimization Task
          </Button>
        </CardContent>
      </TasksCard>
      
      <ButtonContainer>
        <Button 
          variant="contained" 
          style={{ marginBottom: '8px' }}
          onClick={() => console.log('Generate optimization report')}
        >
          Generate Optimization Report
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={() => console.log('Export metrics')}
        >
          Export Metrics
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

const CompletionRateText = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
`;

const CompletionRateLabel = styled.div`
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

const ImprovementsCard = styled(Card)`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const ImprovementRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ImprovementItem = styled.div`
  align-items: center;
  text-align: center;
  flex: 1;
`;

const ImprovementValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #4CAF50;
`;

const ImprovementLabel = styled.div`
  font-size: 12px;
  color: #666;
  text-align: center;
`;

const TasksCard = styled(Card)`
  margin-bottom: 16px;
`;

const TaskList = styled.div`
  padding: 0;
`;

const TaskItem = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #eee;
`;

const TaskContent = styled.div`
  display: flex;
  align-items: center;
`;

const TaskIcon = styled.div`
  margin-right: 16px;
  font-size: 24px;
`;

const TaskInfo = styled.div`
  flex: 1;
`;

const TaskTitle = styled.div`
  font-weight: bold;
`;

const TaskDescription = styled.div`
  font-size: 14px;
  color: #666;
`;

const TaskRight = styled.div`
  text-align: right;
`;

const TaskStatus = styled.div`
  font-size: 12px;
  font-weight: bold;
`;

const TaskImprovement = styled.div`
  font-size: 12px;
  color: #4CAF50;
`;

const ButtonContainer = styled.div`
  margin-bottom: 32px;
`;

export default OptimizationDashboard;
