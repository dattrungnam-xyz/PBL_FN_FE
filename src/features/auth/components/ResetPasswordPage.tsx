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
          Create New Password
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
              label="New Password"
              register={newPasswordForm.register("newPassword", {
                required: "Enter your new password!",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              sx={{ width: "100%", marginTop: "20px" }}
              error={!!newPasswordForm.formState.errors.newPassword}
              helperText={newPasswordForm.formState.errors.newPassword?.message}
            />

            <PasswordTextField
              label="Confirm Password"
              register={newPasswordForm.register("confirmPassword", {
                required: "Confirm your new password!",
                validate: (value: string) =>
                  value === newPasswordForm.getValues("newPassword") ||
                  "Password does not match",
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
                "Save"
              )}
            </Button>
          </form>
        )}

        {resetPasswordMutation.isSuccess && (
          <>
            <Alert severity="success" sx={{ my: 1 }}>
              Your password has been reset successfully!
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
                Continue to login
              </Button>
            </Link>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
