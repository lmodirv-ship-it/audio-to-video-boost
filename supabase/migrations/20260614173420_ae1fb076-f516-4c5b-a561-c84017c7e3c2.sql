-- Files stored under {user_id}/...
DROP POLICY IF EXISTS "media owner read" ON storage.objects;
DROP POLICY IF EXISTS "media owner write" ON storage.objects;
DROP POLICY IF EXISTS "media owner update" ON storage.objects;
DROP POLICY IF EXISTS "media owner delete" ON storage.objects;

CREATE POLICY "media owner read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "media owner write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "media owner update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "media owner delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.clips ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false;
ALTER TABLE public.clips ADD COLUMN IF NOT EXISTS clipped_url text;