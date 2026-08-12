-- ============================================================
-- Migration : Sécurisation des fonctions SECURITY DEFINER
-- ============================================================
-- Supabase Linter (0028 & 0029) :
-- Les fonctions SECURITY DEFINER situées dans le schéma public sont
-- par défaut exécutables via l'API RPC PostgREST (/rest/v1/rpc/...).
--
-- Ces 3 fonctions ne sont pas censées être appelées par des clients API :
--   - rls_auto_enable() : fonction système/déclencheur
--   - handle_new_user() : déclencheur à la création d'un utilisateur auth.users
--   - has_role()        : fonction de vérification RLS interne
--
-- Ce script révoque le droit EXECUTE pour les rôles publics et authentifiés.
-- Les déclencheurs et politiques RLS continueront de fonctionner normalement.
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
