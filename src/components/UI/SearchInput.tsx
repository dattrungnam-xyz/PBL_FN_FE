import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps & OutlinedInputProps> = ({
  onChange,
  sx,
  ...props
}) => {
  return (
    <FormControl>
      <OutlinedInput
        placeholder="Search"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
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
