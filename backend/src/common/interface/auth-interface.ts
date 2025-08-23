import { Localization } from "../types/types";

export interface JwtPayload {
  sub: string;
  studentId: string;
  username: Localization;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthUser {
  _id: string;
  studentId: string;
  username: Localization;
  role: string;
}

export interface LoginResult {
  access_Token: string;
}