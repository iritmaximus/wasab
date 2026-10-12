import { useState } from 'react';
import { apps as allApps, groups } from './apps';
import { AppGroup } from './components/AppGroup';
import { SearchBox } from './components/SearchBox';
import { filterApps } from './filterApps';

export function App() {
  const [query, setQuery] = useState('');
  const visible = filterApps(allApps, query);

  return (
    <div className="page">
      <header className="header">
        <h1>pumppi.dev</h1>
        <p className="tagline">Apps running on the homelab cluster.</p>
        <SearchBox value={query} onChange={setQuery} />
      </header>
      <main>
        {visible.length === 0 ? (
          <output className="empty">No apps match “{query.trim()}”.</output>
        ) : (
          groups.map((group) => {
            const groupApps = visible.filter((app) => app.group === group.id);
            return groupApps.length > 0 ? (
              <AppGroup key={group.id} group={group} apps={groupApps} />
            ) : null;
          })
        )}
      </main>
      <footer className="footer">
        <span className="badge badge-sso">SSO</span> behind Authelia ·{' '}
        <span className="badge badge-login">Login</span> own login
      </footer>
    </div>
  );
}
