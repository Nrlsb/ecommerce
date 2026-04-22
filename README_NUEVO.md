# ColorShop - Ecommerce Platform

Modern paint & accessories ecommerce platform built with Next.js 16, React 19, and Supabase.

## Tech Stack

- **Frontend**: Next.js 16.2.1, React 19.2.4, TypeScript 5.3
- **Styling**: Tailwind CSS 4, Framer Motion animations
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Icons**: Lucide React
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, TypeScript strict mode

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project

### Installation

```bash
# Clone repository
git clone <repo-url>
cd ecommerce

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build & Deploy

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── catalogo/     # Product catalog
│   ├── carrito/      # Shopping cart
│   ├── checkout/     # Checkout flow
│   ├── login/        # Authentication
│   ├── admin/        # Admin panel
│   └── api/          # API routes
├── components/       # Reusable React components
│   ├── catalogo/     # Catalog-specific components
│   ├── auth/         # Auth components
│   ├── ui/           # Basic UI components
│   └── ErrorBoundary # Error handling
├── context/          # React contexts
│   ├── CartContext   # Shopping cart state
│   └── AuthContext   # Auth state
├── lib/              # Utilities & libraries
│   ├── supabase.ts   # Supabase client
│   ├── env.ts        # Environment validation
│   └── validation.ts # Input validation schemas (Zod)
└── styles/           # Global styles
```

## Key Features

### Catalog Management
- Dynamic product filtering by category, brand, price
- Full-text search
- Pagination with load-more
- Product details page
- Shopping cart integration

### Authentication
- Supabase Auth
- Login/logout flow
- User profile (context available)

### Shopping Cart
- Add/remove items
- Quantity management
- Persistent state (CartContext)

### Error Handling
- Error boundary component
- Global error page
- 404 not-found page
- Graceful error messages

### Input Validation
- Zod schemas for runtime validation
- Validates search params, product data, auth inputs
- Safe parsing with fallback to null

## API Routes

### GET `/api/sync-products`
Sync products from external source to Supabase.

### GET `/api/sync-categories`
Sync product categories.

### POST `/api/checkout`
Process checkout (payment integration point).

## Environment Variables

Required:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Optional:
```
SUPABASE_SERVICE_ROLE_KEY=your-service-key  # Server-side only
NODE_ENV=development|production
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage
npm test -- --coverage
```

Sample tests in `src/components/__tests__/` directory.

## Code Quality

```bash
# Run ESLint
npm run lint

# Type checking
npm run type-check  # if configured
```

### Lint Rules
- React hooks rules enabled
- Unused variable warnings
- Console use restricted (warn only)
- Strict type checking with TypeScript

## Best Practices

### Components
- Use TypeScript for type safety
- Extract large components (>200 lines)
- Use error boundaries for isolating failures
- Memoize expensive computations

### API
- Validate all inputs with Zod schemas
- Handle errors gracefully
- Log errors to console
- Return consistent JSON responses

### State Management
- Use React Context for global state (cart, auth)
- Keep component state minimal
- Avoid prop drilling with Context

### Performance
- Use ISR/revalidateTag for dynamic routes
- Lazy load images
- Code split with dynamic imports
- Monitor bundle size

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Docker
```bash
docker build -t colorshop .
docker run -p 3000:3000 colorshop
```

### Environment Setup
1. Set environment variables in hosting platform
2. Ensure Supabase is accessible from production
3. Configure CORS if needed

## Troubleshooting

### Missing Environment Variables
Error: "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL"
- Check `.env.local` exists with correct keys
- Run `npm run dev` again after updating env

### Supabase Connection Issues
- Verify NEXT_PUBLIC_SUPABASE_URL is correct
- Check ANON_KEY is valid
- Ensure Supabase project is active

### Products Not Loading
- Check database connection in Supabase console
- Verify `productos` and `categorias` tables exist
- Check RLS policies allow public read access

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Run tests: `npm test`
4. Run lint: `npm run lint`
5. Commit with conventional commits: `git commit -m "feat: description"`
6. Push and create PR

## License

MIT - See LICENSE file

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create new issue with reproduction steps
3. Contact: luksbenitez27@gmail.com
