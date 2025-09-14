import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Send, ThumbsUp, ThumbsDown, Clock, User, Bot, MapPin, BarChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{ title: string; url: string }>;
  responseType?: 'text' | 'chart' | 'map' | 'timeline';
  responseData?: any;
  confidence?: number;
}

interface Recommendation {
  id: string;
  title: string;
  summary: string;
  category: string;
  similarity_score: number;
}

interface AIChatProps {
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeSession();
    scrollToBottom();
  }, [messages]);

  const initializeSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { error } = await supabase.from('user_sessions').insert({
        user_id: user.id,
        session_id: newSessionId,
        metadata: { platform: 'web', user_agent: navigator.userAgent }
      });

      if (error) throw error;
      setSessionId(newSessionId);
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const startTime = performance.now();
      
      // Call AI assistant edge function
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          query: input,
          sessionId,
          context: messages.slice(-5) // Last 5 messages for context
        }
      });

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      if (error) throw error;

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        sources: data.sources || [],
        responseType: data.responseType || 'text',
        responseData: data.responseData,
        confidence: data.confidence
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save interaction to database
      await saveInteraction(userMessage, assistantMessage, responseTime, data.sources);
      
      // Get recommendations
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }

    } catch (error) {
      console.error('AI chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });

      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again or contact support if the issue persists.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveInteraction = async (userMsg: Message, assistantMsg: Message, responseTime: number, sources: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get session from database
      const { data: session } = await supabase
        .from('user_sessions')
        .select('id')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (!session) return;

      await supabase.from('user_interactions').insert({
        user_id: user.id,
        session_id: session.id,
        query_text: userMsg.content,
        response_text: assistantMsg.content,
        ai_confidence_score: assistantMsg.confidence,
        sources_used: sources,
        response_type: assistantMsg.responseType,
        response_data: assistantMsg.responseData,
        response_time_ms: responseTime,
        context_used: JSON.stringify(messages.slice(-5))
      });
    } catch (error) {
      console.error('Failed to save interaction:', error);
    }
  };

  const handleFeedback = async (messageId: string, isHelpful: boolean, rating?: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Find the interaction from the messages
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const { data: interaction } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('response_text', message.content)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!interaction) return;

      await supabase.from('interaction_feedback').insert({
        interaction_id: interaction.id,
        user_id: user.id,
        rating: rating || (isHelpful ? 5 : 2),
        is_helpful: isHelpful,
        feedback_text: feedbackText
      });

      setShowFeedback(null);
      setFeedbackText('');
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!"
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    
    return (
      <div key={message.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        
        <div className={`max-w-[80%] ${isUser ? 'order-1' : ''}`}>
          <Card className={`${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>
            <CardContent className="p-3">
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/20">
                  <p className="text-xs opacity-70 mb-1">Sources:</p>
                  {message.sources.map((source, idx) => (
                    <Badge key={idx} variant="outline" className="mr-1 text-xs">
                      {source.title}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Confidence Score */}
              {message.confidence && (
                <div className="mt-2 flex items-center gap-1 text-xs opacity-70">
                  <BarChart className="w-3 h-3" />
                  Confidence: {Math.round(message.confidence * 100)}%
                </div>
              )}
              
              {/* Rich Content */}
              {message.responseType === 'chart' && message.responseData && (
                <div className="mt-2 p-2 bg-background/10 rounded">
                  <p className="text-xs">📊 Chart data available</p>
                </div>
              )}
              
              {message.responseType === 'map' && message.responseData && (
                <div className="mt-2 p-2 bg-background/10 rounded flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <p className="text-xs">Map location data</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {message.timestamp.toLocaleTimeString()}
            </span>
            
            {!isUser && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleFeedback(message.id, true)}
                >
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowFeedback(message.id)}
                >
                  <ThumbsDown className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">AI Assistant</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Hello! I'm your civic assistant. Ask me about city services, report issues, or get information about your community.</p>
            </div>
          )}
          
          {messages.map(renderMessage)}
          
          {isLoading && (
            <div className="flex gap-3 justify-start mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="border-t p-4">
            <p className="text-sm font-medium mb-2">Related Topics:</p>
            <div className="flex flex-wrap gap-2">
              {recommendations.map((rec) => (
                <Badge key={rec.id} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  {rec.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Feedback Modal */}
        {showFeedback && (
          <div className="border-t p-4 bg-muted/30">
            <p className="text-sm font-medium mb-2">Help us improve:</p>
            <Textarea
              placeholder="What could be better about this response?"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="mb-2"
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleFeedback(showFeedback, false)}>
                Submit Feedback
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowFeedback(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about city services, report issues, or get help..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;