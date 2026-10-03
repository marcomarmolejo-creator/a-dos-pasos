alter table public.businesses
  add column if not exists listing_type text not null default 'ficha',
  add column if not exists theme text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'businesses_listing_type_check'
      and conrelid = 'public.businesses'::regclass
  ) then
    alter table public.businesses
      add constraint businesses_listing_type_check
      check (listing_type in ('ficha', 'micrositio'));
  end if;
end;
$$;

create unique index if not exists businesses_slug_unique_idx
  on public.businesses (slug)
  where slug is not null;

revoke select, update, delete on table public.businesses from anon, authenticated;

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
  'Public, editorially approved business fields only. Private responsible-contact and consent fields are excluded.';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-public',
  'business-public',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read published business images" on storage.objects;
create policy "Public can read published business images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'business-public');

notify pgrst, 'reload schema';
