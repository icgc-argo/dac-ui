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
  ORCID = 'ORCID',
  LINKEDIN = 'LINKEDIN',
  GITHUB = 'GITHUB',
  FACEBOOK = 'FACEBOOK',
}

export interface User {
  email: string;
  type: UserType;
  status: UserStatus;
  firstName: string;
  lastName: string;
  createdAt: number;
  lastLogin: number;
  preferredLanguage?: string | undefined;
  providerType: ProviderType;
  providerSubjectId: string;
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
