-- 1. Storage policies for the private "recapitulatifs" bucket
DROP POLICY IF EXISTS "recap_select_own" ON storage.objects;
CREATE POLICY "recap_select_own"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'recapitulatifs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "recap_select_admin" ON storage.objects;
CREATE POLICY "recap_select_admin"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'recapitulatifs'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- 2. Restrict direct API execution of SECURITY DEFINER / trigger functions
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
