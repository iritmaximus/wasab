import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AppInfo } from '../apps';
import { AppCard } from './AppCard';

const base: AppInfo = {
  id: 'grafana',
  name: 'Grafana',
  url: 'https://grafana.pumppi.dev',
  description: 'Metrics and logs dashboards',
  group: 'admin',
  access: ['sso', 'login'],
};

function renderCard(app: AppInfo) {
  render(
    <ul>
      <AppCard app={app} />
    </ul>,
  );
}

describe('AppCard', () => {
  it('renders a link to the app named after it', () => {
    renderCard(base);
    const link = screen.getByRole('link', { name: /grafana/i });
    expect(link).toHaveAttribute('href', 'https://grafana.pumppi.dev');
    expect(link).toHaveAttribute('rel', 'noopener');
    expect(link).toHaveAccessibleName('Grafana grafana.pumppi.dev');
  });

  it('shows the description', () => {
    renderCard(base);
    expect(screen.getByText('Metrics and logs dashboards')).toBeInTheDocument();
  });

  it('shows both badges for SSO + own login', () => {
    renderCard(base);
    const badges = within(screen.getByRole('list', { name: 'Access' })).getAllByRole('listitem');
    expect(badges.map((b) => b.textContent)).toEqual(['SSO', 'Login']);
  });

  it('shows only the SSO badge for SSO-only apps', () => {
    renderCard({ ...base, access: ['sso'] });
    const badges = within(screen.getByRole('list', { name: 'Access' })).getAllByRole('listitem');
    expect(badges.map((b) => b.textContent)).toEqual(['SSO']);
    expect(badges[0]).toHaveAttribute('title', 'Behind Authelia single sign-on');
  });

  it('shows only the login badge for apps with their own login', () => {
    renderCard({ ...base, access: ['login'] });
    const badges = within(screen.getByRole('list', { name: 'Access' })).getAllByRole('listitem');
    expect(badges.map((b) => b.textContent)).toEqual(['Login']);
    expect(badges[0]).toHaveAttribute('title', 'Has its own login');
  });
});
