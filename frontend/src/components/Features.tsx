import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Brain, Users, Calendar, TrendingUp, MessageSquare, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Advanced algorithms analyze skills, experience, and certifications to find perfect candidate-job matches.",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Talent Pool Management", 
    description: "Build and manage your talent pipeline with intelligent candidate ranking and insights.",
    color: "text-secondary"
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Automated interview scheduling with AI-powered candidate confirmation and availability checks.",
    color: "text-accent"
  },
  {
    icon: TrendingUp,
    title: "Skill Development",
    description: "Personalized coaching and course recommendations to bridge the skills gap for job seekers.",
    color: "text-primary"
  },
  {
    icon: MessageSquare,
    title: "Real-time Notifications", 
    description: "Stay updated with instant notifications for applications, interviews, and candidate updates.",
    color: "text-secondary"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with OAuth integration and comprehensive data protection.",
    color: "text-accent"
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Modern Recruitment
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your hiring process with AI-driven tools designed to connect the right talent 
            with the right opportunities while addressing South Africa's skills shortage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-enterprise transition-all duration-300 hover:-translate-y-2 border-border/50 bg-gradient-card animate-fade-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};