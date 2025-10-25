import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Settings,
  LogOut,
  Edit,
  Check,
  X,
  Plus,
  Trash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";

export function ProfileSheet() {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  type Social = { id: string; label: string; url: string };
  type Profile = {
    name: string;
    role: string;
    department: string;
    studentId: string;
    email: string;
    phone: string;
    bio?: string;
    interests: string[];
    socials: Social[];
  };

  const defaultProfile: Profile = {
    name: "Ponugoti Ranadeep",
    role: "Student",
    department: "Computer Science Engineering",
    studentId: "2410030488",
    email: "2410030488@klh.edu.in",
    phone: "9550625140",
    bio: "",
    interests: ["Coding", "Robotics"],
    socials: [{ id: "s1", label: "GitHub", url: "https://github.com/" }],
  };

  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(defaultProfile);
  const [newInterest, setNewInterest] = useState("");
  const [newSocialLabel, setNewSocialLabel] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("campus_profile");
      if (raw) {
        const parsed = JSON.parse(raw) as Profile;
        setProfile(parsed);
        setDraft(parsed);
      }
    } catch (e) {
      console.warn("Failed to load profile from localStorage", e);
    }
  }, []);

  const initials = useMemo(() => {
    const parts = profile.name.split(" ").filter(Boolean);
    return (parts[0]?.[0] || "P") + (parts[1]?.[0] || "R");
  }, [profile.name]);

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(profile);
    setEditing(false);
    setNewInterest("");
    setNewSocialLabel("");
    setNewSocialUrl("");
  };

  const saveProfile = () => {
    setProfile(draft);
    localStorage.setItem("campus_profile", JSON.stringify(draft));
    setEditing(false);
    toast.success("Profile saved");
  };

  const addInterest = () => {
    const val = newInterest.trim();
    if (!val) return;
    setDraft((d) => ({ ...d, interests: [...d.interests, val] }));
    setNewInterest("");
  };

  const removeInterest = (i: number) => {
    setDraft((d) => ({ ...d, interests: d.interests.filter((_, idx) => idx !== i) }));
  };

  const addSocial = () => {
    const label = newSocialLabel.trim();
    const url = newSocialUrl.trim();
    if (!label || !url) return;
    const id = `s_${Date.now()}`;
    setDraft((d) => ({ ...d, socials: [...d.socials, { id, label, url }] }));
    setNewSocialLabel("");
    setNewSocialUrl("");
  };

  const removeSocial = (id: string) => {
    setDraft((d) => ({ ...d, socials: d.socials.filter((s) => s.id !== id) }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-hero text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription>
            Manage your account settings and preferences
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Profile Avatar */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-gradient-hero text-primary-foreground text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center w-full">
              {editing ? (
                <div className="space-y-2">
                  <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                  <div className="flex gap-2">
                    <Input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
                    <Input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-lg">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{profile.department}</p>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Profile Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Account Information</h4>
              <div className="flex items-center gap-2">
                {editing ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={saveProfile}>
                      <Check className="w-4 h-4" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                      <X className="w-4 h-4" /> Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="ghost" onClick={startEdit}>
                    <Edit className="w-4 h-4" /> Edit
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Student ID</p>
                  {editing ? (
                    <Input value={draft.studentId} onChange={(e) => setDraft({ ...draft, studentId: e.target.value })} />
                  ) : (
                    <p className="text-sm font-medium">{profile.studentId}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  {editing ? (
                    <Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                  ) : (
                    <p className="text-sm font-medium">{profile.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  {editing ? (
                    <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
                  ) : (
                    <p className="text-sm font-medium">{profile.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Department</p>
                  {editing ? (
                    <Input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} />
                  ) : (
                    <p className="text-sm font-medium">{profile.department}</p>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Bio</p>
                {editing ? (
                  <Textarea value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.bio || "—"}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Interests</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(editing ? draft.interests : profile.interests).map((it, idx) => (
                    <span key={it + idx} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/80 text-sm">
                      <span>{it}</span>
                      {editing && (
                        <button onClick={() => removeInterest(idx)} className="text-red-500" aria-label={`Remove ${it}`}>
                          <Trash className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}

                  {editing && (
                    <div className="flex items-center gap-2 mt-2 w-full">
                      <Input placeholder="Add interest" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} />
                      <Button size="sm" onClick={addInterest}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Social Links</p>
                <div className="mt-2 space-y-2">
                  {(editing ? draft.socials : profile.socials).map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{s.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.url}</p>
                      </div>
                      {editing ? (
                        <button title={`Remove ${s.label}`} aria-label={`Remove ${s.label}`} onClick={() => removeSocial(s.id)} className="text-red-500">
                          <Trash className="w-4 h-4" />
                        </button>
                      ) : (
                        <a className="text-primary" href={s.url} target="_blank" rel="noreferrer">Open</a>
                      )}
                    </div>
                  ))}

                  {editing && (
                    <div className="mt-2 space-y-2">
                      <Input placeholder="Label (e.g. GitHub)" value={newSocialLabel} onChange={(e) => setNewSocialLabel(e.target.value)} />
                      <Input placeholder="https://..." value={newSocialUrl} onChange={(e) => setNewSocialUrl(e.target.value)} />
                      <div className="flex justify-end">
                        <Button size="sm" onClick={addSocial}><Plus className="w-4 h-4" /> Add</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Settings className="w-4 h-4" /> Account Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
