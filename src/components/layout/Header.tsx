import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, MapPin, Bell, User, Globe, Moon, Sun } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
}

const Header = ({ darkMode, setDarkMode, language, setLanguage }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const translations = {
    en: {
      title: "CivicConnect",
      nav: {
        home: "Home",
        report: "Report Issue",
        track: "Track Issues",
        analytics: "Analytics",
        profile: "Profile",
      },
      buttons: {
        signIn: "Sign In",
        reportIssue: "Report Issue",
      },
    },
    hi: {
      title: "सिविककनेक्ट",
      nav: {
        home: "होम",
        report: "समस्या रिपोर्ट करें",
        track: "समस्याओं को ट्रैक करें",
        analytics: "विश्लेषण",
        profile: "प्रोफाइल",
      },
      buttons: {
        signIn: "साइन इन",
        reportIssue: "समस्या रिपोर्ट करें",
      },
    },
    mr: {
      title: "सिविककनेक्ट",
      nav: {
        home: "होम",
        report: "समस्या नोंदवा",
        track: "समस्यांचा मागोवा घ्या",
        analytics: "विश्लेषण",
        profile: "प्रोफाइल",
      },
      buttons: {
        signIn: "साइन इन",
        reportIssue: "समस्या नोंदवा",
      },
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const navItems = [
    { key: 'home', label: t.nav.home, href: '#home' },
    { key: 'report', label: t.nav.report, href: '#report' },
    { key: 'track', label: t.nav.track, href: '#track' },
    { key: 'analytics', label: t.nav.analytics, href: '#analytics' },
    { key: 'profile', label: t.nav.profile, href: '#profile' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-civic-gradient">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">{t.title}</span>
          <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
            Beta
          </Badge>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language Selector */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-20 h-8">
              <Globe className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="hi">हि</SelectItem>
              <SelectItem value="mr">मर</SelectItem>
            </SelectContent>
          </Select>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
            className="h-8 w-8 px-0"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative h-8 w-8 px-0">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive"></span>
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
            <User className="h-4 w-4" />
          </Button>

          <Button variant="civic" size="sm">
            {t.buttons.signIn}
          </Button>

          <Button variant="hero" size="sm" className="shadow-glow">
            {t.buttons.reportIssue}
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col space-y-4 mt-6">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="flex items-center space-x-2 text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              
              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Language</span>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">EN</SelectItem>
                      <SelectItem value="hi">हि</SelectItem>
                      <SelectItem value="mr">मर</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Theme</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </div>

                <Button variant="civic" className="w-full">
                  {t.buttons.signIn}
                </Button>

                <Button variant="hero" className="w-full">
                  {t.buttons.reportIssue}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;