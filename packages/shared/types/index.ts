// User types
export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type NewUser = Pick<User, "name" | "email">;

// Session types
export type Session = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type NewSession = Pick<Session, "userId" | "token" | "expiresAt">;

// Account types
export type Account = {
  id: string;
  userId: string;
  accountId: string;
  providerId: string;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  idToken: string | null;
  password: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type NewAccount = Pick<Account, "userId" | "accountId" | "providerId"> & Partial<Pick<Account, "accessToken" | "refreshToken" | "accessTokenExpiresAt" | "refreshTokenExpiresAt" | "scope" | "idToken" | "password">>;

// Verification types
export type Verification = {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type NewVerification = Pick<Verification, "identifier" | "value" | "expiresAt">;

// Ambition types
export type Ambition = {
  id: string;
  userId: string;
  ambitionName: string;
  ambitionDefinition: string | null;
  ambitionTrackingMethod: "task" | "milestone";
  ambitionStartDate: Date;
  ambitionEndDate: Date;
  ambitionCompletionDate: Date | null;
  ambitionStatus: "active" | "completed" | "missed";
  ambitionPriority: "low" | "medium" | "high";
  ambitionPercentageCompleted: number;
  ambitionColor: string;
  isFavourited: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type NewAmbition = Pick<Ambition, "userId" | "ambitionName" | "ambitionTrackingMethod" | "ambitionStartDate" | "ambitionEndDate"> &
  Partial<Pick<Ambition, "ambitionDefinition" | "ambitionCompletionDate" | "ambitionStatus" | "ambitionPriority" | "ambitionPercentageCompleted" | "ambitionColor" | "isFavourited">>;

// Task types
export type Task = {
  id: string;
  userId: string;
  ambitionId: string;
  task: string;
  taskDescription: string | null;
  taskCompleted: boolean;
  taskDeadline: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type NewTask = Pick<Task, "userId" | "ambitionId" | "task" | "taskDeadline"> & Partial<Pick<Task, "taskDescription" | "taskCompleted">>;

// Milestone types
export type Milestone = {
  id: string;
  userId: string;
  ambitionId: string;
  milestone: string;
  milestoneDescription: string | null;
  milestoneCompleted: boolean;
  milestoneTargetDate: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type NewMilestone = Pick<Milestone, "userId" | "ambitionId" | "milestone" | "milestoneTargetDate"> & Partial<Pick<Milestone, "milestoneDescription" | "milestoneCompleted">>;

// Note types
export type Note = {
  id: string;
  userId: string;
  ambitionId: string;
  note: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type NewNote = Pick<Note, "userId" | "ambitionId" | "note">;

// Settings types
export type Settings = {
  id: string;
  userId: string;
  userTimezone: string;
  emailAccountActivity: boolean;
  pushAmbitionReminders: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type NewSettings = Pick<Settings, "userId" | "userTimezone"> & Partial<Pick<Settings, "emailAccountActivity" | "pushAmbitionReminders">>;
