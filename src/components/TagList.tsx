import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Popover from "@mui/material/Popover";
import { ReactNode, useState } from "react";

interface TagsListProps {
  limit?: number;
  items: ReactNode[] | unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format?: (value: any) => ReactNode;
  disabled?: boolean;
}

const styles = { m: 0.2, fontSize: 12, height: 26 };

const TagsList: React.FC<TagsListProps> = ({
  items,
  format = (value) => value,
  limit = 2,
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!items) {
    return null;
  }

  return (
    <>
      {items.slice(0, limit).map((item, index) => (
        <Chip key={index} label={format(item)} sx={styles} />
      ))}

      {items.length > limit ? (
        <Chip
          label={`+${items.length - limit}`}
          sx={{ ...styles, cursor: "pointer", color: disabled ? "grey" : "" }}
          onClick={handleClick}
        />
      ) : null}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 1, maxWidth: 250 }}>
          {items.slice(limit).map((item, index) => (
            <Chip key={index} label={format(item)} sx={styles} />
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default TagsList;
