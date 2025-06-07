import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Save, User, UserRound, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authApi, UserProfile, ProfileUpdateRequest } from '@/services/api';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { flashcardApi } from '@/services/api';

const ProfilePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [flashcardStats, setFlashcardStats] = useState({ deckCount: 0, cardCount: 0 });
  
  useEffect(() => {
    fetchUserProfile();
    fetchFlashcardStats();
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

  const handleProfileUpdate = async (data: ProfileUpdateRequest) => {
  try {
    setLoading(true);
    await authApi.updateProfile({
      firstname: data.firstname,
      lastname: data.lastname,
      educational_level: data.educational_level,
      age: data.age ? Number(data.age) : undefined
    });

    // 👇 Fetch fresh profile from backend
    await fetchUserProfile();

    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully"
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
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

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
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold">Profile</h1>
        {isEditing ? (
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleCancelEdit}
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline"
            onClick={handleEditToggle}
            disabled={loading}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <UserRound className="h-12 w-12 text-gray-500" />
              </div>
              {profile && (
                <>
                  <h2 className="text-xl font-medium">{profile.first_name} {profile.last_name}</h2>
                  <p className="text-gray-500 text-sm">{profile.email}</p>
                  <p className="text-gray-500 text-sm mt-1">Member since May 2025</p>
                </>
              )}
              
              {!isEditing ? (
                <div className="w-full mt-4 space-y-2">
                  {profile?.educational_level && (
                    <div className="text-sm">
                      <span className="text-gray-500">Education Level:</span>
                      <span className="ml-2">{profile.educational_level}</span>
                    </div>
                  )}
                  {profile?.age && (
                    <div className="text-sm">
                      <span className="text-gray-500">Age:</span>
                      <span className="ml-2">{profile.age}</span>
                    </div>
                  )}
                  {profile?.gender && (
                    <div className="text-sm">
                      <span className="text-gray-500">Gender:</span>
                      <span className="ml-2">{profile.gender}</span>
                    </div>
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

          <div className="mt-4">
            <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                >
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
                  <Button 
                    variant="outline" 
                    onClick={() => setConfirmDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={loading}
                  >
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="stats">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="history">Session History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Study Sessions" value="12" subtitle="This month" />
                    <StatCard title="Quiz Score" value="85%" subtitle="Average" />
                    <StatCard title="Flashcard Decks" value={flashcardStats.deckCount.toString()} subtitle="Created" />
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Flashcard Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🃏</span>
                          <span className="font-medium">Total Cards</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{flashcardStats.cardCount}</div>
                        <div className="text-sm text-muted-foreground">Cards created</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">📚</span>
                          <span className="font-medium">Deck Collection</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">{flashcardStats.deckCount}</div>
                        <div className="text-sm text-muted-foreground">Decks organized</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Subject Breakdown</h3>
                    <div className="space-y-3">
                      <SubjectProgress subject="Mathematics" progress={0.65} />
                      <SubjectProgress subject="Physics" progress={0.45} />
                      <SubjectProgress subject="Chemistry" progress={0.2} />
                      <SubjectProgress subject="Biology" progress={0.1} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <SessionItem 
                      title="Calculus Derivatives" 
                      date="May 14, 2025" 
                      type="Math" 
                    />
                    <SessionItem 
                      title="Physics Chapter Summary" 
                      date="May 12, 2025" 
                      type="Summary" 
                    />
                    <SessionItem 
                      title="Biology Flashcards" 
                      date="May 10, 2025" 
                      type="Flashcard" 
                    />
                    <SessionItem 
                      title="Chemistry Quiz" 
                      date="May 8, 2025" 
                      type="Quiz" 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4">
              <Card>
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

const ProfileForm = ({ 
  profile, 
  onSubmit, 
  onCancel,
  loading 
}: { 
  profile: UserProfile | null, 
  onSubmit: (data: ProfileUpdateRequest) => void,
  onCancel: () => void,
  loading: boolean
}) => {
  const form = useForm<ProfileUpdateRequest>({
    defaultValues: {
      firstname: profile?.first_name || '',
      lastname: profile?.last_name || '',
      educational_level: profile?.educational_level || '',
      age: profile?.age,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form className="w-full mt-4 space-y-3" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm text-gray-500 block mb-1">First Name</label>
        <Input
          {...form.register('firstname')}
          defaultValue={profile?.first_name}
          disabled={loading}
        />
      </div>
      <div>
        <label className="text-sm text-gray-500 block mb-1">Last Name</label>
        <Input
          {...form.register('lastname')}
          defaultValue={profile?.last_name}
          disabled={loading}
        />
      </div>
      <div>
        <label className="text-sm text-gray-500 block mb-1">Education Level</label>
        <Input
          {...form.register('educational_level')}
          defaultValue={profile?.educational_level}
          disabled={loading}
          placeholder="e.g. University, High School"
        />
      </div>
      <div>
        <label className="text-sm text-gray-500 block mb-1">Age</label>
        <Input
          {...form.register('age')}
          type="number"
          defaultValue={profile?.age}
          disabled={loading}
          min={1}
          max={120}
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-2 pt-4">
        <Button 
          type="submit"
          className="flex-1 bg-primary text-white hover:bg-primary/90"
          disabled={loading}
        >
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
        <Button 
          type="button"
          variant="outline"
          className="flex-1 border border-gray-300"
          onClick={onCancel}
          disabled={loading}
        >
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
      </div>
    </form>
  );
};

const StatCard = ({ title, value, subtitle }: { title: string; value: string; subtitle: string }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-gray-600 font-medium">{title}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
};

const SubjectProgress = ({ subject, progress }: { subject: string; progress: number }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm">{subject}</span>
        <span className="text-sm font-medium">{Math.round(progress * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full" 
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

const SessionItem = ({ title, date, type }: { title: string; date: string; type: string }) => {
  const { toast } = useToast();
  
  const getTypeColor = () => {
    switch (type) {
      case 'Math': return 'text-green-500';
      case 'Summary': return 'text-blue-500';
      case 'Flashcard': return 'text-accent';
      case 'Quiz': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };
  
  return (
    <div 
      className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
      onClick={() => toast({ title: `Viewing ${title}` })}
    >
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">{date}</div>
      </div>
      <div className={`font-medium ${getTypeColor()}`}>
        {type}
      </div>
    </div>
  );
};

export default ProfilePage;
