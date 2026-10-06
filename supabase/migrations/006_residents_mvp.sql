create table if not exists public.residents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'activo'
    check (status in ('activo', 'inactivo')),

  name text not null
    check (char_length(trim(name)) between 2 and 80),
  whatsapp text not null
    check (whatsapp ~ '^\+52[0-9]{10}$'),
  email text,
  zone text not null
    check (zone in ('El Refugio', 'Zibatá', 'Zakia', 'Juriquilla', 'El Campanario', 'La Pradera')),
  neighborhood text
    check (neighborhood is null or char_length(neighborhood) <= 100),
  interests text[] not null default '{}'
    check (
      cardinality(interests) between 1 and 10
      and interests <@ array[
        'Todo',
        'Comer',
        'Café',
        'Cuidarme',
        'Mi casa',
        'Mascotas',
        'Servicios',
        'Promociones',
        'Nuevos lugares',
        'Ideas para hoy'
      ]::text[]
    ),
  comments text
    check (comments is null or char_length(comments) <= 240),

  consent boolean not null default false
    check (consent),
  consent_at timestamptz,
  source text not null default 'web'
    check (source = 'web')
);

create unique index if not exists residents_whatsapp_unique_idx
  on public.residents (whatsapp);
create index if not exists residents_status_idx
  on public.residents (status);
create index if not exists residents_zone_idx
  on public.residents (zone);
create index if not exists residents_created_at_idx
  on public.residents (created_at desc);
create index if not exists residents_interests_idx
  on public.residents using gin (interests);

drop trigger if exists residents_set_updated_at on public.residents;
create trigger residents_set_updated_at
before update on public.residents
for each row execute function public.set_updated_at();

alter table public.residents enable row level security;

revoke all on table public.residents from public, anon, authenticated;

grant insert (
  name,
  whatsapp,
  email,
  zone,
  neighborhood,
  interests,
  comments,
  consent,
  consent_at
) on table public.residents to anon;

drop policy if exists "Anonymous users can register residents" on public.residents;
create policy "Anonymous users can register residents"
on public.residents
for insert
to anon
with check (
  status = 'activo'
  and zone = 'El Refugio'
  and consent
  and consent_at is not null
  and source = 'web'
);

grant select on table public.residents to authenticated;

drop policy if exists "Admins can read residents" on public.residents;
create policy "Admins can read residents"
on public.residents
for select
to authenticated
using ((select public.is_admin()));

create or replace function public.admin_set_resident_status(
  p_resident_id uuid,
  p_status text
)
returns public.residents
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  result public.residents;
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  if p_status not in ('activo', 'inactivo') then
    raise exception 'Invalid resident status' using errcode = '22023';
  end if;

  update public.residents
  set status = p_status
  where id = p_resident_id
  returning * into result;

  if result.id is null then
    raise exception 'Resident not found' using errcode = 'P0002';
  end if;

  return result;
end;
$$;

revoke all on function public.admin_set_resident_status(uuid, text) from public, anon;
grant execute on function public.admin_set_resident_status(uuid, text) to authenticated;

comment on table public.residents is
  'Registro privado de residentes que aceptaron recibir comunicaciones de A Dos Pasos.';
comment on column public.residents.whatsapp is
  'Identificador de duplicado normalizado como +52 seguido de 10 dígitos.';

notify pgrst, 'reload schema';
