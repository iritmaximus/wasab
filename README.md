# wasab

Home page for [pumppi.dev](https://pumppi.dev): links to every app running on the
[k8s-pumppi](https://github.com/iritmaximus/k8s-pumppi) cluster.

Vite + React + TypeScript, static build served by nginx.

## Develop

```sh
npm install
npm run dev
```

| Script                      |                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------- |
| `npm run lint`              | oxlint                                                                            |
| `npm run fmt` / `fmt:check` | oxfmt                                                                             |
| `npm run typecheck`         | `tsc --noEmit`                                                                    |
| `npm test`                  | Vitest unit/component tests (`-- --coverage` enforces 90%)                        |
| `npm run test:e2e`          | Playwright against a production build (run `npx playwright install firefox` once) |

## Adding an app

Add an entry to `src/apps.ts`. `access` lists how you get in: `sso` if the ingress uses the
Authelia middleware, `login` if the app has its own login (both is fine). Then update the host list
in `src/apps.test.ts`, which is there so a removed or mistyped app is noticed.

## Deploy

Pushing to `main` runs CI and publishes `registry.pumppi.dev/wasab:latest`. Argo CD image-updater
picks up the new digest and rolls out `k8s-pumppi/wasab`. The container serves on port 8080 with a
`/health` endpoint for probes.

```sh
docker build -t wasab . && docker run --rm -p 8080:8080 wasab
```
