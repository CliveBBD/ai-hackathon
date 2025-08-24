import { Button } from "../components/ui/button";
import { Brain, Users, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AfroServe
          </span>
        </div>

        {/* <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
            Features
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-smooth">
            How It Works
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-smooth">
            Pricing
          </a>
        </nav> */}

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/auth')}>Sign In</Button>
          <Button variant="enterprise" onClick={() => navigate('/auth')}>Get Started</Button>
        </div>
      </div>
    </header>
  );
};