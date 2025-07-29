import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  Zap, 
  Flame, 
  Star,
  X
} from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRole?: 'asker' | 'solver';
}

export const LoginModal = ({ isOpen, onClose, preselectedRole }: LoginModalProps) => {
  const { login } = useUser();
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<'asker' | 'solver' | null>(null);
  const [step, setStep] = useState<'type' | 'name'>('type');

  // If preselectedRole is provided, set userType and step accordingly
  useEffect(() => {
    if (preselectedRole) {
      setUserType(preselectedRole);
      setStep('name');
    } else {
      setUserType(null);
      setStep('type');
    }
  }, [preselectedRole, isOpen]);

  const handleTypeSelect = (type: 'asker' | 'solver') => {
    setUserType(type);
    setStep('name');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && userType) {
      login(userType, name.trim());
      onClose();
      // Reset form
      setName("");
      setUserType(null);
      setStep('type');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setName("");
    setUserType(null);
    setStep('type');
  };

  const userTypes = [
    {
      type: 'asker' as const,
      title: 'Doubt Asker',
      description: 'I have questions and need help understanding concepts',
      icon: HelpCircle,
      benefits: [
        'Get help from experienced students',
        'Learn from detailed explanations',
        'Build your knowledge step by step',
        'Join a supportive community'
      ],
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      type: 'solver' as const,
      title: 'Doubt Solver',
      description: 'I want to help others and earn points while learning',
      icon: BookOpen,
      benefits: [
        'Earn points for each doubt solved',
        'Build your reputation and badges',
        'Reinforce your own knowledge',
        'Help others while learning'
      ],
      color: 'text-coral',
      bgColor: 'bg-coral/10',
      borderColor: 'border-coral/20'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Join vFriends
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Choose your role and start your learning journey
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'type' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">What would you like to do?</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your primary role in the community
                </p>
              </div>

              <div className="grid gap-4">
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card 
                      key={type.type}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 ${type.borderColor} hover:border-opacity-50`}
                      onClick={() => handleTypeSelect(type.type)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${type.bgColor}`}>
                            <Icon className={`w-6 h-6 ${type.color}`} />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className={`font-bold text-lg ${type.color} mb-2`}>
                              {type.title}
                            </h4>
                            <p className="text-muted-foreground mb-4">
                              {type.description}
                            </p>
                            
                            <div className="space-y-2">
                              {type.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <Star className="w-4 h-4 text-mint" />
                                  <span>{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'name' && userType && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('type')}
                  className="absolute top-4 left-4"
                >
                  <X className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                <h3 className="text-lg font-semibold mb-2">Almost there!</h3>
                <p className="text-sm text-muted-foreground">
                  Tell us your name to get started
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-lg"
                    autoFocus
                    required
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={userType === 'solver' ? 'default' : 'secondary'}>
                      {userType === 'solver' ? 'Doubt Solver' : 'Doubt Asker'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You'll start with 0 points and can begin earning immediately!
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-orange" />
                    <span>Earn points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-coral" />
                    <span>Build streaks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-mint" />
                    <span>Unlock badges</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg"
                  disabled={!name.trim()}
                >
                  Start Learning
                </Button>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 