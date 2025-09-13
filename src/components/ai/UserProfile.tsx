import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { 
  User, 
  History, 
  Settings, 
  Download, 
  Trash2, 
  Bell, 
  Shield,
  Clock,
  MessageSquare,
  BarChart,
  Archive
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserInteraction {
  id: string;
  query_text: string;
  response_text: string;
  created_at: string;
  response_type: string;
  ai_confidence_score: number;
  sources_used: any;
}

interface UserPreferences {
  preferred_response_style: string;
  topics_of_interest: string[];
  notification_preferences: any;
  data_retention_days: number;
  allow_data_collection: boolean;
  language_preference: string;
}

interface TopicSubscription {
  id: string;
  topic: string;
  keywords: string[];
  notification_frequency: string;
  is_active: boolean;
}

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferred_response_style: 'balanced',
    topics_of_interest: [],
    notification_preferences: { email: false, push: false, in_app: true },
    data_retention_days: 365,
    allow_data_collection: true,
    language_preference: 'en'
  });
  const [subscriptions, setSubscriptions] = useState<TopicSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load interactions
      const { data: interactionsData } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (interactionsData) setInteractions(interactionsData);

      // Load preferences
      const { data: preferencesData } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (preferencesData) {
        setPreferences(preferencesData);
      } else {
        // Create default preferences
        await createDefaultPreferences(user.id);
      }

      // Load subscriptions
      const { data: subscriptionsData } = await supabase
        .from('topic_subscriptions')
        .select('*')
        .eq('user_id', user.id);

      if (subscriptionsData) setSubscriptions(subscriptionsData);

    } catch (error) {
      console.error('Failed to load user data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPreferences = async (userId: string) => {
    const { error } = await supabase.from('user_preferences').insert({
      user_id: userId,
      ...preferences
    });

    if (error) {
      console.error('Failed to create default preferences:', error);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newPreferences = { ...preferences, ...updates };
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...newPreferences
        });

      if (error) throw error;

      setPreferences(newPreferences);
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved"
      });
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive"
      });
    }
  };

  const downloadHistory = async () => {
    try {
      const data = {
        interactions,
        preferences,
        subscriptions,
        exported_at: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `civic-assistant-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download complete",
        description: "Your data has been exported"
      });
    } catch (error) {
      console.error('Failed to download history:', error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const clearHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_interactions')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setInteractions([]);
      toast({
        title: "History cleared",
        description: "All interaction history has been deleted"
      });
    } catch (error) {
      console.error('Failed to clear history:', error);
      toast({
        title: "Error",
        description: "Failed to clear history",
        variant: "destructive"
      });
    }
  };

  const toggleSubscription = async (subscriptionId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('topic_subscriptions')
        .update({ is_active: isActive })
        .eq('id', subscriptionId);

      if (error) throw error;

      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId ? { ...sub, is_active: isActive } : sub
        )
      );

      toast({
        title: isActive ? "Subscription enabled" : "Subscription disabled",
        description: `Notifications ${isActive ? 'enabled' : 'disabled'} for this topic`
      });
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          User Profile & Preferences
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Interaction History</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadHistory}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button variant="destructive" size="sm" onClick={clearHistory}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {interactions.map((interaction) => (
                <Card key={interaction.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-sm">{interaction.query_text}</p>
                      <Badge variant="outline" className="text-xs">
                        {interaction.response_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {interaction.response_text}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(interaction.created_at).toLocaleDateString()}
                      </span>
                      {interaction.ai_confidence_score && (
                        <span className="flex items-center gap-1">
                          <BarChart className="w-3 h-3" />
                          {Math.round(interaction.ai_confidence_score * 100)}% confidence
                        </span>
                      )}
                      {interaction.sources_used.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Archive className="w-3 h-3" />
                          {interaction.sources_used.length} sources
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {interactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No interactions yet. Start a conversation with the AI assistant!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="response-style">Response Style</Label>
                <Select
                  value={preferences.preferred_response_style}
                  onValueChange={(value) => updatePreferences({ preferred_response_style: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concise">Concise - Short, direct answers</SelectItem>
                    <SelectItem value="balanced">Balanced - Moderate detail</SelectItem>
                    <SelectItem value="detailed">Detailed - Comprehensive explanations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={preferences.language_preference}
                  onValueChange={(value) => updatePreferences({ language_preference: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="retention">Data Retention (days)</Label>
                <Select
                  value={preferences.data_retention_days.toString()}
                  onValueChange={(value) => updatePreferences({ data_retention_days: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="1095">3 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notification Preferences</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={preferences.notification_preferences.email}
                    onCheckedChange={(checked) => 
                      updatePreferences({
                        notification_preferences: {
                          ...preferences.notification_preferences,
                          email: checked
                        }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={preferences.notification_preferences.push}
                    onCheckedChange={(checked) => 
                      updatePreferences({
                        notification_preferences: {
                          ...preferences.notification_preferences,
                          push: checked
                        }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                  <Switch
                    id="in-app-notifications"
                    checked={preferences.notification_preferences.in_app}
                    onCheckedChange={(checked) => 
                      updatePreferences({
                        notification_preferences: {
                          ...preferences.notification_preferences,
                          in_app: checked
                        }
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Topic Subscriptions</h4>
                
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{subscription.topic}</p>
                      <p className="text-sm text-muted-foreground">
                        {subscription.notification_frequency} updates
                      </p>
                    </div>
                    <Switch
                      checked={subscription.is_active}
                      onCheckedChange={(checked) => toggleSubscription(subscription.id, checked)}
                    />
                  </div>
                ))}

                {subscriptions.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No topic subscriptions yet. Subscribe to topics during conversations!
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Privacy & Data Control</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-collection">Allow Data Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve AI responses by sharing anonymized interaction data
                  </p>
                </div>
                <Switch
                  id="data-collection"
                  checked={preferences.allow_data_collection}
                  onCheckedChange={(checked) => updatePreferences({ allow_data_collection: checked })}
                />
              </div>

              <div className="space-y-3 p-4 border rounded bg-muted/30">
                <h4 className="font-medium">Data Management</h4>
                <p className="text-sm text-muted-foreground">
                  You have full control over your data. You can export or delete your information at any time.
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={downloadHistory}>
                    <Download className="w-4 h-4 mr-1" />
                    Export My Data
                  </Button>
                  <Button variant="destructive" size="sm" onClick={clearHistory}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete All Data
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-2">
                <p>• Your conversations are encrypted and stored securely</p>
                <p>• Data is automatically deleted based on your retention settings</p>
                <p>• You can opt-out of data collection at any time</p>
                <p>• We never sell or share your personal information</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserProfile;