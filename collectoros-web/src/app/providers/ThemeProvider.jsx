import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import theme from "../theme/theme";

const ThemeProvider = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;