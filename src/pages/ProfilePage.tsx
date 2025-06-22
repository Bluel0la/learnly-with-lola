import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Save, Trash2, X, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authApi, UserProfile, ProfileUpdateRequest } from '@/services/api';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import ProfileInfo from "./profile/ProfileInfo";
import StatCard from "./profile/StatCard";
import SubjectProgress from "./profile/SubjectProgress";
import SessionItem from "./profile/SessionItem";
import ProfileForm from "./profile/ProfileForm";
import { flashcardApi, quizApi } from '@/services/api';

// Extended type for unified session item, keeps minimal
type CombinedSession = {
  id: string;
  type: "Quiz" | "Flashcard";
  title: string;
  date: string;
  detail?: string;
};

// Responsive and lively Profile Page
const ProfilePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [flashcardStats, setFlashcardStats] = useState({ deckCount: 0, cardCount: 0 });
  
  // State for session items (quiz + flashcard, max 5 most recent)
  const [historySessions, setHistorySessions] = useState<CombinedSession[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    fetchFlashcardStats();
    fetchCombinedSessionHistory();
  }, []);

  const fetchFlashcardStats = async () => {
    try {
      const decks = await flashcardApi.getDecks();
      const totalCards = decks.reduce((sum, deck) => sum + (deck.card_count || 0), 0);
      setFlashcardStats({
        deckCount: decks.length,
        cardCount: totalCards
      });
    } catch (error) {
      console.error('Failed to fetch flashcard stats:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await authApi.getProfile();
      setProfile(userProfile);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load profile information",
        variant: "destructive"
      });
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch both quiz and flashcard sessions, combine and sort by date
  const fetchCombinedSessionHistory = async () => {
    setHistoryLoading(true);
    try {
      // Quiz sessions history (API returns array)
      const quizHistory = await quizApi.getQuizHistory();
      const quizSessions: CombinedSession[] = (quizHistory?.sessions || []).map(qs => ({
        id: qs.session_id,
        type: "Quiz",
        title: typeof qs.topic === "string" ? qs.topic : "Quiz",
        date: qs.date,
        detail: `${qs.total_questions} questions, ${qs.accuracy}%`
      }));

      // [Optional] Future flashcard session support if backend API exists:
      // let flashcardSessions: CombinedSession[] = [];
      // if (typeof flashcardApi.getRecentSessions === "function") {
      //   // ...code for mapping flashcard sessions...
      // }
      // For now, leave flashcardSessions empty.
      let flashcardSessions: CombinedSession[] = [];

      // Merge, sort by date desc, take top 5
      const allSessions = [...quizSessions, ...flashcardSessions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setHistorySessions(allSessions);
    } catch (err) {
      console.error("Failed to fetch combined session history:", err);
      setHistorySessions([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleProfileUpdate = async (data: ProfileUpdateRequest) => {
    try {
      setLoading(true);
      await authApi.updateProfile({
        firstname: data.firstname,
        lastname: data.lastname,
        educational_level: data.educational_level,
        age: data.age ? Number(data.age) : undefined
      });

      await fetchUserProfile();
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await authApi.deleteAccount();
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: "There was a problem deleting your account",
        variant: "destructive"
      });
      setConfirmDeleteOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleCancelEdit = () => {
    setIsEditing(false);
    toast({
      description: "Editing cancelled"
    });
  };

  if (loading && !profile) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <span className="text-xl">Loading profile information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-2 md:px-4 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold">Profile</h1>
        <div>
          {isEditing ? (
            <Button variant="outline" onClick={handleCancelEdit} className="flex items-center">
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          ) : (
            <Button variant="outline" onClick={handleEditToggle} disabled={loading} className="flex items-center">
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          )}
        </div>
      </div>
      {/* Main Content Grid */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile card column */}
        <div className="w-full md:w-1/3 order-2 md:order-1">
          <Card className="relative z-0 p-0 overflow-visible">
            <CardContent className="py-8 px-5 flex flex-col items-center bg-gradient-to-b from-white/80 to-blue-50 rounded-xl shadow animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-200 via-purple-200 to-gray-200 rounded-full flex items-center justify-center mb-3 shadow-lg">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              {profile && (
                <>
                  <h2 className="text-xl font-semibold text-center">{profile.first_name} {profile.last_name}</h2>
                  <p className="text-gray-500 text-sm break-all text-center">{profile.email}</p>
                  <p className="text-gray-400 text-xs mt-2 text-center">Member since May 2025</p>
                </>
              )}

              {!isEditing ? (
                <div className="w-full mt-5 space-y-2">
                  {profile?.educational_level && (
                    <ProfileInfo label="Education Level" value={profile.educational_level} />
                  )}
                  {profile?.age && (
                    <ProfileInfo label="Age" value={profile.age} />
                  )}
                  {profile?.gender && (
                    <ProfileInfo label="Gender" value={profile.gender} />
                  )}
                </div>
              ) : (
                <ProfileForm 
                  profile={profile} 
                  onSubmit={handleProfileUpdate} 
                  onCancel={handleCancelEdit}
                  loading={loading}
                />
              )}
            </CardContent>
          </Card>
          {/* Delete Account */}
          <div className="mt-4">
            <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete your account? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Tabbed stats, 2/3rds width */}
        <div className="w-full md:w-2/3 order-1 md:order-2">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="w-full flex overflow-x-auto rounded-lg bg-gray-100 border mb-2 sm:mb-4 gap-1 px-1 py-0">
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="history">Session History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="mt-0 sm:mt-2">
              <Card className="bg-gradient-to-b from-white to-blue-50/40 border-blue-100 shadow-lg animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg font-bold mb-0">Your Learning Progress</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-2">
                    <StatCard title="Study Sessions" value="12" subtitle="This month" onClick={() => toast({title:"View Study Sessions"})}/>
                    <StatCard title="Quiz Score" value="85%" subtitle="Average" highlightBg="from-green-100 to-blue-50" onClick={() => toast({title:"View Quiz Score Trend"})}/>
                    <StatCard title="Flashcard Decks" value={flashcardStats.deckCount.toString()} subtitle="Created" highlightBg="from-purple-100 to-blue-50" onClick={() => toast({title:"View Flashcard Decks"})}/>
                  </div>

                  {/* Flashcard Statistics section */}
                  <div className="mt-6">
                    <h3 className="text-base font-semibold mb-2">Flashcard Statistics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <StatCard 
                        icon={<span className="text-2xl">🃏</span>} 
                        title="Total Cards" 
                        value={flashcardStats.cardCount.toString()} 
                        subtitle="Cards created"
                        highlightBg="from-blue-50 to-teal-50"
                        onClick={() => toast({title: "View All Cards"})}
                      />
                      <StatCard 
                        icon={<span className="text-2xl">📚</span>}
                        title="Deck Collection"
                        value={flashcardStats.deckCount.toString()}
                        subtitle="Decks organized"
                        highlightBg="from-green-50 to-blue-50"
                        onClick={() => toast({title:"View Deck Collection"})}
                      />
                    </div>
                  </div>
                  {/* Subject Progress */}
                  <div className="mt-6">
                    <h3 className="text-base font-semibold mb-2">Subject Breakdown</h3>
                    <div className="space-y-4">
                      <SubjectProgress subject="Mathematics" progress={0.65} onClick={() => toast({title:"Mathematics detail coming soon!"})}/>
                      <SubjectProgress subject="Physics" progress={0.45} onClick={() => toast({title:"Physics detail coming soon!"})}/>
                      <SubjectProgress subject="Chemistry" progress={0.2} onClick={() => toast({title:"Chemistry detail coming soon!"})}/>
                      <SubjectProgress subject="Biology" progress={0.1} onClick={() => toast({title:"Biology detail coming soon!"})}/>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Session History Tab */}
            <TabsContent value="history" className="mt-2">
              <Card className="shadow animate-fade-in">
                <CardHeader><CardTitle>Recent Sessions</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {historyLoading ? (
                      <div className="py-6 text-center text-gray-400 text-sm">Loading history...</div>
                    ) : historySessions.length === 0 ? (
                      <div className="py-6 text-center text-gray-400 text-sm">
                        No recent quiz or flashcard activity found.
                      </div>
                    ) : (
                      historySessions.map(s => (
                        <SessionItem
                          key={s.id}
                          title={s.title}
                          date={new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          type={s.type}
                        />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-2">
              <Card className="shadow animate-fade-in">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Email Notifications</label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="emailNotif" defaultChecked />
                      <label htmlFor="emailNotif" className="text-sm">Receive email updates about your activity</label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Theme Preference</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="lightTheme" name="theme" defaultChecked />
                        <label htmlFor="lightTheme" className="text-sm">Light</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="darkTheme" name="theme" />
                        <label htmlFor="darkTheme" className="text-sm">Dark</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="systemTheme" name="theme" />
                        <label htmlFor="systemTheme" className="text-sm">System</label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Language</label>
                    <select className="w-full p-2 border rounded">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
