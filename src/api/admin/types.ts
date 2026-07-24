import type { User } from "../user/types";

export interface Admin {
  name: string;
  email: string;
  role: string;
}

export interface AdminGetUsersRequest {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  email?: string;
}

export interface AdminGetUsersResponse {
  users: User[];
}
