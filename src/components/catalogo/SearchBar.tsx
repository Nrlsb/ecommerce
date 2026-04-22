import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Busca por producto o marca..."
        className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
      />
    </div>
  );
}
