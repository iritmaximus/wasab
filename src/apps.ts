export type Access = 'sso' | 'login';

export type AppGroupId = 'apps' | 'admin';

export interface AppInfo {
  id: string;
  name: string;
  url: string;
  description: string;
  group: AppGroupId;
  /** How you get in: Authelia SSO in front, the app's own login, or both. */
  access: readonly Access[];
}

export interface AppGroupInfo {
  id: AppGroupId;
  title: string;
}

export const groups: readonly AppGroupInfo[] = [
  { id: 'apps', title: 'Apps' },
  { id: 'admin', title: 'Admin & infra' },
];

// Mirrors the deployed apps in k8s-pumppi (README "What runs here").
export const apps: readonly AppInfo[] = [
  {
    id: 'gitea',
    name: 'Gitea',
    url: 'https://git.pumppi.dev',
    description: 'Git hosting, ssh on :2222',
    group: 'apps',
    access: ['login'],
  },
  {
    id: 'vaultwarden',
    name: 'Vaultwarden',
    url: 'https://vault.pumppi.dev',
    description: 'Password manager',
    group: 'apps',
    access: ['login'],
  },
  {
    id: 'mealie',
    name: 'Mealie',
    url: 'https://meal.pumppi.dev',
    description: 'Recipes and meal plans',
    group: 'apps',
    access: ['login'],
  },
  {
    id: 'workh',
    name: 'workh',
    url: 'https://workh.pumppi.dev',
    description: 'Work hour tracking',
    group: 'apps',
    access: ['login'],
  },
  {
    id: 'argocd',
    name: 'Argo CD',
    url: 'https://argo.pumppi.dev',
    description: 'GitOps deployments',
    group: 'admin',
    access: ['sso', 'login'],
  },
  {
    id: 'grafana',
    name: 'Grafana',
    url: 'https://grafana.pumppi.dev',
    description: 'Metrics and logs',
    group: 'admin',
    access: ['sso', 'login'],
  },
  {
    id: 'traefik',
    name: 'Traefik',
    url: 'https://dashboard.pumppi.dev',
    description: 'Ingress dashboard',
    group: 'admin',
    access: ['sso'],
  },
  {
    id: 'authelia',
    name: 'Authelia',
    url: 'https://auth.pumppi.dev',
    description: 'Single sign-on',
    group: 'admin',
    access: ['sso'],
  },
  {
    id: 'whoami',
    name: 'whoami',
    url: 'https://whoami.pumppi.dev',
    description: 'Request echo for testing',
    group: 'admin',
    access: ['sso'],
  },
];

export function hostOf(url: string): string {
  return new URL(url).host;
}
