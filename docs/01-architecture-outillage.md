# Module 1 — [Angular] Architecture et outillage

> Durée estimée : 2–3 h · Widget : la coquille de l'application (page d'accueil listant les widgets)

## Ce que tu sauras faire à la fin

- Utiliser la CLI Angular pour créer, générer, lancer, construire et tester
- Te repérer dans les fichiers d'un projet Angular
- Expliquer **ce qui se passe entre l'ouverture de la page et l'affichage du premier composant**
- Savoir à quoi sert `app.config.ts` et ce qu'est un _provider_
- Comprendre pourquoi le standalone a remplacé les `NgModule` et ce que faisait zone.js

| Priorité | Notions |
| --- | --- |
| ★ cœur | Angular CLI, structure d'un projet, `main.ts` → `bootstrapApplication` → `app.config.ts`, composant racine |
| ○ courant | `angular.json`, standalone vs NgModule, zoneless |
| · référence | Angular DevTools, MCP Angular |

---

## 1. ★ La CLI Angular

La CLI (`@angular/cli`, commande `ng`) est l'outil en ligne de commande officiel. Elle crée le projet, génère du code qui respecte les conventions, et pilote la compilation. En entreprise, **on ne crée presque jamais un fichier de composant à la main** : on passe par `ng generate`.

Dans ce projet, `ng` est installé localement (dans `node_modules`). On l'appelle donc via `npx ng ...` ou via les scripts npm de `package.json` :

```jsonc
"scripts": {
  "ng": "ng",
  "start": "ng serve",        // npm start
  "build": "ng build",        // npm run build
  "watch": "ng build --watch --configuration development",
  "test": "ng test"           // npm test
}
```

| Commande | Rôle | Quand tu l'utilises |
| --- | --- | --- |
| `ng new mon-app` | Crée un projet complet (fichiers, dépendances, git) | Une fois par projet |
| `ng serve` | Compile en mémoire et lance un serveur de dev sur http://localhost:4200, avec rechargement automatique | Toute la journée pendant que tu codes |
| `ng generate component home` (ou `ng g c home`) | Crée un composant : `home.ts`, `home.html`, `home.scss`, `home.spec.ts` | À chaque nouveau composant |
| `ng g service`, `ng g pipe`, `ng g directive`, `ng g guard`, `ng g interceptor` | Idem pour les autres briques | Modules suivants |
| `ng build` | Compile et optimise pour la production dans `dist/` | Avant un déploiement |
| `ng test` | Lance les tests unitaires (ici avec Vitest) | Avant chaque commit, idéalement |

Options utiles de `ng generate` :

```bash
npx ng g c widgets/01-demo/demo --dry-run   # affiche ce qui SERAIT créé, sans rien écrire
npx ng g c home --skip-tests                # ne crée pas le fichier .spec.ts
npx ng g c home --inline-template --inline-style   # template et styles dans le .ts
```

> 💡 `--dry-run` est ton ami : il te montre les fichiers générés avant de les créer.

**Nommage (Angular ≥ 20)** : les fichiers n'ont plus de suffixe `.component`. `ng g c home` crée `home.ts` avec une classe `Home`, et non plus `home.component.ts` avec `HomeComponent`. Tu verras encore beaucoup l'ancien style en entreprise.

---

## 2. ★ La structure du projet

```
learn-rxjs/
├── angular.json          ← configuration de la CLI (build, serve, test)
├── package.json          ← dépendances npm + scripts
├── tsconfig.json         ← options TypeScript communes
├── tsconfig.app.json     ←   … pour le code de l'application
├── tsconfig.spec.json    ←   … pour les tests
├── .prettierrc           ← formatage du code
├── public/               ← fichiers statiques copiés tels quels (favicon, images)
└── src/
    ├── index.html        ← LA page HTML unique (Single Page Application)
    ├── main.ts           ← point d'entrée TypeScript : démarre Angular
    ├── styles.scss       ← styles globaux (toute l'application)
    └── app/
        ├── app.ts        ← composant racine (classe App)
        ├── app.html      ← son template
        ├── app.scss      ← ses styles (limités à ce composant)
        ├── app.spec.ts   ← ses tests
        ├── app.config.ts ← configuration de l'application (providers)
        └── app.routes.ts ← table des routes
```

À retenir :

- **Une seule page HTML** : Angular est une _SPA_ (Single Page Application). Le navigateur charge `index.html` une fois, puis Angular remplace le contenu à l'écran sans recharger la page.
- **`public/`** : ce qui y est placé est servi à la racine du site (`public/favicon.ico` → `/favicon.ico`).
- **`styles.scss` vs `app.scss`** : le premier s'applique partout, le second uniquement au composant `App` (on verra pourquoi au module 2 : l'encapsulation des styles).

---

## 3. ★ Le démarrage : de `index.html` au premier composant affiché

C'est **le** schéma à comprendre dans ce module :

```
 Navigateur                   index.html
    │   charge                ┌───────────────────────────┐
    └──────────────────────►  │ <body>                    │
                              │   <app-root></app-root>   │ ◄── balise vide pour l'instant
                              │ </body>                   │
                              └───────────────────────────┘
                                          │ la CLI a ajouté un <script> qui charge main.js
                                          ▼
                              main.ts
                              ┌───────────────────────────────────────┐
                              │ bootstrapApplication(App, appConfig)  │
                              └───────────────┬───────────────┬───────┘
                                              │               │
                           "quel composant ?" │               │ "avec quels services ?"
                                              ▼               ▼
                              app.ts                      app.config.ts
                              ┌──────────────────────┐    ┌───────────────────────────┐
                              │ @Component({         │    │ providers: [              │
                              │  selector: 'app-root'│    │   provideRouter(routes),  │
                              │  templateUrl: ...    │    │   ...                     │
                              │ })                   │    │ ]                         │
                              │ export class App {}  │    └─────────────┬─────────────┘
                              └──────────┬───────────┘                  │
                                         │                              ▼
                                         │                      app.routes.ts
                                         ▼
                 Angular cherche <app-root> dans la page et y affiche le template de App
```

### `main.ts`

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

`bootstrapApplication` reçoit deux choses :

1. **le composant racine** (`App`) : le premier composant affiché, qui contiendra tous les autres ;
2. **la configuration** (`appConfig`) : la liste des services disponibles dans toute l'application.

Il retourne une `Promise` ; le `.catch` affiche l'erreur si le démarrage échoue (une erreur à ce stade = écran blanc, donc toujours regarder la console !).

### Le lien `selector` ↔ `index.html`

Le `selector: 'app-root'` de `App` correspond à la balise `<app-root>` de `index.html`. C'est comme ça qu'Angular sait **où** afficher le composant racine. Si tu renommes l'un sans l'autre : écran blanc et erreur `NG05104: The selector "app-root" did not match any elements`.

---

## 4. ★ `app.config.ts` et les _providers_

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
```

Un **provider** dit à Angular : « voici comment fournir tel service à qui le demande ». Le système qui distribue ces services s'appelle **l'injection de dépendances** (module 6 en détail).

Les fonctions `provideXxx()` sont la façon moderne d'activer une fonctionnalité d'Angular :

| Provider | Ce qu'il active | Module |
| --- | --- | --- |
| `provideBrowserGlobalErrorListeners()` | Capture les erreurs non gérées du navigateur et les envoie à l'`ErrorHandler` d'Angular | 23 |
| `provideRouter(routes)` | Le routeur (navigation entre pages) | 9 |
| `provideHttpClient()` | Les requêtes HTTP (pas encore présent ici) | 10 |

> 🧠 Règle simple : **tu veux une fonctionnalité globale ? Tu ajoutes un `provideXxx()` dans `app.config.ts`.**

### `app.routes.ts`

```ts
export const routes: Routes = [];
```

Pour l'instant, aucune route. Une route associe une URL à un composant :

```ts
export const routes: Routes = [
  { path: 'about', loadComponent: () => import('./about/about').then((m) => m.About) },
];
```

Le composant de la route s'affiche **à l'emplacement de `<router-outlet />`** dans le template d'`App`. Avec `loadComponent` + `import()`, le code du composant est placé dans un fichier JavaScript séparé, téléchargé seulement quand on visite l'URL : c'est le **lazy loading**. Le routing complet est au module 9 ; ici on a juste besoin de ces deux lignes.

---

## 5. ★ Le composant racine

```ts
@Component({
  selector: 'app-root',        // balise HTML qui représente ce composant
  imports: [RouterOutlet],     // ce que le TEMPLATE a le droit d'utiliser
  templateUrl: './app.html',   // le HTML (chemin relatif au fichier .ts)
  styleUrl: './app.scss',      // les styles, limités à ce composant
})
export class App {
  protected readonly title = signal('learn-rxjs');
}
```

- Un composant = **une classe TypeScript** (données et logique) **+ un template** (HTML) **+ des styles**.
- `imports` : un composant standalone doit déclarer ce qu'il utilise dans son template. `<router-outlet />` n'est connu que parce que `RouterOutlet` est importé. Oublie l'import → erreur de compilation `'router-outlet' is not a known element`.
- `protected` : accessible depuis le template, mais pas depuis l'extérieur de la classe. C'est la convention pour ce qui ne sert qu'au template.
- `signal('learn-rxjs')` : une valeur réactive (module 3). Dans le template, on la lit en l'appelant : `{{ title() }}`.

Le composant racine est en général **une coquille** : en-tête, navigation, `<router-outlet />`, pied de page. Le vrai contenu vient des routes.

---

## 6. ○ `angular.json`

C'est la configuration de la CLI. Les parties à savoir lire :

```jsonc
"architect": {
  "build": {
    "builder": "@angular/build:application",  // le moteur (esbuild + Vite)
    "options": {
      "browser": "src/main.ts",               // point d'entrée
      "styles": ["src/styles.scss"],          // styles globaux
      "assets": [{ "glob": "**/*", "input": "public" }]
    },
    "configurations": {
      "production":  { "budgets": [...], "outputHashing": "all" },
      "development": { "optimization": false, "sourceMap": true }
    },
    "defaultConfiguration": "production"      // ng build = production par défaut
  },
  "serve": { "defaultConfiguration": "development" },  // ng serve = dev par défaut
  "test":  { "builder": "@angular/build:unit-test" }   // Vitest
}
```

- **`architect`** : chaque clé (`build`, `serve`, `test`) est une commande `ng`.
- **`configurations`** : des variantes. `ng build --configuration development` produit un build non minifié, lisible.
- **`budgets`** : alerte (warning) ou échec (error) si le bundle dépasse une taille. Ici : warning à 500 kB, erreur à 1 MB. Garde-fou très utilisé en entreprise (module 21).
- **`outputHashing: "all"`** : ajoute une empreinte au nom des fichiers (`main-X7K2P.js`) pour que le navigateur ne garde pas une vieille version en cache.

Un détail : le projet utilise TypeScript 6, qui active le mode `strict` par défaut. C'est pour ça que tu ne vois pas `"strict": true` dans `tsconfig.json`.

---

## 7. ○ Standalone vs NgModule : pourquoi le standalone a gagné

Avant Angular 14, **tout composant devait appartenir à un `NgModule`**, une sorte de « boîte » qui déclarait des composants et importait d'autres boîtes. Un composant ne pouvait pas dire lui-même ce dont il avait besoin.

Problèmes :
- pour savoir ce qu'un template pouvait utiliser, il fallait remonter jusqu'au module qui le déclarait ;
- beaucoup de code répétitif (`SharedModule` fourre-tout, modules par fonctionnalité) ;
- lazy loading plus lourd (il fallait un module entier par route).

Avec le **standalone** (par défaut depuis Angular 19), chaque composant déclare ses propres `imports`. Il est autonome, plus facile à lire, à tester et à charger à la demande.

> ### Legacy : ce que tu verras en entreprise (·)
>
> ```ts
> // app.module.ts — AVANT
> @NgModule({
>   declarations: [AppComponent, HeaderComponent],   // composants de ce module
>   imports: [BrowserModule, HttpClientModule, AppRoutingModule],
>   providers: [],
>   bootstrap: [AppComponent],                        // composant racine
> })
> export class AppModule {}
>
> // main.ts — AVANT
> platformBrowserDynamic().bootstrapModule(AppModule);
> ```
>
> | Ancien | Moderne |
> | --- | --- |
> | `@NgModule({ bootstrap: [AppComponent] })` + `bootstrapModule(AppModule)` | `bootstrapApplication(App, appConfig)` |
> | `imports: [HttpClientModule]` dans le module | `provideHttpClient()` dans `app.config.ts` |
> | `RouterModule.forRoot(routes)` | `provideRouter(routes)` |
> | `declarations: [MonComposant]` | le composant est standalone, rien à déclarer |
> | `standalone: true` écrit dans le décorateur (Angular 14–18) | inutile : c'est le défaut depuis Angular 19 |
> | `app.component.ts` / `AppComponent` | `app.ts` / `App` (convention Angular 20) |

---

## 8. ○ Zoneless : ce que zone.js faisait avant

**Le problème** : quand une donnée change (clic, réponse HTTP, timer), Angular doit mettre l'écran à jour. Mais comment sait-il **quand** vérifier ?

**Avant (zone.js)** : une bibliothèque, zone.js, _modifiait_ les fonctions du navigateur (`setTimeout`, `addEventListener`, `fetch`, les `Promise`…). Après chaque événement de ce type, elle prévenait Angular : « il s'est peut-être passé quelque chose, revérifie tout l'arbre des composants ».

```
 clic ─► zone.js intercepte ─► Angular revérifie TOUS les composants ─► met à jour le DOM
```

Ça marchait « par magie », mais avec des défauts : vérifications inutiles, ~30 kB de plus, piles d'erreurs illisibles, et un comportement difficile à comprendre.

**Maintenant (zoneless, par défaut depuis Angular 21)** : plus de zone.js. Angular met l'écran à jour quand il **sait** qu'une donnée a changé, principalement grâce aux **signals** :

```
 signal.set(nouvelle valeur) ─► Angular sait QUELS composants lisent ce signal ─► met à jour ceux-là
```

Les événements du template (`(click)`) et le pipe `async` déclenchent aussi une mise à jour. Conséquence pratique pour toute la formation : **l'état affiché doit être dans des signals** (ou passer par `async` / `toSignal`). Une simple propriété modifiée dans un `setTimeout` ne s'affichera pas. Tu le vérifieras toi-même au module 3.

Tu peux constater que `zone.js` n'est pas dans les dépendances de `package.json`.

> **Legacy (·)** : dans un vieux projet, tu verras `zone.js` dans `package.json` et dans `polyfills` de `angular.json`, et parfois `provideZoneChangeDetection()` dans la config.

---

## 9. · Référence : outils à connaître

- **Angular DevTools** : extension Chrome/Firefox. Onglet « Angular » dans les outils de développement : arbre des composants, valeurs des inputs et des signals, profiler de détection de changement. *Quand y penser* : quand tu te demandes « pourquoi mon composant n'affiche pas la bonne valeur ? ».
- **MCP Angular** : `ng mcp` expose un serveur qui donne aux assistants IA (comme moi) la documentation et les bonnes pratiques Angular à jour. Il est déjà configuré dans `.vscode/mcp.json`. *Quand y penser* : pour qu'un assistant IA te propose du code Angular moderne plutôt que des syntaxes dépassées.

---

## Exemple générique : ajouter une page avec la CLI

Voici le cycle complet pour ajouter une page « À propos » à une application. Pas besoin de le reproduire dans ce projet : c'est le même principe que tu appliqueras dans l'exercice.

**1. Générer le composant**

```bash
npx ng g c about --dry-run   # vérifier ce qui sera créé
npx ng g c about
# CREATE src/app/about/about.ts
# CREATE src/app/about/about.html
# CREATE src/app/about/about.scss
# CREATE src/app/about/about.spec.ts
```

**2. Le composant généré**

```ts
// src/app/about/about.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
```

**3. Déclarer la route (lazy)**

```ts
// src/app/app.routes.ts
export const routes: Routes = [
  {
    path: 'about',
    // import() dynamique : About est dans un fichier JS séparé,
    // téléchargé seulement quand on visite /about
    loadComponent: () => import('./about/about').then((m) => m.About),
  },
];
```

**4. Vérifier**

```bash
npm start
```

Ouvre http://localhost:4200/about : le template d'`About` s'affiche à la place de `<router-outlet />`. Dans la console où tourne `ng serve`, tu vois une ligne **« Lazy chunk files »** contenant `about` : c'est la preuve du lazy loading.

**5. Construire pour la production**

```bash
npm run build
```

La sortie liste les fichiers produits dans `dist/` avec leur taille : « Initial chunk files » (chargés au démarrage) et « Lazy chunk files » (chargés à la demande).

---

## Exercice : la coquille de l'application

> ⚠️ Ne regarde pas de solution : c'est à toi de jouer. Demande-moi des indices si tu bloques.

**Objectif** : remplacer la page d'exemple d'Angular par la coquille de notre lab : un en-tête et une page d'accueil qui liste les widgets de la formation.

### Consignes

1. **Nettoyer `App`** : dans `app.html`, supprime tout le contenu d'exemple généré par Angular. Garde uniquement :
   - un en-tête (`<header>`) avec le titre de l'application, affiché via le signal `title` (qui vaudra par exemple `'Angular & RxJS Lab'`) ;
   - un `<main>` qui contient `<router-outlet />`.
2. **Générer un composant `Home`** avec la CLI, dans `src/app/home/`.
3. **Déclarer une route lazy** : le chemin vide (`''`) affiche `Home` via `loadComponent`.
4. **Lister les widgets** dans `Home` :
   - dans la classe, un tableau (une propriété `protected readonly`) décrivant les widgets. Chaque élément a : un numéro de module, un titre, une étiquette (`Angular`, `RxJS`, `Pont` ou `Tests`) ;
   - pour l'instant il n'y a qu'un seul élément : le module 1 lui-même ;
   - dans le template, affiche une liste (`<ul>` / `<li>`) de ces widgets. On n'a pas encore vu `@for` (module 2) : **cherche dans la doc d'Angular** comment afficher une liste. Trouver l'info dans la doc fait partie de l'exercice.
5. **Définir un type** pour un widget (une `interface` ou un `type` TypeScript), plutôt que de laisser TypeScript deviner.
6. **Réparer le test** : `app.spec.ts` vérifie un `<h1>` contenant `Hello, learn-rxjs`, ce qui ne sera plus vrai. Adapte-le à ton nouveau titre, puis lance `npm test` : tout doit passer.
7. **Vérifier le build** : `npm run build` doit réussir, et `home` doit apparaître dans les « Lazy chunk files ».

### Critères de réussite

- [ ] `npm start` → http://localhost:4200 affiche l'en-tête et la liste des widgets, sans erreur dans la console du navigateur
- [ ] `Home` est chargé en lazy (visible dans la sortie de `ng serve` ou `ng build`)
- [ ] `npm test` passe
- [ ] Aucun `standalone: true` ni `changeDetection` dans les décorateurs (ce sont les valeurs par défaut)
- [ ] Accessibilité : un seul `<h1>` par page, structure `<header>` / `<main>`, la liste est une vraie `<ul>`. Mets `lang="fr"` dans `index.html`, puisque le contenu est en français

### Bonus (facultatif)

- Change le `<title>` de `index.html` pour un nom plus parlant.
- Ajoute un peu de style dans `home.scss` : une grille de cartes plutôt qu'une simple liste.

Quand tu as fini (ou si tu bloques), dis-le-moi : je relirai ton code.
