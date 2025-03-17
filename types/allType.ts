// Enum Types
enum Role {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
}

enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

enum CourseLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

enum EnrollmentStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// Model Interfaces
export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  role: Role;
  phone?: string;
  avatar?: string;
  avatarKey?: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  gamificationPoints: number;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  subscriptionStatus?: SubscriptionStatus;
  authoredCourses?: Course[];
  enrollments?: Enrollment[];
  certificates?: Certificate[];
  blogs?: Blog[];
  liveClasses?: LiveClass[];
  UserProgress?: UserProgress[];
  QuizProgress?: QuizProgress[];
  teacherPaymentReq?: TeacherPaymentRequest[];
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  publicKey?: string;
  price?: number;
  isFree: boolean;
  status: BlogStatus;
  level: CourseLevel;

  // Relations
  instructorId: string;
  instructor: User;
  categoryId?: string;
  category?: Category;

  createdAt: Date;
  updatedAt: Date;

  chapters?: Chapter[];
  enrollments?: Enrollment[];
  liveClasses?: LiveClass[];
  certificates?: Certificate[];
  teacherPaymentReq?: TeacherPaymentRequest[];
}

interface Category {
  id: string;
  name: string;

  createdAt: Date;
  updatedAt: Date;

  course?: Course[];
}

export interface Enrollment {
  id: string;
  status: EnrollmentStatus;
  orderId?: string;
  price?: number;
  receipt?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  payment_status?: PaymentStatus;

  // Relations
  userId: string;
  user: User;
  courseId: string;
  course: Course;

  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  order?: number;
  status: BlogStatus;

  // Relations
  courseId: string;
  course: Course;

  createdAt: Date;
  updatedAt: Date;

  topics?: Topic[];
  quiz?: Quiz[];
  resources?: Resource[];
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  order?: number;
  video?: string;
  duration?: number;
  status: BlogStatus;
  isFree: boolean;

  // Relations
  chapterId: string;
  chapter: Chapter;

  createdAt: Date;
  updatedAt: Date;

  muxData?: MuxData;
  userProgress?: UserProgress[];
}

export interface Resource {
  id: string;
  title: string;
  url?: string;
  type?: string;
  // Relations
  chapterId: string;
  chapter: Chapter;

  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  passingScore?: number;
  timeLimit?: number;
  order?: number;
  status: BlogStatus;

  // Relations
  chapterId: string;
  chapter: Chapter;

  createdAt: Date;
  updatedAt: Date;

  questions?: Question[];
  completedBy?: QuizProgress[];
}

export interface Question {
  id: string;
  title: string;
  order?: number;
  points?: number;
  status: BlogStatus;

  // Relations
  answerId?: string;
  answer?: Option;
  quizId: string;
  quiz: Quiz;

  createdAt: Date;
  updatedAt: Date;

  options?: Option[];
  answeredByUsers?: QuizAnswer[];
}

export interface Option {
  id: string;
  title: string;
  order?: number;
  status: BlogStatus;

  // Relations
  questionId: string;
  question: Question;

  createdAt: Date;
  updatedAt: Date;

  correctForQuestion?: Question[];
  choosedByUsers?: QuizAnswer[];
}

export interface LiveClass {
  id: string;
  courseId: string;
  instructorId: string;
  title: string;
  description?: string;
  scheduledAt?: Date;
  duration?: number;
  meetingUrl?: string;
  maxParticipants?: number;
  enrolledParticipants?: string[];

  // Relations
  course: Course;
  instructor: User;

  createdAt: Date;
  updatedAt: Date;
}

export interface Blog {
  id: string;
  authorId: string;
  title: string;
  content?: string;
  tags: string[];
  publishedAt?: Date;
  status: BlogStatus;
  featuredImage: string;

  // Relations
  author: User;

  createdAt: Date;
  updatedAt: Date;
}

export interface Certificate {
  id: string;
  issueDate?: Date;
  template?: string;
  verificationCode?: string;

  // Relations
  userId: string;
  user: User;
  courseId: string;
  course: Course;

  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration?: number;
  maxFreeCourses?: number;
  features: string[];
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;

  // Relations
  subscriptionStatuses?: SubscriptionStatus[];
}

export interface SubscriptionStatus {
  id: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  freeCourseCount: number;

  // Relations
  userId: string;
  user: User;
  planId: string;
  plan: SubscriptionPlan;

  createdAt: Date;
  updatedAt: Date;
}

export interface MuxData {
  id: string;
  assetId: string;
  playbackId?: string;

  topicId: string;
  topic: Topic;

  createdAt: Date;
  updatedAt: Date;
}

interface UserProgress {
  id: string;
  isCompleted: boolean;

  topicId: string;
  topic: Topic;
  userId: string;
  user: User;

  createdAt: Date;
  updatedAt: Date;
}

interface QuizProgress {
  id: string;
  isCompleted: boolean;
  correct?: number;
  wrong?: number;

  quizId: string;
  quiz: Quiz;
  userId: string;
  user: User;

  createdAt: Date;
  updatedAt: Date;
  userAnswers?: QuizAnswer[];
}

interface QuizAnswer {
  id: string;
  isCorrect?: boolean;

  answerId?: string;
  answer?: Option;

  questionId: string;
  question: Question;

  quizProgressId: string;
  quizDetails: QuizProgress;

  createdAt: Date;
  updatedAt: Date;
}

interface TeacherPaymentRequest {
  id: string;
  userId: string;
  user: User;
  courseId: string;
  course: Course;
  amount: number;
  status: RequestStatus;
  createdAt: Date;
}
