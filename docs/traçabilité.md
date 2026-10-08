# Table de traçabilité

Une ligne par notion. Cocher ✅ quand la notion est pratiquée dans un widget (★ et ○ doivent toutes l'être à la fin du parcours).

Légende : ★ cœur · ○ courant · · référence

## Module 1 — [Angular] Architecture et outillage

| ✓ | Notion | Priorité | Widget | Fichier | Quand l'utiliser en vrai |
| --- | --- | --- | --- | --- | --- |
| ⬜ | Angular CLI (`ng new`, `ng generate`, `ng serve`, `ng build`, `ng test`) | ★ | Coquille | — | Tous les jours : générer composants et services, lancer le serveur de dev, les tests et le build |
| ⬜ | Structure d'un projet | ★ | Coquille | `src/` | Pour se repérer en arrivant sur un projet existant |
| ⬜ | `main.ts` → `bootstrapApplication` → `app.config.ts` | ★ | Coquille | `src/main.ts`, `src/app/app.config.ts` | Quand on active une fonctionnalité globale (`provideHttpClient`, `provideRouter`…) ou qu'on débogue un écran blanc |
| ⬜ | Composant racine | ★ | Coquille | `src/app/app.ts` | Pour la mise en page commune : en-tête, navigation, `<router-outlet />` |
| ⬜ | `angular.json` | ○ | Coquille | `angular.json` | Pour ajuster les budgets, les configurations de build ou les styles globaux |
| ⬜ | Standalone vs NgModule | ○ | Coquille | `src/app/app.ts` | Pour écrire du standalone, et savoir lire les `NgModule` des projets anciens |
| ⬜ | Zoneless | ○ | Coquille | `package.json` (pas de zone.js) | Toujours : l'état affiché passe par des signals |
| — | Angular DevTools | · | — | — | Pour inspecter les composants et les signals quand l'affichage n'est pas celui attendu |
| — | MCP Angular | · | — | `.vscode/mcp.json` | Pour qu'un assistant IA propose du code Angular à jour |
