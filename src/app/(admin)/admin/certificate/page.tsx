"use client";

import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { AppDispatch } from "@/store/store";
import { GetCourseApi } from "@/store/course/slice";
import { Course } from "../../../../../types/allType";
import { GetSingleUserProgressApi } from "@/store/user-progress/slice";
import PageHeader from "@/components/LayoutContent/PageHeader";
import { APIClient } from "@/helpers/apiHelper";

export default function DynamicCertificateGenerator() {
  const { singleData } = useSelector((state: any) => state.UserStore);
  const dispatch = useDispatch<AppDispatch>();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [eligibleUsers, setEligibleUsers] = useState([]);

  const [certificateSettings, setCertificateSettings] = useState({
    template: "standard",
    title: `Certificate of ${selectedCourse?.title}`,
    subtitle: "has successfully completed the course",
    signature: singleData?.username || "Course Instructor",
    signaturePosition: "center",
    showLogo: true,
    showDate: true,
    showBorder: true,
    primaryColor: "#0ea5e9",
    secondaryColor: "#8b5cf6",
    fontFamily: "serif",
    fontSize: 24,
    borderWidth: 5,
    includeQR: false,
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUser, setPreviewUser] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCertificates, setGeneratedCertificates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [courses, setCourses] = useState([]); // State to store courses
  const [isLoadingCourses, setIsLoadingCourses] = useState(false); // State to track loading
  const [courseError, setCourseError] = useState<string | null>(""); // State to track errors

  const canvasRef = useRef(null);
  const liveCanvasRef = useRef(null);
  const logoRef = useRef(null);
  const signatureRef = useRef(null);

  // Load logo and signature images
  useEffect(() => {
    const logo: any = new Image();
    logo.src = "/assets/logos/light-logo.svg";
    logo.crossOrigin = "anonymous";
    logoRef.current = logo;

    const signature: any = new Image();
    signature.src = "/assets/logos/light-name.svg";
    signature.crossOrigin = "anonymous";
    signatureRef.current = signature;
  }, []);

  // Fetch courses when the component mounts or user role changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (singleData?.role === "ADMIN") {
        setIsLoadingCourses(true);
        setCourseError(null);
        try {
          const resp: any = await dispatch(GetCourseApi({ searchParams: {} }));
          if (resp.meta.requestStatus === "fulfilled") {
            setCourses(resp?.payload?.result || []);
          } else {
            setCourseError("Failed to fetch courses. Please try again.");
          }
        } catch (error) {
          setCourseError("An error occurred while fetching courses.");
          console.error(error);
        } finally {
          setIsLoadingCourses(false);
        }
      } else {
        // For non-admin users, use authoredCourses
        setCourses(singleData?.authoredCourses || []);
      }
    };
    const fetchCertificate = async () => {
      const api = new APIClient();
      const res = await api.get("/certificate");
    };
    fetchCourses();
    fetchCertificate();
  }, [singleData, dispatch]);

  useEffect(() => {
    if (selectedCourse) {
      const users: any = getEligibleUsersForCourse(selectedCourse);
      setEligibleUsers(users);
      setSelectedUsers([]);
      setSelectAll(false);

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

  function getEligibleUsersForCourse(course: Course) {
    const userprogres = dispatch(
      GetSingleUserProgressApi({
        id: "67cc166404592fe5d573d1ce",
      })
    );

    return course?.enrollments?.map((enroll) => enroll.user);
  }

  const handleCourseChange = (courseId: string) => {
    const course: Course = courses.find((c: Course) => c.id === courseId);
    setSelectedCourse(course);
    setCertificateSettings((prev: any) => {
      return { ...certificateSettings, title: course.title };
    });
  };

  const handleUserSelect = (userId: string) => {
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

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUsers(eligibleUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSettingChange = (key, value) => {
    if (key === "signature") {
      setCertificateSettings({
        ...certificateSettings,
        signature: singleData?.username,
      });
    }
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

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#f8fafc");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

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

    if (certificateSettings.showLogo && logoRef.current) {
      ctx.drawImage(logoRef.current, width / 2 - 50, 50, 100, 100);
    }

    ctx.font = `bold ${certificateSettings.fontSize}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = certificateSettings.primaryColor;
    ctx.textAlign = "center";
    ctx.fillText(certificateSettings.title, width / 2, 200);

    ctx.font = `italic ${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#64748b";
    ctx.fillText("This is to certify that", width / 2, 250);

    ctx.font = `bold ${certificateSettings.fontSize * 1.2}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = certificateSettings.secondaryColor;
    ctx.fillText(user.username, width / 2, 300);

    ctx.font = `${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#64748b";
    ctx.fillText(certificateSettings.subtitle, width / 2, 340);

    ctx.font = `bold ${certificateSettings.fontSize * 0.8}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#0f172a";
    ctx.fillText(selectedCourse.title, width / 2, 380);

    if (certificateSettings.showDate) {
      ctx.font = `${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
      ctx.fillStyle = "#64748b";
      ctx.fillText(
        `Issued on ${new Date().toLocaleDateString()}`,
        width / 2,
        430
      );
    }

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

    if (certificateSettings.includeQR) {
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(width - 100, height - 100, 80, 80);
      ctx.font = `${certificateSettings.fontSize * 0.4}px ${certificateSettings.fontFamily}`;
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "center";
      ctx.fillText("QR Code", width - 60, height - 50);
    }

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

    setTimeout(() => {
      const newCertificates = selectedUsers.map((userId) => {
        const user: any = eligibleUsers.find((u: any) => u.id === userId);
        return {
          id: `CERT-${user.id}-${Date.now().toString().slice(-6)}`,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          courseId: selectedCourse.id,
          courseName: selectedCourse.title,
          issueDate: new Date().toDateString(),
          template: certificateSettings.template,
          createdBy: singleData?.username || "Admin",
        };
      });

      setGeneratedCertificates([...generatedCertificates, ...newCertificates]);
      setIsGenerating(false);
      setSelectedUsers([]);
      setSelectAll(false);
    }, 2000);
  };

  const downloadCertificate = (canvasRef: any) => {
    if (!canvasRef.current) return;

    const dataUrl = canvasRef.current.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = `certificate-${previewUser.name}-${selectedCourse.title}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviewUserChange = (userId: string) => {
    const user = eligibleUsers.find((u) => u.id === userId);
    setPreviewUser(user);
  };

  return (
    <div className="space-y-6">
      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"> */}
      <PageHeader
        headerTitle="Certificate Generator"
        // renderRight={() => {
        //   return (
        //     <div className="flex gap-2">
        //       <Button
        //         variant="outline"
        //         disabled={!selectedCourse || !previewUser}
        //         onClick={() => downloadCertificate(liveCanvasRef)}
        //       >
        //         <Download className="h-4 w-4 mr-2" />
        //         Download Preview
        //       </Button>
        //       <Button
        //         disabled={!selectedCourse || selectedUsers.length === 0}
        //         onClick={handleGenerateCertificates}
        //         isLoading={isGenerating}
        //       >
        //         <Award className="h-4 w-4 mr-2" />
        //         Generate Certificates
        //       </Button>
        //     </div>
        //   );
        // }}
      />

      {/* </div> */}

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
              {isLoadingCourses ? (
                <div className="flex items-center justify-center h-20">
                  <p>Loading courses...</p>
                </div>
              ) : courseError ? (
                <div className="flex items-center justify-center h-20 text-red-500">
                  <p>{courseError}</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="flex items-center justify-center h-20">
                  <p>No courses available.</p>
                </div>
              ) : (
                <>
                  <Select onValueChange={handleCourseChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course: Course) => (
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
                </>
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
                      {eligibleUsers.map((user: any) => (
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
                  ? `Preview for ${previewUser.username}`
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
                          alt={previewUser.username}
                        />
                      ) : (
                        <AvatarFallback>
                          {previewUser.username.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {previewUser.username}
                      </p>
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
                      {eligibleUsers.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.username}
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
                    {generatedCertificates.slice(0, 5).map((cert: any) => (
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
