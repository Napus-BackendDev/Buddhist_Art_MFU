import type { Localization } from "../common/localization";
import type { Arts } from "./art";

export interface User {
  _id: string;
  photo: string;
  username: Localization;
  studentId: string;
  email: Email;
  password?: string;
  role: string;
  tel: string;
  createdAt: string;
  arts: Arts[];
}

export interface Email {
  personal: string;
  university: string;
}
