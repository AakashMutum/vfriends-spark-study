import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  HelpCircle, 
  BookOpen, 
  Zap, 
  Star, 
  MessageSquare,
  Plus,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";
import { Doubt, calculatePointsForDoubtSolved } from "@/lib/userState";

export const DoubtInteraction = () => {
  const { state, askDoubt, solveDoubt } = useUser();
  const [showAskDialog, setShowAskDialog] = useState(false);
  const [showSolveDialog, setShowSolveDialog] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);
  const [rating, setRating] = useState<number>(0);

  // Form states for asking doubt
  const [doubtTitle, setDoubtTitle] = useState("");
  const [doubtDescription, setDoubtDescription] = useState("");
  const [doubtSubject, setDoubtSubject] = useState("");

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", 
    "Computer Science", "English", "History", "Geography",
    "Economics", "Psychology", "Other"
  ];

  const openDoubts = state.doubts.filter(doubt => doubt.status === 'open');
  const solvedDoubts = state.doubts.filter(doubt => doubt.status === 'solved');

  const handleAskDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (doubtTitle.trim() && doubtDescription.trim() && doubtSubject) {
      askDoubt(doubtTitle.trim(), doubtDescription.trim(), doubtSubject);
      setShowAskDialog(false);
      // Reset form
      setDoubtTitle("");
      setDoubtDescription("");
      setDoubtSubject("");
    }
  };

  const handleSolveDoubt = (doubt: Doubt) => {
    setSelectedDoubt(doubt);
    setShowSolveDialog(true);
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDoubt) {
      solveDoubt(selectedDoubt.id, rating > 0 ? rating : undefined);
      setShowSolveDialog(false);
      setSelectedDoubt(null);
      setRating(0);
    }
  };

  const getPointsForDoubt = (doubt: Doubt) => {
    return calculatePointsForDoubtSolved(10, undefined, false);
  };

  if (!state.currentUser) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {state.currentUser.type === 'solver' ? 'Solve Doubts' : 'Ask Doubts'}
          </h2>
          <p className="text-muted-foreground">
            {state.currentUser.type === 'solver' 
              ? 'Help others and earn points' 
              : 'Get help from the community'
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          {state.currentUser.type === 'asker' && (
            <Dialog open={showAskDialog} onOpenChange={setShowAskDialog}>
              <DialogTrigger asChild>
                <Button variant="glow">
                  <Plus className="w-4 h-4 mr-2" />
                  Ask Doubt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ask a New Doubt</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAskDoubt} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Brief title for your doubt"
                      value={doubtTitle}
                      onChange={(e) => setDoubtTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-lg font-semibold">Choose a subject/topic</Label>
                    <Select value={doubtSubject} onValueChange={setDoubtSubject}>
                      <SelectTrigger className="h-12 text-lg border-2 border-primary/40">
                        <SelectValue placeholder="Select subject (e.g. Maths, Physics, Chemistry...)" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject} className="text-base">
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your doubt in detail..."
                      value={doubtDescription}
                      onChange={(e) => setDoubtDescription(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-orange" />
                      <span>This doubt is worth 10 points for the solver</span>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={!doubtTitle.trim() || !doubtDescription.trim() || !doubtSubject}>
                    Ask Doubt
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Doubts List */}
      <div className="grid gap-4">
        {state.currentUser.type === 'solver' ? (
          // Solver view - show open doubts
          <>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Open Doubts ({openDoubts.length})</h3>
            </div>
            
            {openDoubts.length === 0 ? (
              <Card className="glass-card border-0">
                <CardContent className="p-8 text-center">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-lg font-semibold mb-2">No open doubts</h4>
                  <p className="text-muted-foreground">
                    All doubts have been solved! Check back later for new questions.
                  </p>
                </CardContent>
              </Card>
            ) : (
              openDoubts.map((doubt) => (
                <Card key={doubt.id} className="glass-card border-0 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{doubt.title}</h4>
                          <Badge variant="outline">{doubt.subject}</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(doubt.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">{doubt.description}</p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Zap className="w-4 h-4 text-orange" />
                            <span className="font-medium">{getPointsForDoubt(doubt)} points</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>1 solver needed</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleSolveDoubt(doubt)}
                        className="ml-4"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Solve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        ) : (
          // Asker view - show their doubts
          <>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Your Doubts ({state.doubts.length})</h3>
            </div>
            
            {state.doubts.length === 0 ? (
              <Card className="glass-card border-0">
                <CardContent className="p-8 text-center">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-lg font-semibold mb-2">No doubts yet</h4>
                  <p className="text-muted-foreground mb-4">
                    Start by asking your first doubt to get help from the community!
                  </p>
                  <Button onClick={() => setShowAskDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ask Your First Doubt
                  </Button>
                </CardContent>
              </Card>
            ) : (
              state.doubts.map((doubt) => (
                <Card key={doubt.id} className="glass-card border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{doubt.title}</h4>
                          <Badge variant={doubt.status === 'solved' ? 'default' : 'secondary'}>
                            {doubt.status === 'solved' ? 'Solved' : 'Open'}
                          </Badge>
                          <Badge variant="outline">{doubt.subject}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{doubt.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(doubt.createdAt).toLocaleDateString()}</span>
                          </div>
                          {doubt.status === 'solved' && doubt.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>{doubt.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {doubt.status === 'solved' && (
                        <div className="flex items-center gap-2 ml-4">
                          <CheckCircle className="w-5 h-5 text-mint" />
                          <span className="text-sm text-muted-foreground">Solved</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}
      </div>

      {/* Solve Doubt Dialog */}
      <Dialog open={showSolveDialog} onOpenChange={setShowSolveDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solve Doubt</DialogTitle>
          </DialogHeader>
          {selectedDoubt && (
            <form onSubmit={handleSubmitSolution} className="space-y-4">
              <div className="space-y-2">
                <Label>Doubt Title</Label>
                <p className="font-medium">{selectedDoubt.title}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Subject</Label>
                <Badge variant="outline">{selectedDoubt.subject}</Badge>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <p className="text-muted-foreground">{selectedDoubt.description}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Your Solution</Label>
                <Textarea
                  placeholder="Provide a detailed solution..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Rate the difficulty (optional)</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="button"
                      variant={rating >= star ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRating(star)}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-orange" />
                  <span>You'll earn {getPointsForDoubt(selectedDoubt)} points for solving this doubt</span>
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                Submit Solution
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 