import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";

const AppProviders = ({ children }) => {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  );
};

export default AppProviders;