export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  age: number;
  weight: number;
  gender: UserGender;
  height: number;
  activityLevel: UserActivityLevel;
  avatarUrl: string;
};

export type UserActivityLevel = "малий" | "середній" | "високий";

export type UserGender = "чоловік" | "жінка";
