//Production
export const NODE_APP_URL = "https://academix-learning.netlify.app";
// export const NODE_APP_URL = "http://localhost:3000";
// export const NODE_APP_URL =
//   process.env.NODE_ENV === "production"
//     ? "https://academix-learning.netlify.app"
//     : "http://localhost:3000";

// Local
export const USER_UPLOAD_PATH = "uploads/users";
export const COURSE_UPLOAD_PATH = "uploads/courses/images";
export const VALID_STATUS = ["DRAFT", "PUBLISHED"] as const;
export const VALID_ROLES = ["STUDENT", "TEACHER"] as const;
export const AvatarsURL = "https://api.dicebear.com/9.x/avataaars/svg?seed";
