"use client";

import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Award, Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/LayoutContent/PageHeader";
import { getCertificate } from "@/helpers/getCertificate";

export default function DynamicCertificateGenerator({ isAdmin = false }) {
  const { singleData } = useSelector((state: any) => state.UserStore);

  const [certificateSettings, setCertificateSettings] = useState({
    template: "standard",
    title: "Certificate of Completion",
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
  const [generatedCertificates, setGeneratedCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const canvasRef = useRef(null);
  const logoRef = useRef(null);
  const signatureRef = useRef(null);

  useEffect(() => {
    const loaddata = async () => {
      const result = await getCertificate();
      setGeneratedCertificates(result);
      if (result.length > 0) {
        setSelectedCertificate(result[0]); // Default to first certificate for side preview
        setPreviewUser(result[0].user); // Set initial preview user
      }
    };
    loaddata();
  }, []);

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

    if (isPreviewOpen && selectedCertificate) {
      // Add a small delay to ensure the canvas is properly mounted in the DOM
      const timer = setTimeout(() => {
        renderCertificate(
          selectedCertificate.user,
          selectedCertificate.course,
          canvasRef.current
        );
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isPreviewOpen, selectedCertificate, certificateSettings]);

  const renderCertificate = (user, course, canvas) => {
    if (!canvas || !user || !course) return;

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
    ctx.fillText(user.username, width / 2, 300);

    // Course Completion Text
    ctx.font = `${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#64748b";
    ctx.fillText(certificateSettings.subtitle, width / 2, 340);

    // Course Name
    ctx.font = `bold ${certificateSettings.fontSize * 0.8}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#0f172a";
    ctx.fillText(course.title, width / 2, 380);

    // Date
    if (certificateSettings.showDate) {
      ctx.font = `${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
      ctx.fillStyle = "#64748b";
      ctx.fillText(
        `Issued on ${selectedCertificate?.issueDate}`,
        width / 2,
        430
      );
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

    // Certificate ID
    ctx.font = `${certificateSettings.fontSize * 0.4}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(
      `Certificate ID: ${selectedCertificate?.certificateId}`,
      width / 2,
      height - 30
    );
  };

  const handleCertificateClick = (certificate) => {
    setSelectedCertificate(certificate);
    setPreviewUser(certificate.user);
    setIsPreviewOpen(true);
  };

  const downloadCertificate = (canvasRef, certificate) => {
    if (!canvasRef.current) return;

    const dataUrl = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `certificate-${certificate.user.username}-${certificate.course.title}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader headerTitle="Generated Certificates" />

      {generatedCertificates.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Generated Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <ScrollArea className="h-[600px]"> */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedCertificates.map((cert) => (
                  <TableRow
                    key={cert.id}
                    className={
                      selectedCertificate?.id === cert.id ? "bg-muted" : ""
                    }
                  >
                    <TableCell>{cert.user.username}</TableCell>
                    <TableCell>{cert.course.title}</TableCell>
                    <TableCell>
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{cert.certificateId}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCertificate(cert);
                          setPreviewUser(cert.user);
                          setIsPreviewOpen(true);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Certificate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* </ScrollArea> */}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground">
              No certificates generated yet.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Full Certificate Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="w-[70vw]">
          <DialogHeader>
            <DialogTitle>Certificate</DialogTitle>
            {selectedCertificate && (
              <DialogDescription>
                Issued to {selectedCertificate.user.username} for{" "}
                {selectedCertificate.course.title}
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedCertificate && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 bg-muted p-4 rounded-lg">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={selectedCertificate.user.avatar}
                    alt={selectedCertificate.user.username}
                  />
                  <AvatarFallback>
                    {selectedCertificate.user.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">
                    {selectedCertificate.user.username}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCertificate.user.email}
                  </p>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <Award className="h-4 w-4 mr-1 text-primary" />
                    <span>
                      Certificate ID: {selectedCertificate.certificateId}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6 flex items-center justify-center bg-white shadow-md">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() =>
                downloadCertificate(canvasRef, selectedCertificate)
              }
            >
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
