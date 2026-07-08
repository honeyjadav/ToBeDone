import { useState, useEffect } from 'react'
import { MainLayout } from '../components/layouts/MainLayout'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { Loader } from '../components/common/Loader'
import { motion } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import api from '../services/api'

export const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/user')
        setAnalytics(response.data.data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const kpiData = [
    {
      title: 'Total Tasks',
      value: analytics?.taskCount || 0,
      change: '+12%',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Completed',
      value: analytics?.completedTasks || 0,
      change: '+8%',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'In Progress',
      value: analytics?.pendingTasks || 0,
      change: '-2%',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Overdue',
      value: analytics?.overdueTasks || 0,
      change: '+1%',
      color: 'from-red-500 to-red-600',
    },
  ]

  const chartData = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 3 },
    { name: 'Wed', tasks: 8 },
    { name: 'Thu', tasks: 5 },
    { name: 'Fri', tasks: 6 },
    { name: 'Sat', tasks: 2 },
    { name: 'Sun', tasks: 1 },
  ]

  const pieData = [
    { name: 'Completed', value: analytics?.completedTasks || 0 },
    { name: 'Pending', value: analytics?.pendingTasks || 0 },
    { name: 'Overdue', value: analytics?.overdueTasks || 0 },
  ]

  const COLORS = ['#22C55E', '#5B5FEF', '#EF4444']

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-light-50">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back! Here's your productivity overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${kpi.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">{kpi.title}</p>
                    <p className="text-3xl font-bold mt-2">{kpi.value}</p>
                  </div>
                  <Badge variant="secondary">{kpi.change}</Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-bold text-light-50 mb-6">Weekly Tasks</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  cursor={{ fill: 'rgba(91, 95, 239, 0.1)' }}
                />
                <Bar dataKey="tasks" fill="#5B5FEF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-light-50 mb-6">Task Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-bold text-light-50 mb-6">Overall Completion</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Task Completion Rate</span>
                <span className="text-2xl font-bold text-primary">{analytics?.completionPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analytics?.completionPercentage}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
