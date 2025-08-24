# AfroServe - AI-Powered Recruitment Platform

AfroServe is a comprehensive recruitment platform that uses AI to match candidates with job opportunities, provides skill coaching, and automates interview scheduling. Designed to serve the African talent community by connecting skilled professionals with meaningful career opportunities.

## Features

### For Recruiters
- **Project Management**: Create, edit, and manage job postings
- **AI Candidate Matching**: Get top candidates ranked by compatibility score
- **Interview Scheduling**: Automated interview scheduling with candidates
- **Analytics Dashboard**: Track hiring funnel and success metrics
- **Real-time Notifications**: Get notified about new applications and updates

### For Applicants
- **Profile Management**: Comprehensive profile with skills, experience, and certifications
- **AI Job Recommendations**: Get personalized job recommendations based on your profile
- **Application Tracking**: Track status of all your applications
- **Skill Coaching**: AI-powered recommendations to improve employability
- **Progress Tracking**: Monitor skill development and profile completion

### AI Features
- **Smart Matching**: Advanced algorithm that matches candidates to jobs based on skills, experience, and location
- **Skill Gap Analysis**: Identifies missing skills and provides learning recommendations
- **Market Insights**: Analyzes job market trends and in-demand skills
- **Automated Notifications**: Smart notifications for both recruiters and applicants

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **Passport.js** for authentication
- **Express Session** with **MongoDB store**

### Frontend
- **React** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **React Router** for navigation

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd express-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
MONGO_URI=mongodb://localhost:27017/ai-hackathon
SESSION_SECRET=your-session-secret-key
FRONTEND=http://localhost:8080
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:8080`

### Database Setup

The application will automatically create the necessary collections when you start using it. No manual database setup is required.

## API Endpoints

### Authentication
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - Logout user

### Profiles
- `GET /api/profiles/:userId` - Get user profile
- `POST /api/profiles` - Create user profile
- `PUT /api/profiles/:userId` - Update user profile

### Projects (Recruiters)
- `GET /api/projects/recruiter/:recruiterId` - Get recruiter's projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:projectId` - Update project
- `GET /api/projects/:projectId/candidates` - Get project candidates
- `POST /api/projects/:projectId/schedule-interview` - Schedule interview

### Applications (Applicants)
- `GET /api/applications/applicant/:applicantId` - Get applicant's applications
- `POST /api/applications` - Apply to project
- `GET /api/applications/recommendations/:applicantId` - Get job recommendations

### Notifications
- `GET /api/notifications/:userId` - Get user notifications
- `PUT /api/notifications/:notificationId/read` - Mark notification as read
- `PUT /api/notifications/user/:userId/read-all` - Mark all notifications as read

### Coaching
- `GET /api/coaching/:userId/recommendations` - Get skill coaching recommendations
- `PUT /api/coaching/:userId/skills/:skillName` - Update skill level
- `GET /api/coaching/:userId/resources` - Get learning resources

## Usage

### For Recruiters
1. Sign up and create a recruiter profile
2. Post job openings with required skills and experience
3. Review AI-matched candidates with compatibility scores
4. Schedule interviews directly through the platform
5. Track hiring metrics and success rates

### For Applicants
1. Sign up and create a comprehensive profile
2. Add your skills, experience, and certifications
3. Browse AI-recommended job opportunities
4. Apply to positions that match your profile
5. Follow AI coaching recommendations to improve your skills
6. Track application status and scheduled interviews

## AI Matching Algorithm

The platform uses a sophisticated matching algorithm that considers:
- **Skills Match** (40% weight): Compares candidate skills with job requirements
- **Experience Level** (30% weight): Matches experience level with job seniority
- **Certifications** (20% weight): Considers relevant certifications
- **Location** (10% weight): Factors in location preferences and remote work options

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.