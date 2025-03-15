import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvatarsURL } from "@/constants/config";
import { createCourseSchema } from "@/schema/course/schema";
import { GetCourseApi, GetSingleCourseApi } from "@/store/course/slice";
import {
  DeleteEnrollmentApi,
  GetEnrollmentApi,
} from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import { Badge, GraduationCap, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const EnrollmentManagement = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [singleCourseData, setSingleCourseData] = useState(null);
  const [searchStud, setSearchStud] = useState("");
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<string | null>(
    null
  ); // Track enrollment to delete

  const { data: courseData } = useSelector(
    (state: any) => state["CourseStore"]
  );

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    if (selectedCourse) {
      const course = courseData.find(
        (course: any) => course.id === selectedCourse
      );
      setSingleCourseData(course);
      setUserEnrollments(course?.enrollments);
      if (searchStud.length > 0) {
        const filteredUser = course.enrollments?.filter((enroll: any) =>
          enroll.user?.username.toLowerCase()?.trim().startsWith(searchStud)
        );
        setUserEnrollments(filteredUser);
      }
    }
  }, [selectedCourse, searchStud, courseData]);

  const handleRemoveClick = (id: string) => {
    // Instead of directly deleting, open the modal and set the enrollment to delete
    setEnrollmentToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (enrollmentToDelete) {
      const response = await dispatch(
        DeleteEnrollmentApi({
          id: enrollmentToDelete,
        })
      );
      if (response.meta.requestStatus === "fulfilled") {
        // Optionally, refresh the enrollment list or update state
        setUserEnrollments((prev) =>
          prev.filter((enroll: any) => enroll.id !== enrollmentToDelete)
        );
      }
    }
    setIsModalOpen(false); // Close the modal
    setEnrollmentToDelete(null); // Reset the enrollment to delete
    toast.success("Enrollment deleted successfully");
    router.refresh();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEnrollmentToDelete(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Enrollments</CardTitle>
        <CardDescription>
          Manage student enrollments for all courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Select onValueChange={(value) => setSelectedCourse(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {courseData.map((course: any) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Search students..."
              className="flex-1"
              onChange={(e) => setSearchStud(e.target.value)}
            />
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Student
            </Button>
          </div>
          {userEnrollments.map((enroll: any) => (
            <div key={enroll.id} className="border rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between pb-3">
                {/* Left Section - Avatar & Name */}
                <div className="flex items-center gap-4">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <img
                    src={
                      enroll?.user?.avatar ||
                      `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
                        enroll?.user?.username?.trim()
                      )}`
                    }
                    width={50}
                    height={50}
                    alt="Profile Image"
                    className="rounded-full"
                  />
                  <span className="font-medium text-lg">
                    {enroll?.user?.username}
                  </span>
                </div>

                {/* Right Section - Action Buttons */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="hover:bg-red-600 transition"
                  onClick={() => handleRemoveClick(enroll?.id)} // Trigger modal instead of delete
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this enrollment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
