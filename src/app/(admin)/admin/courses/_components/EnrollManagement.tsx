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
import { createCourseSchema } from "@/schema/course/schema";
import { GetCourseApi, GetSingleCourseApi } from "@/store/course/slice";
import { GetEnrollmentApi } from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import { Badge, GraduationCap, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const EnrollmentManagement = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [singleCourseData, setSingleCourseData] = useState(null);
  const [searchStud, setSearchStud] = useState("");
  const [userEnrollments, setUserEnrollments] = useState([]);
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
  }, [selectedCourse, searchStud]);
  console.log(singleCourseData, "Ccc");

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
            <div key={enroll.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{enroll?.user?.username}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
