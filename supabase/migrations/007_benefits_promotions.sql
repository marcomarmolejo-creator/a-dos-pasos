create table if not exists public.business_promotions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  type text not null check (type in ('beneficio', 'promocion')),
  status text not null default 'borrador'
    check (status in ('borrador', 'activo', 'pausado', 'finalizado')),
  title text not null check (char_length(trim(title)) between 2 and 120),
  description text check (description is null or char_length(description) <= 500),
  short_label text check (short_label is null or char_length(short_label) <= 60),
  cta_label text check (cta_label is null or char_length(cta_label) <= 60),
  cta_url text check (
    cta_url is null
    or cta_url ~ '^https://'
  ),
  starts_at timestamptz,
  ends_at timestamptz,
  featured boolean not null default false,
  image_url text check (
    image_url is null
    or image_url ~ '^https://'
    or image_url ~ '^/'
  ),
  terms text check (terms is null or char_length(terms) <= 500),
  internal_notes text check (internal_notes is null or char_length(internal_notes) <= 2000),
  created_by uuid references auth.users (id) on delete set null,
  constraint business_promotions_valid_period
    check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

create index if not exists business_promotions_business_idx
  on public.business_promotions (business_id);
create index if not exists business_promotions_public_idx
  on public.business_promotions (status, type, starts_at, ends_at);
create index if not exists business_promotions_featured_idx
  on public.business_promotions (featured)
  where status = 'activo';

drop trigger if exists business_promotions_set_updated_at on public.business_promotions;
create trigger business_promotions_set_updated_at
before update on public.business_promotions
for each row execute function public.set_updated_at();

alter table public.business_promotions enable row level security;
revoke all on table public.business_promotions from public, anon, authenticated;

grant select on table public.business_promotions to authenticated;

drop policy if exists "Admins can read business promotions" on public.business_promotions;
create policy "Admins can read business promotions"
on public.business_promotions
for select
to authenticated
using ((select public.is_admin()));

create or replace view public.active_business_promotions
with (security_barrier = true)
as
select
  promotion.id,
  promotion.business_id,
  promotion.type,
  promotion.title,
  promotion.description,
  promotion.short_label,
  promotion.cta_label,
  promotion.cta_url,
  promotion.starts_at,
  promotion.ends_at,
  promotion.featured,
  promotion.image_url,
  promotion.terms
from public.business_promotions as promotion
join public.businesses as business on business.id = promotion.business_id
where business.status = 'publicado'
  and promotion.status = 'activo'
  and (promotion.starts_at is null or promotion.starts_at <= now())
  and (promotion.ends_at is null or promotion.ends_at >= now());

revoke all on table public.active_business_promotions from public, anon, authenticated;
grant select on table public.active_business_promotions to anon, authenticated;

create or replace function public.admin_save_business_promotion(
  p_id uuid,
  p_business_id uuid,
  p_type text,
  p_status text,
  p_title text,
  p_description text,
  p_short_label text,
  p_cta_label text,
  p_cta_url text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_featured boolean,
  p_image_url text,
  p_terms text,
  p_internal_notes text
)
returns public.business_promotions
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  result public.business_promotions;
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  if p_type not in ('beneficio', 'promocion') then
    raise exception 'Invalid promotion type' using errcode = '22023';
  end if;
  if p_status not in ('borrador', 'activo', 'pausado', 'finalizado') then
    raise exception 'Invalid promotion status' using errcode = '22023';
  end if;
  if p_ends_at is not null and p_starts_at is not null and p_ends_at < p_starts_at then
    raise exception 'End date must be after start date' using errcode = '22023';
  end if;
  if not exists (select 1 from public.businesses where id = p_business_id) then
    raise exception 'Business not found' using errcode = 'P0002';
  end if;

  if p_id is null then
    insert into public.business_promotions (
      business_id, type, status, title, description, short_label,
      cta_label, cta_url, starts_at, ends_at, featured, image_url,
      terms, internal_notes, created_by
    ) values (
      p_business_id, p_type, p_status, trim(p_title), nullif(trim(p_description), ''),
      nullif(trim(p_short_label), ''), nullif(trim(p_cta_label), ''), nullif(trim(p_cta_url), ''),
      p_starts_at, p_ends_at, coalesce(p_featured, false), nullif(trim(p_image_url), ''),
      nullif(trim(p_terms), ''), nullif(trim(p_internal_notes), ''), auth.uid()
    ) returning * into result;
  else
    update public.business_promotions
    set
      business_id = p_business_id,
      type = p_type,
      status = p_status,
      title = trim(p_title),
      description = nullif(trim(p_description), ''),
      short_label = nullif(trim(p_short_label), ''),
      cta_label = nullif(trim(p_cta_label), ''),
      cta_url = nullif(trim(p_cta_url), ''),
      starts_at = p_starts_at,
      ends_at = p_ends_at,
      featured = coalesce(p_featured, false),
      image_url = nullif(trim(p_image_url), ''),
      terms = nullif(trim(p_terms), ''),
      internal_notes = nullif(trim(p_internal_notes), '')
    where id = p_id
    returning * into result;

    if result.id is null then
      raise exception 'Promotion not found' using errcode = 'P0002';
    end if;
  end if;

  return result;
end;
$$;

revoke all on function public.admin_save_business_promotion(
  uuid, uuid, text, text, text, text, text, text, text,
  timestamptz, timestamptz, boolean, text, text, text
) from public, anon;
grant execute on function public.admin_save_business_promotion(
  uuid, uuid, text, text, text, text, text, text, text,
  timestamptz, timestamptz, boolean, text, text, text
) to authenticated;

create or replace function public.admin_set_business_promotion_status(
  p_id uuid,
  p_status text
)
returns public.business_promotions
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  result public.business_promotions;
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  if p_status not in ('borrador', 'activo', 'pausado', 'finalizado') then
    raise exception 'Invalid promotion status' using errcode = '22023';
  end if;

  update public.business_promotions
  set status = p_status
  where id = p_id
  returning * into result;

  if result.id is null then
    raise exception 'Promotion not found' using errcode = 'P0002';
  end if;

  return result;
end;
$$;

revoke all on function public.admin_set_business_promotion_status(uuid, text) from public, anon;
grant execute on function public.admin_set_business_promotion_status(uuid, text) to authenticated;

comment on table public.business_promotions is
  'Beneficios y promociones administrables. Incluye campos internos protegidos por RLS.';
comment on view public.active_business_promotions is
  'Campos editoriales publicos de beneficios y promociones activos y vigentes.';
comment on column public.business_promotions.business_id is
  'Permite segmentar posteriormente por zona y categoria mediante el negocio asociado, sin enviar mensajes automaticamente.';

notify pgrst, 'reload schema';
