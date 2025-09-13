import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Bot, 
  Brain, 
  Book, 
  User, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react';
import AIChat from '@/components/ai/AIChat';
import UserProfile from '@/components/ai/UserProfile';
import AIKnowledgeBase from '@/components/ai/AIKnowledgeBase';

interface AISectionProps {
  language: string;
}

const AISection: React.FC<AISectionProps> = ({ language }) => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const translations = {
    en: {
      title: "AI-Powered Civic Assistant",
      subtitle: "Get instant help, personalized recommendations, and smart insights for all your civic needs",
      chatTitle: "AI Chat Assistant",
      chatDescription: "Ask questions about city services, report issues, or get personalized help",
      profileTitle: "Your AI Profile",
      profileDescription: "View your interaction history, preferences, and personalized recommendations",
      knowledgeTitle: "Knowledge Base",
      knowledgeDescription: "Browse and contribute to our comprehensive civic information database",
      features: {
        intelligent: "Intelligent Responses",
        intelligentDesc: "AI understands context and provides relevant, accurate information",
        personalized: "Personalized Experience", 
        personalizedDesc: "Learns from your interactions to provide better recommendations",
        secure: "Privacy-First Design",
        secureDesc: "Your data is encrypted and you have full control over retention",
        realtime: "Real-time Updates",
        realtimeDesc: "Get notifications about topics and issues you care about"
      },
      startChat: "Start Conversation",
      viewProfile: "View Profile", 
      browseKnowledge: "Browse Knowledge Base",
      benefits: [
        "Natural language question answering",
        "Contextual conversation memory", 
        "Personalized recommendations",
        "Rich content with charts and maps",
        "Feedback-driven improvements",
        "Privacy and data control"
      ]
    },
    es: {
      title: "Asistente Cívico Impulsado por IA",
      subtitle: "Obtén ayuda instantánea, recomendaciones personalizadas e información inteligente para todas tus necesidades cívicas",
      chatTitle: "Asistente de Chat IA",
      chatDescription: "Haz preguntas sobre servicios de la ciudad, reporta problemas u obtén ayuda personalizada",
      profileTitle: "Tu Perfil de IA",
      profileDescription: "Ve tu historial de interacciones, preferencias y recomendaciones personalizadas",
      knowledgeTitle: "Base de Conocimiento",
      knowledgeDescription: "Navega y contribuye a nuestra base de datos integral de información cívica",
      features: {
        intelligent: "Respuestas Inteligentes",
        intelligentDesc: "La IA entiende el contexto y proporciona información relevante y precisa",
        personalized: "Experiencia Personalizada",
        personalizedDesc: "Aprende de tus interacciones para proporcionar mejores recomendaciones",
        secure: "Diseño que Prioriza la Privacidad",
        secureDesc: "Tus datos están encriptados y tienes control total sobre la retención",
        realtime: "Actualizaciones en Tiempo Real",
        realtimeDesc: "Recibe notificaciones sobre temas y problemas que te importan"
      },
      startChat: "Iniciar Conversación",
      viewProfile: "Ver Perfil",
      browseKnowledge: "Explorar Base de Conocimiento",
      benefits: [
        "Respuestas a preguntas en lenguaje natural",
        "Memoria contextual de conversación",
        "Recomendaciones personalizadas", 
        "Contenido enriquecido con gráficos y mapas",
        "Mejoras basadas en retroalimentación",
        "Control de privacidad y datos"
      ]
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="w-8 h-8 text-primary" />
            <Badge variant="secondary" className="px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* AI Chat */}
          <Dialog open={activeDialog === 'chat'} onOpenChange={(open) => setActiveDialog(open ? 'chat' : null)}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{t.chatTitle}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{t.chatDescription}</p>
                  <Button className="w-full group">
                    {t.startChat}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0">
              <AIChat onClose={() => setActiveDialog(null)} />
            </DialogContent>
          </Dialog>

          {/* User Profile */}
          <Dialog open={activeDialog === 'profile'} onOpenChange={(open) => setActiveDialog(open ? 'profile' : null)}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{t.profileTitle}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{t.profileDescription}</p>
                  <Button variant="outline" className="w-full group">
                    {t.viewProfile}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0">
              <UserProfile />
            </DialogContent>
          </Dialog>

          {/* Knowledge Base */}
          <Dialog open={activeDialog === 'knowledge'} onOpenChange={(open) => setActiveDialog(open ? 'knowledge' : null)}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Book className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-xl">{t.knowledgeTitle}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{t.knowledgeDescription}</p>
                  <Button variant="secondary" className="w-full group">
                    {t.browseKnowledge}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0">
              <AIKnowledgeBase />
            </DialogContent>
          </Dialog>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10">
            <Brain className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t.features.intelligent}</h3>
            <p className="text-sm text-muted-foreground">{t.features.intelligentDesc}</p>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <TrendingUp className="w-10 h-10 text-secondary-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t.features.personalized}</h3>
            <p className="text-sm text-muted-foreground">{t.features.personalizedDesc}</p>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-br from-green-500/5 to-green-500/10">
            <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t.features.secure}</h3>
            <p className="text-sm text-muted-foreground">{t.features.secureDesc}</p>
          </Card>

          <Card className="text-center p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
            <Clock className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t.features.realtime}</h3>
            <p className="text-sm text-muted-foreground">{t.features.realtimeDesc}</p>
          </Card>
        </div>

        {/* Benefits List */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Key Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {t.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AISection;