
CREATE TABLE public.app_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  archive_name TEXT NOT NULL,
  size_bytes BIGINT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.app_snapshots TO authenticated;
GRANT SELECT ON public.app_snapshots TO anon;
GRANT ALL ON public.app_snapshots TO service_role;

ALTER TABLE public.app_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "snapshots readable by everyone"
ON public.app_snapshots FOR SELECT
USING (true);

CREATE TRIGGER update_app_snapshots_updated_at
BEFORE UPDATE ON public.app_snapshots
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.app_snapshots (version, label, archive_name, size_bytes, description, meta)
VALUES (
  'v1.0.0',
  'HourClips MVP — Initial Release',
  'hourclips-v1.zip',
  239616,
  'Trilingual (EN/AR/FR) HourClips SaaS: landing, auth (Google OAuth), dashboard, upload, clips gallery, settings. Backed by Supabase tables: projects, clips, jobs.',
  jsonb_build_object(
    'stack', jsonb_build_array('TanStack Start','React 19','Tailwind v4','Supabase'),
    'tables', jsonb_build_array('projects','clips','jobs','app_snapshots'),
    'languages', jsonb_build_array('en','ar','fr'),
    'features', jsonb_build_array('google-oauth','rls','i18n-rtl','responsive-dashboard','mock-clip-seeding')
  )
);
