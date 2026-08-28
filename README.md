# vinext-starter

Un starter full-stack propre qui tourne sur
[vinext](https://github.com/cloudflare/vinext), avec un support optionnel de Cloudflare D1 et
Drizzle.

## Prérequis

- Node.js `>=22.13.0`
- Linux avec `flock`, `curl`, et GNU `timeout`

## Cycle de vie Sites

Le CLI de cycle de vie Sites exécute l'installation verrouillée des dépendances avant de restituer ce checkout. Modifie le code source sous `app/`, puis effectue un checkpoint quand un jalon cohérent est prêt à être inspecté ou partagé. Le builder distant de Sites exécute `npm run build` sur le commit poussé. Ne répète pas l'installation ou le build en tant qu'étape normale avant un checkpoint.

Ce starter n'utilise pas `wrangler.jsonc`.

`install:ci` est volontairement un `npm ci` unique, sans nouvelle tentative. Il refuse une installation concurrente pour le même projet, consomme un cache npm correspondant préchargé dans l'image avec `--prefer-offline` tout en conservant un repli vers le registre en cas d'objet de cache manquant, sinon télécharge et vérifie l'archive vinext complète enregistrée dans `package-lock.json`, limite npm à un seul socket, et termine une installation bloquée. `build` applique un timeout court. Ces scripts d'assistance ciblent Linux et utilisent GNU `timeout` ; ce ne sont pas des scripts natifs macOS.

Les scripts qui ont besoin de chemins home, npm, XDG et temporaires inscriptibles et propres au projet utilisent `scripts/sites-env.sh`. Les scripts `dev` et `start` respectent l'environnement d'exécution de l'appelant et conservent les logs Wrangler à l'intérieur du checkout. Le répertoire généré `.sites-runtime/` est jetable et ignoré par Git.

## Contenu inclus

- modifie le code du site sous `app/`
- `app/chatgpt-auth.ts` fournit des helpers optionnels de connexion ChatGPT gérés par le dispatch
- `.openai/hosting.json` déclare les bindings optionnels Sites D1 et R2
- `vite.config.ts` simule les bindings déclarés pour le développement local
- `db/index.ts` lit le binding D1 depuis l'environnement du Cloudflare Worker
- `db/schema.ts` démarre volontairement vide
- `examples/d1/` contient une surface d'exemple D1 optionnelle
- `drizzle.config.ts` permet la génération de migrations locales si besoin

## En-têtes d'authentification Workspace

Les sites workspace OpenAI peuvent lire l'e-mail de l'utilisateur actuel depuis
`oai-authenticated-user-email`.

Les sites workspace authentifiés via SIWC peuvent aussi recevoir
`oai-authenticated-user-full-name` lorsque le profil SIWC de l'utilisateur a une revendication
`name` non vide. La valeur du nom complet est encodée en UTF-8 percent-encoded et est accompagnée de
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Traite le nom complet comme optionnel et retombe sur l'e-mail quand il est absent :

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Connexion ChatGPT optionnelle gérée par le dispatch

Importe les helpers prêts à l'emploi depuis `app/chatgpt-auth.ts` quand le site a besoin
d'une connexion ChatGPT optionnelle ou obligatoire :

- Utilise `getChatGPTUser()` pour une UI de connexion optionnelle.
- Utilise `requireChatGPTUser(returnTo)` pour les pages rendues côté serveur qui doivent
  rediriger les visiteurs anonymes vers la connexion avec ChatGPT.
- Dans un Server Component, démarre la connexion avec
  `<a href={chatGPTSignInPath(returnTo)} target="_top">`. Le module d'aide à l'authentification
  est server-only ; ne l'importe pas dans un Client Component.
- N'utilise pas `fetch`, XHR, un routeur côté client, ou un lien de framework qui pourrait
  précharger la route de connexion. SIWC doit démarrer comme une navigation top-level.
- Ne demande jamais directement le endpoint d'autorisation de l'AuthAPI. La route
  `/signin-with-chatgpt` gérée par le dispatch doit démarrer le flux SIWC.
- Utilise `chatGPTSignOutPath(returnTo)` pour les liens ou actions de déconnexion côté navigateur.
- Passe un chemin `returnTo` relatif de même origine pour la destination après connexion
  ou déconnexion. Le helper le valide et l'encode de façon sûre.
- Marque les pages protégées avec `export const dynamic = "force-dynamic"` car
  elles dépendent des en-têtes d'identité propres à chaque requête.

Le dispatch possède `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, les
cookies OAuth, et l'injection des en-têtes d'identité. N'implémente pas de routes d'application pour
ces chemins réservés. Les routes qui n'importent pas et n'appellent pas le helper restent
compatibles anonymes.

SIWC établit uniquement l'identité ; cela ne prouve pas l'appartenance au workspace. Utilise les
contrôles de politique d'accès de la plateforme d'hébergement Sites pour les restrictions à l'échelle du workspace,
ou applique des vérifications explicites d'appartenance ou de liste blanche côté serveur.

Utilise SIWC pour les pages de compte, les tableaux de bord propres à l'utilisateur, les enregistrements sauvegardés, et les actions d'écriture
liées à l'utilisateur ChatGPT actuel. Laisse le contenu public anonyme.

## Commandes de diagnostic

- `npm run install:ci` : effectue l'unique installation bornée du lockfile
- `npm run dev` : démarre le serveur de développement Vite/Vinext
- `npm run build` : construit l'artefact Sites déployable
- `npm run start` : démarre l'application Vinext construite
- `npm test` : construit et vérifie les métadonnées de prévisualisation de développement rendues
- `npm run db:generate` : génère les migrations Drizzle après modification du schéma

Utilise les commandes de build pour un diagnostic ciblé après un échec distant, pas comme une étape normale avant un checkpoint.

Les timeouts par défaut peuvent être surchargés pour un canary contrôlé avec `SITES_INSTALL_TIMEOUT`, `SITES_INSTALL_KILL_AFTER`, `SITES_BUILD_TIMEOUT`, et `SITES_BUILD_KILL_AFTER`. Un timeout fait échouer la commande ; les scripts d'assistance ne relancent jamais une installation ou un build inchangés.

## En savoir plus

- [Documentation vinext](https://github.com/cloudflare/vinext)
- [Guide Drizzle D1](https://orm.drizzle.team/docs/get-started/d1-new)
