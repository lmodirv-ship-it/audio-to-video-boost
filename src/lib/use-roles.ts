import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyRoles } from "@/lib/admin.functions";
import { useAuth } from "@/lib/use-auth";

export function useMyRoles() {
  const { user } = useAuth();
  const fn = useServerFn(getMyRoles);
  const q = useQuery({
    queryKey: ["my-roles", user?.id],
    queryFn: () => fn(),
    enabled: !!user,
    staleTime: 60_000,
  });
  const roles = q.data?.roles ?? [];
  return {
    roles,
    isOwner: roles.includes("owner"),
    isAdmin: roles.includes("admin") || roles.includes("owner"),
    isLoading: q.isLoading,
  };
}
