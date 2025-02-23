"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Key,
  Globe,
  Camera,
} from "lucide-react";
import PageHeader from "@/components/LayoutContent/PageHeader";
import { useSession } from "next-auth/react";
import { User } from "../../../../../types/User";

// interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   location: string;
//   timezone: string;
//   avatarUrl?: string;
//   role: string;
//   joinedDate: string;
//   lastActive: string;
// }

const ProfileManagement = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({
    username: user?.username ?? "",
    email: user?.email ?? "",
    phone: user?.phone,
    location: user?.location,
    avatar: user?.avatar,
    role: user?.role,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user?.avatar
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* <div className="container mx-auto p-6"> */}
      <PageHeader headerTitle="Profile" />
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <Card className="col-span-12 lg:col-span-3">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={
                      avatarPreview ||
                      `https://api.dicebear.com/6.x/initials/svg?seed=${user?.name}`
                    }
                    alt={user?.username}
                  />
                  <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="rounded-full bg-primary p-2 text-white">
                      <Camera className="h-4 w-4" />
                    </div>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </Label>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{user?.username}</h2>
                <p className="text-muted-foreground">{user?.role}</p>
              </div>
              <div className="w-full pt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  {user && user.email}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  {user?.phone}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  {user && user.location}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full justify-start"> */}
          {/* <TabsTrigger value="profile" className="flex items-center"> */}

          {/* </TabsTrigger> */}
          {/* </TabsList> */}
          {/* <TabsContent value="profile" className="space-y-6"> */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Personal Information</CardTitle>
                <Button onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="submit">Save Changes</Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Account Status</p>
                    <p className="text-sm text-muted-foreground">
                      Your account is active and verified
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">18-09-2024</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Last Active</p>
                    <p className="text-sm text-muted-foreground">18-02-2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* </TabsContent> */}
          {/* 
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                      </div>
                      <Button variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">Enhance your account security</p>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Push Notifications</h3>
                          <p className="text-sm text-muted-foreground">Get instant notifications</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}
          {/* </Tabs> */}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default ProfileManagement;
