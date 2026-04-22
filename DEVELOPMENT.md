# Development Guide

Quick reference for developers working on ColorShop.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Git configured
- Supabase account

### Initial Setup
```bash
# Clone repo
git clone <url> && cd ecommerce

# Install deps
npm install

# Setup env
cp .env.example .env.local
# Edit with Supabase keys

# Verify setup
npm run type-check

# Start dev server
npm run dev
```

Open http://localhost:3000

## Daily Workflow

### Before Starting
```bash
# Update dependencies
npm install

# Pull latest code
git pull origin main

# Start dev server
npm run dev
```

### During Development
```bash
# Lint check
npm run lint

# Type check
npm run type-check

# Run tests
npm test

# Run tests in watch
npm test -- --watch
```

### Before Committing
```bash
# Fix lint issues
npm run lint:fix

# Type check passes
npm run type-check

# Tests pass
npm test

# Commit
git add .
git commit -m "feat: description"
git push origin feature-branch
```

## Project Structure Quick Reference

```
src/
├── app/              # Pages (Next.js App Router)
├── components/       # React components
│   ├── catalogo/    # Catalog features
│   ├── auth/        # Auth components
│   ├── ui/          # Basic UI
│   └── __tests__/   # Component tests
├── context/         # React Context providers
├── lib/             # Utilities, DB, validation
│   ├── supabase.ts  # DB client
│   ├── env.ts       # Env vars
│   └── validation.ts # Zod schemas
└── styles/          # Global CSS
```

## Common Tasks

### Add New Page
```bash
# Create page directory
mkdir -p src/app/newpage

# Create page.tsx
touch src/app/newpage/page.tsx
```

```typescript
// src/app/newpage/page.tsx
export default function NewPage() {
  return <h1>New Page</h1>;
}
```

### Add New Component
```bash
# Create component file
touch src/components/MyComponent.tsx
```

```typescript
import { FC, ReactNode } from 'react';

interface MyComponentProps {
  children?: ReactNode;
  title: string;
}

export const MyComponent: FC<MyComponentProps> = ({ children, title }) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
};
```

### Add API Endpoint
```bash
mkdir -p src/app/api/myendpoint
touch src/app/api/myendpoint/route.ts
```

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { safeValidate, productSchema } from '@/lib/validation';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await req.json();
    
    // Validate input
    const validated = safeValidate(productSchema, data);
    if (!validated) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Process request
    // ...

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Query Database
```typescript
import { supabase } from '@/lib/supabase';

// Fetch
const { data, error } = await supabase
  .from('productos')
  .select('*')
  .eq('categoria_id', categoryId)
  .limit(10);

// Insert
const { data, error } = await supabase
  .from('productos')
  .insert([{ nombre: 'Product', precio: 100 }]);

// Update
const { data, error } = await supabase
  .from('productos')
  .update({ precio: 120 })
  .eq('id', productId);

// Delete
const { error } = await supabase
  .from('productos')
  .delete()
  .eq('id', productId);
```

### Add Form with Validation
```typescript
'use client';

import { useState, FormEvent } from 'react';
import { loginSchema } from '@/lib/validation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    // Process form
    try {
      // submit...
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### Add Test for Component
```typescript
// src/components/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders with title', () => {
    render(<MyComponent title="Test Title">Content</MyComponent>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <MyComponent title="Title">
        <span>Child content</span>
      </MyComponent>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
```

## TypeScript Tips

### Infer Type from Data
```typescript
const products = await supabase.from('productos').select();
type Product = typeof products.data[0];
```

### Generic Component
```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
}

export function List<T extends { id: string }>({
  items,
  renderItem,
}: ListProps<T>) {
  return <ul>{items.map((item) => <li key={item.id}>{renderItem(item)}</li>)}</ul>;
}
```

### Async Server Component
```typescript
interface PageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: PageProps) {
  const { data } = await supabase
    .from('productos')
    .select()
    .eq('id', params.id)
    .single();

  if (!data) return <div>Not found</div>;

  return <div>{data.nombre}</div>;
}
```

## Debugging

### Console Logs
```typescript
console.log('Info:', value);     // Info
console.warn('Warning:', error); // Warning  
console.error('Error:', error);  // Error
```

### React DevTools
- Install React DevTools extension
- Inspect component state/props
- Profile performance

### Network Tab
- Check API responses
- Verify request/response payloads
- Monitor bandwidth

### VS Code Debugging
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js Debug",
      "type": "node",
      "request": "attach",
      "port": 9229
    }
  ]
}
```

Run: `npm run dev -- --inspect`

## Performance Tips

### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize component
const ProductCard = memo(function ProductCard({ product }: Props) {
  return <div>{product.name}</div>;
});

// Memoize expensive computation
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);

// Memoize callback
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

### Bundle Analysis
```bash
npm install -D @next/bundle-analyzer
```

Update next.config.mjs:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
```

Run: `ANALYZE=true npm run build`

## Commit Messages

Follow Conventional Commits:
```
feat: add product search
fix: cart total calculation
docs: update README
style: format code
refactor: extract component
test: add cart tests
chore: update deps
```

## Code Review Checklist

- [ ] Types are correct (no `any`)
- [ ] Tests pass
- [ ] Linting passes
- [ ] No console errors
- [ ] No broken links
- [ ] Accessible markup (ARIA)
- [ ] Mobile responsive
- [ ] Error handling added
- [ ] Input validation added
- [ ] Performance impact checked

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zod Docs](https://zod.dev)

## Getting Help

1. Check documentation files:
   - README.md - Overview
   - ARCHITECTURE.md - System design
   - MIGRATION.md - TypeScript migration

2. Search GitHub issues

3. Check Supabase docs for DB questions

4. Ask in team chat with context

## Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production build

# Quality
npm run lint         # Check linting
npm run lint:fix     # Fix linting issues
npm run type-check   # Check types
npm test             # Run tests
npm run test:watch   # Tests in watch mode
npm run test:coverage # Coverage report

# Utility
npm install          # Install dependencies
npm update           # Update dependencies
```
