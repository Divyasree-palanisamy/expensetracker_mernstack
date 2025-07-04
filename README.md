# Personal Finance Dashboard - MERN Stack Application

A modern personal finance dashboard built with the MERN (MongoDB, Express.js, React.js, Node.js) stack. This application helps users manage their budgets, track transactions, set savings goals, monitor moods, and participate in financial challenges—all in one place.

## 🚀 Features

### Authentication & User Management
- User registration and login with JWT authentication
- Secure password hashing
- User profile management

### Budget & Transaction Management
- Create, view, update, and delete budgets
- Add, edit, and delete transactions
- Categorize transactions (Food, Rent, Utilities, etc.)
- View transaction history and summaries

### Savings Goals
- Set and track savings goals
- Visual progress indicators

### Mood Tracking
- Log daily moods
- View mood history and trends

### Financial Challenges
- Participate in savings or spending challenges
- Track challenge progress

### Dashboard & Insights
- Overview of budgets, transactions, and goals
- Recent activity and statistics
- Visual charts and summaries

### User Interface
- Responsive, modern design
- Mobile-friendly
- Real-time notifications and error handling

## 🛠️ Tech Stack

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **cors**, **helmet**, **morgan** for security and logging

### Frontend
- **React.js**
- **React Router**
- **Axios**
- **Material-UI** for UI components
- **React Hot Toast** for notifications

## 📋 Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Divyasree-palanisamy/budget_calc_mern_project.git
cd budget_calc_mern_project
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `backend` directory:
```env
MONGO_URI=mongodb://localhost:27017/finance-dashboard
JWT_SECRET=your-secret-key
PORT=5000
```

### 4. Start the Application
- **Backend:**
  ```bash
  cd backend
  npm start
  ```
- **Frontend:**
  ```bash
  cd frontend
  npm start
  ```

## 📱 Usage
- Register or log in to your account
- Add budgets and transactions
- Set and track savings goals
- Log your daily mood
- Join and monitor financial challenges
- View your dashboard for insights and summaries

## 🔧 API Endpoints (Sample)
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Add transaction
- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Add budget
- `GET /api/goals` - List savings goals
- `POST /api/goals` - Add savings goal
- `GET /api/moods` - List mood entries
- `POST /api/moods` - Add mood entry
- `GET /api/challenges` - List challenges
- `POST /api/challenges` - Join challenge

## 🎨 Customization
- Edit styles in `frontend/src/App.css` and `frontend/src/index.css`
- Update backend configuration in `backend/.env`

## 📄 License
This project is for educational and personal use.

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

**Happy Budget Managing! 🎉** 