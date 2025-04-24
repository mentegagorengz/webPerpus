export interface JwtPayload {
  userId: number;
  email: string;
  role?: string; // Optional for regular users
}
