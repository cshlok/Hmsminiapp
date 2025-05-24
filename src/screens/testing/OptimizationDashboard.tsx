import React from 'react';
// Replace React Native imports with web-compatible alternatives
import { Card, Button, List, useTheme } from '@mui/material';

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
    <List.Item
      key={task.id}
      className="taskItem"
    >
      <div className="taskContent">
        <div className="taskIcon" style={{ color: getStatusColor(task.status) }}>
          {task.status === 'completed' ? '✓' : 
           task.status === 'in_progress' ? '⟳' : '⚠'}
        </div>
        <div className="taskInfo">
          <div className="taskTitle">{task.title}</div>
          <div className="taskDescription">{task.description}</div>
        </div>
        <div className="taskRight">
          <div className="taskStatus" style={{ color: getStatusColor(task.status) }}>
            {getStatusText(task.status)}
          </div>
          <div className="taskImprovement">{task.improvement}</div>
        </div>
      </div>
    </List.Item>
  );

  return (
    <div className="container">
      <Card className="summaryCard">
        <div className="card-content">
          <h1 className="title">Optimization Dashboard</h1>
          <h2 className="subtitle">Performance Optimization Progress</h2>
          
          <div className="overallStats">
            <div className="statCircle">
              <div className="completionRateText">{completionRate}%</div>
              <div className="completionRateLabel">Complete</div>
            </div>
            
            <div className="statsColumn">
              <div className="statsRow">
                <div className="statItem">
                  <div className="statValue">{totalTasks}</div>
                  <div className="statLabel">Total Tasks</div>
                </div>
                <div className="statItem">
                  <div className="statValue" style={{ color: theme.palette.primary.main }}>{completedTasks}</div>
                  <div className="statLabel">Completed</div>
                </div>
              </div>
              <div className="statsRow">
                <div className="statItem">
                  <div className="statValue" style={{ color: theme.palette.secondary.main }}>{inProgressTasks}</div>
                  <div className="statLabel">In Progress</div>
                </div>
                <div className="statItem">
                  <div className="statValue" style={{ color: theme.palette.error.main }}>{notStartedTasks}</div>
                  <div className="statLabel">Not Started</div>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="contained" 
            className="button"
            onClick={() => console.log('Run performance analysis')}
          >
            Run Performance Analysis
          </Button>
        </div>
      </Card>
      
      <Card className="improvementsCard">
        <div className="card-content">
          <h2 className="sectionTitle">Performance Improvements</h2>
          
          <div className="improvementRow">
            <div className="improvementItem">
              <div className="improvementValue">{performanceImprovements.startupTime}</div>
              <div className="improvementLabel">Startup Time</div>
            </div>
            <div className="improvementItem">
              <div className="improvementValue">{performanceImprovements.memoryUsage}</div>
              <div className="improvementLabel">Memory Usage</div>
            </div>
            <div className="improvementItem">
              <div className="improvementValue">{performanceImprovements.renderSpeed}</div>
              <div className="improvementLabel">Render Speed</div>
            </div>
          </div>
          
          <div className="improvementRow">
            <div className="improvementItem">
              <div className="improvementValue">{performanceImprovements.storageSize}</div>
              <div className="improvementLabel">Storage Size</div>
            </div>
            <div className="improvementItem">
              <div className="improvementValue">{performanceImprovements.batteryUsage}</div>
              <div className="improvementLabel">Battery Usage</div>
            </div>
            <div className="improvementItem">
              <div className="improvementValue">6/7</div>
              <div className="improvementLabel">Modules Optimized</div>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="tasksCard">
        <div className="card-content">
          <h2 className="sectionTitle">Optimization Tasks</h2>
          
          <List className="taskList">
            {optimizationTasks.map(renderTaskItem)}
          </List>
          
          <Button 
            variant="outlined" 
            className="button"
            onClick={() => console.log('Add new optimization task')}
          >
            Add New Optimization Task
          </Button>
        </div>
      </Card>
      
      <div className="buttonContainer">
        <Button 
          variant="contained" 
          className="button generateButton"
          onClick={() => console.log('Generate optimization report')}
        >
          Generate Optimization Report
        </Button>
        
        <Button 
          variant="outlined" 
          className="button"
          onClick={() => console.log('Export metrics')}
        >
          Export Metrics
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
        .summaryCard {
          margin-bottom: 16px;
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
        .completionRateText {
          font-size: 24px;
          font-weight: bold;
          color: #4CAF50;
        }
        .completionRateLabel {
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
        .improvementsCard {
          margin-bottom: 16px;
        }
        .sectionTitle {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 16px;
        }
        .improvementRow {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .improvementItem {
          align-items: center;
          text-align: center;
          flex: 1;
        }
        .improvementValue {
          font-size: 18px;
          font-weight: bold;
          color: #4CAF50;
        }
        .improvementLabel {
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        .tasksCard {
          margin-bottom: 16px;
        }
        .taskList {
          padding: 0;
        }
        .taskItem {
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .taskContent {
          display: flex;
          align-items: center;
        }
        .taskIcon {
          margin-right: 16px;
          font-size: 24px;
        }
        .taskInfo {
          flex: 1;
        }
        .taskTitle {
          font-weight: bold;
        }
        .taskDescription {
          font-size: 14px;
          color: #666;
        }
        .taskRight {
          text-align: right;
        }
        .taskStatus {
          font-size: 12px;
          font-weight: bold;
        }
        .taskImprovement {
          font-size: 12px;
          color: #4CAF50;
        }
        .buttonContainer {
          margin-bottom: 32px;
        }
        .generateButton {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default OptimizationDashboard;
