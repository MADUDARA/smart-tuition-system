# Tuition Organization Management System

A comprehensive system for managing tuition organizations with both web and mobile applications.

## Project Structure

- **Backend**: Node.js/Express server with PostgreSQL database
- **Web Application**: React-based web interface
- **Mobile Application**: React Native mobile app

## User Roles

1. **Super Admin**: Full system access and control
2. **Sub Admin**: Administrative access with limited permissions
3. **Teacher's Admin**: Manages teachers and their schedules
4. **Teacher**: Manages classes and student progress
5. **Student**: Accesses learning materials and track progress

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- PgAdmin 4
- React Native development environment

### Installation

1. Clone the repository
2. Install dependencies for each part:
   ```bash
   # Backend
   cd backend
   npm install

   # Web Application
   cd ../web
   npm install

   # Mobile Application
   cd ../mobile
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database
   - Run migrations from the database/migrations folder
   - Configure database connection in backend/.env

4. Start the applications:
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start web application
   cd ../web
   npm start

   # Start mobile application
   cd ../mobile
   npm start
   ```

## Documentation

Detailed documentation for each component can be found in the `docs` directory:
- API documentation
- Setup guides
- User guides for different roles

## License

[Your License Here] 