import { Button } from "../components/ui/button";
import { ArrowRight, Users, Brain, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-image.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 pt-16">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-slide-up">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary/10 rounded-full border border-primary/20">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Recruitment</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Connect{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Talent
              </span>{" "}
              with{" "}
              <span className="bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
                Opportunity
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              AfroServe uses advanced AI to match job seekers with perfect opportunities
              while providing personalized career coaching to bridge South Africa's skills gap.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="hero" className="group" onClick={() => navigate('/auth')}>
              Join as Recruiter
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/auth')}>
              Find Your Dream Job
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold">10,000+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" />
              <div>
                <div className="font-semibold">95%</div>
                <div className="text-sm text-muted-foreground">Match Success</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-scale">
          <div className="relative rounded-2xl overflow-hidden shadow-enterprise">
            <img
              src={heroImage}
              alt="AI-powered recruitment platform connecting talent with opportunities"
              className="w-full h-auto animate-float"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
          </div>

          {/* Floating cards */}
          <div className="absolute -top-4 -right-4 bg-gradient-card p-4 rounded-xl shadow-medium border border-border/50 animate-float" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm">AI Match Found</div>
                <div className="text-xs text-muted-foreground">98% compatibility</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};