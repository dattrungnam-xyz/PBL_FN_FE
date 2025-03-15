import { Box } from "@mui/material";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/logos/logo.jpg";
import LogoMini from "../../../assets/logos/logomini.png";
import Link from "../../UI/Link";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { AuthState } from "../../../stores/authSlice";
import { isAdmin } from "../../../types/auth";

const SideBar = (props: any) => {
  const { collapsed, toggled } = props;
  const navigate = useNavigate();
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  return (
    <Sidebar collapsed={collapsed} toggled={toggled}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 2,
          px: 1,
        }}
      >
        <Link
          to="/"
          style={{
            width: 150,
            height: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {collapsed ? (
            <img src={LogoMini} style={{ height: "30px", width: "auto" }} />
          ) : (
            <img src={Logo} style={{ height: "30px", width: "auto" }} />
          )}
        </Link>
      </Box>
      <Menu
        menuItemStyles={{
          button: {
            // the active class will be added automatically by react router
            // so we can use it to style the active menu item
            [`&.active`]: {
              backgroundColor: "#13395e",
              color: "#b6c8d9",
            },
          },
        }}
      >
        <MenuItem onClick={() => navigate("/admin")}>Dashboard</MenuItem>
        {user && isAdmin(user) && (
          <Link to="/admin/account">
            <MenuItem>Accounts</MenuItem>
          </Link>
        )}
        <MenuItem onClick={() => navigate("/admin/exam-set")}>
          {/* <MenuItem onClick={() => navigate("/admin/exam")}>Exam</MenuItem> */}
          Exams
        </MenuItem>

        <MenuItem onClick={() => navigate("/admin/voca-set")}>
          Vocabularies
        </MenuItem>

        <MenuItem onClick={() => navigate("/admin/listen-group")}>
          Listen Practices
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
