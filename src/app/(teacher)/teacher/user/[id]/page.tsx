// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   Calendar,
//   Clock,
//   Download,
//   FileText,
//   GraduationCap,
//   Mail,
//   Phone,
//   User,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Progress } from "@/components/ui/progress";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { AppDispatch } from "@/store/store";
// import { GetSingleUserApi } from "@/store/user/slice";

// export default function StudentDetailPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const { singleData: student } = useSelector((state: any) => state.UserStore);
//   const dispatch = useDispatch<AppDispatch>();
//   console.log(student);

//   useEffect(() => {
//     // Only fetch if student data is not already present or if the ID differs
//     if (!student || student.id !== params.id) {
//       dispatch(GetSingleUserApi({ id: params.id }));
//     }
//   }, [params.id, student, dispatch]);

//   // Mock activity data
//   const activities = [
//     {
//       id: "1",
//       type: "QUIZ_COMPLETED",
//       courseId: "67cad724b9c1cb55b541a809",
//       courseTitle: "Machine Learning",
//       detail: "Completed 'Introduction to ML' quiz with score 8/10",
//       date: "2025-03-22T10:15:30.000Z",
//     },
//     {
//       id: "2",
//       type: "TOPIC_VIEWED",
//       courseId: "67cad724b9c1cb55b541a809",
//       courseTitle: "Machine Learning",
//       detail: "Watched 'Introduction to Machine Learning' video",
//       date: "2025-03-21T18:30:45.000Z",
//     },
//     {
//       id: "3",
//       type: "RESOURCE_DOWNLOADED",
//       courseId: "67cad724b9c1cb55b541a809",
//       courseTitle: "Machine Learning",
//       detail: "Downloaded 'Machine Learning' PDF resource",
//       date: "2025-03-21T18:05:12.000Z",
//     },
//   ];
//   return (
//     <div className="container mx-auto py-6">
//       <div className="flex flex-col gap-6">
//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="sm" asChild>
//             <Link href="/teacher/student">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Students
//             </Link>
//           </Button>
//         </div>

//         <div className="grid gap-6 md:grid-cols-3">
//           <Card className="md:col-span-1">
//             <CardHeader>
//               <CardTitle>Student Profile</CardTitle>
//             </CardHeader>
//             <CardContent className="flex flex-col items-center text-center">
//               <Avatar className="h-24 w-24 mb-4">
//                 <AvatarImage src={student.avatar} alt={student.username} />
//                 <AvatarFallback>{student.avatar}</AvatarFallback>
//               </Avatar>
//               <h2 className="text-xl font-bold">{student.username}</h2>
//               <p className="text-muted-foreground">{student.role}</p>

//               <div className="w-full mt-6 space-y-4">
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-4 w-4 text-muted-foreground" />
//                   <span>{student.email}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Phone className="h-4 w-4 text-muted-foreground" />
//                   <span>{student.phone}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <span>
//                     Joined {new Date(student.joinedDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Clock className="h-4 w-4 text-muted-foreground" />
//                   <span>
//                     Last active{" "}
//                     {new Date(student.lastActive).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>

//               <div className="w-full mt-6">
//                 <Badge
//                   className="w-full"
//                   variant={student.isVerified ? "default" : "secondary"}
//                 >
//                   {student.isVerified
//                     ? "Verified Account"
//                     : "Unverified Account"}
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="md:col-span-2">
//             <CardHeader>
//               <CardTitle>Enrolled Courses</CardTitle>
//               <CardDescription>
//                 Courses this student is currently enrolled in
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {student?.enrollments?.length > 0 ? (
//                 <div className="space-y-4">
//                   {student?.enrollments?.map((enrollment) => (
//                     <div key={enrollment.id} className="border rounded-md p-4">
//                       <div className="flex flex-col md:flex-row gap-4">
//                         <div className="relative h-20 w-32 overflow-hidden rounded-md flex-shrink-0">
//                           <Image
//                             src={
//                               enrollment.thumbnail ||
//                               "/placeholder.svg?height=80&width=128"
//                             }
//                             alt={enrollment.courseTitle}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="font-medium text-lg">
//                             {enrollment.courseTitle}
//                           </h3>
//                           <div className="flex flex-wrap gap-2 mt-1">
//                             <Badge variant="outline">
//                               {enrollment.category}
//                             </Badge>
//                             <Badge variant="outline">{enrollment.level}</Badge>
//                             <Badge
//                               variant={
//                                 enrollment.status === "ACTIVE"
//                                   ? "default"
//                                   : "secondary"
//                               }
//                             >
//                               {enrollment.status}
//                             </Badge>
//                             <Badge
//                               variant={
//                                 enrollment.payment_status === "PAID"
//                                   ? "default"
//                                   : "destructive"
//                               }
//                             >
//                               {enrollment.payment_status}
//                             </Badge>
//                           </div>
//                           <div className="mt-3">
//                             <div className="flex justify-between text-sm mb-1">
//                               <span>Progress</span>
//                               <span>{enrollment?.progress}%</span>
//                             </div>
//                             <Progress
//                               value={enrollment?.progress}
//                               className="h-2"
//                             />
//                           </div>
//                           <div className="mt-3 text-sm text-muted-foreground">
//                             Enrolled on{" "}
//                             {new Date(
//                               enrollment.enrolledDate
//                             ).toLocaleDateString()}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
//                   <h3 className="mt-4 text-lg font-medium">
//                     No courses enrolled
//                   </h3>
//                   <p className="text-muted-foreground">
//                     This student hasn't enrolled in any courses yet.
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         <Tabs defaultValue="activity" className="w-full">
//           <TabsList>
//             <TabsTrigger value="activity">Recent Activity</TabsTrigger>
//             <TabsTrigger value="performance">Performance</TabsTrigger>
//             <TabsTrigger value="notes">Teacher Notes</TabsTrigger>
//           </TabsList>

//           <TabsContent value="activity" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Student Activity</CardTitle>
//                 <CardDescription>
//                   Recent learning activities and interactions
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Activity</TableHead>
//                       <TableHead>Course</TableHead>
//                       <TableHead>Date</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {activities.map((activity) => (
//                       <TableRow key={activity.id}>
//                         <TableCell>
//                           <div className="font-medium">
//                             {activity.type.replace(/_/g, " ").toLowerCase()}
//                           </div>
//                           <div className="text-sm text-muted-foreground">
//                             {activity.detail}
//                           </div>
//                         </TableCell>
//                         <TableCell>{activity.courseTitle}</TableCell>
//                         <TableCell>
//                           {new Date(activity.date).toLocaleString()}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="performance" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Performance Overview</CardTitle>
//                 <CardDescription>
//                   Quiz scores and assignment performance
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center py-8">
//                   <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
//                   <h3 className="mt-4 text-lg font-medium">
//                     No performance data yet
//                   </h3>
//                   <p className="text-muted-foreground">
//                     This student hasn't completed any assessments yet.
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="notes" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Teacher Notes</CardTitle>
//                 <CardDescription>
//                   Private notes about this student
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center py-8">
//                   <User className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
//                   <h3 className="mt-4 text-lg font-medium">No notes yet</h3>
//                   <p className="text-muted-foreground">
//                     You haven't added any notes about this student.
//                   </p>
//                   <Button className="mt-4">Add Note</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         <div className="flex justify-end gap-2">
//           <Button variant="outline">
//             <Download className="mr-2 h-4 w-4" />
//             Export Student Data
//           </Button>
//           <Button>
//             <Mail className="mr-2 h-4 w-4" />
//             Contact Student
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
