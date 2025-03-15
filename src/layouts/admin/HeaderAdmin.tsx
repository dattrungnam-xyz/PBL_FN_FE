import AppBar from "@mui/material/AppBar";
import { Toolbar } from "@mui/material";
// import { FaBars } from "react-icons/fa6";

const HeaderAdmin = () => {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "white",
      }}
    >
      <Toolbar
        sx={{
          px: { xl: 4 },
          justifyContent: "space-between",
        }}
      >
        {/* <FaBars onClick={() => setCollapsed(!collapsed)} /> */}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderAdmin;
