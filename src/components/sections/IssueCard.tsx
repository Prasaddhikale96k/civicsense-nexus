import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  ThumbsUp, 
  MessageSquare, 
  Camera, 
  Eye 
} from "lucide-react";
import type { Issue } from "@/types";

interface IssueCardProps {
  issue: any; // Using any for now to handle both real and mock data
  index: number;
  t: any;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, index, t }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'status-new';
      case 'verified': return 'bg-blue-500';
      case 'assigned': return 'bg-purple-500';
      case 'in-progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      case 'pending': return 'status-new';
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const reportedBy = issue.profiles?.full_name || issue.reportedBy || 'Anonymous';
  const reportedDate = issue.created_at ? formatDate(issue.created_at) : issue.reportedDate;
  const lastUpdate = issue.updated_at ? formatDate(issue.updated_at) : issue.lastUpdate;

  return (
    <Card className="interactive-card civic-shadow animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
      <CardContent className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Issue Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {issue.id.substring(0, 8)}...
                  </Badge>
                  <Badge className={`text-white ${getStatusColor(issue.status)}`}>
                    {t.status[issue.status as keyof typeof t.status] || issue.status}
                  </Badge>
                  {issue.urgency && (
                    <Badge className={`text-white ${getUrgencyColor(issue.urgency)}`}>
                      {t.urgency[issue.urgency as keyof typeof t.urgency] || issue.urgency}
                    </Badge>
                  )}
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
                  <span className="font-medium">{reportedBy}</span>
                </div>
                {issue.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{t.issueCard.location}:</span>
                    <span className="font-medium">{issue.location}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{t.issueCard.reportedOn}:</span>
                  <span className="font-medium">{reportedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{t.issueCard.lastUpdate}:</span>
                  <span className="font-medium">{lastUpdate}</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            {issue.progress !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t.issueCard.progress}</span>
                  <span className="text-sm text-muted-foreground">{issue.progress}%</span>
                </div>
                <Progress value={issue.progress} className="h-2" />
              </div>
            )}

            {/* Engagement Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {issue.votes !== undefined && (
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{issue.votes} {t.issueCard.votes}</span>
                </div>
              )}
              {issue.comments !== undefined && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{issue.comments} {t.issueCard.comments}</span>
                </div>
              )}
              {issue.images !== undefined && (
                <div className="flex items-center gap-1">
                  <Camera className="h-4 w-4" />
                  <span>{issue.images} {t.issueCard.images}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          {issue.timeline && (
            <div className="space-y-4">
              <h4 className="font-semibold">{t.timeline.title}</h4>
              <div className="space-y-3">
                {issue.timeline.map((event: any, eventIndex: number) => (
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
          )}
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
  );
};

export default IssueCard;