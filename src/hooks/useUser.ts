import { useQuery } from "@tanstack/react-query";
import { me } from "../services/auth.service";

export default function useUser(token: string, enabled: boolean) {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => me(token!),
    enabled: enabled,
  });
}
