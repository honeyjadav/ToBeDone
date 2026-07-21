# CloudCollab - Professional SaaS Dashboard

A modern, fully-responsive, feature-rich SaaS application built with React 19, Vite, and Material UI 5. Inspired by Linear, Jira, ClickUp, and Monday.com.

## ✨ Features

### 🎯 Core Capabilities

- **📊 Dashboard Analytics** - Real-time insights with interactive charts and metrics
- **📋 Kanban Board** - Drag-and-drop task management with status tracking
- **💬 Team Chat** - Real-time communication with channels and messaging
- **📁 File Manager** - Cloud storage and file sharing with version control
- **⚙️ Workflow Automation** - Automate repetitive tasks and workflows
- **🔗 Slack Integration** - Seamless notifications and webhook support
- **🤖 AI Smart Digest** - AI-powered insights using Gemini & Claude
- **📈 Activity Log** - Comprehensive audit trail and activity tracking
- **👥 Team Management** - User roles, permissions, and team collaboration

### 🎨 Design Excellence

- ✅ Premium glassmorphism UI with modern gradients
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Dark/Light theme ready
- ✅ Smooth animations and transitions
- ✅ Accessibility compliant (WCAG 2.1)
- ✅ Clean, maintainable component architecture

### 🔐 Authentication

- Role-based access control (Admin, Manager, Member)
- JWT-ready authentication flow
- Dummy authentication for demo purposes
- Protected routes and session management

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm 8+
- Git (optional)

### Installation

```bash
# Navigate to the project directory
cd frontend

# Run the setup script (Unix/Linux/Mac)
chmod +x setup.sh
./setup.sh

# Or on Windows, run:
npm install
npm run dev
```

### Demo Credentials

The application includes demo accounts for testing:

| Role    | Email                      | Password   |
|---------|----------------------------|-----------|
| Admin   | admin@cloudcollab.com      | password123 |
| Manager | manager@cloudcollab.com    | password123 |
| Member  | member@cloudcollab.com     | password123 |

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # React Context (Auth, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Layout components (DashboardLayout)
│   ├── pages/               # Page components
│   │   ├── Landing.jsx      # Landing page
│   │   ├── Login.jsx        # Login page
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── Analytics.jsx    # Analytics page
│   │   ├── Kanban.jsx       # Kanban board
│   │   ├── Chat.jsx         # Team chat
│   │   ├── FileManager.jsx  # File manager
│   │   ├── Workflows.jsx    # Workflow automation
│   │   ├── Slack.jsx        # Slack integration
│   │   ├── Digest.jsx       # AI Smart Digest
│   │   ├── Activity.jsx     # Activity log
│   │   └── Team.jsx         # Team members
│   ├── routes/              # Router configuration
│   ├── services/            # API services
│   ├── theme/               # Material UI theme
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   ├── index.css            # Global styles
│   └── main.jsx             # React entry point
├── public/                  # Static assets
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── setup.sh                 # Setup script
└── README.md                # This file
```

## 🛠️ Development

### Available Commands

```bash
# Start development server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Technology Stack

- **Frontend Framework:** React 19.2.7
- **Build Tool:** Vite 8.1.1
- **UI Component Library:** Material UI 5.14.21
- **Icons:** Material UI Icons 5.14.21
- **Charts:** Recharts 2.12.7
- **Routing:** React Router DOM 7.18.1
- **HTTP Client:** Axios 1.18.1
- **Animations:** Framer Motion 10.16.12
- **Styling:** Emotion (CSS-in-JS)

## 🎨 Theme & Styling

The application uses a premium Material UI theme with:

- **Primary Color:** Purple (#7c3aed)
- **Secondary Color:** Cyan (#06b6d4)
- **Success Color:** Green (#10b981)
- **Warning Color:** Amber (#f59e0b)
- **Error Color:** Red (#ef4444)

All components feature:
- Glassmorphism effects
- Smooth transitions and animations
- Responsive breakpoints (xs, sm, md, lg, xl)
- Accessibility-first approach

## 📊 Component Features

### Dashboard
- Welcome message with user name
- 4 key metric cards (Tasks, Completed, Team Members, Growth)
- Interactive line chart for task performance
- Pie chart for task distribution
- Upcoming tasks with progress bars
- Recent activity timeline
- Notifications panel

### Kanban Board
- 4 columns: To Do, In Progress, Review, Done
- Drag-and-drop task cards
- Task details: title, description, priority, due date, assignees
- Quick add task button per column
- Color-coded priority levels

### Analytics
- Team performance trends
- Quarterly progress tracking
- Department efficiency metrics
- Key performance indicators (KPIs)
- Trend analysis and comparisons

### Team Chat
- Searchable channel sidebar
- Real-time message display
- User avatars and timestamps
- Rich text input with emoji and file support
- Channel member count
- Unread message badges

### File Manager
- File listing with details (type, size, owner)
- Share tracking
- Search functionality
- Upload capability
- File type filtering
- Mobile-friendly view

### Workflow Automation
- Create and manage workflows
- Trigger/Action configuration
- Enable/disable workflows
- Visual workflow status
- Edit and delete operations

### Slack Integration
- Connection status display
- Channel selection
- Webhook URL management
- Event configuration
- Message formatting options
- Test functionality

### AI Smart Digest
- Multiple summary examples
- AI model selection (Gemini, Claude, Hybrid)
- Digest frequency settings
- Email and Slack delivery options
- Custom digest generation
- Key insights extraction

### Activity Log
- Timeline view of all activities
- Color-coded activity types
- User avatars and details
- Timestamp information
- Search and filter capabilities
- Activity details chips

### Team Members
- Member cards with avatars
- Role and department display
- Status indicators
- Join date information
- Email contact button
- Invite new members

## 🔐 Authentication Flow

1. User visits landing page
2. Click "Get Started" or "Sign In"
3. Redirected to login page
4. Select role (Admin/Manager/Member) or use demo email
5. Login (credentials auto-filled for demo)
6. Redirected to dashboard
7. Access all protected routes

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile (xs):** < 600px
- **Tablet (sm):** 600px - 960px
- **Desktop (md):** 960px - 1264px
- **Large Desktop (lg):** 1264px+

All pages adapt seamlessly across devices with:
- Collapsed sidebar on mobile
- Stacked layouts on smaller screens
- Touch-friendly components
- Optimized images and loading

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

## 📚 Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Offline mode with service workers
- [ ] Advanced search with Elasticsearch
- [ ] Custom report generation
- [ ] API rate limiting and caching
- [ ] Dark mode toggle
- [ ] Multi-language support (i18n)
- [ ] Advanced permission system
- [ ] Performance monitoring
- [ ] Mobile app (React Native)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
```bash
# Clear Vite cache
rm -rf .vite
npm run build
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📞 Support

For support, please contact support@cloudcollab.com or visit our website.

---

**Built with ❤️ by CloudCollab Team**

Last Updated: July 2024
Version: 1.0.0
