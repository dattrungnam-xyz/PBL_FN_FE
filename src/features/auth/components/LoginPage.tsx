import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import RoundedInput from "../../../components/UI/RoundedInput";
import RoundedPasswordInput from "./RoundedPasswordInput";

import { authActions } from "../../../stores/authSlice";
import { AppDispatch } from "../../../stores";
import CustomBackdrop from "../../../components/UI/CustomBackdrop";
import { Alert, Divider } from "@mui/material";
import { loginGoggle, postLogin } from "../api/account-api";
import LoginResponse from "../types/LoginResponse";
import { useGoogleLogin } from "@react-oauth/google";
import Link from "../../../components/UI/Link";
import { canAccessAdminPage } from "../../../types/auth";
import GoogleIcon from "../../../assets/icons/google.svg";
import { Image } from "../../../components/UI/Image";

interface FormData {
  username: string;
  password: string;
}

const validationRules = {
  username: {
    required: "Username is required",
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long",
    },
  },
};

const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const loginGg = useGoogleLogin({
    flow: "implicit",
    onSuccess: (response: { access_token: string }) => {
      loginGoogleMutation.mutate(response.access_token);
    },
    onError: (error) => {
      toast.error("Please try another way to login!");
      console.error("Google login error: ", error);
    },
  });

  const handleLoginSuccess = useCallback(
    (responseData: LoginResponse) => {
      dispatch(
        authActions.login({
          token: responseData.token,
          refreshToken: responseData.refreshToken,
          user: responseData.user,
        }),
      );

      if (canAccessAdminPage(responseData.user)) {
        navigate("/admin");
      } else {
        navigate("/");
      }

      toast.success("Login successful!");
    },
    [dispatch, navigate],
  );

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: postLogin,
    onSuccess: handleLoginSuccess,
  });

  const loginGoogleMutation = useMutation({
    mutationFn: loginGoggle,
    onSuccess: handleLoginSuccess,
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    mutate(data);
  };

  return (
    <>
      {isPending && <CustomBackdrop open />}

      <Stack sx={{ gap: 2, width: "100%" }}>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Sign in to explore our OCOP marketplace.
        </Typography>
        {isError && (
          <Alert severity="error" onClose={() => reset()}>
            {error?.message || "Something went wrong!"}
          </Alert>
        )}
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={1}>
            {/* Username Field */}
            <Controller
              name="username"
              control={control}
              rules={validationRules.username}
              render={({ field }) => (
                <RoundedInput
                  {...field}
                  label="User name"
                  placeholder="Enter your user name"
                  validationError={errors.username?.message}
                />
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={control}
              rules={validationRules.password}
              render={({ field }) => (
                <RoundedPasswordInput
                  {...field} // Pass form field props (value, onChange, etc.)
                  label="Password"
                  placeholder="Enter your password"
                  validationError={errors.password?.message}
                />
              )}
            />

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <FormControlLabel control={<Checkbox />} label="Remember me" />
              <Link
                to="/forgot-password"
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>
          </Stack>
        </form>

        <Stack spacing={1.5}>
          <Button
            type="submit"
            form="login-form"
            variant="contained"
            sx={{
              backgroundColor: "success.main",
              borderRadius: "32px",
              py: "6px",
              width: "100%",
              alignSelf: { lg: "flex-end" },
              marginBottom: "-16px",
            }}
          >
            Login
          </Button>
          <Divider
            sx={{
              color: "text.secondary",
              fontSize: "14px",
              px: "20%",
            }}
          >
            Or
          </Divider>
          <Button
            onClick={() => loginGg()}
            variant="outlined"
            startIcon={
              <Image
                src={GoogleIcon}
                alt="Google Icon"
                sx={{ width: "18px", height: "18px" }}
              />
            }
            sx={{
              borderRadius: "32px",
              py: "6px",
              width: "100%",
              alignSelf: { lg: "flex-end" },
              marginBottom: "-16px",
              border: "1px solid #dadce0",
              color: "text.primary",
              fontWeight: "400",
            }}
          >
            Login with Google
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default LoginPage;
