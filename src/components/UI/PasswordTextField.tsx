import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type PasswordTextFieldProps = {
  register?: UseFormRegisterReturn; // react-hook-form register
};

const PasswordTextField: React.FC<PasswordTextFieldProps & TextFieldProps> = ({
  register,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <TextField
      {...props}
      ref={register?.ref}
      onChange={register?.onChange}
      onBlur={register?.onBlur}
      name={register?.name}
      type={showPassword ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordTextField;
