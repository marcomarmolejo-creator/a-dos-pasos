# Supabase Phase 1 · Alta de negocios

Esta fase conecta `/para-negocios/alta` con una tabla privada de solicitudes y un bucket privado para imágenes. No migra el directorio, residentes, administración ni los datos demo.

## Configuración

1. Crea o selecciona el proyecto de Supabase.
2. Ejecuta `supabase/migrations/001_create_businesses.sql` desde SQL Editor (o con Supabase CLI).
3. Copia `.env.example` a `.env.local` y configura:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Ejecuta `npm run build`.

`.env.local` está ignorado por Git. La aplicación no usa `service_role` ni contraseñas de base de datos.

## Seguridad

- `businesses` tiene RLS habilitado.
- El rol anónimo solo recibe privilegio `INSERT`.
- La política de inserción solo acepta registros con estado `pendiente` y los tres consentimientos en verdadero.
- No existen políticas públicas de `SELECT`, `UPDATE` o `DELETE`.
- `business-submissions` es un bucket privado. El rol anónimo solo puede subir JPG, PNG o WEBP de hasta 8 MB; no puede leer, listar, actualizar ni borrar archivos.
- El formulario no envía el campo `status`; la base asigna `pendiente` por defecto.

## Mapeo principal

| Formulario | Supabase |
| --- | --- |
| `businessName` | `business_name` |
| slug generado | `slug` |
| `description` | `short_description` |
| `delivery` | `home_service` |
| `hours` | `business_hours` |
| `contactPhone` | `contact_whatsapp` |
| `logo` | ruta privada en `logo_url` |
| `mainImage` | ruta privada en `main_image_url` |

La vigencia opcional se conserva en `promotion_expiration` para no perder un campo ya existente del formulario aprobado.

## Flujo de envío

1. El navegador valida campos, imágenes y consentimientos.
2. Genera un UUID para agrupar los dos archivos.
3. Sube logo e imagen principal al bucket privado.
4. Inserta la solicitud en `businesses` con las rutas privadas de Storage.
5. Muestra confirmación únicamente después de una inserción exitosa.

Si Storage o la inserción fallan, el formulario conserva los datos y muestra un mensaje recuperable. Los detalles técnicos solo se registran en consola durante desarrollo.

## Pendiente para una fase posterior

- Panel administrativo y autenticación.
- Flujo editorial para aprobar/publicar/rechazar.
- Lectura del directorio desde Supabase.
- URLs firmadas o transformación editorial de imágenes.
- Limpieza automática de archivos huérfanos si una subida termina pero la inserción posterior falla.
