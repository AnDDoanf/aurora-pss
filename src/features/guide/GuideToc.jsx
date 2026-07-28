import React, { useEffect, useState } from 'react';

export function GuideToc({ content }) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const lines = content.split('\n');
    const list = [];
    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/\{#[^}]+\}/, '').trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        list.push({ level, text, id });
      }
    });
    setHeadings(list);
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block w-56 shrink-0 pl-6 border-l border-slate-800 space-y-3 sticky top-24 max-h-[80vh] overflow-y-auto">
      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">On this page</h4>
      <nav className="space-y-1 text-xs">
        {headings.map((h, i) => (
          <a
            key={i}
            href={`#${h.id}`}
            className={`block py-1 transition-colors ${
              h.level === 3 ? 'pl-3 text-slate-400 hover:text-slate-200' : 'font-semibold text-slate-300 hover:text-emerald-400'
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
