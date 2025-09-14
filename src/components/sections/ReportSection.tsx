import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import AuthModal from "@/components/auth/AuthModal";
import { 
  Camera, 
  MapPin, 
  Mic, 
  Upload, 
  AlertTriangle, 
  Trash2, 
  Lightbulb, 
  Droplets,
  Car,
  TreePine,
  Building,
  Zap,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import potholeImage from "@/assets/pothole.jpg";
import streetlightImage from "@/assets/streetlight.jpg";
import garbageImage from "@/assets/garbage.jpg";

interface ReportSectionProps {
  language: string;
}

const ReportSection = ({ language }: ReportSectionProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIssueType, setSelectedIssueType] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    urgency: "",
    category: "",
  });

  const { user } = useAuth();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const translations = {
    en: {
      title: "Report a Civic Issue",
      subtitle: "Help us make your community better by reporting issues that need attention",
      steps: {
        1: "Issue Type",
        2: "Details",
        3: "Location & Media",
        4: "Review & Submit"
      },
      issueTypes: [
        { id: "pothole", label: "Road Damage", icon: Car, description: "Potholes, cracks, damaged roads", image: potholeImage },
        { id: "streetlight", label: "Street Lighting", icon: Lightbulb, description: "Broken or dim street lights", image: streetlightImage },
        { id: "garbage", label: "Waste Management", icon: Trash2, description: "Overflowing bins, illegal dumping", image: garbageImage },
        { id: "water", label: "Water Issues", icon: Droplets, description: "Leaks, drainage, water quality" },
        { id: "traffic", label: "Traffic & Parking", icon: Car, description: "Signal issues, parking problems" },
        { id: "environment", label: "Environment", icon: TreePine, description: "Tree issues, air quality, noise" },
        { id: "infrastructure", label: "Infrastructure", icon: Building, description: "Public buildings, sidewalks" },
        { id: "utilities", label: "Utilities", icon: Zap, description: "Power outages, cable issues" },
      ],
      form: {
        title: "Issue Title",
        titlePlaceholder: "Brief description of the issue",
        description: "Detailed Description",
        descriptionPlaceholder: "Provide more details about the issue...",
        location: "Location",
        locationPlaceholder: "Enter address or use GPS",
        urgency: "Urgency Level",
        urgencyOptions: {
          low: "Low - Can wait",
          medium: "Medium - Should be addressed soon",
          high: "High - Needs immediate attention",
          critical: "Critical - Emergency situation"
        },
        attachments: "Attachments",
        voiceNote: "Voice Note",
        recordVoice: "Record Voice Note",
        stopRecording: "Stop Recording",
        useGPS: "Use Current Location",
        takePhoto: "Take Photo",
        uploadFile: "Upload File",
      },
      buttons: {
        next: "Next Step",
        previous: "Previous",
        submit: "Submit Report",
        submitAnother: "Submit Another",
      },
      success: {
        title: "Report Submitted Successfully!",
        message: "Your report has been received and will be reviewed by the relevant department.",
        trackingId: "Tracking ID:",
        nextSteps: "What happens next:",
        steps: [
          "Department review (within 24 hours)",
          "Issue verification and assessment",
          "Work assignment and scheduling", 
          "Resolution and follow-up"
        ]
      }
    },
    hi: {
      title: "नागरिक समस्या की रिपोर्ट करें",
      subtitle: "ध्यान देने योग्य समस्याओं की रिपोर्ट करके अपने समुदाय को बेहतर बनाने में हमारी मदद करें",
      steps: {
        1: "समस्या का प्रकार",
        2: "विवरण",
        3: "स्थान और मीडिया",
        4: "समीक्षा और सबमिट"
      },
      issueTypes: [
        { id: "pothole", label: "सड़क क्षति", icon: Car, description: "गड्ढे, दरारें, क्षतिग्रस्त सड़कें", image: potholeImage },
        { id: "streetlight", label: "स्ट्रीट लाइटिंग", icon: Lightbulb, description: "टूटी या मंद स्ट्रीट लाइटें", image: streetlightImage },
        { id: "garbage", label: "कचरा प्रबंधन", icon: Trash2, description: "भरे हुए डिब्बे, अवैध डंपिंग", image: garbageImage },
        { id: "water", label: "पानी की समस्याएं", icon: Droplets, description: "रिसाव, जल निकासी, पानी की गुणवत्ता" },
        { id: "traffic", label: "ट्रैफिक और पार्किंग", icon: Car, description: "सिग्नल की समस्याएं, पार्किंग की समस्याएं" },
        { id: "environment", label: "पर्यावरण", icon: TreePine, description: "पेड़ की समस्याएं, वायु गुणवत्ता, शोर" },
        { id: "infrastructure", label: "बुनियादी ढांचा", icon: Building, description: "सार्वजनिक भवन, फुटपाथ" },
        { id: "utilities", label: "उपयोगिताएं", icon: Zap, description: "बिजली कटौती, केबल की समस्याएं" },
      ],
      form: {
        title: "समस्या शीर्षक",
        titlePlaceholder: "समस्या का संक्षिप्त विवरण",
        description: "विस्तृत विवरण",
        descriptionPlaceholder: "समस्या के बारे में अधिक विवरण प्रदान करें...",
        location: "स्थान",
        locationPlaceholder: "पता दर्ज करें या GPS का उपयोग करें",
        urgency: "तात्कालिकता स्तर",
        urgencyOptions: {
          low: "कम - प्रतीक्षा कर सकते हैं",
          medium: "मध्यम - जल्द ही संबोधित किया जाना चाहिए",
          high: "उच्च - तत्काल ध्यान देने की आवश्यकता",
          critical: "गंभीर - आपातकालीन स्थिति"
        },
        attachments: "अनुलग्नक",
        voiceNote: "वॉयस नोट",
        recordVoice: "वॉयस नोट रिकॉर्ड करें",
        stopRecording: "रिकॉर्डिंग रोकें",
        useGPS: "वर्तमान स्थान का उपयोग करें",
        takePhoto: "फोटो लें",
        uploadFile: "फ़ाइल अपलोड करें",
      },
      buttons: {
        next: "अगला चरण",
        previous: "पिछला",
        submit: "रिपोर्ट सबमिट करें",
        submitAnother: "एक और सबमिट करें",
      },
      success: {
        title: "रिपोर्ट सफलतापूर्वक सबमिट की गई!",
        message: "आपकी रिपोर्ट प्राप्त हो गई है और संबंधित विभाग द्वारा इसकी समीक्षा की जाएगी।",
        trackingId: "ट्रैकिंग आईडी:",
        nextSteps: "आगे क्या होता है:",
        steps: [
          "विभागीय समीक्षा (24 घंटे के भीतर)",
          "समस्या सत्यापन और मूल्यांकन",
          "कार्य असाइनमेंट और शेड्यूलिंग",
          "समाधान और फॉलो-अप"
        ]
      }
    },
    mr: {
      title: "नागरिक समस्येचा अहवाल द्या",
      subtitle: "लक्ष देण्याजोग्या समस्यांचा अहवाल देऊन आपल्या समुदायाला चांगले बनवण्यास मदत करा",
      steps: {
        1: "समस्येचा प्रकार",
        2: "तपशील",
        3: "स्थान आणि मीडिया",
        4: "पुनरावलोकन आणि सबमिट"
      },
      issueTypes: [
        { id: "pothole", label: "रस्ता नुकसान", icon: Car, description: "खड्डे, भेगा, खराब रस्ते", image: potholeImage },
        { id: "streetlight", label: "रस्ता दीप", icon: Lightbulb, description: "तुटलेले किंवा मंद रस्ता दीप", image: streetlightImage },
        { id: "garbage", label: "कचरा व्यवस्थापन", icon: Trash2, description: "भरलेली डबी, बेकायदा डंपिंग", image: garbageImage },
        { id: "water", label: "पाण्याच्या समस्या", icon: Droplets, description: "गळती, निचरा, पाण्याची गुणवत्ता" },
        { id: "traffic", label: "रहदारी आणि पार्किंग", icon: Car, description: "सिग्नलच्या समस्या, पार्किंगच्या समस्या" },
        { id: "environment", label: "पर्यावरण", icon: TreePine, description: "झाडांच्या समस्या, हवेची गुणवत्ता, आवाज" },
        { id: "infrastructure", label: "पायाभूत सुविधा", icon: Building, description: "सार्वजनिक इमारती, फूटपाथ" },
        { id: "utilities", label: "उपयोगिता", icon: Zap, description: "वीज खंडित, केबलच्या समस्या" },
      ],
      form: {
        title: "समस्या शीर्षक",
        titlePlaceholder: "समस्येचे संक्षिप्त वर्णन",
        description: "तपशीलवार वर्णन",
        descriptionPlaceholder: "समस्येबद्दल अधिक तपशील द्या...",
        location: "स्थान",
        locationPlaceholder: "पत्ता प्रविष्ट करा किंवा GPS वापरा",
        urgency: "तातडीचा स्तर",
        urgencyOptions: {
          low: "कमी - प्रतीक्षा करू शकतो",
          medium: "मध्यम - लवकरच सोडवले पाहिजे",
          high: "उच्च - तातडीने लक्ष देण्याची गरज",
          critical: "गंभीर - आपत्कालीन परिस्थिती"
        },
        attachments: "संलग्नक",
        voiceNote: "आवाज नोट",
        recordVoice: "आवाज नोट रेकॉर्ड करा",
        stopRecording: "रेकॉर्डिंग थांबवा",
        useGPS: "सध्याचे स्थान वापरा",
        takePhoto: "फोटो घ्या",
        uploadFile: "फाइल अपलोड करा",
      },
      buttons: {
        next: "पुढील चरण",
        previous: "मागील",
        submit: "अहवाल सबमिट करा",
        submitAnother: "आणखी एक सबमिट करा",
      },
      success: {
        title: "अहवाल यशस्वीरित्या सबमिट झाला!",
        message: "तुमचा अहवाल प्राप्त झाला आहे आणि संबंधित विभागाकडून त्याचे पुनरावलोकन केले जाईल.",
        trackingId: "ट्रॅकिंग आयडी:",
        nextSteps: "पुढे काय होते:",
        steps: [
          "विभागीय पुनरावलोकन (24 तासांत)",
          "समस्या पडताळणी आणि मूल्यांकन",
          "कार्य नियुक्ती आणि वेळापत्रक",
          "निराकरण आणि पाठपुरावा"
        ]
      }
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { error } = await supabase
        .from('issues')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            status: 'pending',
            user_id: user.id,
          }
        ]);

      if (error) {
        throw error;
      }

      setCurrentStep(5); // Success step
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Select Issue Type</h3>
              <p className="text-muted-foreground">Choose the category that best describes your issue</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.issueTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card 
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedIssueType === type.id ? 'ring-2 ring-primary shadow-civic' : ''
                    }`}
                    onClick={() => setSelectedIssueType(type.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          selectedIssueType === type.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold">{type.label}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                          {type.image && (
                            <div className="mt-3">
                              <img 
                                src={type.image} 
                                alt={type.label}
                                className="w-full h-24 object-cover rounded-md"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Provide Details</h3>
              <p className="text-muted-foreground">Give us more information about the issue</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t.form.title}</Label>
                <Input
                  id="title"
                  placeholder={t.form.titlePlaceholder}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t.form.description}</Label>
                <Textarea
                  id="description"
                  placeholder={t.form.descriptionPlaceholder}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">{t.form.urgency}</Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Low - Can wait</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span>Medium - Should be addressed soon</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span>High - Needs immediate attention</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="critical">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>Critical - Emergency situation</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Location & Media</h3>
              <p className="text-muted-foreground">Help us locate and understand the issue better</p>
            </div>

            <div className="space-y-6">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">{t.form.location}</Label>
                <div className="flex space-x-2">
                  <Input
                    id="location"
                    placeholder={t.form.locationPlaceholder}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    {t.form.useGPS}
                  </Button>
                </div>
              </div>

              {/* Media Upload */}
              <div className="space-y-4">
                <Label>{t.form.attachments}</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex-col space-y-2">
                    <Camera className="h-6 w-6" />
                    <span className="text-sm">{t.form.takePhoto}</span>
                  </Button>
                  
                  <Button variant="outline" className="h-24 flex-col space-y-2">
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">{t.form.uploadFile}</span>
                  </Button>

                  <Button 
                    variant={isRecording ? "destructive" : "outline"} 
                    className="h-24 flex-col space-y-2"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    <Mic className={`h-6 w-6 ${isRecording ? 'animate-pulse' : ''}`} />
                    <span className="text-sm">
                      {isRecording ? t.form.stopRecording : t.form.recordVoice}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Review Your Report</h3>
              <p className="text-muted-foreground">Please review your information before submitting</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">ISSUE TYPE</h4>
                  <p className="text-lg">{t.issueTypes.find(type => type.id === selectedIssueType)?.label}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">TITLE</h4>
                  <p>{formData.title}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">DESCRIPTION</h4>
                  <p>{formData.description}</p>
                </div>

                <div className="flex space-x-8">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">URGENCY</h4>
                    <Badge variant={formData.urgency === 'critical' ? 'destructive' : 'secondary'}>
                      {formData.urgency}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground">LOCATION</h4>
                    <p>{formData.location || "Current location"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-secondary">{t.success.title}</h3>
              <p className="text-muted-foreground">{t.success.message}</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">{t.success.trackingId}</h4>
                    <p className="text-2xl font-mono text-primary">CIV-2024-{Math.floor(Math.random() * 10000)}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">{t.success.nextSteps}</h4>
                    <div className="space-y-2">
                      {t.success.steps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                            {index + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" onClick={() => setCurrentStep(1)}>
                {t.buttons.submitAnother}
              </Button>
              <Button variant="outline">
                Track This Issue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="report" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t.title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="civic-shadow">
            <CardHeader>
              {/* Progress indicator */}
              {currentStep <= totalSteps && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  
                  {/* Step indicators */}
                  <div className="flex justify-between">
                    {Object.entries(t.steps).map(([step, label]) => (
                      <div 
                        key={step}
                        className={`flex flex-col items-center space-y-1 ${
                          parseInt(step) <= currentStep ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          parseInt(step) <= currentStep 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          {parseInt(step) < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                        </div>
                        <span className="text-xs font-medium hidden sm:block">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent>
              {!user && currentStep === totalSteps && (
                <Alert className="mb-6">
                  <AlertDescription>
                    Please sign in to submit a report. Your account allows you to track your issues and receive updates.
                  </AlertDescription>
                </Alert>
              )}

              {submitError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              {renderStepContent()}
              
              {/* Navigation buttons */}
              {currentStep <= totalSteps && (
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    {t.buttons.previous}
                  </Button>
                  
                  <Button 
                    variant={currentStep === totalSteps ? "hero" : "civic"}
                    onClick={currentStep === totalSteps ? handleSubmit : handleNext}
                    disabled={(currentStep === 1 && !selectedIssueType) || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : currentStep === totalSteps ? (user ? t.buttons.submit : "Sign In to Submit") : t.buttons.next}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </section>
  );
};

export default ReportSection;
