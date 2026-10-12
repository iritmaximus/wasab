import type { AppGroupInfo, AppInfo } from '../apps';
import { AppCard } from './AppCard';

export function AppGroup({ group, apps }: { group: AppGroupInfo; apps: readonly AppInfo[] }) {
  const headingId = `group-${group.id}`;
  return (
    <section className="group" aria-labelledby={headingId}>
      <h2 id={headingId}>{group.title}</h2>
      <ul className="cards">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </ul>
    </section>
  );
}
