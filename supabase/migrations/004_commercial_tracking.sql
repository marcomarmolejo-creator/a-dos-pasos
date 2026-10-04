alter table public.businesses
  add column if not exists commercial_interest text,
  add column if not exists sales_status text not null default 'sin-contacto',
  add column if not exists sales_notes text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'businesses_commercial_interest_check'
      and conrelid = 'public.businesses'::regclass
  ) then
    alter table public.businesses
      add constraint businesses_commercial_interest_check
      check (commercial_interest is null or commercial_interest in (
        'micrositio',
        'video-local',
        'promocion-activa',
        'beneficio-local',
        'paquete-micrositio-video'
      ));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'businesses_sales_status_check'
      and conrelid = 'public.businesses'::regclass
  ) then
    alter table public.businesses
      add constraint businesses_sales_status_check
      check (sales_status in (
        'sin-contacto',
        'interesado',
        'cotizacion-enviada',
        'contratado',
        'no-interesado'
      ));
  end if;
end;
$$;

create index if not exists businesses_sales_status_idx
  on public.businesses (sales_status);

create or replace function public.admin_update_commercial_tracking(
  p_business_id uuid,
  p_commercial_interest text,
  p_sales_status text,
  p_sales_notes text
)
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

  if p_commercial_interest is not null and p_commercial_interest not in (
    'micrositio',
    'video-local',
    'promocion-activa',
    'beneficio-local',
    'paquete-micrositio-video'
  ) then
    raise exception 'Invalid commercial interest' using errcode = '22023';
  end if;

  if p_sales_status not in (
    'sin-contacto',
    'interesado',
    'cotizacion-enviada',
    'contratado',
    'no-interesado'
  ) then
    raise exception 'Invalid sales status' using errcode = '22023';
  end if;

  update public.businesses
  set
    commercial_interest = p_commercial_interest,
    sales_status = p_sales_status,
    sales_notes = nullif(trim(p_sales_notes), '')
  where id = p_business_id
  returning * into result;

  if result.id is null then
    raise exception 'Business not found' using errcode = 'P0002';
  end if;

  return result;
end;
$$;

revoke all on function public.admin_update_commercial_tracking(uuid, text, text, text) from public, anon;
grant execute on function public.admin_update_commercial_tracking(uuid, text, text, text) to authenticated;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'published_businesses'
      and column_name in ('commercial_interest', 'sales_status', 'sales_notes')
  ) then
    raise exception 'Commercial tracking fields must not be exposed by published_businesses';
  end if;
end;
$$;

notify pgrst, 'reload schema';
