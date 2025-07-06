# Expense Tracker - MERN Stack Application

A full-stack expense tracking application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, expense management, charts, and data export functionality.

## Features

### Core Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Expense Management**: Add, edit, delete, and categorize expenses
- **Monthly Summary**: View spending patterns and totals by month
- **Category Analysis**: Breakdown expenses by category with visual charts
- **Recurring Expenses**: Set up and manage recurring expense patterns

### Bonus Features
- **Interactive Charts**: Pie charts and line graphs using Chart.js
- **CSV Export**: Export expense data to CSV format
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Instant data synchronization
- **Advanced Filtering**: Filter expenses by date, category, and search terms

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **React Icons** - Icon library
- **date-fns** - Date manipulation

## Project Structure

```
MERN-PROJECT/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-secret-key-here
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Expenses
- `GET /api/expenses` - Get all expenses (with pagination and filters)
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary` - Get monthly summary
- `GET /api/expenses/export` - Export expenses to CSV

### Categories
- `GET /api/categories` - Get category statistics
- `GET /api/categories/:category` - Get expenses by category

### Recurring Expenses
- `GET /api/recurring` - Get all recurring expenses
- `POST /api/recurring` - Create recurring expense
- `PUT /api/recurring/:id` - Update recurring expense
- `DELETE /api/recurring/:id` - Delete recurring expense
- `POST /api/recurring/:id/advance` - Advance recurring expense

## Features in Detail

### Dashboard
- Monthly expense overview with key metrics
- Interactive pie chart showing category distribution
- Line chart displaying daily spending trends
- Recent expenses list with quick actions

### Expense Management
- Comprehensive expense form with all necessary fields
- Category-based organization
- Payment method tracking
- Location and tags support
- Date-based filtering and sorting

### Categories Analysis
- Visual breakdown of expenses by category
- Percentage and amount statistics
- Category-specific expense lists
- Monthly category comparisons

### Recurring Expenses
- Set up recurring expense patterns
- Automatic due date calculation
- Mark as paid functionality
- Pause/activate recurring expenses

### Data Export
- CSV export with customizable date ranges
- Category-based filtering for exports
- Complete expense data including all fields

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Protected routes with middleware
- User-specific data isolation

## Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**Happy Expense Tracking! 💰📊** 