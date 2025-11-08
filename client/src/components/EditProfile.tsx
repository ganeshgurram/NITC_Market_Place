import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Camera } from "lucide-react";
import { usersAPI } from "../utils/api";
import { toast } from "sonner";
import React from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface EditProfileProps {
  currentUser: any;
  onCancel: () => void;
  onSave: (updatedUser: any) => void;
}

export default function EditProfile({ currentUser, onCancel, onSave }: EditProfileProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>((currentUser as any).avatar || (currentUser as any).avatarUrl || "");
  const [semester, setSemester] = useState<string>((currentUser as any).semester || "");
  const [hostel, setHostel] = useState<string>((currentUser as any).hostel || "");
  const [phone, setPhone] = useState<string>((currentUser as any).phone || "");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [imageValid, setImageValid] = useState<boolean>(!!avatarUrl);

  useEffect(() => {
    if (!avatarUrl) {
      setImageValid(false);
      return;
    }

    let mounted = true;
    const img = new Image();
    img.onload = () => { if (mounted) setImageValid(true); };
    img.onerror = () => { if (mounted) setImageValid(false); };
    img.src = avatarUrl;
    return () => { mounted = false; };
  }, [avatarUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updates: any = {
        phone,
        hostel,
        semester,
        avatarUrl: avatarUrl || null,
      };

      // Password change flow: require currentPassword + newPassword
      if (newPassword && newPassword.length > 0) {
        updates.currentPassword = currentPassword;
        updates.newPassword = newPassword;
      }

      const res = await usersAPI.updateProfile(updates);
      toast.success(res.message || 'Profile updated');
      onSave(res.user || res);
    } catch (err: any) {
      console.error('Failed to update profile', err);
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-8">
              <div className="relative group cursor-pointer">
                <label htmlFor="avatar-upload" className="cursor-pointer block">
                  <Avatar className="w-32 h-32">
                    {imageValid ? (
                      <AvatarImage src={avatarUrl as string} />
                    ) : (
                      <AvatarFallback>
                        <Camera className="w-12 h-12 text-muted-foreground" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                    {uploadingImage ? (
                      <span>Uploading...</span>
                    ) : (
                      <>
                        <Camera className="w-6 h-6" />
                        <span className="ml-2">Edit</span>
                      </>
                    )}
                  </div>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    try {
                      setUploadingImage(true);
                      const formData = new FormData();
                      formData.append('image', file);
                      
                      const response = await fetch(`${API_BASE_URL}/upload`, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        },
                        body: formData
                      });
                      
                      if (!response.ok) {
                        throw new Error('Failed to upload image');
                      }
                      
                      const data = await response.json();
                      setAvatarUrl(API_BASE_URL.replace('/api', '') + data.url);
                      toast.success('Image uploaded successfully');
                    } catch (error) {
                      console.error('Error uploading image:', error);
                      toast.error('Failed to upload image');
                    } finally {
                      setUploadingImage(false);
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input value={currentUser.email} disabled />
            </div>

            <div>
              <Label>Roll Number</Label>
              <Input value={currentUser.rollNumber} disabled />
            </div>

            <div>
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div>
              <Label>Hostel</Label>
              <Input value={hostel} onChange={(e) => setHostel(e.target.value)} />
            </div>

            <div>
              <Label>Semester</Label>
              <Input value={semester} onChange={(e) => setSemester(e.target.value)} />
            </div>

            <div>
              <Label>New Password</Label>
              <Input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" placeholder="Current password (required to change)" className="mb-2" />
              <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="New password (leave blank to keep current)" />
            </div>

            <div className="flex items-center space-x-2">
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save changes'}</Button>
              <Button variant="ghost" onClick={onCancel} type="button">Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
