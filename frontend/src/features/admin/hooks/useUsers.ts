import {
  useQuery,
} from "@tanstack/react-query";

import {
  getUsers,
} from "../../../shared/services/adminUsersApi";

export function useUsers() {
  return useQuery({
    queryKey: [
      "admin",
      "users",
    ],

    queryFn: getUsers,
  });
}