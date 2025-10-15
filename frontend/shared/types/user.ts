import type { Localization } from "../common/localization"
import type { Arts } from "./art"

export interface UserProfile {
  _id: string
  photo: string
  username: Localization
  studentId: string
  email: Email
  role: string
  tel: string
  createdAt: string
  arts: Arts[]
}

export interface Email {
  personal: string
  university: string
}