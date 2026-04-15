import { useQuery } from "@tanstack/react-query";
import { getLatestWhatsNewRequest } from "../api/whatsNewApi";

function useLatestWhatsNew() {
  return useQuery({
    queryKey: ["whats-new-latest"],
    queryFn: getLatestWhatsNewRequest,
    refetchOnWindowFocus: false,
  });
}

export { useLatestWhatsNew };