import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  // Mock data for demonstration
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
        closed: "Closed"
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
        closed: "बंद"
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
        closed: "बंद"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'status-new';
      case 'verified': return 'bg-blue-500';
      case 'assigned': return 'bg-purple-500';
      case 'in-progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredIssues = mockIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || issue.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

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

            {/* All Issues Tab */}
            <TabsContent value="allIssues" className="space-y-6">
              <div className="grid gap-6">
                {filteredIssues.map((issue, index) => (
                  <Card key={issue.id} className="interactive-card civic-shadow animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6">
                      <div className="grid lg:grid-cols-3 gap-6">
                        {/* Issue Info */}
                        <div className="lg:col-span-2 space-y-4">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono">
                                  {issue.id}
                                </Badge>
                                <Badge className={`text-white ${getStatusColor(issue.status)}`}>
                                  {t.status[issue.status as keyof typeof t.status]}
                                </Badge>
                                <Badge className={`text-white ${getUrgencyColor(issue.urgency)}`}>
                                  {t.urgency[issue.urgency as keyof typeof t.urgency]}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-semibold">{issue.title}</h3>
                              <p className="text-muted-foreground">{issue.description}</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{t.issueCard.reportedBy}:</span>
                                <span className="font-medium">{issue.reportedBy}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{t.issueCard.location}:</span>
                                <span className="font-medium">{issue.location}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{t.issueCard.reportedOn}:</span>
                                <span className="font-medium">{issue.reportedDate}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{t.issueCard.lastUpdate}:</span>
                                <span className="font-medium">{issue.lastUpdate}</span>
                              </div>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{t.issueCard.progress}</span>
                              <span className="text-sm text-muted-foreground">{issue.progress}%</span>
                            </div>
                            <Progress value={issue.progress} className="h-2" />
                          </div>

                          {/* Engagement Stats */}
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{issue.votes} {t.issueCard.votes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{issue.comments} {t.issueCard.comments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Camera className="h-4 w-4" />
                              <span>{issue.images} {t.issueCard.images}</span>
                            </div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-4">
                          <h4 className="font-semibold">{t.timeline.title}</h4>
                          <div className="space-y-3">
                            {issue.timeline.map((event, eventIndex) => (
                              <div key={eventIndex} className="flex items-start gap-3">
                                <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(event.status)}`}></div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium capitalize">
                                      {t.status[event.status as keyof typeof t.status] || event.status}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{event.date}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{event.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center mt-6 pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          {t.issueCard.upvote}
                        </Button>
                        <Button variant="civic" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          {t.issueCard.viewDetails}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* My Issues Tab */}
            <TabsContent value="myIssues">
              <Card className="civic-shadow">
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Sign in to view your issues</h3>
                      <p className="text-muted-foreground">Track your reported issues and their progress</p>
                    </div>
                    <Button variant="civic">Sign In</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="civic-shadow">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">247</div>
                    <div className="text-sm text-muted-foreground">{t.stats.totalIssues}</div>
                  </CardContent>
                </Card>
                
                <Card className="civic-shadow">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold">189</div>
                    <div className="text-sm text-muted-foreground">{t.stats.resolvedIssues}</div>
                  </CardContent>
                </Card>
                
                <Card className="civic-shadow">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">4.2</div>
                    <div className="text-sm text-muted-foreground">{t.stats.avgResolutionTime} (days)</div>
                  </CardContent>
                </Card>
                
                <Card className="civic-shadow">
                  <CardContent className="p-6 text-center">
                    <User className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold">12</div>
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