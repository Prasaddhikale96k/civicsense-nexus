-- Create comprehensive AI knowledge base system

-- User interaction sessions
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- User queries and AI interactions
CREATE TABLE public.user_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  response_text TEXT,
  ai_confidence_score NUMERIC(3,2),
  sources_used JSONB DEFAULT '[]'::jsonb,
  response_type TEXT DEFAULT 'text', -- text, chart, table, map, timeline
  response_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  response_time_ms INTEGER,
  user_location POINT,
  context_used JSONB DEFAULT '[]'::jsonb
);

-- Knowledge base articles/content
CREATE TABLE public.knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  embedding VECTOR(1536), -- OpenAI embedding dimension
  source_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  view_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  priority_score INTEGER DEFAULT 0
);

-- User feedback on AI responses
CREATE TABLE public.interaction_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  interaction_id UUID REFERENCES public.user_interactions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_helpful BOOLEAN,
  feedback_text TEXT,
  improvement_suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User preferences and settings
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferred_response_style TEXT DEFAULT 'balanced', -- concise, detailed, balanced
  topics_of_interest TEXT[] DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{"email": false, "push": false, "in_app": true}'::jsonb,
  data_retention_days INTEGER DEFAULT 365,
  allow_data_collection BOOLEAN DEFAULT true,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Personalized recommendations
CREATE TABLE public.user_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommended_content_id UUID REFERENCES public.knowledge_base(id) ON DELETE CASCADE,
  interaction_id UUID REFERENCES public.user_interactions(id) ON DELETE CASCADE,
  similarity_score NUMERIC(3,2),
  recommendation_type TEXT DEFAULT 'semantic', -- semantic, collaborative, trending
  is_clicked BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  shown_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE
);

-- Topic subscriptions for notifications
CREATE TABLE public.topic_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  notification_frequency TEXT DEFAULT 'weekly', -- immediate, daily, weekly, monthly
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_notification_sent TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, topic)
);

-- Search analytics
CREATE TABLE public.search_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query_text TEXT NOT NULL,
  result_count INTEGER DEFAULT 0,
  has_results BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  response_quality_score NUMERIC(3,2),
  search_context JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on all tables
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interaction_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_sessions
CREATE POLICY "Users can manage their own sessions" 
ON public.user_sessions 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for user_interactions
CREATE POLICY "Users can manage their own interactions" 
ON public.user_interactions 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all interactions for analytics" 
ON public.user_interactions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role IN ('municipal_staff', 'admin')
));

-- RLS Policies for knowledge_base
CREATE POLICY "Everyone can view public knowledge base" 
ON public.knowledge_base 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Authors can manage their own articles" 
ON public.knowledge_base 
FOR ALL 
USING (auth.uid() = author_id);

CREATE POLICY "Staff can manage all knowledge base" 
ON public.knowledge_base 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role IN ('municipal_staff', 'admin')
));

-- RLS Policies for interaction_feedback
CREATE POLICY "Users can manage their own feedback" 
ON public.interaction_feedback 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage their own preferences" 
ON public.user_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for user_recommendations
CREATE POLICY "Users can view their own recommendations" 
ON public.user_recommendations 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for topic_subscriptions
CREATE POLICY "Users can manage their own subscriptions" 
ON public.topic_subscriptions 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for search_analytics
CREATE POLICY "Users can view their own search analytics" 
ON public.search_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all search analytics" 
ON public.search_analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role IN ('municipal_staff', 'admin')
));

CREATE POLICY "Anyone can insert search analytics" 
ON public.search_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_user_interactions_user_id ON public.user_interactions(user_id);
CREATE INDEX idx_user_interactions_session_id ON public.user_interactions(session_id);
CREATE INDEX idx_user_interactions_created_at ON public.user_interactions(created_at DESC);
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX idx_knowledge_base_tags ON public.knowledge_base USING GIN(tags);
CREATE INDEX idx_knowledge_base_embedding ON public.knowledge_base USING ivfflat(embedding vector_cosine_ops);
CREATE INDEX idx_user_recommendations_user_id ON public.user_recommendations(user_id);
CREATE INDEX idx_topic_subscriptions_user_id ON public.topic_subscriptions(user_id);
CREATE INDEX idx_search_analytics_created_at ON public.search_analytics(created_at DESC);

-- Create updated_at triggers
CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to clean up old user data based on preferences
CREATE OR REPLACE FUNCTION public.cleanup_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Clean up interactions older than user's retention preference
  DELETE FROM public.user_interactions 
  WHERE user_id = NEW.user_id 
    AND created_at < (NOW() - INTERVAL '1 day' * NEW.data_retention_days);
  
  -- Clean up old sessions
  DELETE FROM public.user_sessions 
  WHERE user_id = NEW.user_id 
    AND updated_at < (NOW() - INTERVAL '30 days');
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run cleanup when preferences are updated
CREATE TRIGGER trigger_cleanup_user_data
  AFTER UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_user_data();