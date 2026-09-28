# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — dev server at http://localhost:4200 (auto-reloads on file changes)
- `npm run build` — production build to `dist/`
- `npm test` — run unit tests with Vitest (via the `@angular/build:unit-test` builder, jsdom environment)
- `ng test --include src/app/app.spec.ts` — run a single spec file
- `ng generate component <name>` — scaffold a component (SCSS styles are the configured default)

There is no lint script configured. Prettier is configured (100 char width, single quotes, Angular parser for HTML).

## Architecture

Angular 22 learning project (complete Angular course + essential RxJS). Standalone application (no NgModules): `src/main.ts` bootstraps the root `App` component with `appConfig` from `src/app/app.config.ts`, which registers the router with routes defined in `src/app/app.routes.ts`. Zoneless (no zone.js dependency), so change detection relies on signals. OnPush is the default change detection strategy in Angular 22.

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush`. It's the default in Angular v22.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()`, `output()` and `model()` functions instead of decorators
- Use `computed()` for derived state
- Prefer inline templates for small components
- Forms: use the API taught by the current module (Reactive Forms or Signal Forms); for new code outside the course, prefer Signal Forms
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state (`linkedSignal()` when derived state must also be writable)
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe (or `toSignal`) to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

# Angular 22 & RxJS Lab — Formation complète par la pratique

## Objectif du projet

Une application Angular composée de **mini-widgets indépendants**, chacun conçu pour pratiquer une notion. Deux objectifs menés ensemble :

1. **Angular complet** : revoir toutes les bases (composants, templates, directives, pipes, DI, routing, HTTP, intercepteurs, formulaires, état, tests…) jusqu'aux nouveautés d'Angular 22 — le niveau attendu d'un développeur Angular en entreprise
2. **RxJS essentiel** : maîtriser la **quinzaine d'opérateurs du quotidien** et les **usages réels en entreprise** (formulaires, HTTP, router, NgRx), savoir repérer les anti-patterns

Le fil rouge : pour chaque besoin, savoir choisir entre **signal**, **resource** et **Observable**.

Chaque module suit 3 temps :

1. **Leçon** : explication dans `docs/XX-nom-module.md` (avec diagramme marble en ASCII pour chaque opérateur RxJS, schémas ASCII quand ça aide pour Angular)
2. **Exemple générique** : un exemple générique bien expliqué
3. **Pratique** : exercice à faire moi-même

Mon niveau : je maîtrise TypeScript ; je connais un peu Angular mais je dois **revoir les bases** — les expliquer clairement, sans supposer d'acquis ; je débute en RxJS. Tout en français, module par module. Ne jamais donner la solution avant que je la demande.

## Priorités

- ★ **cœur** — utilisé quasiment tous les jours : à maîtriser, exercice dédié
- ○ **courant** — revient souvent : bien comprendre, au moins un exemple
- · **référence** — savoir que ça existe : une ligne « quand y penser », pas d'exercice

Ne jamais se bloquer sur un élément `référence`.

## Code legacy à savoir lire

En entreprise, beaucoup de code est antérieur à Angular 17–22. Dans chaque module concerné, ajouter un encadré **« Legacy : ce que tu verras en entreprise »** (priorité ·) montrant l'ancienne syntaxe et son équivalent moderne : `NgModule`, `*ngIf` / `*ngFor`, `@Input()` / `@Output()` + `EventEmitter`, `@ViewChild`, injection par constructeur, `ngClass` / `ngStyle`, intercepteurs en classe (`HttpInterceptor`), guards en classe, `@HostBinding` / `@HostListener`. Savoir les lire, pas les écrire.

## Règles RxJS

- RxJS 7+ moderne : syntaxe `pipe()`, pas d'opérateurs dépréciés — toujours citer le remplaçant dans la leçon :
  - `pluck` → `map(x => x.prop)`
  - `retryWhen` → `retry({ delay })`
  - `toPromise()` → `firstValueFrom()` / `lastValueFrom()`
  - `mapTo` → `map(() => valeur)`
  - `multicast` / `publish` / `refCount` → `share()` / `connectable()`
- Toujours montrer la **gestion de la désinscription** : `takeUntilDestroyed()`, pipe `async`, `toSignal`, ou complétion naturelle — expliquer les fuites mémoire
- Chaque widget RxJS affiche visuellement les émissions (liste horodatée des valeurs émises) pour « voir » les flux
- **Comparer avec l'équivalent signal** quand il existe (`computed`, `resource`, `debounced()`…) : ce que chaque approche sait faire, et où les signals s'arrêtent

## Le parcours

Les modules sont numérotés dans l'ordre à suivre. Étiquettes : **[Angular]**, **[RxJS]**, **[Pont]**, **[Tests]**.

### Phase 1 — Les bases d'Angular (≈ 23–29 h)

#### 1. [Angular] Architecture et outillage (≈ 2–3 h)

Widget : la coquille de l'application (page d'accueil listant les widgets).

- ★ cœur : Angular CLI (`ng new`, `ng generate`, `ng serve`, `ng build`, `ng test`), structure d'un projet, `main.ts` → `bootstrapApplication` → `app.config.ts` (providers), composant racine
- ○ courant : `angular.json`, standalone vs NgModule (pourquoi le standalone a gagné), zoneless (ce que zone.js faisait avant)
- · référence : Angular DevTools, MCP Angular

#### 2. [Angular] Composants et templates (≈ 4–5 h)

- ★ cœur : anatomie d'un `@Component` (selector, template / templateUrl, styles, imports), interpolation `{{ }}`, property binding `[prop]`, event binding `(event)`, bindings `[class.x]` / `[style.x]` / `[attr.x]`, control flow `@if` / `@else`, `@for` (avec `track`, `$index`, `@empty`), `@switch`
- ○ courant : variables de template `#ref`, `@let`, encapsulation des styles (`:host`, `ViewEncapsulation`)
- · référence : accès aux membres privés dans les templates (v22.2)

#### 3. [Angular] Signals (≈ 4–5 h)

- ★ cœur : `signal` (`set`, `update`), `computed`, lecture dans le template, `effect` (et quand NE PAS l'utiliser)
- ○ courant : `linkedSignal`, `untracked`, signals en lecture seule (`asReadonly()`)
- · référence : `equal` personnalisé

#### 4. [Angular] Communication entre composants (≈ 5–6 h)

Widget : une liste de cartes avec parent / enfants.

- ★ cœur : `input()` (requis, valeur par défaut, `transform`, `alias`), `output()`, `model()` (two-way binding `[( )]`), projection de contenu `<ng-content>` (et `select`), cycle de vie (`ngOnInit`, `ngOnDestroy`, `DestroyRef`)
- ○ courant : `viewChild()` / `viewChildren()` / `contentChild()`, `afterNextRender` / `afterEveryRender`, `ngOnChanges` (et pourquoi les signals le rendent rare)
- · référence : `ng-template` + `ngTemplateOutlet`, composants dynamiques (`ViewContainerRef`)

#### 5. [Angular] Directives et pipes (≈ 4–5 h)

- ★ cœur : directive d'attribut custom (objet `host`, `input()` sur une directive), pipes natifs (`date`, `currency`, `decimal`, `percent`, `json`, `async`, `keyvalue`, `titlecase`), écrire un pipe custom
- ○ courant : pipes purs vs impurs, `hostDirectives` (composition)
- · référence : directive structurelle custom (rare depuis le control flow)

#### 6. [Angular] Services et injection de dépendances (≈ 4–5 h)

- ★ cœur : `@Injectable({ providedIn: 'root' })`, `inject()`, un service qui partage de l'état via signals entre composants
- ○ courant : providers (`useClass`, `useValue`, `useFactory`, `useExisting`), `InjectionToken` (ex. config d'API), injecteurs hiérarchiques (`providers` d'un composant, d'une route), contexte d'injection
- · référence : `@Service()` (v22), `injectAsync` (services lazy), modificateurs `optional` / `self` / `skipSelf`

### Phase 2 — Fondations RxJS (≈ 6–8 h)

#### 7. [RxJS] Qu'est-ce qu'un Observable ? (≈ 3–4 h)

Widget minimal : bouton subscribe / unsubscribe qui affiche en direct les callbacks reçus et le nombre de souscriptions actives.

- Un Observable est une fonction paresseuse qui, **à la souscription**, produit 0 à n valeurs dans le temps
- Contrat de l'Observer : `next` (0..n) puis **un seul** événement terminal — `complete` OU `error`
- `subscribe()` → `Subscription` ; `unsubscribe()` déclenche le teardown — base des fuites mémoire
- Unicast (chaque `subscribe` ré-exécute la source) ; cold vs hot
- Synchrone vs asynchrone ; Observable vs Promise ; **Observable vs signal** (flux d'événements dans le temps vs valeur courante)
- Créer un Observable à la main avec `new Observable(subscriber => { ...; return () => teardown })`
- Lire un diagramme marble ; anatomie de `pipe()`

#### 8. [RxJS] Création (≈ 3–4 h)

- ★ cœur : `of`, `from`, `fromEvent`
- ○ courant : `interval`, `timer`, `EMPTY`, `throwError`, `firstValueFrom` / `lastValueFrom`
- · référence : `defer`, `range`, `iif`

### Phase 3 — Navigation et données (≈ 32–42 h)

#### 9. [Angular] Routing (≈ 6–7 h)

- ★ cœur : définition des routes, `routerLink`, `routerLinkActive`, `<router-outlet>`, paramètres de route et query params reçus en `input()` (`withComponentInputBinding`), navigation par code (`Router.navigate`), routes enfants, lazy loading (`loadComponent`, `loadChildren`), redirections et page 404
- ○ courant : guards fonctionnels (`canActivate`, `canMatch`, `canDeactivate`), resolvers, `title` de route, événements du Router en RxJS (`filter(e => e instanceof NavigationEnd)`), `isActive`
- · référence : router resources (developer preview, v22.2), stratégies de preloading

#### 10. [Angular] HttpClient et intercepteurs (≈ 5–6 h)

- ★ cœur : `provideHttpClient()`, requêtes typées (`get<T>`, `post`, `put`, `delete`), `HttpParams` et headers, gestion d'erreur (`HttpErrorResponse`), intercepteurs fonctionnels (`withInterceptors`) : ajout d'un token d'auth, gestion globale des erreurs (`catchError`), loader global (`finalize`)
- ○ courant : `HttpContext` (options par requête), ordre d'exécution des intercepteurs
- · référence : `withFetch()`, upload avec progression

#### 11. [Angular] Resource API (≈ 4–5 h)

Widget : fiche pays (API REST Countries) chargée selon un signal de sélection.

- ★ cœur : `httpResource` ; les états `value`, `isLoading`, `error`, `status`, `hasValue()` ; `reload()`
- ○ courant : `resource` (loader à base de Promise, `abortSignal`), `rxResource` (quand on a déjà un Observable), `debounced()`
- · référence : `chain()` pour les requêtes dépendantes, cache des resources en SSR

#### 12. [RxJS] Autocomplétion — filtrage temporel (≈ 5–7 h)

Widget : la **même recherche de pays** que le module 11, réécrite en pipeline RxJS, puis comparaison des deux versions (`debounced()` + `httpResource` vs `debounceTime` + `switchMap`).

- ★ cœur : `debounceTime`, `distinctUntilChanged`, `filter`, `take`, `first`, `takeUntil`
- ○ courant : `throttleTime`, `skip`, `takeWhile`
- · référence : `auditTime`, `distinctUntilKeyChanged`, `last`

#### 13. [RxJS] Les 4 mousquetaires — aplatissement (≈ 8–12 h, module le plus important)

Widget : clics → requêtes lentes simulées, les 4 opérateurs comparés côte à côte sur le MÊME cas.

- ★ cœur : `switchMap` (dernière valeur gagne), `mergeMap` (tout en parallèle), `concatMap` (écritures ordonnées), `exhaustMap` (boutons d'envoi), `map`
- ○ courant : `scan`, `pairwise`, pattern **polling** (`timer(0, 5000)` + `switchMap`), `catchError` **à l'intérieur** du `switchMap` pour ne pas tuer le flux
- · référence : `expand` (pagination récursive), `bufferTime`, `groupBy`
- Exercice optionnel : dessin / drag & drop (`mousedown` → `switchMap` → `mousemove` → `takeUntil(mouseup)`)

#### 14. [RxJS] Combinaison — dashboard de prix temps réel (≈ 4–5 h)

Flux de prix simulés (`interval` + valeurs aléatoires), agrégats, alertes de seuil. Comparer `combineLatest` avec `computed` sur des signals.

- ★ cœur : `combineLatest`, `forkJoin`, `withLatestFrom`, `startWith`
- ○ courant : `merge`
- · référence : `concat`, `zip`, `race`, variantes pipeables (`mergeWith`, `combineLatestWith`…)

### Phase 4 — Formulaires et état (≈ 30–39 h)

#### 15. [Angular] Reactive Forms (≈ 6–8 h)

Widget : formulaire d'inscription complet. Omniprésent en entreprise.

- ★ cœur : `FormControl`, `FormGroup`, `FormArray`, `FormBuilder` (`nonNullable`), typed forms, `Validators` natifs, validator custom, validator **cross-field** (confirmation de mot de passe), affichage des erreurs, `touched` / `dirty` / `valid`, soumission
- ○ courant : validator asynchrone (email déjà pris), `valueChanges` / `statusChanges` (pont vers RxJS), `setValue` vs `patchValue`, `disable()` / `enable()`
- · référence : template-driven forms (`ngModel`) — savoir les lire, `ControlValueAccessor`

#### 16. [Angular] Signal Forms (≈ 4–5 h)

Widget : le **même formulaire** que le module 15, réécrit en Signal Forms, puis comparaison.

- ★ cœur : `form()` sur un modèle signal, schéma de validation (`required`, `email`, `min`…), affichage des erreurs, soumission
- ○ courant : validation asynchrone, schémas réutilisables, contrôle personnalisé
- · référence : interop avec les Reactive Forms, schémas dynamiques (Standard Schema)

#### 17. [RxJS] Subjects et partage — centre de notifications (≈ 5–6 h)

File de toasts partagée entre widgets. Comparer un service à base de `BehaviorSubject` avec un service à base de `signal` : quand choisir l'un ou l'autre.

- ★ cœur : `Subject`, `BehaviorSubject`, `shareReplay` (et le piège de `refCount`)
- ○ courant : `share`, `ReplaySubject`
- · référence : `AsyncSubject`, `connectable`
- Exercice optionnel : minuteur Pomodoro avec pause / reprise pilotée par un `Subject` (`timer`, `interval`, `takeUntil`)

#### 18. [RxJS + Angular] Sauvegarde automatique — erreurs et effets (≈ 5–7 h)

Formulaire Reactive Forms : `valueChanges` → `debounceTime` → `concatMap` → API simulée qui échoue aléatoirement. Variante : la même chose depuis un Signal Form via `toObservable`.

- ★ cœur : `catchError`, `tap`, `finalize`
- ○ courant : `retry({ count, delay, resetOnSuccess })` ; écrire son propre opérateur **par composition** : `retryWithBackoff(config)` qui retourne `pipe(...)`, typé `MonoTypeOperatorFunction<T>`, puis le réutiliser dans l'intercepteur du module 10
- · référence : `timeout`, `throwIfEmpty`

#### 19. [Pont] RxJS ↔ Signals et anti-patterns (≈ 4–5 h)

- ★ cœur : `toSignal` (et `initialValue` / `requireSync`), `toObservable`, `takeUntilDestroyed`
- ★ cœur : **anti-patterns à reconnaître et corriger** : `subscribe` imbriqués, `subscribe` manuel pour copier une valeur dans une propriété, oubli de désinscription, `catchError` mal placé qui tue le flux, `shareReplay` sans `refCount` sur un flux infini, `effect` utilisé pour synchroniser de l'état
- ○ courant : `outputFromObservable` / `outputToObservable`, `rxResource` revisité
- Livrable : `docs/grille-de-decision.md` — « signal, resource ou Observable ? », avec un cas concret par ligne
- Exercice : refactorer un bout de code « legacy » fourni plein d'anti-patterns

#### 20. [Angular] Gestion d'état applicative (≈ 6–8 h)

- ★ cœur : store maison à base de service + signals (état privé, `computed` publics, méthodes de mise à jour)
- ○ courant : NgRx Store (actions, reducers, selectors, effects avec `ofType` + `switchMap` / `exhaustMap`) — très répandu en entreprise ; NgRx SignalStore (`signalStore`, `withState`, `withComputed`, `withMethods`)
- · référence : quand un store global est de trop

### Phase 5 — Qualité et production (≈ 17–23 h)

#### 21. [Angular] Détection de changement et performance (≈ 3–4 h)

- ★ cœur : comment Angular sait quoi rafraîchir (zoneless + signals + OnPush par défaut), `track` dans `@for`, `@defer` (déclencheurs `on viewport`, `on interaction`, `@placeholder`, `@loading`)
- ○ courant : `NgOptimizedImage`, budgets de bundle, lazy loading mesuré
- · référence : `ChangeDetectorRef.markForCheck()` dans du code legacy

#### 22. [Angular] UI, accessibilité et animations (≈ 3–4 h)

- ○ courant : Angular Material et CDK (installer, thème, composants courants, `Dialog`, `Overlay`), Angular Aria (lien avec les exigences AXE / WCAG du projet)
- · référence : animations (`animate.enter` / `animate.leave`, et le package `@angular/animations` en legacy)

#### 23. [Angular] Gestion d'erreurs et sécurité (≈ 2–3 h)

- ○ courant : `ErrorHandler` global, protection XSS (sanitization automatique des bindings), `DomSanitizer`
- · référence : `@boundary` (developer preview, v22.2), protection CSRF / XSRF de `HttpClient`

#### 24. [Tests] Tester composants, services et flux (≈ 7–9 h)

Vitest, déjà configuré.

- ★ cœur : `TestBed`, tester un composant (inputs, outputs, rendu du DOM), tester un service, `HttpTestingController` (HttpClient et `httpResource`), mocker une dépendance avec les providers
- ○ courant : component harnesses (CDK), tester un formulaire et un guard ; marble testing avec `TestScheduler` de `rxjs/testing` — syntaxe (`-`, lettres, `|`, `#`, `()`), `cold` / `hot`, `expectObservable`, temps virtuel. Exercice : tester le debounce du module 12 et le `switchMap` du module 13
- · référence : `expectSubscriptions`, tests end-to-end (Playwright / Cypress), les schedulers RxJS

#### 25. [Angular] Configuration, build et déploiement (≈ 2–3 h)

- ○ courant : environnements / configuration par build, `ng build` et ses options, déploiement d'une app statique
- · référence : i18n (`$localize`), SSR et hydratation incrémentale, PWA

### 26. Projet de synthèse (≈ 10–12 h)

Une mini-application « comme en entreprise » : routing avec guard et lazy loading, intercepteur (auth + erreurs + `retryWithBackoff`), recherche RxJS (`debounceTime` + `switchMap`), fiche détail en `httpResource`, formulaire Reactive Forms avec validators custom et auto-save, état partagé (store signals ou SignalStore), notifications, un pipe et une directive custom, `@defer`, et des tests (composant, service HTTP, un test marble).

## Estimation

≈ 118–153 h au total, soit ≈ 40–51 jours à 3 h/jour (8 à 10 semaines à 5 jours/semaine).
Repères : fin de la phase 1 ≈ semaine 2 ; module 13 terminé ≈ semaine 5.

## Table de traçabilité

Tenir à jour `docs/traçabilité.md` : notion (API Angular ou opérateur RxJS) → priorité (★ / ○ / ·) → widget → fichier → module, avec pour chacune une phrase « quand l'utiliser en vrai ». À la fin du parcours, chaque élément ★ et ○ doit être coché.

## Contraintes techniques

- Angular 22 dernière version, standalone, zoneless
- Un widget = un dossier dans `src/app/widgets/NN-nom/`, une route lazy-loadée, accessible depuis la page d'accueil
- API simulées avec `delay` + `throwError` aléatoire quand pas de vraie API — pas de backend
- Code en anglais, commentaires et docs en français
- Un commit clair par module

## Règles de travail

- Avancer strictement dans l'ordre des modules ; le module 13 est le cœur RxJS : y passer le temps nécessaire
- Doser l'effort selon la priorité : temps + exercice pour les ★, un exemple pour les ○, une ligne pour les ·
- Bien expliquer chaque notion pour un bon apprentissage, en partant des bases pour Angular
- Après chaque module : quiz de 5 questions pour vérifier ma compréhension, puis exercice
- Ne jamais donner la solution avant que je la demande
