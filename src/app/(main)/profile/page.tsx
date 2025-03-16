"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Camera } from "lucide-react";
import PageHeader from "@/components/LayoutContent/PageHeader";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { EditUserApi, GetSingleUserApi } from "@/store/user/slice";
import { format } from "date-fns";
import { GetSingleCourseApi } from "@/store/course/slice";

const ProfileManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: any) => state["UserStore"]);

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(data?.singleData);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user?.avatar
  );
  const [userData, setUserData] = useState({
    username: user?.username ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [courseDetails, setCourseDetails] = useState<any>({});

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const courseIds = user?.enrollments?.map((e: any) => e.courseId) || [];
      const details: any = {};
      for (const courseId of courseIds) {
        try {
          const response = await dispatch(
            GetSingleCourseApi({ id: courseId })
          ).unwrap();
          details[courseId] = response;
        } catch (error) {
          console.error(`Failed to fetch course ${courseId}:`, error);
        }
      }
      setCourseDetails(details);
    };
    if (user?.enrollments?.length > 0) {
      fetchCourseDetails();
    }
  }, [user?.enrollments, dispatch]);
  // Update userData when user changes (e.g., on mount or Redux update)
  useEffect(() => {
    setUser(data.singleData);
    setUserData({
      username: data.singleData?.username ?? "",
      email: data.singleData?.email ?? "",
      phone: data.singleData?.phone ?? "",
    });
    setAvatarPreview(data.singleData?.avatar);
  }, [data.singleData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    const { username, email, phone } = userData;
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await dispatch(
        EditUserApi({
          id: user?.id,
          values: formData,
          requiredFields: ["username", "email", "phone"],
        })
      ).unwrap();
      console.log("Edit Response:", response);
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.error("Edit Error:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader headerTitle="Profile" />
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <Card className="col-span-12 lg:col-span-3">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={avatarPreview} alt={user?.username} />
                  <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                </Avatar>
                {isEditing && (
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
                )}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{user?.username}</h2>
                <p className="text-muted-foreground">{user?.role}</p>
              </div>
              <div className="w-full pt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.email}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  {user?.phone || "Not provided"}
                </div>
                {/* Gamification Points */}
                <div className="flex items-center text-sm">
                  <span className="font-medium mr-2">Points:</span>
                  {user?.gamificationPoints || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
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
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Full Name</Label>
                    <Input
                      id="username"
                      name="username"
                      value={userData.username}
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
                      value={userData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={userData.phone}
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
                      {`Your Account is ${!user?.isBlocked ? "Active" : "Blocked"} and ${user?.isVerified ? "Verified" : "Not Verified"}`}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {!user?.isBlocked ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.createdAt
                      ? format(new Date(user.createdAt), "yyyy-MM-dd HH:mm:ss")
                      : "Invalid Date"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Last Update</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.updatedAt
                      ? format(new Date(user.updatedAt), "yyyy-MM-dd HH:mm:ss")
                      : "Invalid Date"}
                  </p>
                </div>
                {/* Subscription Status */}
                <div className="flex justify-between items-center">
                  <p className="font-medium">Subscription Status</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.subscriptionStatus || "Not Subscribed"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrollments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              {user?.enrollments?.length > 0 ? (
                <div className="space-y-6">
                  {user.enrollments.map((enrollment: any) => (
                    <div
                      key={enrollment.id}
                      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Course Thumbnail */}
                        <div className="md:col-span-1">
                          {enrollment.course?.thumbnail ? (
                            <img
                              src={enrollment.course.thumbnail}
                              alt={enrollment.course.title}
                              className="w-full h-32 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-md">
                              <span className="text-gray-500">
                                No Thumbnail
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Course Details */}
                        <div className="md:col-span-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                              {enrollment.course?.title || "Unknown Course"}
                            </h3>
                            <Badge
                              variant={
                                enrollment.status === "ACTIVE"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {enrollment.status}
                            </Badge>
                          </div>

                          {/* Additional Course Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div>
                              <p>
                                <span className="font-medium">Price:</span> ₹
                                {enrollment.course?.price || 0}
                                {enrollment.course?.isFree && " (Free)"}
                              </p>
                              <p>
                                <span className="font-medium">Level:</span>{" "}
                                {enrollment.course?.level || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">Status:</span>{" "}
                                {enrollment.course?.status || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p>
                                <span className="font-medium">
                                  Enrolled On:
                                </span>{" "}
                                {enrollment.createdAt
                                  ? format(
                                      new Date(enrollment.createdAt),
                                      "yyyy-MM-dd HH:mm:ss"
                                    )
                                  : "Unknown"}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Payment Status:
                                </span>{" "}
                                {enrollment.payment_status}
                              </p>
                              <p>
                                <span className="font-medium">Order ID:</span>{" "}
                                {enrollment.orderId}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No enrollments found.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Certificates Section */}
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              {user?.certificates?.length > 0 ? (
                <div className="space-y-4">
                  {user.certificates.map((certificate: any, index: number) => (
                    <div
                      key={index}
                      className="border p-4 rounded-lg space-y-2"
                    >
                      <p className="font-medium">
                        Certificate for Course: {certificate.courseId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Issued On:{" "}
                        {certificate.issuedAt
                          ? format(
                              new Date(certificate.issuedAt),
                              "yyyy-MM-dd HH:mm:ss"
                            )
                          : "Unknown"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No certificates earned yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* User Progress Section */}
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {user?.UserProgress?.length > 0 ? (
                <div className="space-y-4">
                  {user.UserProgress.map((progress: any, index: number) => (
                    <div
                      key={index}
                      className="border p-4 rounded-lg space-y-2"
                    >
                      <p className="font-medium">
                        Course ID: {progress.courseId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Progress: {progress.progressPercentage || 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last Updated:{" "}
                        {progress.updatedAt
                          ? format(
                              new Date(progress.updatedAt),
                              "yyyy-MM-dd HH:mm:ss"
                            )
                          : "Unknown"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No progress data available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
