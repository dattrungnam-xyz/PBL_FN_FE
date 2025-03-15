import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import RoundedInput from "../../../components/UI/RoundedInput";
import RoundedPasswordInput from "./RoundedPasswordInput";
import { postRegister } from "../api/account-api";
import CustomBackdrop from "../../../components/UI/CustomBackdrop";
import { Alert } from "@mui/material";

import { capitalizeFirstLetter } from "../../../utils/stringFormatter.ts";
import { toast } from "react-toastify";

interface FormData {
  username: string;
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
}

const validationRules = {
  username: {
    required: "Username is required",
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^\S+@\S+$/i,
      message: "Invalid email format",
    },
  },
  name: {
    required: "Name is required",
    minLength: {
      value: 6,
      message: "Name must be at least 6 characters long",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long",
    },
  },
  passwordConfirm: {
    required: "Confirm password is required",
  },
};

const RegisterPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  const navigate = useNavigate();

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: postRegister,
    onSuccess: () => {
      navigate("/account/login");
      toast.success("Register successful! Please login to continue.");
    },
  });

  let errorMessages;
  if (isError && error && error?.message) {
    if (Array.isArray(error.message)) {
      errorMessages = (
        <Stack spacing={0.25} component="ul">
          {error.message.map((message) => (
            <li>
              <Alert severity="error" onClose={() => reset()}>
                {capitalizeFirstLetter(message)}
              </Alert>
            </li>
          ))}
        </Stack>
      );
    } else {
      errorMessages = (
        <Alert severity="error" onClose={() => reset()}>
          {capitalizeFirstLetter(error.message)}
        </Alert>
      );
    }
  }

  const handleSubmitRegisterForm: SubmitHandler<FormData> = (data) => {
    console.log("Submit register form: ", data);
    mutate({ ...data, roles: ["user"] }); // temp
  };

  return (
    <>
      {isPending && <CustomBackdrop open />}

      <Stack sx={{ gap: 2, width: "100%" }}>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Register now to discover quality OCOP goods.
        </Typography>

        {isError && errorMessages}

        <form
          id="register-form"
          onSubmit={handleSubmit(handleSubmitRegisterForm)}
        >
          <Stack spacing={1}>
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
                  gap={0.4}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={validationRules.email}
              render={({ field }) => (
                <RoundedInput
                  {...field}
                  label="Email"
                  placeholder="Enter your email"
                  validationError={errors.email?.message}
                  gap={0.4}
                />
              )}
            />

            <Controller
              name="name"
              control={control}
              rules={validationRules.name}
              render={({ field }) => (
                <RoundedInput
                  {...field}
                  label="Name"
                  placeholder="Enter your name"
                  validationError={errors.name?.message}
                  gap={0.4}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={validationRules.password}
              render={({ field }) => (
                <RoundedPasswordInput
                  {...field}
                  label="Password"
                  placeholder="Enter your password"
                  validationError={errors.password?.message}
                  gap={0.4}
                />
              )}
            />

            <Controller
              name="passwordConfirm"
              control={control}
              rules={{
                ...validationRules.passwordConfirm,
                validate: (value: string) =>
                  value === getValues("password") || "Password does not match",
              }}
              render={({ field }) => (
                <RoundedPasswordInput
                  {...field}
                  label="Confirm Password"
                  placeholder="Retype your password"
                  validationError={errors.passwordConfirm?.message}
                  gap={0.4}
                />
              )}
            />
          </Stack>
        </form>
        <Button
          type="submit"
          form="register-form"
          variant="contained"
          sx={{
            backgroundColor: "success.main",
            borderRadius: "32px",
            py: "6px",
            width: { xs: "100%", lg: "230px" },
            alignSelf: { lg: "flex-end" },
          }}
        >
          Start Learning
        </Button>
      </Stack>
    </>
  );
};

export default RegisterPage;
