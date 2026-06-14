-- 1) Restrict app_snapshots to owners only
DROP POLICY IF EXISTS "snapshots readable by everyone" ON public.app_snapshots;
REVOKE SELECT ON public.app_snapshots FROM anon;
GRANT SELECT ON public.app_snapshots TO authenticated;

CREATE POLICY "owners read snapshots"
ON public.app_snapshots
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "owners manage snapshots"
ON public.app_snapshots
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'owner'))
WITH CHECK (public.has_role(auth.uid(), 'owner'));

-- 2) Prevent privilege escalation: owners cannot grant 'owner' role via the API
DROP POLICY IF EXISTS "owners manage roles" ON public.user_roles;

CREATE POLICY "owners manage non-owner roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'owner')
  AND role <> 'owner'::public.app_role
)
WITH CHECK (
  public.has_role(auth.uid(), 'owner')
  AND role <> 'owner'::public.app_role
);

-- 3) Lock down SECURITY DEFINER trigger functions from direct execution
REVOKE EXECUTE ON FUNCTION public.handle_new_user_roles() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;