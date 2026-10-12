import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SearchBox } from './SearchBox';

function Controlled({ onChange }: { onChange?: (value: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <>
      <SearchBox
        value={value}
        onChange={(v) => {
          setValue(v);
          onChange?.(v);
        }}
      />
      <textarea aria-label="other field" />
      <button type="button">elsewhere</button>
    </>
  );
}

describe('SearchBox', () => {
  it('is labelled for screen readers', () => {
    render(<Controlled />);
    expect(screen.getByRole('searchbox', { name: 'Search apps' })).toBeInTheDocument();
  });

  it('reports typed text', async () => {
    const onChange = vi.fn<(value: string) => void>();
    render(<Controlled onChange={onChange} />);
    await userEvent.type(screen.getByRole('searchbox'), 'git');
    expect(onChange).toHaveBeenLastCalledWith('git');
    expect(screen.getByRole('searchbox')).toHaveValue('git');
  });

  it('focuses on "/" without typing the slash', async () => {
    render(<Controlled />);
    screen.getByRole('button', { name: 'elsewhere' }).focus();
    await userEvent.keyboard('/');
    const input = screen.getByRole('searchbox');
    expect(input).toHaveFocus();
    expect(input).toHaveValue('');
  });

  it('ignores "/" with a modifier key', async () => {
    render(<Controlled />);
    screen.getByRole('button', { name: 'elsewhere' }).focus();
    await userEvent.keyboard('{Control>}/{/Control}');
    expect(screen.getByRole('searchbox')).not.toHaveFocus();
  });

  it('lets "/" be typed into other fields', async () => {
    render(<Controlled />);
    const other = screen.getByRole('textbox', { name: 'other field' });
    await userEvent.type(other, 'a/b');
    expect(other).toHaveValue('a/b');
    expect(other).toHaveFocus();
  });

  it('lets "/" be typed into the search box itself', async () => {
    render(<Controlled />);
    await userEvent.type(screen.getByRole('searchbox'), 'a/b');
    expect(screen.getByRole('searchbox')).toHaveValue('a/b');
  });

  it('clears on Escape', async () => {
    render(<Controlled />);
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'vault');
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveValue('');
  });

  it('removes its key listener on unmount', async () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<Controlled />);
    unmount();
    expect(remove).toHaveBeenCalledWith('keydown', expect.any(Function));
    remove.mockRestore();
  });
});
