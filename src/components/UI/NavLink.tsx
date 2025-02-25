import Button from "@mui/material/Button";
import styles from "./NavLink.module.scss";

const NavLink: React.FC<{
  children: React.ReactNode;
  isActive?: boolean;
}> = ({ children, isActive = false }) => {
  return (
    <Button
      disableRipple
      className={styles.navlinkBtn + (isActive ? " " + styles.active : "")}
    >
      {children}
    </Button>
  );
};

export default NavLink;
