# La Repisa Chañarense

Biblioteca editorial digital dedicada a San Patricio del Chañar.

## Tecnología
Sitio estático: HTML, CSS y JavaScript sin frameworks, servidor, base de datos ni dependencias de ejecución. Preparado para GitHub Pages.

## Estructura
- `index.html`: portada.
- `colecciones.html`: catálogo con búsqueda, filtros y orden.
- `acerca-de.html`: propósito, criterios editoriales y participación.
- `css/styles.css`: sistema visual adaptable.
- `js/catalogo.js`: catálogo central editable.
- `js/app.js`: renderizado, filtros, navegación y copia de alias.
- `assets/`: identidad y recursos gráficos.
- `publicaciones/`: archivos editoriales que se incorporen.

## Incorporar una publicación
Editar `window.REPISA_CATALOG.publications` en `js/catalogo.js` y agregar un objeto con:
- `id` único, sin espacios.
- `title`, `description`, `collection`, `type`.
- `status: "published"` para que aparezca en el catálogo.
- `cover` y `file` con rutas relativas cuando los archivos estén cargados.
- Autoría, créditos, fecha y fuentes.

Valores admitidos para `collection`: `historia`, `territorio`, `gente`, `descubrir`, `cultura`, `archivo`.
Tipos sugeridos: `libro`, `fotografia`, `documento`, `mapa`, `revista`.

**Regla editorial:** no publicar materiales sin verificar procedencia, derechos, créditos y permisos. Un elemento en preparación no debe marcarse como publicado.

## Publicación en GitHub Pages
En el repositorio: Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.
La dirección será: https://eliasmartinezcultural-glitch.github.io/RUMA-/

## Estado
Primera base estructural. Antes del lanzamiento público: revisar alias de colaboración, incorporar publicaciones reales, verificar permisos de materiales y probar enlaces/descargas en dispositivos reales.
