import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./fetch";

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    retry: 1,
  });
