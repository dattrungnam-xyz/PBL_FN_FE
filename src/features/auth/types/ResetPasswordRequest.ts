export interface ResetPasswordRequest {
  password: string;
  passwordConfirm: string;
  resetToken: string;
}
