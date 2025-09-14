import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import type { Issue } from "@/types";
import IssueCard from "./IssueCard";
import { 
  Search, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Filter,
  TrendingUp,
  MessageSquare,
  Camera,
  ThumbsUp,
  Eye
} from "lucide-react";

interface TrackingSectionProps {
  language: string;
}

const TrackingSection = ({ language }: TrackingSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch issues from Supabase
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration (keeping as fallback)
  const mockIssues = [
    {
      id: "CIV-2024-1234",
      title: "Pothole on Main Street",
      category: "road",
      status: "in-progress",
      urgency: "high",
      location: "Main Street, Block A",
      reportedBy: "John Doe",
      reportedDate: "2024-01-15",
      lastUpdate: "2024-01-18",
      progress: 65,
      votes: 24,
      comments: 8,
      images: 3,
      description: "Large pothole causing traffic issues and vehicle damage.",
      timeline: [
        { date: "2024-01-15", status: "reported", description: "Issue reported by citizen" },
        { date: "2024-01-16", status: "verified", description: "Verified by municipal inspector" },
        { date: "2024-01-17", status: "assigned", description: "Assigned to Road Maintenance Department" },
        { date: "2024-01-18", status: "in-progress", description: "Work started - materials ordered" }
      ]
    },
    {
      id: "CIV-2024-1235",
      title: "Broken streetlight at Park Avenue",
      category: "lighting",
      status: "resolved",
      urgency: "medium",
      location: "Park Avenue, Near Community Center",
      reportedBy: "Jane Smith",
      reportedDate: "2024-01-10",
      lastUpdate: "2024-01-14",
      progress: 100,
      votes: 12,
      comments: 5,
      images: 2,
      description: "Street light not working, creating safety concerns for pedestrians.",
      timeline: [
        { date: "2024-01-10", status: "reported", description: "Issue reported by citizen" },
        { date: "2024-01-11", status: "verified", description: "Verified by municipal inspector" },
        { date: "2024-01-12", status: "assigned", description: "Assigned to Electrical Department" },
        { date: "2024-01-14", status: "resolved", description: "Street light repaired and tested" }
      ]
    },
    {
      id: "CIV-2024-1236",
      title: "Overflowing garbage bin",
      category: "waste",
      status: "new",
      urgency: "low",
      location: "Market Square",
      reportedBy: "Alice Johnson",
      reportedDate: "2024-01-20",
      lastUpdate: "2024-01-20",
      progress: 10,
      votes: 7,
      comments: 2,
      images: 1,
      description: "Public garbage bin overflowing, attracting pests and creating unsanitary conditions.",
      timeline: [
        { date: "2024-01-20", status: "reported", description: "Issue reported by citizen" }
      ]
    }
  ];

  const translations = {
    en: {
      title: "Track Civic Issues",
      subtitle: "Monitor the progress of reported issues and stay updated on resolutions",
      search: {
        placeholder: "Search by tracking ID, location, or issue type...",
        button: "Search Issues"
      },
      tabs: {
        myIssues: "My Issues",
        allIssues: "All Issues",
        analytics: "Analytics"
      },
      filters: {
        all: "All Status",
        new: "New",
        verified: "Verified", 
        assigned: "Assigned",
        inProgress: "In Progress",
        resolved: "Resolved",
        closed: "Closed"
      },
      status: {
        new: "New",
        verified: "Verified",
        assigned: "Assigned",
        "in-progress": "In Progress",
        resolved: "Resolved",
        closed: "Closed",
        pending: "Pending"
      },
      urgency: {
        low: "Low",
        medium: "Medium",
        high: "High",
        critical: "Critical"
      },
      issueCard: {
        reportedBy: "Reported by",
        location: "Location",
        reportedOn: "Reported on",
        lastUpdate: "Last update",
        progress: "Progress",
        votes: "votes",
        comments: "comments", 
        images: "images",
        viewDetails: "View Details",
        upvote: "Upvote"
      },
      timeline: {
        title: "Progress Timeline",
        reported: "Reported",
        verified: "Verified",
        assigned: "Assigned", 
        inProgress: "In Progress",
        resolved: "Resolved",
        closed: "Closed"
      },
      stats: {
        totalIssues: "Total Issues",
        resolvedIssues: "Resolved",
        avgResolutionTime: "Avg Resolution Time",
        userReports: "Your Reports"
      }
    },
    hi: {
      title: "नागरिक समस्याओं को ट्रैक करें",
      subtitle: "रिपोर्ट की गई समस्याओं की प्रगति पर नज़र रखें और समाधान के बारे में अपडेट रहें",
      search: {
        placeholder: "ट्रैकिंग आईडी, स्थान, या समस्या प्रकार से खोजें...",
        button: "समस्याएं खोजें"
      },
      tabs: {
        myIssues: "मेरी समस्याएं",
        allIssues: "सभी समस्याएं",
        analytics: "विश्लेषण"
      },
      filters: {
        all: "सभी स्थिति",
        new: "नई",
        verified: "सत्यापित",
        assigned: "सौंपी गई",
        inProgress: "प्रगति में",
        resolved: "हल हो गई",
        closed: "बंद"
      },
      status: {
        new: "नई",
        verified: "सत्यापित",
        assigned: "सौंपी गई",
        "in-progress": "प्रगति में",
        resolved: "हल हो गई",
        closed: "बंद",
        pending: "प्रतीक्षारत"
      },
      urgency: {
        low: "कम",
        medium: "मध्यम",
        high: "उच्च",
        critical: "गंभीर"
      },
      issueCard: {
        reportedBy: "द्वारा रिपोर्ट",
        location: "स्थान",
        reportedOn: "रिपोर्ट की तारीख",
        lastUpdate: "अंतिम अपडेट",
        progress: "प्रगति",
        votes: "वोट",
        comments: "टिप्पणियां",
        images: "चित्र",
        viewDetails: "विवरण देखें",
        upvote: "अपवोट"
      },
      timeline: {
        title: "प्रगति समयसीमा",
        reported: "रिपोर्ट की गई",
        verified: "सत्यापित",
        assigned: "सौंपी गई",
        inProgress: "प्रगति में",
        resolved: "हल हो गई",
        closed: "बंद"
      },
      stats: {
        totalIssues: "कुल समस्याएं",
        resolvedIssues: "हल की गई",
        avgResolutionTime: "औसत समाधान समय",
        userReports: "आपकी रिपोर्टें"
      }
    },
    mr: {
      title: "नागरिक समस्यांचा मागोवा घ्या",
      subtitle: "अहवाल दिलेल्या समस्यांची प्रगती पहा आणि निराकरणाच्या अपडेटसह राहा",
      search: {
        placeholder: "ट्रॅकिंग आयडी, स्थान, किंवा समस्या प्रकाराने शोधा...",
        button: "समस्या शोधा"
      },
      tabs: {
        myIssues: "माझ्या समस्या",
        allIssues: "सर्व समस्या",
        analytics: "विश्लेषण"
      },
      filters: {
        all: "सर्व स्थिती",
        new: "नवीन",
        verified: "पडताळलेले",
        assigned: "नियुक्त",
        inProgress: "प्रगतीत",
        resolved: "निराकरण झाले",
        closed: "बंद"
      },
      status: {
        new: "नवीन",
        verified: "पडताळलेले",
        assigned: "नियुक्त",
        "in-progress": "प्रगतीत",
        resolved: "निराकरण झाले",
        closed: "बंद",
        pending: "प्रलंबित"
      },
      urgency: {
        low: "कमी",
        medium: "मध्यम",
        high: "उच्च",
        critical: "गंभीर"
      },
      issueCard: {
        reportedBy: "द्वारे अहवाल",
        location: "स्थान",
        reportedOn: "अहवालाची तारीख",
        lastUpdate: "शेवटचे अपडेट",
        progress: "प्रगती",
        votes: "मते",
        comments: "टिप्पण्या",
        images: "चित्रे",
        viewDetails: "तपशील पहा",
        upvote: "अपवोट"
      },
      timeline: {
        title: "प्रगती टाइमलाइन",
        reported: "अहवाल दिला",
        verified: "पडताळले",
        assigned: "नियुक्त",
        inProgress: "प्रगतीत",
        resolved: "निराकरण झाले",
        closed: "बंद"
      },
      stats: {
        totalIssues: "एकूण समस्या",
        resolvedIssues: "निराकरण झाले",
        avgResolutionTime: "सरासरी निराकरण वेळ",
        userReports: "तुमचे अहवाल"
      }
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const displayIssues = issues.length > 0 ? issues : mockIssues;
  
  const filteredIssues = displayIssues.filter((issue: any) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (issue.location && issue.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || issue.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const userIssues = filteredIssues.filter((issue: any) => 
    user && (issue.user_id === user.id || issue.reportedBy === user.email)
  );

  return (
    <section id="track" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t.title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Search and Filters */}
          <Card className="civic-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t.search.placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="whitespace-nowrap">
                    <Filter className="h-4 w-4 mr-2" />
                    {t.filters.all}
                  </Button>
                  <Button variant="civic">
                    {t.search.button}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="allIssues" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="myIssues">{t.tabs.myIssues}</TabsTrigger>
              <TabsTrigger value="allIssues">{t.tabs.allIssues}</TabsTrigger>
              <TabsTrigger value="analytics">{t.tabs.analytics}</TabsTrigger>
            </TabsList>

            {/* My Issues Tab */}
            <TabsContent value="myIssues" className="space-y-6">
              {!user ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold mb-2">Sign in to view your issues</h3>
                    <p className="text-muted-foreground">Please sign in to track your reported issues</p>
                  </CardContent>
                </Card>
              ) : userIssues.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold mb-2">No issues reported yet</h3>
                    <p className="text-muted-foreground">You haven't reported any issues yet. Submit your first report!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {userIssues.map((issue, index) => (
                    <IssueCard key={issue.id} issue={issue} index={index} t={t} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* All Issues Tab */}
            <TabsContent value="allIssues" className="space-y-6">
              {loading ? (
                <div className="grid gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="animate-pulse space-y-4">
                          <div className="h-4 bg-muted rounded w-1/4"></div>
                          <div className="h-6 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-full"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredIssues.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold mb-2">No issues found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredIssues.map((issue, index) => (
                    <IssueCard key={issue.id} issue={issue} index={index} t={t} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="civic-shadow">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{filteredIssues.length}</div>
                    <div className="text-sm text-muted-foreground">{t.stats.totalIssues}</div>
                  </CardContent>
                </Card>
                
                <Card className="civic-shadow">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {filteredIssues.filter(issue => issue.status === 'resolved').length}
                    </div>
                    <div className="text-sm text-muted-foreground">{t.stats.resolvedIssues}</div>
                  </CardContent>
                </Card>
                
                <Card className="civic-shadow">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold">3.2</div>
                    <div className="text-sm text-muted-foreground">{t.stats.avgResolutionTime}</div>
                  </CardContent>
                </Card>
                
                <Card className="civic-shadow">
                  <CardContent className="p-6 text-center">
                    <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {user ? userIssues.length : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">{t.stats.userReports}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default TrackingSection;
