export default function Dashboard() {
  // Dummy Data
  const teamStats = [
    { label: 'Total Tasks', value: '248', icon: '✓', color: '#7c3aed' },
    { label: 'Completed', value: '156', icon: '✔️', color: '#10b981' },
    { label: 'Team Members', value: '12', icon: '👥', color: '#06b6d4' },
    { label: 'Growth Rate', value: '+28%', icon: '📈', color: '#f59e0b' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Design Dashboard Layout', status: 'In Progress', dueDate: 'Today', progress: 65 },
    { id: 2, title: 'API Development', status: 'Pending', dueDate: 'Tomorrow', progress: 30 },
    { id: 3, title: 'Testing & QA', status: 'In Progress', dueDate: 'Jul 12', progress: 45 },
    { id: 4, title: 'Documentation', status: 'Pending', dueDate: 'Jul 15', progress: 10 },
  ];

  const recentActivity = [
    { id: 1, user: 'Alice Chen', action: 'completed', task: 'API Integration', time: '2 hours ago', avatar: '👩‍💼' },
    { id: 2, user: 'Bob Smith', action: 'created', task: 'Design System Update', time: '4 hours ago', avatar: '👨‍💼' },
    { id: 3, user: 'Carol Davis', action: 'commented', task: 'Q3 Planning', time: '6 hours ago', avatar: '👩‍🔬' },
    { id: 4, user: 'David Lee', action: 'updated', task: 'Performance Optimization', time: '8 hours ago', avatar: '👨‍💻' },
  ];

  const notifications = [
    { id: 1, title: 'Project Deadline', message: 'Q3 Launch is due tomorrow', priority: 'high' },
    { id: 2, title: 'New Assignment', message: 'You have been assigned to Mobile App', priority: 'medium' },
    { id: 3, title: 'Team Meeting', message: 'Standup at 10:00 AM', priority: 'low' },
  ];

  const chartData = [
    { month: 'Jan', tasks: 40, completed: 24 },
    { month: 'Feb', tasks: 45, completed: 30 },
    { month: 'Mar', tasks: 50, completed: 35 },
    { month: 'Apr', tasks: 55, completed: 42 },
    { month: 'May', tasks: 60, completed: 48 },
    { month: 'Jun', tasks: 65, completed: 55 },
  ];

  // Simple Line Chart Component
  const LineChart = ({ data }) => {
    const maxValue = 70;
    const width = 600;
    const height = 300;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = data.map((d, i) => ({
      x: padding + (i / (data.length - 1)) * chartWidth,
      y: height - padding - (d.completed / maxValue) * chartHeight,
      value: d.completed
    }));

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={`grid-${i}`}
            x1={padding}
            y1={padding + (chartHeight / 4) * i}
            x2={width - padding}
            y2={padding + (chartHeight / 4) * i}
            stroke="#e2e8f0"
            strokeDasharray="4"
          />
        ))}

        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#94a3b8" strokeWidth="2" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#94a3b8" strokeWidth="2" />

        {/* Line */}
        <path d={pathD} stroke="#7c3aed" strokeWidth="3" fill="none" />

        {/* Dots */}
        {points.map((p, i) => (
          <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="4" fill="#7c3aed" />
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={`label-${i}`}
            x={padding + (i / (data.length - 1)) * chartWidth}
            y={height - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#94a3b8"
          >
            {d.month}
          </text>
        ))}
      </svg>
    );
  };

  // Simple Pie Chart Component
  const PieChart = () => {
    const data = [
      { name: 'Completed', value: 156, color: '#10b981' },
      { name: 'In Progress', value: 65, color: '#f59e0b' },
      { name: 'Pending', value: 27, color: '#ef4444' },
    ];
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const radius = 80;
    const cx = 120;
    const cy = 120;

    let currentAngle = -Math.PI / 2;
    const slices = data.map((d) => {
      const sliceAngle = (d.value / total) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      return { ...d, pathD };
    });

    return (
      <svg viewBox="0 0 280 280" style={{ width: '100%', height: 'auto', maxWidth: '200px' }}>
        {slices.map((slice, i) => (
          <path key={`slice-${i}`} d={slice.pathD} fill={slice.color} stroke="#fff" strokeWidth="2" />
        ))}
        <circle cx={cx} cy={cy} r="50" fill="#fff" />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill="#1e293b">
          248
        </text>
      </svg>
    );
  };

  const getPriorityStyles = (priority) => {
    const styles = {
      high: { bg: 'rgba(239, 68, 68, 0.05)', border: '#fee2e2', badge: '#ef4444' },
      medium: { bg: 'rgba(245, 158, 11, 0.05)', border: '#fef3c7', badge: '#f59e0b' },
      low: { bg: 'rgba(16, 185, 129, 0.05)', border: '#d1fae5', badge: '#10b981' },
    };
    return styles[priority] || styles.low;
  };

  const getStatusColor = (status) => {
    return status === 'In Progress' ? '#3b82f6' : '#6b7280';
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          margin: '0 0 8px 0',
          color: '#1e293b'
        }}>
          Welcome back, John! 👋
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          margin: 0
        }}>
          Here's what's happening with your team today
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {teamStats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <p style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: '0 0 8px 0',
                  fontWeight: 500
                }}>
                  {stat.label}
                </p>
                <h3 style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#1e293b',
                  margin: 0
                }}>
                  {stat.value}
                </h3>
              </div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                backgroundColor: `rgba(${stat.color === '#7c3aed' ? '124, 58, 237' : stat.color === '#10b981' ? '16, 185, 129' : stat.color === '#06b6d4' ? '6, 182, 212' : '245, 158, 11'}, 0.1)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Line Chart */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            margin: '0 0 16px 0',
            color: '#1e293b'
          }}>
            Task Performance
          </h3>
          <LineChart data={chartData} />
        </div>

        {/* Pie Chart */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            margin: '0 0 16px 0',
            color: '#1e293b',
            width: '100%'
          }}>
            Task Distribution
          </h3>
          <PieChart />
          <div style={{
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#10b981' }}></span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Completed: 156</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#f59e0b' }}></span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>In Progress: 65</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#ef4444' }}></span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Pending: 27</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks and Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Upcoming Tasks */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            margin: '0 0 16px 0',
            color: '#1e293b'
          }}>
            Upcoming Tasks
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {upcomingTasks.map((task) => (
              <div key={task.id} style={{
                paddingBottom: '16px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1e293b',
                    margin: 0
                  }}>
                    {task.title}
                  </h4>
                  <span style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: task.status === 'In Progress' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                    color: getStatusColor(task.status),
                    borderRadius: '6px'
                  }}>
                    {task.status}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  marginBottom: '8px',
                  color: '#64748b'
                }}>
                  <span>Due: {task.dueDate}</span>
                  <span style={{ color: '#7c3aed', fontWeight: 600 }}>{task.progress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${task.progress}%`,
                    background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
          <button style={{
            width: '100%',
            marginTop: '16px',
            padding: '10px 16px',
            backgroundColor: 'transparent',
            color: '#7c3aed',
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(124, 58, 237, 0.05)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
            View All Tasks →
          </button>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            margin: '0 0 16px 0',
            color: '#1e293b'
          }}>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentActivity.map((activity) => (
              <div key={activity.id} style={{
                display: 'flex',
                gap: '12px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {activity.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1e293b',
                      margin: 0
                    }}>
                      {activity.user}
                    </h4>
                    <span style={{
                      fontSize: '12px',
                      color: '#94a3b8'
                    }}>
                      {activity.time}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    margin: 0
                  }}>
                    <span style={{ fontWeight: 600 }}>{activity.action}</span> {activity.task}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button style={{
            width: '100%',
            marginTop: '16px',
            padding: '10px 16px',
            backgroundColor: 'transparent',
            color: '#7c3aed',
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(124, 58, 237, 0.05)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
            View All Activity →
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          margin: '0 0 16px 0',
          color: '#1e293b'
        }}>
          🔔 Notifications
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((notification) => {
            const priorityStyles = getPriorityStyles(notification.priority);
            return (
              <div key={notification.id} style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: priorityStyles.bg,
                border: `1px solid ${priorityStyles.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1e293b',
                    margin: '0 0 4px 0'
                  }}>
                    {notification.title}
                  </h4>
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    margin: 0
                  }}>
                    {notification.message}
                  </p>
                </div>
                <span style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: `rgba(${notification.priority === 'high' ? '239, 68, 68' : notification.priority === 'medium' ? '245, 158, 11' : '16, 185, 129'}, 0.1)`,
                  color: priorityStyles.badge,
                  borderRadius: '6px',
                  textTransform: 'capitalize',
                  whiteSpace: 'nowrap'
                }}>
                  {notification.priority}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
                @media (max-width: 768px) {
                    div {
                        font-size: 16px !important;
                    }
                }
            `}</style>
    </div>
  );
}