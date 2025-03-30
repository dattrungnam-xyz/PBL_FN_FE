import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  Divider,
  // useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssessmentIcon from "@mui/icons-material/Assessment";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ListAltIcon from "@mui/icons-material/ListAlt";
// import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import PeopleIcon from "@mui/icons-material/People";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";

const drawerWidth = 220;

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  label: string;
  icon: JSX.Element;
  path: string;
  subItems?: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "Sản phẩm",
    items: [
      {
        label: "Tất cả sản phẩm",
        icon: <InventoryIcon />,
        path: "/seller/products",
      },
      {
        label: "Xác thực OCOP",
        icon: <InventoryIcon />,
        path: "/seller/products/verify",
      },
    ],
  },
  {
    title: "Đơn hàng",
    items: [
      {
        label: "Quản lý đơn hàng",
        icon: <LocalShippingIcon />,
        path: "/seller/orders",
        subItems: [
          {
            label: "Chờ xác nhận",
            icon: <ListAltIcon />,
            path: "/seller/orders/pending",
          },
          {
            label: "Đang giao",
            icon: <LocalShippingIcon />,
            path: "/seller/orders/shipping",
          },
          {
            label: "Hoàn thành",
            icon: <ListAltIcon />,
            path: "/seller/orders/completed",
          },
          {
            label: "Đã hủy",
            icon: <ListAltIcon />,
            path: "/seller/orders/cancelled",
          },
        ],
      },
    ],
  },
  {
    title: "Thống kê",
    items: [
      {
        label: "Tổng quan",
        icon: <AssessmentIcon />,
        path: "/seller/analytics",
      },
      {
        label: "Doanh thu",
        icon: <BarChartIcon />,
        path: "/seller/revenue",
      },
      {
        label: "Xu hướng",
        icon: <TimelineIcon />,
        path: "/seller/trends",
      },
    ],
  },
  {
    title: "Cửa hàng",
    items: [
      {
        label: "Thông tin cửa hàng",
        icon: <StorefrontIcon />,
        path: "/seller",
      },
      {
        label: "Khách hàng",
        icon: <PeopleIcon />,
        path: "/seller/customers",
      },
      {
        label: "Đánh giá",
        icon: <StarBorderIcon />,
        path: "/seller/reviews",
      },
      {
        label: "Cài đặt",
        icon: <SettingsIcon />,
        path: "/seller/settings",
      },
    ],
  },
];

const SellerSidebar = () => {
  // const theme = useTheme();
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const handleSubMenuClick = (path: string) => {
    setOpenSubMenu(openSubMenu === path ? null : path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: 1,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "#F5F7F5",
          borderRight: "1px solid",
          borderColor: "rgba(76, 175, 80, 0.15)",
          pt: "46px", // Match header height
          boxShadow: "1px 0 3px rgba(76, 175, 80, 0.08)",
        },
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        {menuGroups.map((group, groupIndex) => (
          <Box key={group.title}>
            {groupIndex > 0 && (
              <Divider
                sx={{ my: 0.25, borderColor: "rgba(76, 175, 80, 0.15)" }}
              />
            )}
            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                py: 0.5,
                color: "#1F7D53",
                fontWeight: 500,
                display: "block",
                fontSize: "0.65rem",
              }}
            >
              {group.title}
            </Typography>
            <List disablePadding>
              {group.items.map((item) => (
                <Box key={item.path}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={item.subItems ? "div" : Link}
                      to={item.subItems ? undefined : item.path}
                      onClick={() =>
                        item.subItems && handleSubMenuClick(item.path)
                      }
                      selected={isActive(item.path)}
                      sx={{
                        minHeight: 32,
                        px: 1.5,
                        py: 0.25,
                        "&.Mui-selected": {
                          bgcolor: "rgba(76, 175, 80, 0.12)",
                          color: "#1B5E20",
                          "&:hover": {
                            bgcolor: "rgba(76, 175, 80, 0.15)",
                          },
                          "& .MuiListItemIcon-root": {
                            color: "#1B5E20",
                          },
                        },
                        "&:hover": {
                          bgcolor: "rgba(76, 175, 80, 0.08)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 28,
                          color: isActive(item.path) ? "#255F38" : "#1F7D53",
                          "& svg": {
                            fontSize: "1.1rem",
                          },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: {
                            variant: "caption",
                            fontSize: "0.75rem",
                            fontWeight: isActive(item.path) ? 600 : 400,
                          },
                        }}
                      />
                      {item.subItems && (
                        <>
                          {openSubMenu === item.path ? (
                            <ExpandLess
                              sx={{
                                fontSize: "1rem",
                                color: "rgba(76, 175, 80, 0.7)",
                              }}
                            />
                          ) : (
                            <ExpandMore
                              sx={{
                                fontSize: "1rem",
                                color: "rgba(76, 175, 80, 0.7)",
                              }}
                            />
                          )}
                        </>
                      )}
                    </ListItemButton>
                  </ListItem>
                  {item.subItems && (
                    <Collapse
                      in={openSubMenu === item.path}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List disablePadding>
                        {item.subItems.map((subItem) => (
                          <ListItem key={subItem.path} disablePadding>
                            <ListItemButton
                              component={Link}
                              to={subItem.path}
                              selected={isActive(subItem.path)}
                              sx={{
                                minHeight: 32,
                                py: 0.25,
                                pl: 4,
                                pr: 1.5,
                                "&.Mui-selected": {
                                  bgcolor: "rgba(76, 175, 80, 0.12)",
                                  color: "#1B5E20",
                                  "&:hover": {
                                    bgcolor: "rgba(76, 175, 80, 0.15)",
                                  },
                                  "& .MuiListItemIcon-root": {
                                    color: "#1B5E20",
                                  },
                                },
                                "&:hover": {
                                  bgcolor: "rgba(76, 175, 80, 0.08)",
                                },
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 28,
                                  color: isActive(subItem.path)
                                    ? "#255F38"
                                    : "#1F7D53",
                                  "& svg": {
                                    fontSize: "1rem",
                                  },
                                }}
                              >
                                {subItem.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={subItem.label}
                                primaryTypographyProps={{
                                  variant: "caption",
                                  fontSize: "0.75rem",
                                  fontWeight: isActive(subItem.path)
                                    ? 600
                                    : 400,
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
};

export default SellerSidebar;
