-- Helper-free admin check usable inside RLS (reads user_roles, which has its own own-row policy)
-- 1. storage.objects admin policy
DROP POLICY IF EXISTS "recap_select_admin" ON storage.objects;
CREATE POLICY "recap_select_admin"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'recapitulatifs'
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
  )
);

-- 2. orders
DROP POLICY IF EXISTS "orders_select_admin" ON public.orders;
CREATE POLICY "orders_select_admin" ON public.orders FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "orders_update_admin" ON public.orders;
CREATE POLICY "orders_update_admin" ON public.orders FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

-- 3. profiles
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

-- 4. enrollments
DROP POLICY IF EXISTS "enrollments_select_admin" ON public.enrollments;
CREATE POLICY "enrollments_select_admin" ON public.enrollments FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "enrollments_update_admin" ON public.enrollments;
CREATE POLICY "enrollments_update_admin" ON public.enrollments FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

-- 5. order_events
DROP POLICY IF EXISTS "order_events_select_admin" ON public.order_events;
CREATE POLICY "order_events_select_admin" ON public.order_events FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

DROP POLICY IF EXISTS "order_events_insert_admin" ON public.order_events;
CREATE POLICY "order_events_insert_admin" ON public.order_events FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

-- 6. user_roles: drop the self-referencing admin policy (own-row read remains)
DROP POLICY IF EXISTS "user_roles_select_admin" ON public.user_roles;
