import { describe, expect, it } from 'vitest';
import { apps, groups, hostOf } from './apps';

describe('app registry', () => {
  it('has unique ids', () => {
    const ids = apps.map((app) => app.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has unique urls', () => {
    const urls = apps.map((app) => app.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it.each(apps)('$id links to an https pumppi.dev subdomain', (app) => {
    const url = new URL(app.url);
    expect(url.protocol).toBe('https:');
    expect(url.hostname).toMatch(/^[a-z0-9-]+\.pumppi\.dev$/);
    expect(url.pathname).toBe('/');
  });

  it.each(apps)('$id has a name, description and known group', (app) => {
    expect(app.name.trim()).not.toBe('');
    expect(app.description.trim()).not.toBe('');
    expect(groups.map((g) => g.id)).toContain(app.group);
  });

  it.each(apps)('$id lists at least one access kind, without duplicates', (app) => {
    expect(app.access.length).toBeGreaterThan(0);
    expect(new Set(app.access).size).toBe(app.access.length);
  });

  it('has no empty groups', () => {
    for (const group of groups) {
      expect(apps.some((app) => app.group === group.id)).toBe(true);
    }
  });

  it('includes every deployed app with a web UI', () => {
    expect(apps.map((app) => hostOf(app.url)).toSorted()).toEqual(
      [
        'argo.pumppi.dev',
        'auth.pumppi.dev',
        'dashboard.pumppi.dev',
        'git.pumppi.dev',
        'grafana.pumppi.dev',
        'meal.pumppi.dev',
        'vault.pumppi.dev',
        'whoami.pumppi.dev',
        'workh.pumppi.dev',
      ].toSorted(),
    );
  });

  it('marks apps behind Authelia that also keep their own login', () => {
    const byId = Object.fromEntries(apps.map((app) => [app.id, app.access]));
    expect(byId.grafana).toEqual(['sso', 'login']);
    expect(byId.argocd).toEqual(['sso', 'login']);
  });
});

describe('hostOf', () => {
  it('returns the host part of a url', () => {
    expect(hostOf('https://git.pumppi.dev')).toBe('git.pumppi.dev');
    expect(hostOf('https://git.pumppi.dev:2222/foo')).toBe('git.pumppi.dev:2222');
  });
});
