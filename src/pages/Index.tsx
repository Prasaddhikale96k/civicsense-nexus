import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import ReportSection from "@/components/sections/ReportSection";
import TrackingSection from "@/components/sections/TrackingSection";
import AnalyticsSection from "@/components/sections/AnalyticsSection";
import AISection from "@/components/sections/AISection";

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
      />
      
      <main>
        <HeroSection language={language} />
        <ReportSection language={language} />
        <TrackingSection language={language} />
        <AISection language={language} />
        <AnalyticsSection language={language} />
      </main>

      <footer className="py-12 bg-muted/30 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 CivicConnect. Making cities better, together.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
