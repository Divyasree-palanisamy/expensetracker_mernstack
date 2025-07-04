# Task Manager - MERN Stack Application

A comprehensive task management application built with the MERN (MongoDB, Express.js, React.js, Node.js) stack. This application provides a modern, responsive interface for managing tasks with features like user authentication, task categorization, priority management, and real-time updates.

## 🚀 Features

### Authentication & User Management
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- User profile management
- Role-based access control

### Task Management
- Create, read, update, and delete tasks
- Task categorization (Work, Personal, Shopping, Health, Education, Other)
- Priority levels (Low, Medium, High, Urgent)
- Task status tracking (Pending, In Progress, Completed, Cancelled)
- Due date management
- Task tagging system
- Mark tasks as important

### Dashboard & Analytics
- Overview statistics (Total tasks, completion rate, etc.)
- Recent tasks display
- Category distribution charts
- Task filtering and search
- Pagination support

### User Interface
- Modern, responsive design
- Mobile-friendly interface
- Real-time notifications with toast messages
- Loading states and error handling
- Form validation
- Interactive task cards

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **morgan** - HTTP request logger

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **date-fns** - Date manipulation
- **CSS3** - Styling with custom utility classes

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mern-task-manager
```

### 2. Install Dependencies

Install all dependencies for both backend and frontend:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

### 3. Environment Configuration

Create environment files for the backend:

```bash
# In the backend directory
cd backend
```

Create a file named `config.env` with the following content:

```env
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

**Note:** Replace `your-super-secret-jwt-key-change-this-in-production` with a strong secret key for production use.

### 4. Database Setup

Make sure MongoDB is running on your system. If you're using MongoDB Atlas, update the `MONGODB_URI` in your environment file.

### 5. Start the Application

#### Development Mode (Recommended)

Run both backend and frontend concurrently:

```bash
# From the root directory
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

#### Production Mode

Build and start the application:

```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

## 📱 Usage

### 1. User Registration
- Navigate to the registration page
- Fill in your name, email, and password
- Click "Create Account"

### 2. User Login
- Use your registered email and password
- Click "Sign In"

### 3. Dashboard
- View task statistics and recent tasks
- Quick access to create new tasks
- Overview of task categories

### 4. Task Management
- **Create Tasks**: Click "New Task" button
- **View Tasks**: Navigate to the Tasks page
- **Edit Tasks**: Click the edit icon on any task
- **Delete Tasks**: Click the delete icon (with confirmation)
- **Filter Tasks**: Use the search and filter options

### 5. Profile Management
- Update your profile information
- Change your avatar URL
- View account statistics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering and pagination)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/stats/overview` - Get task statistics

## 🎨 Customization

### Styling
The application uses custom CSS utility classes. You can modify the styles in:
- `frontend/src/index.css` - Global styles
- `frontend/src/App.css` - Component-specific styles

### Configuration
- Backend configuration: `backend/config.env`
- Frontend proxy: `frontend/package.json` (proxy field)

## 🚀 Deployment

### Backend Deployment (Heroku Example)

1. Create a Heroku account and install Heroku CLI
2. Create a new Heroku app
3. Set environment variables in Heroku dashboard
4. Deploy using Git:

```bash
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Netlify Example)

1. Build the frontend: `npm run build`
2. Upload the `build` folder to Netlify
3. Set environment variables for API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `config.env`

2. **Port Already in Use**
   - Change the port in `config.env`
   - Kill processes using the port

3. **CORS Errors**
   - Check that the frontend proxy is configured correctly
   - Verify the backend CORS settings

4. **JWT Token Issues**
   - Clear browser localStorage
   - Check JWT_SECRET configuration

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section
2. Review the console logs for error messages
3. Create an issue in the repository

---

**Happy Task Managing! 🎉** 