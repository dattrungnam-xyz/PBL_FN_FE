import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import { Alert, Button, CircularProgress } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../api/account-api";
import { ResetPasswordRequest } from "../types/ResetPasswordRequest";
import PasswordTextField from "../../../components/UI/PasswordTextField";
import Link from "../../../components/UI/Link";

type NewPasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

const ResetPasswordPage: React.FC = () => {
  const { token = "" } = useParams();
  const newPasswordForm = useForm<NewPasswordForm>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
  });

  const handleSaveNewPassword: SubmitHandler<NewPasswordForm> = (data) => {
    const request: ResetPasswordRequest = {
      resetToken: token,
      password: data.newPassword,
      passwordConfirm: data.confirmPassword,
    };

    resetPasswordMutation.mutate(request);
  };

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "500px",
          padding: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          color="primary.main"
          sx={{ marginBottom: 1.25 }}
        >
          Tạo mật khẩu mới
        </Typography>

        {resetPasswordMutation.isError && (
          <Alert
            severity="error"
            onClose={() => resetPasswordMutation.reset()}
            sx={{ my: 1 }}
          >
            {resetPasswordMutation.error.message}
          </Alert>
        )}

        {!resetPasswordMutation.isSuccess && (
          <form onSubmit={newPasswordForm.handleSubmit(handleSaveNewPassword)}>
            <PasswordTextField
              label="Mật khẩu mới"
              register={newPasswordForm.register("newPassword", {
                required: "Nhập mật khẩu mới!",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
              sx={{ width: "100%", marginTop: "20px" }}
              error={!!newPasswordForm.formState.errors.newPassword}
              helperText={newPasswordForm.formState.errors.newPassword?.message}
            />

            <PasswordTextField
              label="Xác nhận mật khẩu mới"
              register={newPasswordForm.register("confirmPassword", {
                required: "Xác nhận mật khẩu mới!",
                validate: (value: string) =>
                  value === newPasswordForm.getValues("newPassword") ||
                  "Mật khẩu không khớp",
              })}
              sx={{ width: "100%", marginTop: "20px", marginBottom: "30px" }}
              error={!!newPasswordForm.formState.errors.confirmPassword}
              helperText={
                newPasswordForm.formState.errors.confirmPassword?.message
              }
            />

            <Button
              type="submit"
              variant="contained"
              disableRipple
              sx={{
                display: "block",
                width: "100%",
                boxShadow: "none",
                padding: "10px 16px",
                height: "48px",
              }}
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? (
                <CircularProgress size={20} />
              ) : (
                "Lưu"
              )}
            </Button>
          </form>
        )}

        {resetPasswordMutation.isSuccess && (
          <>
            <Alert severity="success" sx={{ my: 1 }}>
              Mật khẩu của bạn đã được đặt lại thành công!
            </Alert>
            <Link to="/account/login">
              <Button
                variant="contained"
                disableRipple
                sx={{
                  backgroundColor: "success.main",
                  color: "white",
                  width: "100%",
                  boxShadow: "none",
                  padding: "10px 16px",
                }}
              >
                Tiếp tục đăng nhập
              </Button>
            </Link>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
