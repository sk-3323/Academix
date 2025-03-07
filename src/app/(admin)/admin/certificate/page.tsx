"use client";

import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Award, Check, Download, FileText, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DynamicCertificateGenerator({ isAdmin = false }) {
  const { singleData } = useSelector((state: any) => state.UserStore);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [certificateSettings, setCertificateSettings] = useState({
    template: "standard",
    title: "Certificate of Completion",
    subtitle: "has successfully completed the course",
    signature: singleData?.username || "Course Instructor",
    signaturePosition: "right",
    showLogo: true,
    showDate: true,
    showBorder: true,
    primaryColor: "#0ea5e9",
    secondaryColor: "#8b5cf6",
    fontFamily: "serif",
    fontSize: 24,
    borderWidth: 5,
    includeQR: true,
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUser, setPreviewUser] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCertificates, setGeneratedCertificates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const canvasRef = useRef(null);
  const liveCanvasRef = useRef(null);
  const logoRef = useRef(null);
  const signatureRef = useRef(null);

  // Get all courses (for admin) or just authored courses (for teacher)
  const courses = isAdmin
    ? getAllCourses() // This would be a function to get all courses from your state
    : singleData?.authoredCourses || [];

  useEffect(() => {
    // Load logo and signature images
    const logo = new Image();
    logo.src = "/assets/logos/light-logo.svg";
    logo.crossOrigin = "anonymous";
    logoRef.current = logo;

    const signature = new Image();
    signature.src = "/assets/logos/light-name.svg";
    signature.crossOrigin = "anonymous";
    signatureRef.current = signature;
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      // Get eligible users for the selected course
      const users = getEligibleUsersForCourse(selectedCourse);
      setEligibleUsers(users);
      setSelectedUsers([]);
      setSelectAll(false);

      // Set a default preview user for the live preview
      if (users.length > 0 && !previewUser) {
        setPreviewUser(users[0]);
      }
    }
  }, [selectedCourse]);

  // Update live preview whenever settings change or preview user changes
  useEffect(() => {
    if (liveCanvasRef.current && previewUser && selectedCourse) {
      renderCertificate(previewUser, liveCanvasRef.current);
    }
  }, [certificateSettings, previewUser, selectedCourse]);

  // Update dialog preview when opened
  useEffect(() => {
    if (isPreviewOpen && previewUser && canvasRef.current) {
      renderCertificate(previewUser, canvasRef.current);
    }
  }, [isPreviewOpen, previewUser]);

  function getAllCourses() {
    // In a real app, this would get all courses from your state
    // For now, we'll just use the authored courses as a placeholder
    return singleData?.authoredCourses || [];
  }

  function getEligibleUsersForCourse(course) {
    // In a real app, this would query your API for students who have completed the course
    // For now, we'll create mock data
    return [
      {
        id: "user-001",
        name: "Rishi Gaiwala",
        email: "rishi@example.com",
        avatar: null,
        completionDate: "2025-02-15",
        progress: 100,
      },
      {
        id: "user-002",
        name: "Priya Sharma",
        email: "priya@example.com",
        avatar: null,
        completionDate: "2025-03-01",
        progress: 100,
      },
      {
        id: "user-003",
        name: "Amit Patel",
        email: "amit@example.com",
        avatar: null,
        completionDate: "2025-02-20",
        progress: 95,
      },
      {
        id: "user-004",
        name: "Neha Gupta",
        email: "neha@example.com",
        avatar: null,
        completionDate: "2025-01-30",
        progress: 100,
      },
      {
        id: "user-005",
        name: "Vikram Singh",
        email: "vikram@example.com",
        avatar: null,
        completionDate: "2025-02-10",
        progress: 98,
      },
    ];
  }

  const handleCourseChange = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    setSelectedCourse(course);
  };

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      setSelectAll(false);
    } else {
      setSelectedUsers([...selectedUsers, userId]);
      if (selectedUsers.length + 1 === eligibleUsers.length) {
        setSelectAll(true);
      }
    }
  };

  const handleSelectAllChange = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUsers(eligibleUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSettingChange = (key, value) => {
    setCertificateSettings({
      ...certificateSettings,
      [key]: value,
    });
  };

  const handlePreview = (user) => {
    setPreviewUser(user);
    setIsPreviewOpen(true);
  };

  const renderCertificate = (user, canvas) => {
    if (!canvas || !user || !selectedCourse) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#f8fafc");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Border
    if (certificateSettings.showBorder) {
      ctx.strokeStyle = certificateSettings.primaryColor;
      ctx.lineWidth = certificateSettings.borderWidth;
      ctx.strokeRect(
        certificateSettings.borderWidth / 2,
        certificateSettings.borderWidth / 2,
        width - certificateSettings.borderWidth,
        height - certificateSettings.borderWidth
      );
    }

    // Logo
    if (certificateSettings.showLogo && logoRef.current) {
      ctx.drawImage(logoRef.current, width / 2 - 50, 50, 100, 100);
    }

    // Title
    ctx.font = `bold ${certificateSettings.fontSize}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = certificateSettings.primaryColor;
    ctx.textAlign = "center";
    ctx.fillText(certificateSettings.title, width / 2, 200);

    // Subtitle
    ctx.font = `italic ${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#64748b";
    ctx.fillText("This is to certify that", width / 2, 250);

    // Student Name
    ctx.font = `bold ${certificateSettings.fontSize * 1.2}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = certificateSettings.secondaryColor;
    ctx.fillText(user.name, width / 2, 300);

    // Course Completion Text
    ctx.font = `${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#64748b";
    ctx.fillText(certificateSettings.subtitle, width / 2, 340);

    // Course Name
    ctx.font = `bold ${certificateSettings.fontSize * 0.8}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#0f172a";
    ctx.fillText(selectedCourse.title, width / 2, 380);

    // Date
    if (certificateSettings.showDate) {
      ctx.font = `${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
      ctx.fillStyle = "#64748b";
      ctx.fillText(`Issued on ${user.completionDate}`, width / 2, 430);
    }

    // Signature
    if (signatureRef.current) {
      const signatureX =
        certificateSettings.signaturePosition === "right"
          ? width * 0.7
          : certificateSettings.signaturePosition === "left"
            ? width * 0.3
            : width / 2;

      ctx.drawImage(signatureRef.current, signatureX - 75, 470, 150, 50);

      ctx.font = `bold ${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
      ctx.fillStyle = "#0f172a";
      ctx.fillText(certificateSettings.signature, signatureX, 540);

      ctx.font = `${certificateSettings.fontSize * 0.5}px ${certificateSettings.fontFamily}`;
      ctx.fillStyle = "#64748b";
      ctx.fillText("Instructor", signatureX, 560);
    }

    // QR Code (mock)
    if (certificateSettings.includeQR) {
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(width - 100, height - 100, 80, 80);
      ctx.font = `${certificateSettings.fontSize * 0.4}px ${certificateSettings.fontFamily}`;
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "center";
      ctx.fillText("QR Code", width - 60, height - 50);
    }

    // Certificate ID
    ctx.font = `${certificateSettings.fontSize * 0.4}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText(
      `Certificate ID: CERT-${user.id}-${Date.now().toString().slice(-6)}`,
      width / 2,
      height - 30
    );
  };

  const handleGenerateCertificates = () => {
    setIsGenerating(true);

    // In a real app, you would:
    // 1. Generate certificates for all selected users
    // 2. Save them to your database
    // 3. Possibly email them to students

    // For this demo, we'll simulate the process
    setTimeout(() => {
      const newCertificates = selectedUsers.map((userId) => {
        const user = eligibleUsers.find((u) => u.id === userId);
        return {
          id: `CERT-${user.id}-${Date.now().toString().slice(-6)}`,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          courseId: selectedCourse.id,
          courseName: selectedCourse.title,
          issueDate: new Date().toISOString().split("T")[0],
          template: certificateSettings.template,
          createdBy: singleData?.username || "Admin",
        };
      });

      setGeneratedCertificates([...generatedCertificates, ...newCertificates]);
      setIsGenerating(false);
      setSelectedUsers([]);
      setSelectAll(false);

      // Show success message or notification here
    }, 2000);
  };

  const downloadCertificate = (canvasRef) => {
    if (!canvasRef.current) return;

    // Convert canvas to data URL
    const dataUrl = canvasRef.current.toDataURL("image/png");

    // Create a download link
    const link = document.createElement("a");
    link.download = `certificate-${previewUser.name}-${selectedCourse.title}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviewUserChange = (userId) => {
    const user = eligibleUsers.find((u) => u.id === userId);
    setPreviewUser(user);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Certificate Generator</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!selectedCourse || !previewUser}
            onClick={() => downloadCertificate(liveCanvasRef)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Preview
          </Button>
          <Button
            disabled={!selectedCourse || selectedUsers.length === 0}
            onClick={handleGenerateCertificates}
            isLoading={isGenerating}
          >
            <Award className="h-4 w-4 mr-2" />
            Generate Certificates
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Settings */}
        <div className="space-y-6">
          {/* Course Selection */}
          <Card>
            <CardHeader>
              <CardTitle>1. Select Course</CardTitle>
              <CardDescription>
                Choose a course to generate certificates for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleCourseChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedCourse && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Course:</span>
                    <span className="text-sm">{selectedCourse.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Eligible Students:
                    </span>
                    <span className="text-sm">{eligibleUsers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Selected:</span>
                    <span className="text-sm">{selectedUsers.length}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Selection */}
          <Card>
            <CardHeader>
              <CardTitle>2. Select Students</CardTitle>
              <CardDescription>
                Choose students who will receive certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedCourse ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <User className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Please select a course first
                  </p>
                </div>
              ) : eligibleUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <User className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No eligible students found for this course
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      id="selectAll"
                      checked={selectAll}
                      onCheckedChange={handleSelectAllChange}
                    />
                    <Label htmlFor="selectAll">Select All</Label>
                    <div className="ml-auto text-sm text-muted-foreground">
                      {selectedUsers.length} of {eligibleUsers.length} selected
                    </div>
                  </div>

                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-2">
                      {eligibleUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center space-x-4 p-3 rounded-md ${
                            selectedUsers.includes(user.id)
                              ? "bg-muted"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleUserSelect(user.id)}
                          />
                          <Avatar className="h-10 w-10">
                            {user.avatar ? (
                              <AvatarImage src={user.avatar} alt={user.name} />
                            ) : (
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={
                                user.progress === 100
                                  ? "bg-green-500"
                                  : "bg-amber-500"
                              }
                            >
                              {user.progress}% Complete
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              Completed: {user.completionDate}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePreviewUserChange(user.id)}
                            title="Preview this student's certificate"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </CardContent>
          </Card>

          {/* Certificate Settings */}
          <Card>
            <CardHeader>
              <CardTitle>3. Certificate Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Certificate Title</Label>
                      <Input
                        id="title"
                        value={certificateSettings.title}
                        onChange={(e) =>
                          handleSettingChange("title", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Completion Text</Label>
                      <Input
                        id="subtitle"
                        value={certificateSettings.subtitle}
                        onChange={(e) =>
                          handleSettingChange("subtitle", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signature">Signature Name</Label>
                      <Input
                        id="signature"
                        value={certificateSettings.signature}
                        onChange={(e) =>
                          handleSettingChange("signature", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signaturePosition">
                        Signature Position
                      </Label>
                      <Select
                        value={certificateSettings.signaturePosition}
                        onValueChange={(value) =>
                          handleSettingChange("signaturePosition", value)
                        }
                      >
                        <SelectTrigger id="signaturePosition">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template">Certificate Template</Label>
                      <Select
                        value={certificateSettings.template}
                        onValueChange={(value) =>
                          handleSettingChange("template", value)
                        }
                      >
                        <SelectTrigger id="template">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="minimalist">Minimalist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <Select
                        value={certificateSettings.fontFamily}
                        onValueChange={(value) =>
                          handleSettingChange("fontFamily", value)
                        }
                      >
                        <SelectTrigger id="fontFamily">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="serif">Serif</SelectItem>
                          <SelectItem value="sans-serif">Sans-serif</SelectItem>
                          <SelectItem value="monospace">Monospace</SelectItem>
                          <SelectItem value="cursive">Cursive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{
                            backgroundColor: certificateSettings.primaryColor,
                          }}
                        />
                        <Input
                          id="primaryColor"
                          type="color"
                          value={certificateSettings.primaryColor}
                          onChange={(e) =>
                            handleSettingChange("primaryColor", e.target.value)
                          }
                          className="w-full h-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{
                            backgroundColor: certificateSettings.secondaryColor,
                          }}
                        />
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={certificateSettings.secondaryColor}
                          onChange={(e) =>
                            handleSettingChange(
                              "secondaryColor",
                              e.target.value
                            )
                          }
                          className="w-full h-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <div className="flex items-center space-x-4">
                        <Slider
                          id="fontSize"
                          min={16}
                          max={36}
                          step={1}
                          value={[certificateSettings.fontSize]}
                          onValueChange={(value) =>
                            handleSettingChange("fontSize", value[0])
                          }
                          className="flex-1"
                        />
                        <span className="w-12 text-center">
                          {certificateSettings.fontSize}px
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="borderWidth">Border Width</Label>
                      <div className="flex items-center space-x-4">
                        <Slider
                          id="borderWidth"
                          min={0}
                          max={20}
                          step={1}
                          value={[certificateSettings.borderWidth]}
                          onValueChange={(value) =>
                            handleSettingChange("borderWidth", value[0])
                          }
                          className="flex-1"
                        />
                        <span className="w-12 text-center">
                          {certificateSettings.borderWidth}px
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showLogo"
                        checked={certificateSettings.showLogo}
                        onCheckedChange={(checked) =>
                          handleSettingChange("showLogo", checked)
                        }
                      />
                      <Label htmlFor="showLogo">Show Logo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showDate"
                        checked={certificateSettings.showDate}
                        onCheckedChange={(checked) =>
                          handleSettingChange("showDate", checked)
                        }
                      />
                      <Label htmlFor="showDate">Show Issue Date</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showBorder"
                        checked={certificateSettings.showBorder}
                        onCheckedChange={(checked) =>
                          handleSettingChange("showBorder", checked)
                        }
                      />
                      <Label htmlFor="showBorder">Show Border</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="includeQR"
                        checked={certificateSettings.includeQR}
                        onCheckedChange={(checked) =>
                          handleSettingChange("includeQR", checked)
                        }
                      />
                      <Label htmlFor="includeQR">Include QR Code</Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Live Preview */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Live Certificate Preview</CardTitle>
              <CardDescription>
                {previewUser
                  ? `Preview for ${previewUser.name}`
                  : "Select a course and student to preview"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-4">
              {!selectedCourse || !previewUser ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Award className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Preview Available
                  </h3>
                  <p className="text-muted-foreground">
                    {!selectedCourse
                      ? "Please select a course first"
                      : "Please select a student to preview their certificate"}
                  </p>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center bg-white rounded-md border shadow-sm overflow-hidden">
                  <canvas
                    ref={liveCanvasRef}
                    width={800}
                    height={600}
                    className="max-w-full h-auto"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              {previewUser && (
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {previewUser.avatar ? (
                        <AvatarImage
                          src={previewUser.avatar}
                          alt={previewUser.name}
                        />
                      ) : (
                        <AvatarFallback>
                          {previewUser.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{previewUser.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {previewUser.email}
                      </p>
                    </div>
                  </div>
                  <Select
                    value={previewUser.id}
                    onValueChange={handlePreviewUserChange}
                    disabled={!selectedCourse || eligibleUsers.length === 0}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardFooter>
          </Card>

          {/* Recently Generated Certificates */}
          {generatedCertificates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recently Generated Certificates</CardTitle>
                <CardDescription>
                  Certificates you've generated in this session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedCertificates.slice(0, 5).map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell>{cert.userName}</TableCell>
                        <TableCell>{cert.courseName}</TableCell>
                        <TableCell>{cert.issueDate}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {generatedCertificates.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button variant="link">View All Certificates</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Certificate Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
            <DialogDescription>
              Preview the certificate before generating
            </DialogDescription>
          </DialogHeader>

          {previewUser && selectedCourse && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {previewUser.avatar ? (
                      <AvatarImage
                        src={previewUser.avatar}
                        alt={previewUser.name}
                      />
                    ) : (
                      <AvatarFallback>
                        {previewUser.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{previewUser.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {previewUser.email}
                    </p>
                  </div>
                </div>
                <Badge
                  className={
                    previewUser.progress === 100
                      ? "bg-green-500"
                      : "bg-amber-500"
                  }
                >
                  {previewUser.progress}% Complete
                </Badge>
              </div>

              <div className="border rounded-md p-4 flex items-center justify-center bg-white">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="max-w-full h-auto border shadow-sm"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => downloadCertificate(canvasRef)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              {!selectedUsers.includes(previewUser?.id) && previewUser && (
                <Button onClick={() => handleUserSelect(previewUser.id)}>
                  <Check className="h-4 w-4 mr-2" />
                  Select for Generation
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
