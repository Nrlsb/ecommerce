# TypeScript Migration Guide

Project migrated to TypeScript with strict type checking. This guide helps complete the migration.

## What Changed

### ✅ Completed
- [x] tsconfig.json with strict mode enabled
- [x] .env validation with type safety (env.ts)
- [x] Error boundaries (ErrorBoundary.tsx)
- [x] Global error page (app/error.tsx)
- [x] 404 not found page (app/not-found.tsx)
- [x] Input validation schemas with Zod (lib/validation.ts)
- [x] Jest + React Testing Library setup
- [x] Enhanced ESLint configuration
- [x] Refactored catalog page (app/catalogo/page.tsx)
- [x] Extracted catalog components:
  - SearchBar.tsx
  - FilterPanel.tsx
  - ProductCard.tsx
  - ProductGrid.tsx
- [x] Converted layout.js → layout.tsx
- [x] Sample tests for ErrorBoundary & validation
- [x] Comprehensive README.md
- [x] package.json with TypeScript deps added

### 🔄 In Progress - Remaining Files to Convert

Remaining .js/.jsx files to rename to .ts/.tsx:
- `src/app/page.js` → `src/app/page.tsx`
- `src/app/carrito/page.js` → `src/app/carrito/page.tsx`
- `src/app/contacto/page.js` → `src/app/contacto/page.tsx`
- `src/app/login/page.js` → `src/app/login/page.tsx`
- `src/app/admin/page.js` → `src/app/admin/page.tsx`
- `src/app/ofertas/page.js` → `src/app/ofertas/page.tsx`
- `src/app/marcas/page.js` → `src/app/marcas/page.tsx`
- `src/app/catalogo/[id]/page.js` → `src/app/catalogo/[id]/page.tsx`
- `src/app/globals.css` → no change needed
- `src/app/favicon.ico` → no change needed

API Routes (need .ts conversion):
- `src/app/api/checkout/route.js` → `src/app/api/checkout/route.ts`
- `src/app/api/sync-products/route.js` → `src/app/api/sync-products/route.ts`
- `src/app/api/sync-categories/route.js` → `src/app/api/sync-categories/route.ts`

Components (need .jsx/.js → .tsx/.ts conversion):
- `src/components/Navbar.js` → `src/components/Navbar.tsx`
- `src/components/Footer.js` → `src/components/Footer.tsx`
- `src/components/ui/WhatsAppButton.jsx` → `src/components/ui/WhatsAppButton.tsx`
- `src/components/auth/AuthForm.jsx` → `src/components/auth/AuthForm.tsx`
- `src/components/products/ProductCalculator.jsx` → `src/components/products/ProductCalculator.tsx`

Contexts (need conversion):
- `src/context/CartContext.js` → `src/context/CartContext.tsx`
- `src/context/AuthContext.js` → `src/context/AuthContext.tsx`

Library Files:
- `src/lib/supabase.js` → Already using imports from .ts env, just rename to .ts

## Migration Strategy

### Step 1: Rename Files
```bash
# Rename page files
mv src/app/page.js src/app/page.tsx
mv src/app/carrito/page.js src/app/carrito/page.tsx
# ... continue for all files
```

### Step 2: Add Types
When converting, add TypeScript types:

```typescript
// Before (page.js)
export default function Page() {
  const [state, setState] = useState([]);
  return <div>...</div>;
}

// After (page.tsx)
import { FC } from 'react';

const Page: FC = () => {
  const [state, setState] = useState<unknown[]>([]);
  return <div>...</div>;
};

export default Page;
```

### Step 3: Use Validation Schemas
For API routes, validate inputs with Zod:

```typescript
import { productSchema, safeValidate } from '@/lib/validation';

export async function POST(req: Request) {
  const data = await req.json();
  const validated = safeValidate(productSchema, data);
  
  if (!validated) {
    return Response.json({ error: 'Invalid data' }, { status: 400 });
  }
  
  // Use validated data safely
}
```

### Step 4: Type Contexts
Update context files with proper types:

```typescript
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: string) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
```

### Step 5: Type Components
Add props interfaces to components:

```typescript
interface NavbarProps {
  sticky?: boolean;
  backgroundColor?: string;
}

export function Navbar({ sticky = true, backgroundColor = 'bg-white' }: NavbarProps) {
  return <nav className={backgroundColor}>...</nav>;
}
```

## Type Safety Levels

### Strict Mode (Enabled)
```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

This means:
- All function parameters and return types should be typed
- Unused variables/imports will error
- Exhaustive checking required for switch statements

### Common Patterns

**Component with React.FC:**
```typescript
interface Props {
  title: string;
  onClick?: () => void;
}

const Button: React.FC<Props> = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};
```

**Async API Route:**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await req.json();
    // process...
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**useState with Type:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const [user, setUser] = useState<User | null>(null);
```

**Custom Hook:**
```typescript
interface UseCartReturn {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
}

function useCart(): UseCartReturn {
  // implementation
  return { items, total, addItem };
}
```

## Testing Types

Update test files to use TypeScript:

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent, Props } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const props: Props = {
      title: 'Test',
      onSubmit: jest.fn(),
    };

    render(<MyComponent {...props} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Running Type Checks

```bash
# Check for type errors (if Next.js build)
npm run build

# Run ESLint with type rules
npm run lint
```

## Troubleshooting

### "Property does not exist on type 'Window'"
Add type declaration or cast:
```typescript
declare global {
  interface Window {
    customProp: string;
  }
}
```

### "Cannot find module '@/components/X'"
Check path aliases in tsconfig.json match actual file locations.

### "Expected X type but got Y"
Use explicit types:
```typescript
const value = someFunction() as MyType;
// or
const value: MyType = someFunction();
```

### "No overload matches this call"
Check function signature in types or add proper generic types.

## Next Steps After Migration

1. **Add API Response Types**
   - Create types/api.ts with Zod schemas and types
   - Use in API routes and fetch calls

2. **Add Database Types**
   - Generate from Supabase schema
   - Use in database queries

3. **Add Component Tests**
   - Write .test.tsx files for all components
   - Use generated types in tests

4. **Documentation**
   - Add JSDoc comments for public APIs
   - Document complex type hierarchies

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js TypeScript Guide](https://nextjs.org/docs/basic-features/typescript)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Zod Documentation](https://zod.dev/)
