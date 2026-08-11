CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'::public.app_role
  )
$$;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "orders_select_admin" ON public.orders;
DROP POLICY IF EXISTS "orders_update_admin" ON public.orders;
DROP POLICY IF EXISTS "orders_delete_admin" ON public.orders;
CREATE POLICY "orders_select_admin" ON public.orders FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "orders_update_admin" ON public.orders FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "orders_delete_admin" ON public.orders FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "enrollments_select_admin" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_update_admin" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_delete_admin" ON public.enrollments;
CREATE POLICY "enrollments_select_admin" ON public.enrollments FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "enrollments_update_admin" ON public.enrollments FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "enrollments_delete_admin" ON public.enrollments FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "profiles_update_admin" ON public.profiles FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "profiles_delete_admin" ON public.profiles FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "order_events_select_admin" ON public.order_events;
DROP POLICY IF EXISTS "order_events_insert_admin" ON public.order_events;
DROP POLICY IF EXISTS "order_events_update_admin" ON public.order_events;
DROP POLICY IF EXISTS "order_events_delete_admin" ON public.order_events;
CREATE POLICY "order_events_select_admin" ON public.order_events FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "order_events_insert_admin" ON public.order_events FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "order_events_update_admin" ON public.order_events FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "order_events_delete_admin" ON public.order_events FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "consent_logs_select_admin" ON public.consent_logs;
DROP POLICY IF EXISTS "consent_logs_update_admin" ON public.consent_logs;
DROP POLICY IF EXISTS "consent_logs_delete_admin" ON public.consent_logs;
GRANT UPDATE, DELETE ON public.consent_logs TO authenticated;
CREATE POLICY "consent_logs_select_admin" ON public.consent_logs FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "consent_logs_update_admin" ON public.consent_logs FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "consent_logs_delete_admin" ON public.consent_logs FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "user_roles_select_admin" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_admin" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_delete_admin" ON public.user_roles;
GRANT INSERT, DELETE ON public.user_roles TO authenticated;
CREATE POLICY "user_roles_select_admin" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "user_roles_insert_admin" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "user_roles_delete_admin" ON public.user_roles FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "recap_select_admin" ON storage.objects;
DROP POLICY IF EXISTS "recap_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "recap_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "recap_delete_admin" ON storage.objects;
CREATE POLICY "recap_select_admin" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'recapitulatifs' AND public.is_admin(auth.uid()));
CREATE POLICY "recap_insert_admin" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'recapitulatifs' AND public.is_admin(auth.uid()));
CREATE POLICY "recap_update_admin" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'recapitulatifs' AND public.is_admin(auth.uid())) WITH CHECK (bucket_id = 'recapitulatifs' AND public.is_admin(auth.uid()));
CREATE POLICY "recap_delete_admin" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'recapitulatifs' AND public.is_admin(auth.uid()));