-- Edicion administrativa de datos comerciales publicos.
-- Esta migracion no concede UPDATE directo sobre businesses: toda escritura
-- pasa por una RPC SECURITY DEFINER que vuelve a comprobar is_admin().

begin;

create or replace function public.admin_update_business(
  p_business_id uuid,
  p_business_name text,
  p_category text,
  p_short_description text,
  p_zone text,
  p_address text,
  p_maps_url text,
  p_business_hours text,
  p_home_service boolean,
  p_whatsapp text,
  p_phone text,
  p_instagram text,
  p_facebook text,
  p_website text,
  p_logo_path text,
  p_main_image_path text,
  p_promotion_title text,
  p_promotion_description text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_business public.businesses;
  result public.businesses;
  private_prefix text;
  public_prefix text;
  whatsapp_value text;
  whatsapp_digits text;
  uuid_v4_pattern constant text := '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  select *
  into current_business
  from public.businesses
  where id = p_business_id
  for update;

  if current_business.id is null then
    raise exception 'Business not found' using errcode = 'P0002';
  end if;

  if char_length(trim(coalesce(p_business_name, ''))) not between 2 and 80 then
    raise exception 'Business name must contain between 2 and 80 characters' using errcode = '22023';
  end if;

  if p_category is null or trim(p_category) not in (
    'Comer', 'Café', 'Cuidarme', 'Mi casa', 'Servicios',
    'Mascotas', 'Salud', 'Comprar', 'Aprender', 'Otros'
  ) then
    raise exception 'Invalid business category' using errcode = '22023';
  end if;

  if char_length(trim(coalesce(p_short_description, ''))) not between 2 and 180 then
    raise exception 'Short description must contain between 2 and 180 characters' using errcode = '22023';
  end if;

  if p_zone is null or trim(p_zone) not in (
    'El Refugio', 'Zibatá', 'Zakia', 'La Pradera', 'Juriquilla', 'El Campanario'
  ) then
    raise exception 'Invalid business zone' using errcode = '22023';
  end if;

  if char_length(trim(coalesce(p_address, ''))) not between 2 and 180 then
    raise exception 'Address must contain between 2 and 180 characters' using errcode = '22023';
  end if;

  if char_length(trim(coalesce(p_business_hours, ''))) not between 2 and 120 then
    raise exception 'Business hours must contain between 2 and 120 characters' using errcode = '22023';
  end if;

  whatsapp_value := trim(coalesce(p_whatsapp, ''));
  whatsapp_digits := regexp_replace(whatsapp_value, '[^0-9]', '', 'g');

  if char_length(whatsapp_value) > 80
    or not (
      (
        whatsapp_value ~ '^[+0-9() .-]+$'
        and char_length(whatsapp_digits) between 10 and 15
      )
      or whatsapp_value ~ '^https://wa[.]me/[0-9]{10,15}([?].*)?$'
    ) then
    raise exception 'A valid public WhatsApp number is required' using errcode = '22023';
  end if;

  if nullif(trim(coalesce(p_phone, '')), '') is not null
    and char_length(trim(p_phone)) > 40 then
    raise exception 'Phone number is too long' using errcode = '22023';
  end if;

  if p_maps_url is null or trim(p_maps_url) !~* '^https?://' then
    raise exception 'Maps URL must use http or https' using errcode = '22023';
  end if;

  if (nullif(trim(coalesce(p_instagram, '')), '') is not null and trim(p_instagram) !~* '^https?://')
    or (nullif(trim(coalesce(p_facebook, '')), '') is not null and trim(p_facebook) !~* '^https?://')
    or (nullif(trim(coalesce(p_website, '')), '') is not null and trim(p_website) !~* '^https?://') then
    raise exception 'Public links must use http or https' using errcode = '22023';
  end if;

  if char_length(coalesce(p_maps_url, '')) > 1000
    or char_length(coalesce(p_instagram, '')) > 1000
    or char_length(coalesce(p_facebook, '')) > 1000
    or char_length(coalesce(p_website, '')) > 1000 then
    raise exception 'A public URL is too long' using errcode = '22023';
  end if;

  if char_length(coalesce(p_promotion_title, '')) > 120
    or char_length(coalesce(p_promotion_description, '')) > 500 then
    raise exception 'Legacy promotion copy is too long' using errcode = '22023';
  end if;

  private_prefix := p_business_id::text || '/admin-edits/';
  public_prefix := 'businesses/' || p_business_id::text || '/admin-edits/';

  -- Las rutas existentes se aceptan sin reinterpretarlas. Una ruta nueva solo
  -- puede apuntar a la carpeta administrativa del mismo negocio y al rol de
  -- imagen correspondiente. El bucket se determina por el estado actual.
  if p_logo_path is distinct from current_business.logo_url then
    if p_logo_path is null
      or (
        current_business.status = 'publicado'
        and p_logo_path !~ ('^' || public_prefix || uuid_v4_pattern || '-logo[.](jpg|jpeg|png|webp)$')
      )
      or (
        current_business.status <> 'publicado'
        and p_logo_path !~ ('^' || private_prefix || uuid_v4_pattern || '/logo[.](jpg|jpeg|png|webp)$')
      ) then
      raise exception 'Invalid logo path for this business' using errcode = '22023';
    end if;

    if not exists (
      select 1
      from storage.objects as object
      where object.bucket_id = case
        when current_business.status = 'publicado' then 'business-public'
        else 'business-submissions'
      end
        and object.name = p_logo_path
    ) then
      raise exception 'Logo object not found in the expected bucket' using errcode = 'P0002';
    end if;
  end if;

  if p_main_image_path is distinct from current_business.main_image_url then
    if p_main_image_path is null
      or (
        current_business.status = 'publicado'
        and p_main_image_path !~ ('^' || public_prefix || uuid_v4_pattern || '-principal[.](jpg|jpeg|png|webp)$')
      )
      or (
        current_business.status <> 'publicado'
        and p_main_image_path !~ ('^' || private_prefix || uuid_v4_pattern || '/principal[.](jpg|jpeg|png|webp)$')
      ) then
      raise exception 'Invalid main image path for this business' using errcode = '22023';
    end if;

    if not exists (
      select 1
      from storage.objects as object
      where object.bucket_id = case
        when current_business.status = 'publicado' then 'business-public'
        else 'business-submissions'
      end
        and object.name = p_main_image_path
    ) then
      raise exception 'Main image object not found in the expected bucket' using errcode = 'P0002';
    end if;
  end if;

  update public.businesses
  set
    business_name = trim(p_business_name),
    category = trim(p_category),
    short_description = trim(p_short_description),
    zone = trim(p_zone),
    address = trim(p_address),
    maps_url = trim(p_maps_url),
    business_hours = trim(p_business_hours),
    home_service = coalesce(p_home_service, false),
    whatsapp = whatsapp_value,
    phone = nullif(trim(coalesce(p_phone, '')), ''),
    instagram = nullif(trim(coalesce(p_instagram, '')), ''),
    facebook = nullif(trim(coalesce(p_facebook, '')), ''),
    website = nullif(trim(coalesce(p_website, '')), ''),
    logo_url = p_logo_path,
    main_image_url = p_main_image_path,
    promotion_title = nullif(trim(coalesce(p_promotion_title, '')), ''),
    promotion_description = nullif(trim(coalesce(p_promotion_description, '')), '')
  where id = p_business_id
  returning * into result;

  -- La respuesta excluye deliberadamente contacto responsable, consentimientos,
  -- source y seguimiento comercial. La UI conserva esos campos desde la fila que
  -- ya obtuvo mediante la policy administrativa de SELECT.
  return jsonb_build_object(
    'id', result.id,
    'updated_at', result.updated_at,
    'status', result.status,
    'business_name', result.business_name,
    'slug', result.slug,
    'category', result.category,
    'short_description', result.short_description,
    'zone', result.zone,
    'address', result.address,
    'maps_url', result.maps_url,
    'business_hours', result.business_hours,
    'home_service', result.home_service,
    'whatsapp', result.whatsapp,
    'phone', result.phone,
    'instagram', result.instagram,
    'facebook', result.facebook,
    'website', result.website,
    'logo_url', result.logo_url,
    'main_image_url', result.main_image_url,
    'promotion_title', result.promotion_title,
    'promotion_description', result.promotion_description,
    'listing_type', result.listing_type,
    'theme', result.theme
  );
end;
$$;

alter function public.admin_update_business(
  uuid, text, text, text, text, text, text, text, boolean,
  text, text, text, text, text, text, text, text, text
) owner to postgres;

revoke all on function public.admin_update_business(
  uuid, text, text, text, text, text, text, text, boolean,
  text, text, text, text, text, text, text, text, text
) from public, anon;
grant execute on function public.admin_update_business(
  uuid, text, text, text, text, text, text, text, boolean,
  text, text, text, text, text, text, text, text, text
) to authenticated;

comment on function public.admin_update_business(
  uuid, text, text, text, text, text, text, text, boolean,
  text, text, text, text, text, text, text, text, text
) is
  'Actualiza solo campos comerciales publicos. Conserva id, slug, status, contacto responsable, consentimientos, source, listing_type, theme y seguimiento comercial.';

-- Cargas privadas nuevas: exclusivamente administradores, el UUID del negocio
-- como primera carpeta, admin-edits como segunda carpeta y logo/principal con
-- UUID v4 y extension de imagen permitida. El bucket sigue sin lectura publica.
drop policy if exists "Admins can upload private business edits" on storage.objects;
create policy "Admins can upload private business edits"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'business-submissions'
  and (select public.is_admin())
  and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/admin-edits/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/(logo|principal)[.](jpg|jpeg|png|webp)$'
  and exists (
    select 1
    from public.businesses as business
    where business.id::text = split_part(name, '/', 1)
      and business.status <> 'publicado'
  )
);

comment on policy "Admins can upload private business edits" on storage.objects is
  'INSERT privado limitado a admins y negocios no publicados, con rutas {business-uuid}/admin-edits/{upload-uuid}/logo|principal. El bucket conserva MIME permitidos.';

-- Endurece la policy administrativa publica existente sin romper los tres
-- flujos autorizados: publicacion inicial, edicion de un negocio publicado e
-- imagenes de promociones. La lectura publica del bucket no cambia.
drop policy if exists "Admins can publish business images" on storage.objects;
create policy "Admins can publish business images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'business-public'
  and (select public.is_admin())
  and (
    (
      name ~ '^businesses/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-(logo|principal)[.](jpg|jpeg|png|webp)$'
      and exists (
        select 1
        from public.businesses as business
        where business.id::text = split_part(name, '/', 2)
          and business.status = 'aprobado'
      )
    )
    or (
      name ~ '^businesses/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/admin-edits/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-(logo|principal)[.](jpg|jpeg|png|webp)$'
      and exists (
        select 1
        from public.businesses as business
        where business.id::text = split_part(name, '/', 2)
          and business.status = 'publicado'
      )
    )
    or name ~ '^promotions/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/imagen[.](jpg|jpeg|png|webp)$'
  )
);

comment on policy "Admins can publish business images" on storage.objects is
  'INSERT publico solo para admins y rutas validadas de publicacion, edicion o promociones. El bucket conserva MIME permitidos.';

notify pgrst, 'reload schema';

commit;
