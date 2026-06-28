# SportBook — Bloc 1: base tècnica i autenticació

Aquest bloc conté una primera versió autònoma de SportBook amb:

- configuració de Next.js, TypeScript, Tailwind CSS i ESLint;
- portada provisional;
- registre, inici de sessió i tancament de sessió;
- integració SSR amb Supabase;
- renovació de sessió mitjançant `proxy.ts`;
- validació de correu i contrasenya;
- components reutilitzables d'alerta i càrrega;
- proves unitàries bàsiques de validació.

Encara no inclou el catàleg de pistes, les reserves, les API ni les migracions de base de dades.

## Configuració

1. Instal·la Node.js 20 o superior.
2. Instal·la dependències:

```bash
npm install
```

3. Copia `.env.example` a `.env.local` i completa:

```env
NEXT_PUBLIC_SUPABASE_URL=https://el-teu-projecte.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

4. Executa:

```bash
npm run dev
```

Obre `http://localhost:3000`.

## Verificació

```bash
npm run typecheck
npm run lint
npm test
npm run build
```
