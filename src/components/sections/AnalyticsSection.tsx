import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  ThumbsUp,
  MessageSquare
} from "lucide-react";

interface AnalyticsSectionProps {
  language: string;
}

const AnalyticsSection = ({ language }: AnalyticsSectionProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");

  // Mock analytics data
  const issueTypeData = [
    { name: "Road Damage", value: 35, count: 87, color: "#3B82F6" },
    { name: "Street Lighting", value: 23, count: 57, color: "#EF4444" },
    { name: "Waste Management", value: 18, count: 45, color: "#10B981" },
    { name: "Water Issues", value: 12, count: 30, color: "#F59E0B" },
    { name: "Traffic", value: 8, count: 20, color: "#8B5CF6" },
    { name: "Other", value: 4, count: 10, color: "#6B7280" }
  ];

  const monthlyTrendsData = [
    { month: "Jan", reported: 45, resolved: 38, pending: 7 },
    { month: "Feb", reported: 52, resolved: 44, pending: 8 },
    { month: "Mar", reported: 48, resolved: 51, pending: 5 },
    { month: "Apr", reported: 61, resolved: 48, pending: 13 },
    { month: "May", reported: 55, resolved: 59, pending: 9 },
    { month: "Jun", reported: 67, resolved: 62, pending: 14 },
  ];

  const resolutionTimeData = [
    { category: "Road Issues", avgTime: 5.2, target: 7.0 },
    { category: "Lighting", avgTime: 2.1, target: 3.0 },
    { category: "Waste", avgTime: 1.8, target: 2.0 },
    { category: "Water", avgTime: 4.5, target: 5.0 },
    { category: "Traffic", avgTime: 3.2, target: 4.0 },
  ];

  const topLocationsData = [
    { location: "Downtown", issues: 45, resolved: 38, percentage: 84 },
    { location: "Market District", issues: 32, resolved: 29, percentage: 91 },
    { location: "Residential Zone A", issues: 28, resolved: 25, percentage: 89 },
    { location: "Industrial Area", issues: 24, resolved: 18, percentage: 75 },
    { location: "Park Avenue", issues: 19, resolved: 17, percentage: 89 },
  ];

  const translations = {
    en: {
      title: "Civic Analytics Dashboard",
      subtitle: "Data-driven insights for better city governance and issue resolution",
      tabs: {
        overview: "Overview",
        trends: "Trends",
        performance: "Performance",
        insights: "Insights"
      },
      metrics: {
        totalReports: "Total Reports",
        resolvedIssues: "Resolved Issues",
        avgResolutionTime: "Avg Resolution Time",
        citizenSatisfaction: "Citizen Satisfaction",
        activeReporters: "Active Reporters",
        pendingIssues: "Pending Issues"
      },
      charts: {
        issuesByType: "Issues by Type",
        monthlyTrends: "Monthly Trends",
        resolutionPerformance: "Resolution Performance vs Targets",
        topLocations: "Top Issue Locations",
        reported: "Reported",
        resolved: "Resolved",
        pending: "Pending",
        days: "days",
        target: "Target",
        actual: "Actual"
      },
      insights: {
        title: "AI-Powered Insights",
        predictions: "Predictive Analytics",
        hotspots: "Issue Hotspots",
        recommendations: "Recommendations"
      },
      kpi: {
        resolutionRate: "Resolution Rate",
        responseTime: "Avg Response Time",
        satisfaction: "Satisfaction Score",
        engagement: "Community Engagement"
      }
    },
    hi: {
      title: "नागरिक विश्लेषण डैशबोर्ड",
      subtitle: "बेहतर शहर शासन और समस्या समाधान के लिए डेटा-संचालित अंतर्दृष्टि",
      tabs: {
        overview: "अवलोकन",
        trends: "रुझान",
        performance: "प्रदर्शन",
        insights: "अंतर्दृष्टि"
      },
      metrics: {
        totalReports: "कुल रिपोर्टें",
        resolvedIssues: "हल की गई समस्याएं",
        avgResolutionTime: "औसत समाधान समय",
        citizenSatisfaction: "नागरिक संतुष्टि",
        activeReporters: "सक्रिय रिपोर्टर",
        pendingIssues: "लंबित समस्याएं"
      },
      charts: {
        issuesByType: "प्रकार के अनुसार समस्याएं",
        monthlyTrends: "मासिक रुझान",
        resolutionPerformance: "लक्ष्य बनाम समाधान प्रदर्शन",
        topLocations: "शीर्ष समस्या स्थान",
        reported: "रिपोर्ट की गई",
        resolved: "हल की गई",
        pending: "लंबित",
        days: "दिन",
        target: "लक्ष्य",
        actual: "वास्तविक"
      },
      insights: {
        title: "AI-संचालित अंतर्दृष्टि",
        predictions: "भविष्यवाणी विश्लेषण",
        hotspots: "समस्या हॉटस्पॉट",
        recommendations: "सिफारिशें"
      },
      kpi: {
        resolutionRate: "समाधान दर",
        responseTime: "औसत प्रतिक्रिया समय",
        satisfaction: "संतुष्टि स्कोर",
        engagement: "सामुदायिक सहभागिता"
      }
    },
    mr: {
      title: "नागरिक विश्लेषण डॅशबोर्ड",
      subtitle: "चांगल्या शहर शासन आणि समस्या निराकरणासाठी डेटा-चालित अंतर्दृष्टी",
      tabs: {
        overview: "विहंगावलोकन",
        trends: "ट्रेंड",
        performance: "कामगिरी",
        insights: "अंतर्दृष्टी"
      },
      metrics: {
        totalReports: "एकूण अहवाल",
        resolvedIssues: "निराकरण झालेल्या समस्या",
        avgResolutionTime: "सरासरी निराकरण वेळ",
        citizenSatisfaction: "नागरिक समाधान",
        activeReporters: "सक्रिय रिपोर्टर",
        pendingIssues: "प्रलंबित समस्या"
      },
      charts: {
        issuesByType: "प्रकारानुसार समस्या",
        monthlyTrends: "मासिक ट्रेंड",
        resolutionPerformance: "लक्ष्य विरुद्ध निराकरण कामगिरी",
        topLocations: "शीर्ष समस्या स्थाने",
        reported: "अहवाल दिला",
        resolved: "निराकरण झाले",
        pending: "प्रलंबित",
        days: "दिवस",
        target: "लक्ष्य",
        actual: "वास्तविक"
      },
      insights: {
        title: "AI-संचालित अंतर्दृष्टी",
        predictions: "भविष्यसूचक विश्लेषण",
        hotspots: "समस्या हॉटस्पॉट",
        recommendations: "शिफारसी"
      },
      kpi: {
        resolutionRate: "निराकरण दर",
        responseTime: "सरासरी प्रतिसाद वेळ",
        satisfaction: "समाधान स्कोर",
        engagement: "समुदायिक सहभाग"
      }
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <section id="analytics" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t.title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{t.tabs.overview}</TabsTrigger>
              <TabsTrigger value="trends">{t.tabs.trends}</TabsTrigger>
              <TabsTrigger value="performance">{t.tabs.performance}</TabsTrigger>
              <TabsTrigger value="insights">{t.tabs.insights}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="civic-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t.metrics.totalReports}</p>
                        <p className="text-3xl font-bold">1,247</p>
                        <p className="text-xs text-green-600">+12% from last month</p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="civic-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t.metrics.resolvedIssues}</p>
                        <p className="text-3xl font-bold">1,089</p>
                        <p className="text-xs text-green-600">87.3% resolution rate</p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-secondary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="civic-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t.metrics.avgResolutionTime}</p>
                        <p className="text-3xl font-bold">3.2</p>
                        <p className="text-xs text-green-600">-0.5 days improvement</p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="civic-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t.metrics.citizenSatisfaction}</p>
                        <p className="text-3xl font-bold">4.6</p>
                        <p className="text-xs text-green-600">+0.2 from last month</p>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <ThumbsUp className="h-6 w-6 text-secondary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Issue Types Pie Chart */}
                <Card className="civic-shadow">
                  <CardHeader>
                    <CardTitle>{t.charts.issuesByType}</CardTitle>
                    <CardDescription>Distribution of reported issues by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={issueTypeData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {issueTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Locations */}
                <Card className="civic-shadow">
                  <CardHeader>
                    <CardTitle>{t.charts.topLocations}</CardTitle>
                    <CardDescription>Areas with highest issue reporting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topLocationsData.map((location, index) => (
                        <div key={location.location} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">#{index + 1}</Badge>
                              <span className="font-medium">{location.location}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {location.resolved}/{location.issues} resolved
                            </div>
                          </div>
                          <Progress value={location.percentage} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{location.percentage}% resolution rate</span>
                            <span>{location.issues} total issues</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-6">
              <Card className="civic-shadow">
                <CardHeader>
                  <CardTitle>{t.charts.monthlyTrends}</CardTitle>
                  <CardDescription>Issue reporting and resolution trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="reported" 
                          stackId="1"
                          stroke="#3B82F6" 
                          fill="#3B82F6" 
                          fillOpacity={0.6}
                          name={t.charts.reported}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="resolved" 
                          stackId="2"
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.6}
                          name={t.charts.resolved}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <Card className="civic-shadow">
                <CardHeader>
                  <CardTitle>{t.charts.resolutionPerformance}</CardTitle>
                  <CardDescription>Actual vs target resolution times by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={resolutionTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="avgTime" fill="#3B82F6" name={t.charts.actual} />
                        <Bar dataKey="target" fill="#10B981" name={t.charts.target} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* KPI Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="civic-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="space-y-2">
                      <Target className="h-8 w-8 text-primary mx-auto" />
                      <div className="text-2xl font-bold">87.3%</div>
                      <div className="text-sm text-muted-foreground">{t.kpi?.resolutionRate || "Resolution Rate"}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="civic-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="space-y-2">
                      <Clock className="h-8 w-8 text-secondary mx-auto" />
                      <div className="text-2xl font-bold">2.1h</div>
                      <div className="text-sm text-muted-foreground">{t.kpi?.responseTime || "Response Time"}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="civic-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="space-y-2">
                      <ThumbsUp className="h-8 w-8 text-primary mx-auto" />
                      <div className="text-2xl font-bold">4.6/5</div>
                      <div className="text-sm text-muted-foreground">{t.kpi?.satisfaction || "Satisfaction"}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="civic-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="space-y-2">
                      <Users className="h-8 w-8 text-secondary mx-auto" />
                      <div className="text-2xl font-bold">2,341</div>
                      <div className="text-sm text-muted-foreground">{t.kpi?.engagement || "Engagement"}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="civic-shadow">
                  <CardHeader>
                    <CardTitle>{t.insights?.predictions || "Predictive Analytics"}</CardTitle>
                    <CardDescription>AI-powered predictions and forecasts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900 dark:text-blue-100">Trend Prediction</span>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Road damage reports are expected to increase by 23% next month due to seasonal weather patterns.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-5 w-5 text-amber-600" />
                        <span className="font-medium text-amber-900 dark:text-amber-100">Hotspot Alert</span>
                      </div>
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        Downtown area showing 34% increase in issue reports. Recommend increased monitoring.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900 dark:text-green-100">Performance Insight</span>
                      </div>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Street lighting team exceeded targets by 15%. Consider resource optimization.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="civic-shadow">
                  <CardHeader>
                    <CardTitle>{t.insights?.recommendations || "Recommendations"}</CardTitle>
                    <CardDescription>Data-driven suggestions for improvement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <div className="flex-1">
                          <h4 className="font-medium">Optimize Resource Allocation</h4>
                          <p className="text-sm text-muted-foreground">
                            Redistribute 2 technicians from lighting to road maintenance team based on current demand.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                        <div className="flex-1">
                          <h4 className="font-medium">Preventive Maintenance</h4>
                          <p className="text-sm text-muted-foreground">
                            Schedule proactive inspections in Market District to prevent issue escalation.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <div className="flex-1">
                          <h4 className="font-medium">Citizen Engagement</h4>
                          <p className="text-sm text-muted-foreground">
                            Launch awareness campaign in areas with low reporting rates to improve coverage.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                        <div className="flex-1">
                          <h4 className="font-medium">Technology Integration</h4>
                          <p className="text-sm text-muted-foreground">
                            Implement IoT sensors for real-time monitoring of frequently reported issues.
                          </p>
                        </div>
                      </div>
                    </div>
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

export default AnalyticsSection;