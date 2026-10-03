# Supabase Phase 2 · Directorio y negocios publicados

Esta fase conecta el directorio y los micrositios a una capa pública segura de Supabase. La tabla `businesses` conserva juntos los datos editoriales, comerciales y privados, pero el navegador nunca la consulta directamente.

## Vista pública

La migración `supabase/migrations/002_create_published_businesses_view.sql` crea `public.published_businesses` con barrera de seguridad y filtro fijo:

```sql
where status = 'publicado'
```

Solo expone datos editoriales y comerciales aprobados. No incluye:

- `contact_name`
- `contact_whatsapp`
- `contact_email`
- `information_confirmed`
- `publication_authorized`
- `editorial_review_accepted`

Los roles públicos reciben `SELECT` únicamente sobre la vista. La migración revoca `SELECT`, `UPDATE` y `DELETE` directos sobre `businesses` para `anon` y `authenticated`; el `INSERT` anónimo de Fase 1 permanece limitado por su política RLS a solicitudes pendientes.

## Campos editoriales nuevos

- `listing_type`: `ficha` o `micrositio`; por defecto `ficha`.
- `theme`: opcional. Valores usados por la aplicación: `warm-editorial`, `serene-light`, `dark-classic` y `clean-service`.
- `slug`: conserva su columna existente y ahora tiene índice único parcial para evitar duplicados no nulos.

## Flujo manual de publicación

1. Revisar la solicitud en Supabase Table Editor.
2. Corregir o completar `slug`. Debe ser minúsculo, sin acentos, con guiones y único.
3. Asignar `listing_type`:
   - `ficha`: card con contacto y ubicación.
   - `micrositio`: card con enlace a `/negocio/[slug]` y micrositio dinámico.
4. Asignar `theme` solo si se necesita una variante específica. Si queda vacío, la aplicación selecciona uno por categoría.
5. Copiar manualmente las imágenes aprobadas desde `business-submissions` al bucket `business-public`:
   - `{slug}/logo.ext`
   - `{slug}/main.ext`
6. Actualizar `logo_url` y `main_image_url` con esos paths relativos de `business-public`. No guardar URLs firmadas ni rutas de `business-submissions` como imágenes públicas.
7. Cambiar `status` de `pendiente` a `aprobado` y finalmente a `publicado`.
8. Ejecutar un nuevo build/publicación para generar slugs nuevos de micrositios en el export estático actual.

## Imágenes

- `business-submissions` continúa privado y sin lectura pública.
- `business-public` es público exclusivamente para imágenes ya aprobadas.
- `business-public` no tiene política pública de `INSERT`, `UPDATE` ni `DELETE`.
- La aplicación construye URLs públicas solamente contra `business-public`.

## Directorio dinámico

`lib/businesses.ts` consulta solo `published_businesses`. El directorio intenta actualizar los datos desde Supabase en el navegador y mezcla:

1. negocios publicados;
2. demos locales temporales.

Los slugs publicados tienen prioridad y eliminan el demo duplicado. Los filtros existentes continúan operando sobre la colección combinada.

## Micrositios dinámicos

Durante el build, `/negocio/[slug]` incorpora los negocios publicados con `listing_type = 'micrositio'`. Primero consulta Supabase; si el slug no existe allí, usa el demo local. Los slugs desconocidos muestran el 404 personalizado.

La metadata usa `{business_name} | A Dos Pasos` y `short_description` para negocios reales.

## Fallback y disponibilidad

Si Supabase o la vista no están disponibles, el sitio conserva Forno Locale, Aura Spa, Barbería Clásica y Eleva Steam, además de las fichas demo existentes. La home no se migra en esta fase.

## Pendientes siguientes

- Automatizar copia de imágenes y publicación editorial.
- Reconstruir automáticamente el sitio al publicar un micrositio nuevo.
- Crear panel administrativo, autenticación y roles.
- Migrar otras colecciones de la home cuando corresponda.
