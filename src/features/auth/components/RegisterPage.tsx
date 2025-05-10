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
    required: "Tên tài khoản là bắt buộc",
  },
  email: {
    required: "Email là bắt buộc",
    pattern: {
      value: /^\S+@\S+$/i,
      message: "Định dạng email không hợp lệ",
    },
  },
  name: {
    required: "Name is required",
    minLength: {
      value: 6,
      message: "Tên phải có ít nhất 6 ký tự",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    },
  },
  passwordConfirm: {
    required: "Xác nhận mật khẩu là bắt buộc",
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
      toast.success("Đăng kí thành công. Vui lòng đăng nhập để tiếp tục.");
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
          Đăng kí ngay để khám phá sản phẩm OCOP chất lượng.
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
                  label="Tên tài khoản"
                  placeholder="Nhập tên tài khoản của bạn"
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
                  placeholder="Nhập email của bạn"
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
                  label="Tên"
                  placeholder="Nhập tên của bạn"
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
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu của bạn"
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
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu của bạn"
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
          Đăng kí
        </Button>
      </Stack>
    </>
  );
};

export default RegisterPage;
