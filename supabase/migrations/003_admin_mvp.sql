create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create table if not exists private.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table private.admin_users enable row level security;
revoke all on table private.admin_users from public, anon, authenticated;

comment on table private.admin_users is
  'Allowlist interna de usuarios de Supabase Auth autorizados para administrar A Dos Pasos.';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, private
as $$
  select exists (
    select 1
    from private.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

grant select on table public.businesses to authenticated;
revoke insert, update, delete on table public.businesses from authenticated;

drop policy if exists "Admins can read business submissions" on public.businesses;
create policy "Admins can read business submissions"
on public.businesses
for select
to authenticated
using ((select public.is_admin()));

create or replace function public.admin_approve_business(p_business_id uuid)
returns public.businesses
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  result public.businesses;
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  update public.businesses
  set status = 'aprobado'
  where id = p_business_id
    and status <> 'publicado'
  returning * into result;

  if result.id is null then
    raise exception 'Business not found or already published' using errcode = 'P0002';
  end if;

  return result;
end;
$$;

revoke all on function public.admin_approve_business(uuid) from public, anon;
grant execute on function public.admin_approve_business(uuid) to authenticated;

create or replace function public.admin_reject_business(p_business_id uuid)
returns public.businesses
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  result public.businesses;
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  update public.businesses
  set status = 'rechazado'
  where id = p_business_id
    and status <> 'publicado'
  returning * into result;

  if result.id is null then
    raise exception 'Business not found or already published' using errcode = 'P0002';
  end if;

  return result;
end;
$$;

revoke all on function public.admin_reject_business(uuid) from public, anon;
grant execute on function public.admin_reject_business(uuid) to authenticated;

create or replace function public.admin_publish_business(
  p_business_id uuid,
  p_logo_path text,
  p_main_image_path text
)
returns public.businesses
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  result public.businesses;
  required_prefix text := 'businesses/' || p_business_id::text || '/';
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  if p_logo_path is null
    or p_main_image_path is null
    or left(p_logo_path, length(required_prefix)) <> required_prefix
    or left(p_main_image_path, length(required_prefix)) <> required_prefix then
    raise exception 'Invalid public asset paths' using errcode = '22023';
  end if;

  update public.businesses
  set
    status = 'publicado',
    logo_url = p_logo_path,
    main_image_url = p_main_image_path
  where id = p_business_id
    and status = 'aprobado'
    and slug is not null
  returning * into result;

  if result.id is null then
    raise exception 'Business must be approved and have a slug before publishing' using errcode = 'P0002';
  end if;

  return result;
end;
$$;

revoke all on function public.admin_publish_business(uuid, text, text) from public, anon;
grant execute on function public.admin_publish_business(uuid, text, text) to authenticated;

drop policy if exists "Admins can read private submission images" on storage.objects;
create policy "Admins can read private submission images"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'business-submissions'
  and (select public.is_admin())
);

drop policy if exists "Admins can publish business images" on storage.objects;
create policy "Admins can publish business images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'business-public'
  and (select public.is_admin())
);

create or replace view public.published_businesses
with (security_barrier = true)
as
select
  id,
  created_at,
  updated_at,
  business_name,
  slug,
  category,
  short_description,
  zone,
  address,
  maps_url,
  business_hours,
  home_service,
  whatsapp,
  phone,
  instagram,
  facebook,
  website,
  logo_url,
  main_image_url,
  promotion_title,
  promotion_description,
  listing_type,
  theme
from public.businesses
where status = 'publicado';

revoke all on table public.published_businesses from public, anon, authenticated;
grant select on table public.published_businesses to anon, authenticated;

comment on view public.published_businesses is
  'Campos publicos de negocios publicados. Excluye contacto responsable, consentimientos y estado editorial.';

notify pgrst, 'reload schema';
