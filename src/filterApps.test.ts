import { describe, expect, it } from 'vitest';
import type { AppInfo } from './apps';
import { filterApps } from './filterApps';

const sample: AppInfo[] = [
  {
    id: 'gitea',
    name: 'Gitea',
    url: 'https://git.pumppi.dev',
    description: 'Git hosting',
    group: 'apps',
    access: ['login'],
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
    id: 'mealie',
    name: 'Mealie',
    url: 'https://meal.pumppi.dev',
    description: 'Recipes',
    group: 'apps',
    access: ['login'],
  },
];

const ids = (list: AppInfo[]) => list.map((app) => app.id);

describe('filterApps', () => {
  it('returns everything for an empty or blank query', () => {
    expect(ids(filterApps(sample, ''))).toEqual(['gitea', 'grafana', 'mealie']);
    expect(ids(filterApps(sample, '   '))).toEqual(['gitea', 'grafana', 'mealie']);
  });

  it('returns a copy, not the input array', () => {
    expect(filterApps(sample, '')).not.toBe(sample);
  });

  it('matches names case-insensitively', () => {
    expect(ids(filterApps(sample, 'GRAF'))).toEqual(['grafana']);
  });

  it('matches descriptions', () => {
    expect(ids(filterApps(sample, 'recipes'))).toEqual(['mealie']);
  });

  it('matches hosts', () => {
    expect(ids(filterApps(sample, 'meal.pumppi'))).toEqual(['mealie']);
  });

  it('trims surrounding whitespace', () => {
    expect(ids(filterApps(sample, '  logs '))).toEqual(['grafana']);
  });

  it('keeps the original order when several match', () => {
    expect(ids(filterApps(sample, 'g'))).toEqual(['gitea', 'grafana']);
  });

  it('returns nothing when no app matches', () => {
    expect(filterApps(sample, 'kubernetes')).toEqual([]);
  });
});
