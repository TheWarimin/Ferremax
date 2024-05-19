import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material";
import { dark } from "@mui/material/styles/createPalette";

export const tokens =(mode) => ({
    ...(mode === 'dark'
       ?{
    red: {
        100: "#fddcd5",
        200: "#fbb9ab",
        300: "#f89782",
        400: "#f67458",
        500: "#f4512e",
        600: "#c34125",
        700: "#92311c",
        800: "#622012",
        900: "#311009"
    },
    yellow: {
        100: "#f9f0d5",
        200: "#f3e1ac",
        300: "#eed282",
        400: "#e8c359",
        500: "#e2b42f",
        600: "#b59026",
        700: "#886c1c",
        800: "#5a4813",
        900: "#2d2409"
    },
    green: {
        100: "#e1f8cf",
        200: "#c3f09f",
        300: "#a5e970",
        400: "#87e140",
        500: "#69da10",
        600: "#54ae0d",
        700: "#3f830a",
        800: "#2a5706",
        900: "#152c03"
    },
    green: {
        100: "#d5f8f4",
        200: "#aaf0ea",
        300: "#80e9df",
        400: "#55e1d5",
        500: "#2bdaca",
        600: "#22aea2",
        700: "#1a8379",
        800: "#115751",
        900: "#092c28"
    },
    black: {
        100: "#cfd9e8",
        200: "#9fb4d1",
        300: "#6e8eba",
        400: "#3e69a3",
        500: "#0e438c",
        600: "#0b3670",
        700: "#082854",
        800: "#061b38",
        900: "#030d1c"
    },
    indigo: {
        100: "#e1d7f8",
        200: "#c4aff1",
        300: "#a686eb",
        400: "#895ee4",
        500: "#6b36dd",
        600: "#562bb1",
        700: "#402085",
        800: "#2b1658",
        900: "#150b2c"
    },
    pink: {
        100: "#edd2da",
        200: "#dca4b5",
        300: "#ca7790",
        400: "#b9496b",
        500: "#a71c46",
        600: "#861638",
        700: "#64112a",
        800: "#430b1c",
        900: "#21060e"
    },
    red: {
        100: "#fad3d3",
        200: "#f5a6a6",
        300: "#f07a7a",
        400: "#eb4d4d",
        500: "#e62121",
        600: "#b81a1a",
        700: "#8a1414",
        800: "#5c0d0d",
        900: "#2e0707"
    },
    black: {
        100: "#cccccc",
        200: "#999999",
        300: "#666666",
        400: "#333333",
        500: "#000000",
        600: "#000000",
        700: "#000000",
        800: "#000000",
        900: "#000000"
    },
    indigo: {
        100: "#dadada",
        200: "#b5b5b5",
        300: "#919191",
        400: "#6c6c6c",
        500: "#474747",
        600: "#393939",
        700: "#2b2b2b",
        800: "#1c1c1c",
        900: "#0e0e0e"
    },
        } : 
        {
            red: {
                100: "#311009",
                200: "#622012",
                300: "#92311c",
                400: "#c34125",
                500: "#f4512e",
                600: "#f67458",
                700: "#f89782",
                800: "#fbb9ab",
                900: "#fddcd5"
            },
            yellow: {
                100: "#2d2409",
                200: "#5a4813",
                300: "#886c1c",
                400: "#b59026",
                500: "#e2b42f",
                600: "#e8c359",
                700: "#eed282",
                800: "#f3e1ac",
                900: "#f9f0d5",
            },
            green: {
                100: "#152c03",
                200: "#2a5706",
                300: "#3f830a",
                400: "#54ae0d",
                500: "#69da10",
                600: "#87e140",
                700: "#a5e970",
                800: "#c3f09f",
                900: "#e1f8cf",
            },
            green: {
                100: "#092c28",
                200: "#115751",
                300: "#1a8379",
                400: "#22aea2",
                500: "#2bdaca",
                600: "#55e1d5",
                700: "#80e9df",
                800: "#aaf0ea",
                900: "#d5f8f4",
            },
            black: {
                100: "#030d1c",
                200: "#061b38",
                300: "#082854",
                400: "#0b3670",
                500: "#0e438c",
                600: "#3e69a3",
                700: "#6e8eba",
                800: "#9fb4d1",
                900: "#cfd9e8",
            },
            indigo: {
                100: "#150b2c",
                200: "#2b1658",
                300: "#402085",
                400: "#562bb1",
                500: "#6b36dd",
                600: "#895ee4",
                700: "#a686eb",
                800: "#c4aff1",
                900: "#e1d7f8",
            },
            pink: {
                100: "#21060e",
                200: "#430b1c",
                300: "#64112a",
                400: "#861638",
                500: "#a71c46",
                600: "#b9496b",
                700: "#ca7790",
                800: "#dca4b5",
                900: "#edd2da",
            },
            red: {
                100: "#2e0707",
                200: "#5c0d0d",
                300: "#8a1414",
                400: "#b81a1a",
                500: "#e62121",
                600: "#eb4d4d",
                700: "#f07a7a",
                800: "#f5a6a6",
                800: "#fad3d3",
            },
            black: {
                100: "#000000",
                200: "#000000",
                300: "#000000",
                400: "#000000",
                500: "#000000",
                600: "#333333",
                700: "#666666",
                800: "#999999",
                900: "#cccccc",
            },
            gris: {
                100: "#0e0e0e",
                200: "#1c1c1c",
                300: "#2b2b2b",
                400: "#393939",
                500: "#474747",
                600: "#6c6c6c",
                700: "#919191",
                800: "#b5b5b5",
                900: "#dadada",
            },   
        }
    )
});

export const themeSettings = (mode) => {
    const colors = tokens(mode);
  
    return {
      palette: {
        mode: mode,
        ...(mode === 'dark' && colors.primary && colors.green && colors.black
          ? {
              primary: {
                main: colors.primary[500],
              },
              secondary: {
                main: colors.green[500],
              },
              neutral: {
                dark: colors.black[700],
                main: colors.black[500],
                light: colors.black[100],
              },
              background: {
                default: colors.primary[500],
              },
            }
          : {}),
      },
    };
  };

export const ColorModeContext = createContext({
    toggleColorMode: () => {},
});

export const useMode = () => {
    const [mode, setMode] = useState('dark');

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
        },
    }), []);

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    return [theme, colorMode];
};