import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Close } from "@mui/icons-material";
import { useRef } from "react";

interface SearchInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps & OutlinedInputProps> = ({
  onChange,
  sx,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isEmpty = !inputRef?.current || !inputRef.current.value;

  const handleClearInput = () => {
    if (!inputRef.current) return;

    inputRef.current.value = "";
    inputRef.current.focus();
    onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
  };
  return (
    <FormControl>
      <OutlinedInput
        inputRef={inputRef}
        placeholder="Search"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment
            position="end"
            sx={{
              visibility: isEmpty ? "hidden" : "visible",
              cursor: "pointer",
            }}
            onClick={handleClearInput}
          >
            <Close sx={{ fontSize: "16px" }} />
          </InputAdornment>
        }
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          ...sx,
        }}
        onChange={onChange}
        {...props}
      />
    </FormControl>
  );
};

export default SearchInput;
