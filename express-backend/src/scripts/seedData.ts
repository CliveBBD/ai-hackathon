import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import { ApplicantProfile, RecruiterProfile } from '../models/Profile';
import Project from '../models/Project';
import Application from '../models/Application';
import Notification from '../models/Notification';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await ApplicantProfile.deleteMany({});
    await RecruiterProfile.deleteMany({});
    await Project.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});

    console.log('Cleared existing data');

    // Create Users
    const users = await User.insertMany([
      // Recruiters
      {
        email: 'sarah.johnson@techcorp.com',
        full_name: 'Sarah Johnson',
        role: 'recruiter',
        profile_completed: true
      },
      {
        email: 'mike.chen@innovatelab.co.za',
        full_name: 'Mike Chen',
        role: 'recruiter',
        profile_completed: true
      },
      // Applicants
      {
        email: 'john.doe@email.com',
        full_name: 'John Doe',
        role: 'applicant',
        profile_completed: true
      },
      {
        email: 'jane.smith@email.com',
        full_name: 'Jane Smith',
        role: 'applicant',
        profile_completed: true
      },
      {
        email: 'david.wilson@email.com',
        full_name: 'David Wilson',
        role: 'applicant',
        profile_completed: true
      },
      {
        email: 'lisa.brown@email.com',
        full_name: 'Lisa Brown',
        role: 'applicant',
        profile_completed: true
      }
    ]);

    console.log('Created users');

    // Create Recruiter Profiles
    await RecruiterProfile.insertMany([
      {
        user_id: users[0]._id,
        phone: '+27 11 123 4567',
        company: 'TechCorp Solutions',
        position: 'Senior Talent Acquisition Manager',
        location: 'Johannesburg, South Africa',
        company_website: 'https://techcorp.com',
        company_size: '500-1000',
        industry: 'Technology',
        bio: 'Experienced talent acquisition professional with 8+ years in tech recruitment.',
        linkedin_url: 'https://linkedin.com/in/sarahjohnson',
        specializations: ['Software Development', 'Data Science', 'DevOps'],
        years_experience: 8
      },
      {
        user_id: users[1]._id,
        phone: '+27 21 987 6543',
        company: 'InnovateLab',
        position: 'Head of Talent',
        location: 'Cape Town, South Africa',
        company_website: 'https://innovatelab.co.za',
        company_size: '50-200',
        industry: 'Fintech',
        bio: 'Passionate about connecting innovative talent with cutting-edge fintech opportunities.',
        linkedin_url: 'https://linkedin.com/in/mikechen',
        specializations: ['Fintech', 'Blockchain', 'Mobile Development'],
        years_experience: 6
      }
    ]);

    // Create Applicant Profiles
    await ApplicantProfile.insertMany([
      {
        user_id: users[2]._id,
        phone: '+27 82 123 4567',
        location: 'Cape Town, South Africa',
        bio: 'Passionate full-stack developer with 3 years of experience in React, Node.js, and cloud technologies.',
        linkedin_url: 'https://linkedin.com/in/johndoe',
        github_url: 'https://github.com/johndoe',
        portfolio_url: 'https://johndoe.dev',
        skills: [
          { name: 'React', level: 85, verified: false },
          { name: 'TypeScript', level: 75, verified: false },
          { name: 'Node.js', level: 80, verified: false },
          { name: 'Python', level: 60, verified: false },
          { name: 'AWS', level: 70, verified: false }
        ],
        work_experience: [
          {
            company: 'TechStart',
            position: 'Frontend Developer',
            duration: '2022-2024',
            description: 'Developed React applications and improved user experience'
          }
        ],
        education: [
          {
            institution: 'University of Cape Town',
            degree: 'BSc Computer Science',
            year: '2021'
          }
        ],
        certifications: ['AWS Cloud Practitioner'],
        experience_level: 'mid',
        preferred_salary: { min: 400000, max: 600000, currency: 'ZAR' },
        availability: 'two_weeks',
        remote_preference: 'hybrid',
        profile_score: 85
      },
      {
        user_id: users[3]._id,
        phone: '+27 83 987 6543',
        location: 'Johannesburg, South Africa',
        bio: 'Data scientist with expertise in machine learning and statistical analysis.',
        linkedin_url: 'https://linkedin.com/in/janesmith',
        github_url: 'https://github.com/janesmith',
        skills: [
          { name: 'Python', level: 90, verified: false },
          { name: 'Machine Learning', level: 85, verified: false },
          { name: 'SQL', level: 80, verified: false },
          { name: 'TensorFlow', level: 75, verified: false },
          { name: 'R', level: 70, verified: false }
        ],
        work_experience: [
          {
            company: 'DataCorp',
            position: 'Data Analyst',
            duration: '2021-2024',
            description: 'Analyzed large datasets and built predictive models'
          }
        ],
        education: [
          {
            institution: 'University of the Witwatersrand',
            degree: 'MSc Data Science',
            year: '2021'
          }
        ],
        certifications: ['Google Data Analytics', 'AWS Machine Learning'],
        experience_level: 'senior',
        preferred_salary: { min: 600000, max: 800000, currency: 'ZAR' },
        availability: 'one_month',
        remote_preference: 'remote',
        profile_score: 92
      },
      {
        user_id: users[4]._id,
        phone: '+27 84 555 1234',
        location: 'Durban, South Africa',
        bio: 'Mobile developer specializing in React Native and Flutter applications.',
        linkedin_url: 'https://linkedin.com/in/davidwilson',
        github_url: 'https://github.com/davidwilson',
        skills: [
          { name: 'React Native', level: 88, verified: false },
          { name: 'Flutter', level: 82, verified: false },
          { name: 'JavaScript', level: 85, verified: false },
          { name: 'Dart', level: 78, verified: false },
          { name: 'Firebase', level: 75, verified: false }
        ],
        work_experience: [
          {
            company: 'MobileFirst',
            position: 'Mobile Developer',
            duration: '2020-2024',
            description: 'Built cross-platform mobile applications for various clients'
          }
        ],
        education: [
          {
            institution: 'University of KwaZulu-Natal',
            degree: 'BSc Information Technology',
            year: '2019'
          }
        ],
        certifications: ['Google Mobile Web Specialist'],
        experience_level: 'senior',
        preferred_salary: { min: 500000, max: 700000, currency: 'ZAR' },
        availability: 'immediate',
        remote_preference: 'flexible',
        profile_score: 88
      },
      {
        user_id: users[5]._id,
        phone: '+27 85 777 8888',
        location: 'Pretoria, South Africa',
        bio: 'Junior developer eager to learn and grow in the tech industry.',
        linkedin_url: 'https://linkedin.com/in/lisabrown',
        github_url: 'https://github.com/lisabrown',
        skills: [
          { name: 'HTML', level: 85, verified: false },
          { name: 'CSS', level: 80, verified: false },
          { name: 'JavaScript', level: 70, verified: false },
          { name: 'React', level: 60, verified: false },
          { name: 'Git', level: 75, verified: false }
        ],
        work_experience: [
          {
            company: 'WebStudio',
            position: 'Junior Web Developer',
            duration: '2023-2024',
            description: 'Assisted in building responsive websites and web applications'
          }
        ],
        education: [
          {
            institution: 'University of Pretoria',
            degree: 'BSc Computer Science',
            year: '2023'
          }
        ],
        certifications: ['freeCodeCamp Responsive Web Design'],
        experience_level: 'entry',
        preferred_salary: { min: 250000, max: 400000, currency: 'ZAR' },
        availability: 'immediate',
        remote_preference: 'hybrid',
        profile_score: 75
      }
    ]);

    console.log('Created profiles');

    // Create Projects
    const projects = await Project.insertMany([
      {
        recruiter_id: users[0]._id,
        title: 'Senior React Developer',
        company: 'TechCorp Solutions',
        description: 'We are looking for an experienced React developer to join our frontend team.',
        location: 'Johannesburg, South Africa',
        remote_option: 'hybrid',
        employment_type: 'full_time',
        experience_level: 'senior',
        required_skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
        preferred_skills: ['Next.js', 'AWS', 'Docker'],
        required_certifications: [],
        salary_range: { min: 600000, max: 800000, currency: 'ZAR' },
        benefits: ['Medical Aid', 'Pension Fund', 'Flexible Hours'],
        requirements: ['5+ years React experience', 'Strong TypeScript skills'],
        responsibilities: ['Build scalable web applications', 'Mentor junior developers'],
        status: 'active',
        priority: 'high',
        applications_count: 0,
        matches_count: 0
      },
      {
        recruiter_id: users[0]._id,
        title: 'Data Scientist',
        company: 'TechCorp Solutions',
        description: 'Join our data science team to build ML models and analyze business data.',
        location: 'Johannesburg, South Africa',
        remote_option: 'remote',
        employment_type: 'full_time',
        experience_level: 'senior',
        required_skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
        preferred_skills: ['TensorFlow', 'PyTorch', 'AWS', 'Docker'],
        required_certifications: [],
        salary_range: { min: 700000, max: 900000, currency: 'ZAR' },
        benefits: ['Medical Aid', 'Pension Fund', 'Learning Budget'],
        requirements: ['MSc in Data Science or related field', '3+ years ML experience'],
        responsibilities: ['Build predictive models', 'Analyze business metrics'],
        status: 'active',
        priority: 'high',
        applications_count: 0,
        matches_count: 0
      },
      {
        recruiter_id: users[1]._id,
        title: 'React Native Developer',
        company: 'InnovateLab',
        description: 'Build cutting-edge mobile applications for our fintech platform.',
        location: 'Cape Town, South Africa',
        remote_option: 'hybrid',
        employment_type: 'full_time',
        experience_level: 'mid',
        required_skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux'],
        preferred_skills: ['Flutter', 'Firebase', 'GraphQL'],
        required_certifications: [],
        salary_range: { min: 500000, max: 700000, currency: 'ZAR' },
        benefits: ['Medical Aid', 'Stock Options', 'Flexible Hours'],
        requirements: ['3+ years mobile development', 'Published apps in stores'],
        responsibilities: ['Develop mobile applications', 'Optimize app performance'],
        status: 'active',
        priority: 'medium',
        applications_count: 0,
        matches_count: 0
      },
      {
        recruiter_id: users[1]._id,
        title: 'Junior Frontend Developer',
        company: 'InnovateLab',
        description: 'Great opportunity for a junior developer to grow in a supportive environment.',
        location: 'Cape Town, South Africa',
        remote_option: 'onsite',
        employment_type: 'full_time',
        experience_level: 'entry',
        required_skills: ['HTML', 'CSS', 'JavaScript', 'React'],
        preferred_skills: ['TypeScript', 'Git', 'Responsive Design'],
        required_certifications: [],
        salary_range: { min: 300000, max: 450000, currency: 'ZAR' },
        benefits: ['Medical Aid', 'Mentorship Program', 'Learning Budget'],
        requirements: ['Computer Science degree', 'Portfolio of projects'],
        responsibilities: ['Build user interfaces', 'Learn from senior developers'],
        status: 'active',
        priority: 'low',
        applications_count: 0,
        matches_count: 0
      }
    ]);

    console.log('Created projects');

    // Create Applications with AI insights
    const applications = await Application.insertMany([
      {
        applicant_id: users[2]._id, // John Doe
        project_id: projects[0]._id, // Senior React Developer
        status: 'pending',
        match_score: 85,
        ai_insights: {
          strengths: ['Strong React skills', 'TypeScript experience', 'Full-stack knowledge'],
          gaps: ['GraphQL experience needed', 'Senior-level experience'],
          recommendations: ['Complete GraphQL course', 'Lead more projects'],
          match_reasons: ['React expertise matches requirement', 'TypeScript proficiency']
        }
      },
      {
        applicant_id: users[3]._id, // Jane Smith
        project_id: projects[1]._id, // Data Scientist
        status: 'interviewed',
        match_score: 95,
        ai_insights: {
          strengths: ['Excellent Python skills', 'Strong ML background', 'Advanced degree'],
          gaps: ['Limited cloud experience'],
          recommendations: ['AWS certification'],
          match_reasons: ['Perfect skill match', 'Experience level aligns', 'Educational background fits']
        },
        interview_scheduled: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        applicant_id: users[4]._id, // David Wilson
        project_id: projects[2]._id, // React Native Developer
        status: 'shortlisted',
        match_score: 92,
        ai_insights: {
          strengths: ['Expert React Native skills', 'Cross-platform experience', 'Strong portfolio'],
          gaps: ['Limited fintech experience'],
          recommendations: ['Learn about financial regulations'],
          match_reasons: ['Perfect technical match', 'Experience level fits', 'Mobile expertise']
        }
      },
      {
        applicant_id: users[5]._id, // Lisa Brown
        project_id: projects[3]._id, // Junior Frontend Developer
        status: 'pending',
        match_score: 88,
        ai_insights: {
          strengths: ['Solid foundation skills', 'Recent graduate', 'Eager to learn'],
          gaps: ['Limited professional experience'],
          recommendations: ['Build more portfolio projects'],
          match_reasons: ['Entry-level perfect match', 'Core skills align', 'Growth potential']
        }
      }
    ]);

    console.log('Created applications');

    // Update project application counts
    await Project.findByIdAndUpdate(projects[0]._id, { applications_count: 1, matches_count: 1 });
    await Project.findByIdAndUpdate(projects[1]._id, { applications_count: 1, matches_count: 1 });
    await Project.findByIdAndUpdate(projects[2]._id, { applications_count: 1, matches_count: 1 });
    await Project.findByIdAndUpdate(projects[3]._id, { applications_count: 1, matches_count: 1 });

    // Create Notifications
    await Notification.insertMany([
      {
        user_id: users[0]._id, // Sarah (Recruiter)
        type: 'new_match',
        title: 'New Application',
        message: 'John Doe applied to Senior React Developer with 85% match',
        data: { applicationId: applications[0]._id, matchScore: 85 },
        read: false
      },
      {
        user_id: users[2]._id, // John (Applicant)
        type: 'application_status',
        title: 'Application Submitted',
        message: 'Your application for Senior React Developer has been submitted',
        data: { applicationId: applications[0]._id },
        read: false
      },
      {
        user_id: users[3]._id, // Jane (Applicant)
        type: 'interview_scheduled',
        title: 'Interview Scheduled',
        message: 'Your interview for Data Scientist has been scheduled',
        data: { applicationId: applications[1]._id },
        read: false
      },
      {
        user_id: users[5]._id, // Lisa (Applicant)
        type: 'skill_recommendation',
        title: 'Skill Recommendation',
        message: 'Consider learning TypeScript to improve your job prospects',
        data: { skill: 'TypeScript' },
        read: false
      }
    ]);

    console.log('Created notifications');
    console.log('Seed data created successfully!');
    
    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`Users: ${users.length}`);
    console.log(`Projects: ${projects.length}`);
    console.log(`Applications: ${applications.length}`);
    console.log('\nTest Accounts:');
    console.log('Recruiters:');
    console.log('- sarah.johnson@techcorp.com (TechCorp Solutions)');
    console.log('- mike.chen@innovatelab.co.za (InnovateLab)');
    console.log('\nApplicants:');
    console.log('- john.doe@email.com (Mid-level Full-stack)');
    console.log('- jane.smith@email.com (Senior Data Scientist)');
    console.log('- david.wilson@email.com (Senior Mobile Developer)');
    console.log('- lisa.brown@email.com (Junior Frontend Developer)');

  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();