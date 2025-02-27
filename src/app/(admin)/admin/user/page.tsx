"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import createUserSchema from "@/schema/user/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
// import PageHeader from "@/components/LayoutContent/PageHeader";
// import { User } from "../../../../types/User";
// import { ApiResponse } from "../../../../types/ApiResponse";
import { Ban, UserCheck, History, Shield, Mail } from "lucide-react";
import { ApiResponse } from "../../../../../types/ApiResponse";
import PageHeader from "@/components/LayoutContent/PageHeader";
import { User } from "../../../../../types/User";
import Loading from "@/components/Sidebar/Loading";
import { Skeleton } from "@/components/ui/skeleton";
import { APIClient } from "@/helpers/apiHelper";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Name is required and must be at least 2 characters long",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits long",
  }),
  role: z.string().min(1, {
    message: "Role is required",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});
export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  const getUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const jsonRes: ApiResponse = await response.json();
      const { result } = jsonRes;
      const exceptAdmin = result?.filter((res: User) => res.role !== "ADMIN");
      setUsers(exceptAdmin as User[]);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      role: "",
      password: "",
      phone: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const api = new APIClient();
      const formData = new FormData();

      // Populate formData with values, ensuring strings
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.set(key, String(val));
        }
      });
      console.log(formData.get("username"));

      // // Log formData contents for debugging
      // for (let [key, val] of formData.entries()) {
      //   console.log(`FormData: ${key} = ${val}`);
      // }
      console.log("Values:", formData, values);

      // Send to API
      const response = await api.create("/users", formData, {
        "Content-Type": "multipart/form-data",
      });
      console.log(response, "response");

      if (!response.status) {
        // Adjust based on your API response
        throw new Error("Failed to create user");
      }

      await getUsers();
      form.reset();
      setshow;
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    // try {
    //   const response = await fetch(`/api/users/${userId}/role`, {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ role: newRole }),
    //   });
    //   if (!response.ok) {
    //     throw new Error("Failed to update user role");
    //   }
    //   await getUsers();
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      const formData = new FormData();
      const value = !selectedUser?.isBlocked;
      formData.append("isBlocked", String(value));
      const api = new APIClient();
      const response = await api.update(`/users/${userId}`, formData, {
        "Content-Type": "multipart/form-data",
      });
      if (!response) {
        throw new Error("Failed to block user");
      }
      await getUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // try {
    //   const response = await fetch(`/api/users/${userId}`, {
    //     method: "DELETE",
    //   });
    //   if (!response.ok) {
    //     throw new Error("Failed to delete user");
    //   }
    //   await getUsers();
    //   setShowDeleteDialog(false);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const handleSendPasswordReset = async (userId: string) => {
    // try {
    //   const response = await fetch(`/api/users/${userId}/reset-password`, {
    //     method: "POST",
    //   });
    //   if (!response.ok) {
    //     throw new Error("Failed to send password reset");
    //   }
    //   // Show success message
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        headerTitle="User Management"
        renderRight={() => (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
              </DialogHeader>
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                  encType="multipart/form-data"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="STUDENT">Student</SelectItem>
                            <SelectItem value="TEACHER">Instructor</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter mobile number"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </FormProvider>
            </DialogContent>
          </Dialog>
        )}
      />

      <div className="flex justify-between items-center">
        <Input
          className="w-64"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 && <div>No Data Found</div>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  defaultValue={user.role}
                  onValueChange={(value) => handleUpdateRole(user.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TEACHER">Instructor</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Badge variant={user.isBlocked ? "destructive" : "secondary"}>
                  {user.isBlocked ? "Blocked" : "Active"}
                </Badge>
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowBlockDialog(true);
                  }}
                >
                  {user.isBlocked ? (
                    <UserCheck className="h-4 w-4" />
                  ) : (
                    <Ban className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleSendPasswordReset(user.id)}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Shield className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Block/Unblock Dialog */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.isBlocked ? "Unblock User" : "Block User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.isBlocked
                ? "Are you sure you want to unblock this user? They will regain access to the system."
                : "Are you sure you want to block this user? They will lose access to the system."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser && handleBlockUser(selectedUser.id)}
            >
              {selectedUser?.isBlocked ? "Unblock" : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
