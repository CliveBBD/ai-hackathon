# AfroServe Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Azure OpenAI account and API key
- Google OAuth credentials (optional)

## Backend Setup

1. **Navigate to backend directory:**
```bash
cd express-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
Copy `.env.example` to `.env` and update with your credentials:

```env
# Database
MONGO_URI=mongodb://localhost:27017/afroserve

# Session
SESSION_SECRET=your-secure-session-secret

# Frontend URL
FRONTEND=http://localhost:8080

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Azure OpenAI (Required for AI features)
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

4. **Start MongoDB:**
Make sure MongoDB is running on your system.

5. **Seed the database:**
```bash
npm run seed
```

6. **Start the backend server:**
```bash
npm run dev
```

The backend will run on `http://localhost:8000`

## Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
Create `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

4. **Start the frontend server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:8080`

## Azure OpenAI Setup

1. **Create Azure OpenAI Resource:**
   - Go to Azure Portal
   - Create a new Azure OpenAI resource
   - Deploy a GPT-4 model
   - Get your API key and endpoint

2. **Configure Model Deployment:**
   - Model: GPT-4 or GPT-3.5-turbo
   - Deployment name: Use this in `AZURE_OPENAI_DEPLOYMENT_NAME`

## Test Accounts (After Seeding)

### Recruiters:
- **sarah.johnson@techcorp.com** - TechCorp Solutions
- **mike.chen@innovatelab.co.za** - InnovateLab

### Applicants:
- **john.doe@email.com** - Mid-level Full-stack Developer
- **jane.smith@email.com** - Senior Data Scientist  
- **david.wilson@email.com** - Senior Mobile Developer
- **lisa.brown@email.com** - Junior Frontend Developer

## Features Available

### ✅ Implemented Features:
- User authentication (Google OAuth ready)
- Role-based dashboards (Recruiter/Applicant)
- Profile management (separate for each role)
- Project/Job posting management
- AI-powered candidate matching
- Application tracking
- Interview scheduling
- Skill coaching recommendations
- Real-time notifications
- Comprehensive seed data

### 🔄 AI Features:
- **Candidate Matching**: AI calculates match scores based on skills, experience, and requirements
- **Skill Recommendations**: AI suggests skills to learn based on market trends
- **Job Recommendations**: AI recommends jobs to applicants based on their profile
- **Profile Insights**: AI provides insights on profile completeness and improvements

### 📊 Dashboard Features:
- **Recruiter Dashboard**: Project management, candidate review, analytics
- **Applicant Dashboard**: Job applications, skill tracking, coaching recommendations
- **Real-time Updates**: Notifications for applications, interviews, and recommendations

## API Endpoints

### Authentication
- `GET /auth/google` - Google OAuth login
- `GET /auth/user` - Get current user
- `POST /auth/logout` - Logout

### Profiles  
- `GET /api/profiles/:userId` - Get user profile
- `POST /api/profiles/applicant` - Create/update applicant profile
- `POST /api/profiles/recruiter` - Create/update recruiter profile

### Projects
- `GET /api/projects/recruiter/:recruiterId` - Get recruiter's projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:projectId` - Update project
- `GET /api/projects/:projectId/candidates` - Get project candidates

### Applications
- `GET /api/applications/applicant/:applicantId` - Get applicant's applications
- `POST /api/applications` - Apply to project
- `GET /api/applications/recommendations/:applicantId` - Get job recommendations

### Coaching
- `GET /api/coaching/:userId/recommendations` - Get skill recommendations
- `PUT /api/coaching/:userId/skills/:skillName` - Update skill level
- `GET /api/coaching/:userId/analytics` - Get skill analytics

### Notifications
- `GET /api/notifications/:userId` - Get notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file

2. **Azure OpenAI Errors:**
   - Verify API key and endpoint
   - Check deployment name matches your Azure setup
   - Ensure you have quota available

3. **CORS Issues:**
   - Verify FRONTEND URL in backend .env
   - Check frontend VITE_API_URL

4. **Session Issues:**
   - Clear browser cookies
   - Restart both servers

## Development Notes

- The app uses TypeScript for both frontend and backend
- MongoDB with Mongoose for data persistence
- Express.js with session-based authentication
- React with Vite for the frontend
- Tailwind CSS for styling
- Azure OpenAI for AI features

## Production Deployment

1. Set NODE_ENV=production
2. Use secure session secrets
3. Configure proper CORS origins
4. Set up SSL certificates
5. Use production MongoDB instance
6. Configure proper Azure OpenAI quotas