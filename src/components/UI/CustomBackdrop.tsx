import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const CustomBackdrop: React.FC<{ open?: boolean }> = ({ open = true }) => {
  return (
    <Backdrop
      sx={(theme) => ({
        color: "#fff",
        zIndex: theme.zIndex.drawer + 2,
        position: "fixed",
        top: 0,
        left: 0,
        bgcolor: "rgba(0, 0, 0, 0.4)",
      })}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default CustomBackdrop;
