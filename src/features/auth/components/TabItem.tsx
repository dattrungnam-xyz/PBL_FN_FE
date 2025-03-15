import Button from "@mui/material/Button";

import classes from "./TabItem.module.scss";

interface TabItemProps {
  children: React.ReactNode;
  isActive?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({ children, isActive }) => {
  return (
    <Button
      variant={isActive ? "contained" : "text"}
      className={classes.tabBtn}
      disableRipple
    >
      {children}
    </Button>
  );
};

export default TabItem;
