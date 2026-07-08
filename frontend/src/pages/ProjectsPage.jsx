import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../components/layouts/MainLayout'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { Avatar } from '../components/common/Avatar'
import { Modal } from '../components/common/Modal'
import { Input } from '../components/common/Input'
import { Loader } from '../components/common/Loader'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiTrash2, FiUsers } from 'react-icons/fi'
import api from '../services/api'
import toast from 'react-hot-toast'

export const ProjectsPage = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects')
      setProjects(response.data.data.projects)
    } catch (error) {
      toast.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      await api.post('/projects', formData)
      toast.success('Project created successfully')
      setShowModal(false)
      setFormData({ name: '', description: '' })
      fetchProjects()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project')
    }
  }

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/projects/${id}`)
        toast.success('Project deleted')
        fetchProjects()
      } catch (error) {
        toast.error('Failed to delete project')
      }
    }
  }

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-light-50">Projects</h1>
            <p className="text-gray-400 mt-2">Manage and organize your projects</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <FiPlus size={20} />
            New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-400 mb-4">No projects yet. Create one to get started!</p>
            <Button onClick={() => setShowModal(true)}>Create First Project</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="cursor-pointer"
              >
                <Card className="hover:shadow-medium transition-all h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                        {project.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-light-50">{project.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {project.members?.length || 0} Members
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="p-2 hover:bg-danger/10 text-danger rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteProject(project._id)
                        }}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                  <div className="flex items-center gap-2 pt-4 border-t border-dark-700">
                    <FiUsers size={16} className="text-gray-400" />
                    <div className="flex -space-x-2">
                      {project.members?.slice(0, 3).map((member) => (
                        <Avatar
                          key={member._id}
                          firstName={member.firstName}
                          lastName={member.lastName}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New Project"
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Create</Button>
            </>
          }
        >
          <form className="space-y-4">
            <Input
              label="Project Name"
              placeholder="e.g., Website Redesign"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-light-50 mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe your project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-light-50 placeholder-gray-500 focus:outline-none focus:border-primary"
                rows="4"
              />
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  )
}
