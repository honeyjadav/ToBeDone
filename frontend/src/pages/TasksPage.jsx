import { useState, useEffect } from 'react'
import { MainLayout } from '../components/layouts/MainLayout'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { Avatar } from '../components/common/Avatar'
import { Modal } from '../components/common/Modal'
import { Input } from '../components/common/Input'
import { Loader } from '../components/common/Loader'
import { motion } from 'framer-motion'
import { FiPlus, FiCheck } from 'react-icons/fi'
import api from '../services/api'
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../utils/constants'
import toast from 'react-hot-toast'

export const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      fetchTasks()
    }
  }, [selectedProject])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects')
      setProjects(response.data.data.projects)
      if (response.data.data.projects.length > 0) {
        setSelectedProject(response.data.data.projects[0]._id)
      }
    } catch (error) {
      toast.error('Failed to fetch projects')
    }
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/tasks/project/${selectedProject}`)
      setTasks(response.data.data.tasks)
    } catch (error) {
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus })
      toast.success('Task updated')
      fetchTasks()
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  if (loading && tasks.length === 0) {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-light-50">Tasks</h1>
            <p className="text-gray-400 mt-2">Manage and track your work</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <FiPlus size={20} />
            New Task
          </Button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-light-50 focus:outline-none focus:border-primary"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-light-50 focus:outline-none focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="testing">Testing</option>
            <option value="done">Done</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-400">No tasks yet. Create one to get started!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="flex items-center justify-between hover:shadow-medium transition-all p-4">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => handleUpdateTaskStatus(task._id, 'done')}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        task.status === 'done'
                          ? 'bg-success border-success text-white'
                          : 'border-gray-600 hover:border-success'
                      }`}
                    >
                      {task.status === 'done' && <FiCheck size={16} />}
                    </button>

                    <div className="flex-1">
                      <h3 className={`font-semibold transition-all ${
                        task.status === 'done'
                          ? 'text-gray-400 line-through'
                          : 'text-light-50'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'default'}>
                          {TASK_PRIORITY_LABELS[task.priority]}
                        </Badge>
                        <span className="text-xs text-gray-500">{TASK_STATUS_LABELS[task.status]}</span>
                        {task.dueDate && (
                          <span className="text-xs text-gray-500">
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {task.assignee && (
                    <Avatar
                      firstName={task.assignee.firstName}
                      lastName={task.assignee.lastName}
                      size="sm"
                    />
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
