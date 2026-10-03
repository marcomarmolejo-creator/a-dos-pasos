create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pendiente'
    check (status in ('pendiente', 'aprobado', 'publicado', 'rechazado')),

  business_name text not null,
  slug text,
  category text not null,
  short_description text not null,
  zone text not null,
  address text,
  maps_url text,
  business_hours text,
  home_service boolean not null default false,

  whatsapp text not null,
  phone text,
  instagram text,
  facebook text,
  website text,

  logo_url text,
  main_image_url text,

  contact_name text not null,
  contact_whatsapp text not null,
  contact_email text,

  promotion_title text,
  promotion_description text,
  promotion_expiration text,

  information_confirmed boolean not null check (information_confirmed),
  publication_authorized boolean not null check (publication_authorized),
  editorial_review_accepted boolean not null check (editorial_review_accepted),
  source text not null default 'web'
);

create index if not exists businesses_status_idx on public.businesses (status);
create index if not exists businesses_zone_idx on public.businesses (zone);
create index if not exists businesses_category_idx on public.businesses (category);
create index if not exists businesses_slug_idx on public.businesses (slug);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists businesses_set_updated_at on public.businesses;
create trigger businesses_set_updated_at
before update on public.businesses
for each row execute function public.set_updated_at();

alter table public.businesses enable row level security;

revoke all on table public.businesses from anon;
grant insert on table public.businesses to anon;

drop policy if exists "Anonymous users can create pending business submissions" on public.businesses;
create policy "Anonymous users can create pending business submissions"
on public.businesses
for insert
to anon
with check (
  status = 'pendiente'
  and information_confirmed
  and publication_authorized
  and editorial_review_accepted
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-submissions',
  'business-submissions',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anonymous users can upload business submission images" on storage.objects;
create policy "Anonymous users can upload business submission images"
on storage.objects
for insert
to anon
with check (bucket_id = 'business-submissions');
