import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { apps, groups } from './apps';

function setup() {
  const user = userEvent.setup();
  render(<App />);
  return { user, search: screen.getByRole('searchbox', { name: 'Search apps' }) };
}

describe('App', () => {
  it('shows the site title', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1, name: 'pumppi.dev' })).toBeInTheDocument();
  });

  it('links to every app', () => {
    setup();
    for (const app of apps) {
      expect(screen.getByRole('link', { name: new RegExp(`^${app.name}\\b`) })).toHaveAttribute(
        'href',
        app.url,
      );
    }
    expect(screen.getAllByRole('link')).toHaveLength(apps.length);
  });

  it('puts each app under its group heading', () => {
    setup();
    for (const group of groups) {
      const section = screen.getByRole('region', { name: group.title });
      const hrefs = within(section)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'));
      expect(hrefs).toEqual(apps.filter((app) => app.group === group.id).map((app) => app.url));
    }
  });

  it('filters as you type', async () => {
    const { user, search } = setup();
    await user.type(search, 'vault');
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', 'https://vault.pumppi.dev');
  });

  it('hides groups with no matches', async () => {
    const { user, search } = setup();
    await user.type(search, 'grafana');
    expect(screen.getByRole('region', { name: 'Admin & infra' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Apps' })).not.toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', async () => {
    const { user, search } = setup();
    await user.type(search, '  nothing-here ');
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.getByRole('status')).toHaveTextContent('No apps match “nothing-here”.');
  });

  it('restores everything on Escape', async () => {
    const { user, search } = setup();
    await user.type(search, 'nothing-here');
    await user.keyboard('{Escape}');
    expect(search).toHaveValue('');
    expect(screen.getAllByRole('link')).toHaveLength(apps.length);
  });

  it('focuses search with "/"', async () => {
    const { user, search } = setup();
    expect(search).not.toHaveFocus();
    await user.keyboard('/');
    expect(search).toHaveFocus();
  });

  it('explains the badges in the footer', () => {
    setup();
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent('SSO behind Authelia');
    expect(footer).toHaveTextContent('Login own login');
  });
});
