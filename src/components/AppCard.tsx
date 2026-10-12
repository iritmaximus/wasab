import { hostOf, type Access, type AppInfo } from '../apps';

const accessLabels: Record<Access, { label: string; title: string }> = {
  sso: { label: 'SSO', title: 'Behind Authelia single sign-on' },
  login: { label: 'Login', title: 'Has its own login' },
};

export function AppCard({ app }: { app: AppInfo }) {
  return (
    <li className="card">
      <a className="card-link" href={app.url} rel="noopener">
        <span className="card-name">{app.name}</span>{' '}
        <span className="card-host">{hostOf(app.url)}</span>
      </a>
      <p className="card-description">{app.description}</p>
      <ul className="badges" aria-label="Access">
        {app.access.map((kind) => (
          <li key={kind} className={`badge badge-${kind}`} title={accessLabels[kind].title}>
            {accessLabels[kind].label}
          </li>
        ))}
      </ul>
    </li>
  );
}
