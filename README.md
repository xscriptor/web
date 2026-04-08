# web workspace

Repositorio de trabajo para construir y madurar librerias web antes de publicarlas.

## Estructura recomendada

- `xcomponents/`: libreria en desarrollo de componentes React/Next.
- `icons/xsvg/`: fuente de SVG crudos para generar iconos reutilizables.
- `react/`: area de pruebas y playground para validar componentes.
- `components/`: reservado para futuras librerias o migraciones.

## Convenciones

- Cada libreria vive en su propia carpeta raiz.
- Todo componente reusable debe exponer `index.ts` por nivel.
- Los assets fuente viven fuera de `src` y se transforman por scripts.
- No publicar paquetes hasta que esten marcados como estables.

## Estado actual

- `xcomponents` esta en modo desarrollo (package private).
- Los iconos TSX se generan automaticamente desde `icons/xsvg`.
