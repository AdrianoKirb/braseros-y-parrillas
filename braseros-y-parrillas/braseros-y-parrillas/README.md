# Braseros y parrillas de varilla

App web instalable (PWA), sin dependencias ni paso de build, para fabricar braseros y parrillas de varilla: plano, lista de corte, instrucciones y costo de materiales. Funciona sin conexión una vez abierta.

## Probar en local
```
python3 -m http.server 8000
```
Abrí http://localhost:8000. (El modo sin conexión y la instalación requieren http(s); abrir `index.html` con doble clic funciona, pero sin eso.)

## Subir a GitHub y publicarla
```
git init -b main
git add .
git commit -m "Primera versión"
git remote add origin https://github.com/TU-USUARIO/braseros-y-parrillas.git
git push -u origin main
```
En GitHub: **Settings → Pages → Source: GitHub Actions**. Con cada push a `main`, el workflow `.github/workflows/pages.yml` publica la app en `https://TU-USUARIO.github.io/braseros-y-parrillas/`.

## Instalarla como app
- **Android (Chrome):** menú ⋮ → *Instalar app*.
- **iPhone (Safari):** compartir → *Agregar a pantalla de inicio*.
- **Computadora (Chrome/Edge):** ícono de instalar en la barra de direcciones.

## Estructura
- `index.html`: pestañas Parrilla, Brasero y Costos.
- `css/style.css`: estilos (modo claro y oscuro).
- `js/app.js`: cálculos, planos SVG, instrucciones y registro del service worker.
- `manifest.webmanifest`, `sw.js`, `icons/`: lo que hace que sea instalable y funcione offline.
- `.github/workflows/pages.yml`: publicación automática.

Si modificás archivos, subí `VERSION` en `sw.js` para que los usuarios reciban la actualización.

## Supuestos
- Parrilla: marco y refuerzo Ø 10 mm, barras Ø 8 mm, patas Ø 10 mm.
- Brasero: aros y asas Ø 10 mm, verticales y fondo Ø 8 mm, patas Ø 12 mm; fondo con varillas cada 4 cm.
- Las barras comerciales se calculan de 12 m.
- Los precios se guardan en el navegador (localStorage).
- Las medidas de las piezas son estimadas; verificalas con tu diseño antes de cortar.
