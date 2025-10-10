export type Localization = {
  th: string;
  en: string;
};

export type Email = {
  personal: string;
  university: string;
};

export enum Role {
  STUDENT = 'student',
  ADMIN = 'admin',
}

export enum ProductStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
}
