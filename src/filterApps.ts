import { hostOf, type AppInfo } from './apps';

export function filterApps(list: readonly AppInfo[], query: string): AppInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...list];
  return list.filter((app) =>
    [app.name, app.description, hostOf(app.url)].some((field) => field.toLowerCase().includes(q)),
  );
}
