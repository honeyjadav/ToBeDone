import { useState, useEffect, useRef } from 'react'
import { MainLayout } from '../components/layouts/MainLayout'
import { Card } from '../components/common/Card'
import { Avatar } from '../components/common/Avatar'
import { Button } from '../components/common/Button'
import { Loader } from '../components/common/Loader'
import { motion } from 'framer-motion'
import { FiSend, FiPlus, FiSearch } from 'react-icons/fi'
import api from '../services/api'
import { useSocket } from '../hooks/useSocket'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export const ChatPage = () => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { socket, emit, on } = useSocket()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages()
    }
  }, [selectedConversation])

  useEffect(() => {
    if (on) {
      on('chat:new-message', (message) => {
        if (message.conversationId === selectedConversation?._id) {
          setMessages((prev) => [...prev, message])
        }
      })
    }
  }, [selectedConversation, on])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const response = await api.get('/chat/conversations')
      setConversations(response.data.data)
      setLoading(false)
    } catch (error) {
      toast.error('Failed to fetch conversations')
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chat/messages/${selectedConversation._id}`)
      setMessages(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch messages')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const response = await api.post('/chat/messages', {
        conversationId: selectedConversation._id,
        content: newMessage,
      })

      emit('chat:message-sent', {
        conversationId: selectedConversation._id,
        message: response.data.data,
      })

      setMessages((prev) => [...prev, response.data.data])
      setNewMessage('')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const getConversationName = (conversation) => {
    if (conversation.isGroup) {
      return conversation.name
    }
    const otherUser = conversation.participants.find((p) => p._id !== user._id)
    return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown'
  }

  if (loading) {
    return (
      <MainLayout navbar={false}>
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout navbar={false}>
      <div className="flex h-[calc(100vh-60px)] bg-dark-900">
        <div className="w-80 border-r border-dark-700 flex flex-col bg-dark-800">
          <div className="p-4 border-b border-dark-700">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-light-50 placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>
              <Button size="sm">
                <FiPlus />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <motion.button
                key={conversation._id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 border-b border-dark-700 text-left transition-colors ${
                  selectedConversation?._id === conversation._id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-dark-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    firstName={conversation.participants[0]?.firstName}
                    lastName={conversation.participants[0]?.lastName}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-light-50 truncate">
                      {getConversationName(conversation)}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage?.content || 'No messages'}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="border-b border-dark-700 p-4 bg-dark-800">
                <h2 className="text-lg font-bold text-light-50">
                  {getConversationName(selectedConversation)}
                </h2>
                <p className="text-sm text-gray-400">
                  {selectedConversation.participants.length} members
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => {
                  const isOwn = message.sender._id === user._id
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <Card className={`max-w-xs ${isOwn ? 'bg-primary text-white' : 'bg-dark-700'}`}>
                        <p>{message.content}</p>
                        <p className={`text-xs mt-2 ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </Card>
                    </motion.div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-dark-700 bg-dark-800">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-light-50 placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                  <Button type="submit" size="sm">
                    <FiSend />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
