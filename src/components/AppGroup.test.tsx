import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { apps, groups } from '../apps';
import { AppGroup } from './AppGroup';

describe('AppGroup', () => {
  it('renders a labelled section with one card per app', () => {
    const group = groups[0]!;
    const groupApps = apps.filter((app) => app.group === group.id);
    render(<AppGroup group={group} apps={groupApps} />);

    const section = screen.getByRole('region', { name: group.title });
    expect(within(section).getByRole('heading', { level: 2 })).toHaveTextContent(group.title);
    expect(within(section).getAllByRole('link')).toHaveLength(groupApps.length);
  });
});
