function SearchFieldGrid({ fields = [] }) {
  if (!fields.length) {
    return null;
  }

  return (
    <div className="mt-4 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500 md:grid-cols-4">
      {fields.map((field, index) => (
        <div key={`${field.label}-${index}`} className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">{field.label}</p>
          <p className="text-sm font-semibold text-slate-900">{field.value || '—'}</p>
        </div>
      ))}
    </div>
  );
}

export default SearchFieldGrid;
