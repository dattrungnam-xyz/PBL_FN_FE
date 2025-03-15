import { forwardRef } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import OutlinedInput, { OutlinedInputProps } from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

import InputProps from "../../features/auth/types/InputProps";
import { SxProps } from "@mui/material";

interface CustomRoundedInputProps extends InputProps {
  labelColor?: string;
  borderRadius?: number;
  padding?: string;
  inputSx?: SxProps;
}

export type RoundedInputProps = CustomRoundedInputProps & OutlinedInputProps;

const RoundedInput = forwardRef<
  unknown | null,
  CustomRoundedInputProps & OutlinedInputProps
>(
  (
    {
      id,
      name,
      label,
      placeholder = "",
      validationError = "",
      gap = 1,
      padding = "12px 32px",
      borderRadius = 32,
      labelColor = "secondary.dark",
      requiredSign = false,
      inputSx, // sx pass to OutlinedInput
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(validationError);

    return (
      <Stack spacing={gap}>
        {label && (
          <Typography
            component="label"
            sx={{ color: labelColor }}
            htmlFor={id || `#${label}`}
          >
            {label}
            {requiredSign && (
              <Typography color="error" component="span">
                *
              </Typography>
            )}
          </Typography>
        )}
        <FormControl error={hasError}>
          <OutlinedInput
            id={id || `#${label}`}
            name={name}
            placeholder={placeholder}
            ref={ref}
            {...props} // Spread props like value, onChange, onBlur from React Hook Form
            sx={{
              borderRadius: `${borderRadius}px`,
              "& fieldset": { borderColor: "text.secondary" },
              "& input": { padding: padding },
              ...inputSx,
            }}
          />
          {hasError && <FormHelperText>{validationError}</FormHelperText>}
        </FormControl>
      </Stack>
    );
  },
);

export default RoundedInput;
