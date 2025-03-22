"use client";

import type React from "react";
import { useEffect, useState } from "react";
import PageHeader from "@/components/LayoutContent/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Book,
  Users,
  Layers,
  Plus,
  Edit,
  FileText,
  PlusSquare,
  Trash,
} from "lucide-react";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
import {
  AddCategoryApi,
  GetCategoryApi,
  DeleteCategoryApi,
  EditCategoryApi,
} from "@/store/category/slice";
import { GetCourseApi } from "@/store/course/slice";
import { useSession } from "next-auth/react";
import ChapterManagement from "./_components/chapter-management";
import { useRouter } from "next/navigation";
import { EnrollmentManagement } from "./_components/EnrollManagement";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const courseFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  isFree: z.boolean().optional(),
  level: z.string().optional(),
});

interface CourseType {
  id: string;
  title: string;
  enrolled: number;
  chapters: any[];
  status: "ACTIVE" | "DRAFT";
}

export default function CourseManagement() {
  const [activeTab, setActiveTab] = useState("courses");
  const { data: categoryData } = useSelector(
    (state: any) => state["CategoryStore"]
  );
  const [category, setCategory] = useState("");
  const { data: courseData } = useSelector(
    (state: any) => state["CourseStore"]
  );
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [dialogState, setDialogState] = useState<{
    addCategory: boolean;
    editCategory: string | null; // Changed to store category ID or null
    deleteCategory: string | null; // Changed to store category ID or null
  }>({
    addCategory: false,
    editCategory: null,
    deleteCategory: null,
  });
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(GetCourseApi({ searchParams: {} }));
    }
  }, [session?.user?.id, dispatch]);

  useEffect(() => {
    dispatch(GetCategoryApi());
  }, [dispatch]);

  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      isFree: false,
      level: "",
    },
  });

  const CourseCard: React.FC<{ course: any }> = ({ course }) => (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">{course.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <Users className="h-4 w-4" /> {course?.enrollments?.length} enrolled
            <Layers className="h-4 w-4 ml-2" /> {course.chapters.length}{" "}
            chapters
          </CardDescription>
        </div>
        <Badge
          variant={course.status === "ACTIVE" ? "secondary" : "destructive"}
        >
          {course.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/courses/${course.id}`)}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const handleSubmit = async (values: z.infer<typeof courseFormSchema>) => {
    form.reset();
  };

  const handleAddCategory = async () => {
    if (category === "") {
      toast.error("Please enter a category");
      return;
    }
    const formData = new FormData();
    formData.append("name", category);
    await dispatch(
      AddCategoryApi({ values: formData, requiredFields: ["name"] })
    );
    dispatch(GetCategoryApi());
    setCategory("");
    setDialogState((prev) => ({ ...prev, addCategory: false }));
  };

  const handleEditCategory = async (categoryId: string) => {
    if (editCategoryName === "") {
      toast.error("Please enter a category name");
      return;
    }

    const formData = new FormData();
    formData.append("name", editCategoryName);

    try {
      await dispatch(
        EditCategoryApi({
          id: categoryId,
          values: formData,
          requiredFields: ["name"],
        })
      );
      setEditCategoryName("");
      dispatch(GetCategoryApi());
      toast.success("Category updated successfully");
      setDialogState((prev) => ({ ...prev, editCategory: null }));
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await dispatch(DeleteCategoryApi({ id: categoryId }));
    toast.success("Category deleted successfully");
    dispatch(GetCategoryApi());
    setDialogState((prev) => ({ ...prev, deleteCategory: null }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        headerTitle="Course Management"
        renderRight={() => (
          <>
            <Button
              onClick={() => router.push("/admin/courses/create")}
              className="ms-3"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Course
            </Button>
          </>
        )}
      />

      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="courses" className="flex items-center">
            <Book className="h-4 w-4 mr-1" /> Courses
          </TabsTrigger>
          <TabsTrigger value="chapters" className="flex items-center">
            <FileText className="h-4 w-4 mr-1" /> Chapters
          </TabsTrigger>
          <TabsTrigger value="enrollments" className="flex items-center">
            <Users className="h-4 w-4 mr-1" /> Enrollments
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center">
            <Layers className="h-4 w-4 mr-1" /> Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          {courseData.length > 0 ? (
            courseData
              .filter((course: any) =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((course: any) => (
                <CourseCard key={course.id} course={course} />
              ))
          ) : (
            <p>No courses available.</p>
          )}
        </TabsContent>

        <TabsContent value="chapters" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Management</CardTitle>
              <CardDescription>
                Manage chapters and topics for each course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => setSelectedCourse(value)}>
                <SelectTrigger className="w-full mb-4">
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
              {selectedCourse && (
                <ChapterManagement courseId={selectedCourse} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollments" className="mt-6">
          <EnrollmentManagement />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>
                Manage categories for your courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Input
                  placeholder="Search categories..."
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="max-w"
                />
                <Dialog
                  open={dialogState.addCategory}
                  onOpenChange={(open) =>
                    setDialogState((prev) => ({ ...prev, addCategory: open }))
                  }
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-1" /> Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px] px-4">
                    <DialogHeader>
                      <DialogTitle>Add Category</DialogTitle>
                      <DialogDescription>
                        Create a new category for your courses.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Category Name
                        </Label>
                        <Input
                          id="category"
                          name="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddCategory}>
                        Add
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {categoryData && categoryData.length > 0 ? (
                  categoryData
                    .filter((cat: any) =>
                      cat.name
                        .toLowerCase()
                        .includes(searchCategory.toLowerCase())
                    )
                    .map((cat: any) => (
                      <Card key={cat.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{cat.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {
                                courseData.filter(
                                  (course: any) => course.categoryId === cat.id
                                ).length
                              }{" "}
                              courses
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Dialog
                              open={dialogState.editCategory === cat.id}
                              onOpenChange={(open) =>
                                setDialogState((prev) => ({
                                  ...prev,
                                  editCategory: open ? cat.id : null,
                                }))
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditCategoryName(cat.name)}
                                >
                                  <Edit className="h-4 w-4 mr-1" /> Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Category</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="editCategory"
                                      className="text-right"
                                    >
                                      Category Name
                                    </Label>
                                    <Input
                                      id="editCategory"
                                      value={editCategoryName}
                                      onChange={(e) =>
                                        setEditCategoryName(e.target.value)
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() => handleEditCategory(cat.id)}
                                  >
                                    Save Changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog
                              open={dialogState.deleteCategory === cat.id}
                              onOpenChange={(open) =>
                                setDialogState((prev) => ({
                                  ...prev,
                                  deleteCategory: open ? cat.id : null,
                                }))
                              }
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash className="h-4 w-4 mr-1" /> Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Category</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <span className="text-center">
                                    Are you sure you want to delete this
                                    category?
                                  </span>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() => handleDeleteCategory(cat.id)}
                                  >
                                    Confirm
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </Card>
                    ))
                ) : (
                  <p>No categories available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
