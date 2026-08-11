-- ============================================================
-- Migration : création du compte admin fragnaudyutsio@gmail.com
-- ============================================================
-- INSTRUCTIONS :
--   1. Exécutez ce script dans l'éditeur SQL de votre projet Supabase
--      (Settings > Database > SQL Editor) ou via la Supabase CLI :
--      supabase db execute --file supabase/migrations/20260811_seed_admin.sql
--
--   2. Cette migration crée l'utilisateur dans auth.users (si absent),
--      lui attribue le rôle 'admin' dans public.user_roles, et inscrit
--      un profil minimal dans public.profiles.
--
--   3. Le mot de passe initial est 'Honor@Admin2026!' — l'utilisateur
--      sera OBLIGÉ de le changer à la première connexion (force_password_reset).
--      Vous pouvez également envoyer un e-mail d'invitation ou de
--      réinitialisation de mot de passe depuis la console Supabase.
-- ============================================================

DO $$
DECLARE
  v_user_id uuid;
  v_email   text := 'fragnaudyutsio@gmail.com';
BEGIN

  -- 1. Créer l'utilisateur dans auth.users (si absent)
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      raw_app_meta_data,
      created_at,
      updated_at,
      aud,
      role
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      v_email,
      -- Mot de passe haché : Honor@Admin2026!
      -- (généré avec crypt('Honor@Admin2026!', gen_salt('bf')))
      crypt('Honor@Admin2026!', gen_salt('bf')),
      now(),
      jsonb_build_object(
        'nom', 'Administrateur HONOR',
        'must_change_password', true
      ),
      jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
      now(),
      now(),
      'authenticated',
      'authenticated'
    );

    RAISE NOTICE 'Utilisateur créé : % (id: %)', v_email, v_user_id;
  ELSE
    RAISE NOTICE 'Utilisateur déjà existant : % (id: %)', v_email, v_user_id;
  END IF;

  -- 2. Créer/mettre à jour le profil public
  INSERT INTO public.profiles (id, email, nom, langue)
  VALUES (
    v_user_id,
    v_email,
    'Administrateur HONOR',
    'fr'
  )
  ON CONFLICT (id) DO UPDATE
    SET nom    = EXCLUDED.nom,
        email  = EXCLUDED.email;

  -- 3. Attribuer le rôle admin (idempotent)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Rôle admin attribué à %', v_email;

END $$;
