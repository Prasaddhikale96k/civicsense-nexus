import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, CheckCircle, Clock, ArrowRight, Play, Star } from "lucide-react";
import heroImage from "@/assets/hero-civic.jpg";

interface HeroSectionProps {
  language: string;
}

const HeroSection = ({ language }: HeroSectionProps) => {
  const [stats, setStats] = useState({
    totalReports: 0,
    resolvedIssues: 0,
    activeUsers: 0,
    avgResponseTime: 0,
  });

  // Animate stats on mount
  useEffect(() => {
    const targetStats = {
      totalReports: 12847,
      resolvedIssues: 9653,
      activeUsers: 3521,
      avgResponseTime: 24,
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        totalReports: Math.floor(targetStats.totalReports * progress),
        resolvedIssues: Math.floor(targetStats.resolvedIssues * progress),
        activeUsers: Math.floor(targetStats.activeUsers * progress),
        avgResponseTime: Math.floor(targetStats.avgResponseTime * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setStats(targetStats);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const translations = {
    en: {
      title: "Making Cities Better",
      subtitle: "Together",
      description: "Report civic issues, track their resolution, and build stronger communities through collective action and transparency.",
      cta: {
        primary: "Report an Issue",
        secondary: "View Demo",
      },
      features: [
        "Real-time issue tracking",
        "AI-powered categorization", 
        "Community-driven solutions",
        "Government transparency",
      ],
      stats: {
        totalReports: "Total Reports",
        resolvedIssues: "Issues Resolved",
        activeUsers: "Active Citizens",
        avgResponseTime: "Avg Response (hrs)",
      },
      trustIndicators: [
        "Trusted by 200+ cities",
        "99.9% uptime guarantee",
        "ISO 27001 certified",
      ],
    },
    hi: {
      title: "शहरों को बेहतर बनाना",
      subtitle: "मिलकर",
      description: "नागरिक समस्याओं की रिपोर्ट करें, उनके समाधान को ट्रैक करें, और सामूहिक कार्रवाई और पारदर्शिता के माध्यम से मजबूत समुदाय बनाएं।",
      cta: {
        primary: "समस्या रिपोर्ट करें",
        secondary: "डेमो देखें",
      },
      features: [
        "रियल-टाइम समस्या ट्रैकिंग",
        "AI-संचालित वर्गीकरण",
        "समुदाय-संचालित समाधान",
        "सरकारी पारदर्शिता",
      ],
      stats: {
        totalReports: "कुल रिपोर्टें",
        resolvedIssues: "हल की गई समस्याएं",
        activeUsers: "सक्रिय नागरिक",
        avgResponseTime: "औसत प्रतिक्रिया (घंटे)",
      },
      trustIndicators: [
        "200+ शहरों द्वारा भरोसा",
        "99.9% अपटाइम गारंटी",
        "ISO 27001 प्रमाणित",
      ],
    },
    mr: {
      title: "शहरे चांगली बनवणे",
      subtitle: "एकत्र",
      description: "नागरिक समस्यांचा अहवाल द्या, त्यांचे निराकरण ट्रॅक करा आणि सामूहिक कृती आणि पारदर्शकतेद्वारे मजबूत समुदाय तयार करा.",
      cta: {
        primary: "समस्या नोंदवा",
        secondary: "डेमो पहा",
      },
      features: [
        "रियल-टाइम समस्या ट्रॅकिंग",
        "AI-संचालित वर्गीकरण",
        "समुदाय-संचालित उपाय",
        "सरकारी पारदर्शकता",
      ],
      stats: {
        totalReports: "एकूण अहवाल",
        resolvedIssues: "सोडवलेल्या समस्या",
        activeUsers: "सक्रिय नागरिक",
        avgResponseTime: "सरासरी प्रतिसाद (तास)",
      },
      trustIndicators: [
        "200+ शहरांचा विश्वास",
        "99.9% अपटाइम हमी",
        "ISO 27001 प्रमाणित",
      ],
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Modern city infrastructure" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 right-10 animate-float">
        <div className="h-16 w-16 rounded-full bg-civic-gradient opacity-20 blur-xl" />
      </div>
      <div className="absolute bottom-20 left-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="h-12 w-12 rounded-full bg-secondary opacity-30 blur-lg" />
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-in-up">
            {/* Trust indicators */}
            <div className="flex flex-wrap gap-2">
              {t.trustIndicators.map((indicator, index) => (
                <Badge key={index} variant="secondary" className="animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Star className="h-3 w-3 mr-1 text-primary" />
                  {indicator}
                </Badge>
              ))}
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-primary">{t.title}</span>
                <br />
                <span className="bg-civic-gradient bg-clip-text text-transparent">
                  {t.subtitle}
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {t.description}
              </p>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-2 gap-3">
              {t.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 animate-fade-in-scale" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="lg" className="group">
                {t.cta.primary}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button variant="outline" size="lg" className="group">
                <Play className="mr-2 h-4 w-4" />
                {t.cta.secondary}
              </Button>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in-scale" style={{ animationDelay: '0.8s' }}>
            <Card className="interactive-card civic-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">{stats.totalReports.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{t.stats.totalReports}</div>
              </CardContent>
            </Card>

            <Card className="interactive-card civic-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-secondary">{stats.resolvedIssues.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{t.stats.resolvedIssues}</div>
              </CardContent>
            </Card>

            <Card className="interactive-card civic-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">{stats.activeUsers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{t.stats.activeUsers}</div>
              </CardContent>
            </Card>

            <Card className="interactive-card civic-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-secondary">{stats.avgResponseTime}</div>
                <div className="text-sm text-muted-foreground">{t.stats.avgResponseTime}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;