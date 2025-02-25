import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "1rem",
          whiteSpace: "nowrap",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          // color: "#54565A",
          // fontWeight: 400,
        },
        h1: {
          fontSize: "90px",
          fontWeight: "bold",
        },
        h3: {
          fontFamily: "'Roboto', sans-serif",
          fontSize: "3rem",
          fontWeight: "bold",
        },
        h4: {
          fontFamily: "'Roboto', sans-serif",
          fontSize: "2rem",
          fontWeight: "bold",
        },
        h5: {
          fontFamily: "'Roboto', sans-serif",
          fontSize: "1.5rem",
          fontWeight: 600,
          lineHeight: 1.2,
        },
        h6: {
          fontFamily: "'Roboto', sans-serif",
          fontSize: "1.2rem",
        },
        body2: {
          color: "rgba(84, 86, 90, 0.6)",
        },
        caption: {
          fontSize: 14,
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontWeight: 500,
          "& .MuiChip-label": {
            overflow: "initial",
          },
        },
        sizeSmall: {
          height: "22px",
          fontSize: "12px",
        },
      },
      defaultProps: {
        size: "small", // Set 'small' as the default size
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (min-width: 600px)": {
            maxWidth: "100%",
          },

          // Need to rewrite the default rules so that they have higher specificity
          "@media (min-width: 900px)": {
            maxWidth: "900px",
          },
          "@media (min-width: 1200px)": {
            maxWidth: "1200px",
          },
          "@media (min-width: 1536px)": {
            maxWidth: "1536px",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: "1rem",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          },
          "& .MuiTabs-indicator": {
            height: "4px",
            bottom: "-2px",
          },
          "& .MuiTabs-scroller": {
            overflow: "visible !important",
          },
          borderBottom: 2,
          borderStyle: "solid",
          overflow: "initial",
          borderColor: "rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  palette: {
    primary: {
      light: "#4A82C3",
      main: "#203A90",
      dark: "#102774",
    },
    secondary: {
      light: "rgba(84, 86, 90, 0.6)",
      main: "#54565A",
      dark: "#202124",
    },
    text: {
      primary: "#54565A",
      secondary: "rgba(84, 86, 90, 0.6)",
    },
    success: {
      light: "#F0FDF4",
      main: "#00B035",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  spacing: 16,
});

export default theme;
