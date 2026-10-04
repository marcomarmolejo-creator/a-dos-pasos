# Admin MVP

## Recuperación de contraseña

La ruta pública que recibe la sesión de recuperación de Supabase Auth es:

`/admin/reset-password/`

En Supabase Dashboard, abrir **Authentication → URL Configuration → Redirect URLs** y agregar exactamente:

- Desarrollo local: `http://127.0.0.1:4173/admin/reset-password/`
- Producción: `https://adospasos.com.mx/admin/reset-password/`

El correo de recuperación debe solicitarse con una de esas URL como `redirectTo`. La página únicamente permite actualizar la contraseña cuando Supabase entrega una sesión de recuperación válida. Después del cambio se cierra la sesión local y el usuario debe iniciar sesión de nuevo.

## Publicación de micrositios

Cuando un negocio con `listing_type = 'micrositio'` se publica, debe ejecutarse un redeploy manual para que el export estático genere `/negocio/[slug]/`.
