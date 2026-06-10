CREATE OR REPLACE FUNCTION public.handle_new_user_roles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;

  IF NEW.email IN ('lmodirv@gmail.com', 'info@hnchat.net') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES
      (NEW.id, 'owner'),
      (NEW.id, 'admin'),
      (NEW.id, 'moderator')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user_roles() FROM PUBLIC, anon, authenticated;

-- Backfill for existing user if present
INSERT INTO public.user_roles (user_id, role)
SELECT id, r::public.app_role
FROM auth.users, unnest(ARRAY['owner','admin','moderator','user']) AS r
WHERE email IN ('lmodirv@gmail.com', 'info@hnchat.net')
ON CONFLICT DO NOTHING;