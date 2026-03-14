import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../services/queryClient";

const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;