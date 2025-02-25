import {
  Select,
  SelectProps,
  Stack,
  Typography,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { forwardRef } from "react";

interface BootstrapSelectProps {
  itemLabels: string[];
  itemValues: Array<string | number>;
  gap?: number;
  requiredSign?: boolean;
  validationError?: string;
}

const BootstrapSelect = forwardRef<
  HTMLInputElement,
  BootstrapSelectProps & SelectProps
>((props, ref) => {
  const {
    itemLabels,
    itemValues,
    gap = 0.5,
    label,
    requiredSign = false,
    validationError,
    ...rest
  } = props;

  return (
    <Stack spacing={gap}>
      <Typography component="label" htmlFor={props.id}>
        {label}
        {requiredSign && (
          <Typography color="error" component="span">
            *
          </Typography>
        )}
      </Typography>
      <Select {...rest} inputRef={ref}>
        {itemLabels.map((label, index) => (
          <MenuItem key={index} value={itemValues[index]}>
            {label}
          </MenuItem>
        ))}
      </Select>
      {validationError && <FormHelperText>{validationError}</FormHelperText>}
    </Stack>
  );
});

// const BootstrapSelect: React.FC<BootstrapSelectProps & SelectProps> = (
//   props,
// ) => {
//   const {
//     itemLabels,
//     itemValues,
//     gap = 0.5,
//     label,
//     requiredSign = false,
//     validationError,
//     ...rest
//   } = props;

//   return (
//     <Stack spacing={gap}>
//       <Typography component="label" htmlFor={props.id}>
//         {label}
//         {requiredSign && (
//           <Typography color="error" component="span">
//             *
//           </Typography>
//         )}
//       </Typography>
//       <Select {...rest}>
//         {itemLabels.map((label, index) => (
//           <MenuItem key={index} value={itemValues[index]}>
//             {label}
//           </MenuItem>
//         ))}
//       </Select>
//       {validationError && <FormHelperText>{validationError}</FormHelperText>}
//     </Stack>
//   );
// };

export default BootstrapSelect;
