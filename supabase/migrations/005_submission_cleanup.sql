-- Permite que el formulario elimine exclusivamente archivos huérfanos creados
-- por un intento de alta que no alcanzó a insertar su fila en businesses.
--
-- El UUID v4 de la primera carpeta funciona como una capability temporal:
-- business-submissions es privado y anon no puede listar ni leer objetos, por lo
-- que solo el cliente que acaba de generar la ruta aleatoria conoce su nombre.

create or replace function public.can_cleanup_failed_submission_object(
  p_name text,
  p_created_at timestamptz
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select
    p_created_at >= now() - interval '15 minutes'
    and p_created_at <= now() + interval '1 minute'
    and p_name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/(logo|principal)[.](jpg|jpeg|png|webp)$'
    and not exists (
      select 1
      from public.businesses as business
      where business.id::text = split_part(p_name, '/', 1)
        or business.logo_url = p_name
        or business.main_image_url = p_name
    );
$$;

revoke all on function public.can_cleanup_failed_submission_object(text, timestamptz) from public, authenticated;
grant execute on function public.can_cleanup_failed_submission_object(text, timestamptz) to anon;

comment on function public.can_cleanup_failed_submission_object(text, timestamptz) is
  'Autoriza cleanup solo para una ruta UUID v4 de logo/principal creada en los ultimos 15 minutos y sin fila asociada en businesses.';

-- remove() necesita SELECT sobre las filas que va a eliminar. Este SELECT no
-- permite listar, descargar, inspeccionar ni firmar objetos: solo se activa
-- cuando Storage identifica la operacion exacta de remove([...]) como
-- storage.object.delete_many.
drop policy if exists "Anonymous users can select current failed submission images for deletion" on storage.objects;
create policy "Anonymous users can select current failed submission images for deletion"
on storage.objects
for select
to anon
using (
  storage.allow_only_operation('storage.object.delete_many')
  and bucket_id = 'business-submissions'
  and owner_id is null
  and public.can_cleanup_failed_submission_object(name, created_at)
);

comment on policy "Anonymous users can select current failed submission images for deletion" on storage.objects is
  'SELECT tecnico solo durante storage.object.delete_many para objetos anonimos de business-submissions, rutas UUID v4 logo/principal JPG/PNG/WebP, maximo 15 minutos y sin business asociado. No habilita listados ni lectura normal.';

drop policy if exists "Anonymous users can delete current failed submission images" on storage.objects;
create policy "Anonymous users can delete current failed submission images"
on storage.objects
for delete
to anon
using (
  bucket_id = 'business-submissions'
  and owner_id is null
  and public.can_cleanup_failed_submission_object(name, created_at)
);

comment on policy "Anonymous users can delete current failed submission images" on storage.objects is
  'DELETE anon limitado a objetos anonimos de business-submissions, rutas UUID v4 logo/principal JPG/PNG/WebP, maximo 15 minutos y sin business asociado. SELECT solo existe para delete_many mediante policy operation-aware. No afecta business-public.';

notify pgrst, 'reload schema';
