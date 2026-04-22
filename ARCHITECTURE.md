# ColorShop Architecture

Technical architecture and design decisions for the ecommerce platform.

## Overview

Modern Next.js 16 application using App Router with React 19, TypeScript, and Supabase backend.

```
┌─────────────────────────────────────────────┐
│         Browser / Client Side               │
├─────────────────────────────────────────────┤
│  React 19 + TypeScript + Framer Motion      │
│  State: CartContext, AuthContext            │
│  Error Boundary + Error Pages               │
├─────────────────────────────────────────────┤
│         Next.js 16 API Routes               │
│  /api/sync-products                         │
│  /api/sync-categories                       │
│  /api/checkout                              │
├─────────────────────────────────────────────┤
│      Supabase (PostgreSQL)                  │
│  Tables: productos, categorias, users       │
│  Auth: Supabase Auth                        │
└─────────────────────────────────────────────┘
```

## Layers

### 1. Presentation Layer (`src/components/`)

**Purpose**: UI components and user interactions

**Key Components**:
- `Navbar` - Navigation header
- `Footer` - Page footer
- `ErrorBoundary` - Error handling wrapper
- `catalogo/` - Catalog page components
  - `SearchBar` - Product search input
  - `FilterPanel` - Category/brand filters
  - `ProductGrid` - Product list display
  - `ProductCard` - Individual product card
- `auth/AuthForm` - Login/signup form
- `products/ProductCalculator` - Product quantity calculator
- `ui/WhatsAppButton` - WhatsApp integration

**Patterns**:
- Functional components with hooks
- Props interfaces using TypeScript
- Memoization for expensive renders
- Error boundary wrapping
- Controlled components for forms

### 2. Page Layer (`src/app/`)

**Purpose**: Next.js App Router pages and layouts

**Structure**:
- `layout.tsx` - Root layout with providers
- `page.tsx` - Home page
- `catalogo/`
  - `page.tsx` - Catalog listing
  - `[id]/page.tsx` - Product detail
- `carrito/page.tsx` - Shopping cart
- `checkout/route.ts` - Checkout API
- `login/page.tsx` - Authentication
- `admin/page.tsx` - Admin dashboard
- `error.tsx` - Error page (App Router)
- `not-found.tsx` - 404 page

**Design Decisions**:
- Use App Router (not Pages Router)
- Server Components by default
- Client components only when needed (`'use client'`)
- Removed `force-dynamic` from catalog for ISR caching
- Error and not-found pages for graceful failures

### 3. State Management Layer

**Context Providers** (`src/context/`):

#### CartContext
```typescript
interface CartItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}
```

**Responsibilities**:
- Add/remove items from cart
- Track quantities
- Calculate totals
- Persist to localStorage (optional)

#### AuthContext
```typescript
interface User {
  id: string;
  email: string;
  // additional fields
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
}
```

**Responsibilities**:
- Manage auth state
- Handle login/logout/signup
- Persist user session
- Provide user to components

### 4. API Layer (`src/app/api/`)

**Purpose**: Backend API endpoints

**Endpoints**:

#### POST /api/checkout
Handles checkout payment processing.

```typescript
// Request body
{
  items: CartItem[];
  total: number;
  userEmail: string;
}

// Response
{
  success: boolean;
  orderId?: string;
  error?: string;
}
```

#### GET /api/sync-products
Syncs products from external source to Supabase.

#### GET /api/sync-categories
Syncs categories from external source to Supabase.

**Patterns**:
- Input validation with Zod
- Error handling with try-catch
- Consistent JSON responses
- Authentication checks where needed

### 5. Data Access Layer (`src/lib/`)

**Purpose**: Database and external service integration

**Key Files**:

#### supabase.ts
Singleton Supabase client:
```typescript
export const supabase = createClient(
  env.supabaseUrl,
  env.supabaseAnonKey
);
```

#### validation.ts
Zod schemas for runtime validation:
```typescript
export const productSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1),
  precio: z.number().positive(),
  // ...
});
```

#### env.ts
Type-safe environment variables:
```typescript
export const env = {
  supabaseUrl: required('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
};
```

### 6. Error Handling

**Strategy**: Layered error handling

**Error Boundary** (`src/components/ErrorBoundary.tsx`)
- Catches React component errors
- Renders fallback UI
- Logs errors to console
- Reset button for recovery

**Error Page** (`src/app/error.tsx`)
- App Router error boundary
- Catches page-level errors
- Retry button

**Not Found Page** (`src/app/not-found.tsx`)
- 404 handling
- Links to home/catalog

**API Error Handling**
- Input validation with Zod
- Try-catch blocks
- Consistent error responses
- Meaningful error messages

## Data Flow

### Product Catalog Flow
```
1. User navigates to /catalogo
2. Catalogo page component renders (client component)
3. useEffect fetches categories from Supabase
4. FilterPanel displays categories
5. User selects filters/searches
6. fetchProducts() queries Supabase with filters
7. Results paginated with PAGE_SIZE=20
8. ProductGrid displays ProductCard components
9. User clicks add to cart → CartContext.addToCart()
```

### Shopping Cart Flow
```
1. User adds product → CartContext.addToCart()
2. Items stored in CartContext state
3. Cart page reads from CartContext
4. User clicks checkout
5. POST /api/checkout with cart items
6. Payment processing (integration point)
7. Order created in Supabase
8. Cart cleared
```

### Authentication Flow
```
1. User visits /login
2. AuthForm submits email/password
3. Supabase Auth authenticates
4. AuthContext updates with user
5. Session stored in browser
6. Protected pages check AuthContext.user
7. Redirect if unauthorized
```

## Database Schema

### Tablas Principales

#### productos
```sql
CREATE TABLE productos (
  id PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  marca TEXT,
  stock INT,
  categoria_id UUID,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);
```

#### categorias
```sql
CREATE TABLE categorias (
  id UUID PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP
);
```

#### usuarios (via Supabase Auth)
```
Managed by Supabase Auth
Custom fields can be in auth.users or separate tabla
```

## Caching Strategy

### ISR (Incremental Static Regeneration)
- Catalog page uses on-demand revalidation
- Product detail pages cached indefinitely
- Revalidate on product updates

### Client-side Caching
- React Query or SWR (future enhancement)
- Local storage for cart
- Session storage for temporary data

## Performance Optimization

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting (built-in Next.js)
- Component lazy loading

### Image Optimization
- Next.js Image component (future)
- Cloudinary or similar CDN
- Responsive images with srcset

### Bundle Size
- Tree shaking enabled
- Remove unused dependencies
- Monitor with `next/bundle-analyzer`

## Security Considerations

### Authentication
- Supabase Auth handles password security
- JWT tokens in secure HTTPOnly cookies
- CSRF protection via Next.js

### Input Validation
- All user inputs validated with Zod
- SQL injection protection via Supabase
- XSS prevention via React escaping

### Environment Variables
- Public vars: NEXT_PUBLIC_*
- Secret vars: Server-side only
- Validation at startup via env.ts

### RLS (Row Level Security)
- Supabase RLS policies on all tables
- Products: Public read access
- User data: Restrict to owner

## Testing Strategy

### Unit Tests
- Component logic
- Validation schemas
- Utility functions

### Integration Tests
- API routes with mocked Supabase
- Context providers
- Component + hook interactions

### E2E Tests (future)
- Playwright or Cypress
- Critical user flows
- Cross-browser testing

## Deployment

### Prerequisites
- Node.js 18+
- Supabase project
- Environment variables set

### Vercel (Recommended)
- Automatic deployments from git
- Environment variables in Vercel dashboard
- Automatic HTTPS and CDN

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup
1. Copy .env.example to .env.local
2. Fill in Supabase credentials
3. Verify Supabase database tables exist
4. Test connection: `npm run dev`

## Future Enhancements

### Short Term (V1.1)
- [x] TypeScript migration
- [ ] E2E tests with Playwright
- [ ] Product reviews/ratings
- [ ] Wishlist feature
- [ ] Order tracking

### Medium Term (V2.0)
- [ ] Payment integration (Stripe/MercadoPago)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Admin dashboard
- [ ] Inventory management

### Long Term (V3.0)
- [ ] Mobile app (React Native)
- [ ] Real-time inventory
- [ ] Recommendations engine
- [ ] Multi-tenancy
- [ ] Internationalization

## References

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
