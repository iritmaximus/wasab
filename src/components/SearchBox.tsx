import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}

export function SearchBox({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" jumps to the search box from anywhere on the page
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="search">
      <label htmlFor="search" className="visually-hidden">
        Search apps
      </label>
      <input
        ref={inputRef}
        id="search"
        type="search"
        placeholder="Search apps…"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onChange('');
        }}
      />
      <kbd aria-hidden="true">/</kbd>
    </div>
  );
}
