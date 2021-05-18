export enum UserStatus {
  APPROVED = 'APPROVED',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum UserType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Language {
  ENGLISH = 'English',
  FRENCH = 'French',
  SPANISH = 'Spanish',
}

export enum ProviderType {
  GOOGLE = 'GOOGLE',
}

export interface User {
  email: string;
  type: UserType;
  status: UserStatus;
  firstName: string;
  lastName: string;
  createdAt: number;
  lastLogin: number;
  preferredLanguage?: Language;
  providerType: ProviderType;
  providerSubjectId: string;
  scope: string[];
}

export type EgoJwtData = {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
  aud: string[];
  jti: string;
  context: {
    scope: string[];
    user: User;
  };
};

export interface UserWithId extends User {
  id: string;
}
