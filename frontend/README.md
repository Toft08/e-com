# Buy-01 E-commerce Frontend

Modern Angular 18 frontend for the Buy-01 e-commerce platform with JWT authentication, role-based access control, and responsive design.

## Features

- **Authentication System**
  - Login/Register with JWT token management
  - HttpOnly cookies + localStorage for secure token storage
  - Automatic token validation with session expiry handling
  - Hard refresh logout to clear all cached state

- **Product Browsing**
  - Homepage with featured products grid
  - Product detail pages with image slider
  - Seller information display
  - Cart button (functionality placeholder)

- **Seller Dashboard**
  - Create/update/delete products
  - Upload product images (2MB limit)
  - View and manage own products
  - Media management with preview

- **User Profile**
  - View/edit profile information
  - Avatar management
  - Account deletion with cascade

- **Security Features**
  - Route guards: `authGuard`, `sellerGuard`, `roleGuard`
  - HTTP interceptor for automatic token attachment
  - Global 401/403 error handling
  - HTTPS with self-signed certificates

## Architecture

### Standalone Components (Angular 18+)
```
src/app/
├── components/
│   ├── home/                    # Homepage with product grid
│   ├── login/                   # Login form
│   ├── register/                # Registration form
│   ├── navbar/                  # Navigation with user menu
│   ├── products/
│   │   ├── product-list/        # Product browsing
│   │   └── product-detail/      # Individual product page
│   ├── seller/
│   │   └── seller-dashboard/    # Seller product management
│   └── user/
│       └── user-profile/        # User profile management
├── services/
│   ├── auth.service.ts          # Authentication + JWT
│   ├── product.service.ts       # Product CRUD
│   ├── media.service.ts         # Image upload/management
│   └── cart.service.ts          # Shopping cart (in progress)
├── guards/
│   ├── auth.guard.ts            # Authentication check
│   ├── seller.guard.ts          # Seller role check
│   └── role.guard.ts            # Flexible role-based guard
├── interceptors/
│   └── auth.interceptor.ts      # JWT attachment + error handling
├── models/
│   ├── user.model.ts
│   ├── product.model.ts
│   └── media.model.ts
└── app.routes.ts                # Routing configuration
```

## Setup

### Prerequisites
- Node.js 18+ and npm
- Backend services running (see [backend README](../backend/README.md))

### Local Development (without Docker)

```bash
cd frontend
npm install
npm start
```

Accessible at `https://localhost:4200` (self-signed certificate - click "Advanced" → "Proceed")

**Important:** For local development, update `src/environments/environments.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:8080',  // API Gateway URL
};
```

### Docker Deployment

When running with Docker Compose (recommended), use empty `apiUrl` for nginx proxy:
```typescript
export const environment = {
  production: false,
  apiUrl: '',  // Empty = relative URLs, proxied by nginx
};
```

Then rebuild the frontend container:
```bash
docker-compose build frontend
docker-compose up -d frontend
```

## Routing

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | HomeComponent | Public | Homepage with products |
| `/login` | LoginComponent | Public | User login |
| `/register` | RegisterComponent | Public | User registration |
| `/products` | ProductListComponent | Public | Product browsing |
| `/products/:id` | ProductDetailComponent | Public | Product detail page |
| `/profile` | UserProfileComponent | Auth | User profile management |
| `/seller/dashboard` | SellerDashboardComponent | Seller | Seller product management |

## Services

### AuthService
- `login(credentials)` - Authenticate user, store JWT
- `register(userData)` - Create new account
- `logout()` - Clear tokens and force refresh
- `validateToken()` - Check token validity on app init
- `getCurrentUser()` - Observable of current user
- `isLoggedIn()` - Check authentication status

### ProductService
- `getAllProducts()` - Fetch all products (public)
- `getProductById(id)` - Fetch single product
- `getMyProducts()` - Fetch current user's products (authenticated)
- `createProduct(product)` - Create new product (seller)
- `updateProduct(id, product)` - Update product (owner)
- `deleteProduct(id)` - Delete product (owner)

### MediaService
- `uploadMedia(productId, file)` - Upload image (max 2MB, image/*)
- `getProductMedia(productId)` - Fetch product images
- `getMediaUrl(mediaId)` - Get image URL
- `deleteMedia(mediaId)` - Delete image (owner)

## Guards

### authGuard
Protects routes requiring authentication. Redirects to `/login` if not authenticated.

### sellerGuard
Restricts access to seller-only features. Redirects to `/` if user is not a seller.

### roleGuard
Flexible role-based guard accepting allowed roles as parameter.

## Interceptors

### authInterceptor
- Automatically attaches JWT token to outgoing requests
- Handles 401 (Unauthorized) → redirect to login
- Handles 403 (Forbidden) → show error message
- Skips token attachment for login/register endpoints

## Forms & Validation

All forms use Angular Reactive Forms with validators:
- **Login**: Email (required, email format), Password (required)
- **Register**: Name (required), Email (required, unique), Password (required, min 6 chars), Role (required), Avatar (optional URL)
- **Product**: Name (required), Description (required), Price (required, positive number), Quality (required, 0-100)
- **Media Upload**: File (required, image/*, max 2MB)

## Styling

SCSS with design system:
- `src/styles/_variables.scss` - Colors, fonts, spacing
- `src/styles/_mixins.scss` - Reusable style patterns
- `src/styles/_buttons.scss` - Button styles
- `src/styles/_forms.scss` - Form input styles
- `src/styles/_cards.scss` - Product card styles
- `src/styles/_utilities.scss` - Helper classes

**Responsive breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## nginx Configuration (Docker)

The nginx server handles:
- **Static files**: `.js`, `.css`, images served with caching
- **API proxy**: `/auth`, `/users`, `/products`, `/media` → API Gateway
- **Content negotiation**: `/products` route distinguishes JSON (API) vs HTML (Angular)
- **Angular routing**: All other routes serve `index.html` for client-side routing

## Development Notes

### Token Validation
The app validates JWT tokens on initialization:
- If expired/blacklisted: Shows alert, clears session, redirects to login
- If valid: Loads user data and continues

### Logout Behavior
Logout performs:
1. Clears current user state immediately
2. Calls backend `/auth/logout` to blacklist token
3. Forces hard refresh with `window.location.href = '/'`
4. Works even if backend is unreachable

### Image Upload
- Frontend validation: 2MB max, `image/*` MIME type
- Backend validation: Same rules enforced server-side
- Preview before upload in seller dashboard
- Files stored in `backend/services/media/uploads/images/`

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run e2e

# Lint
npm run lint

# Format code
npm run format
```

## Related Documentation

- [Main README](../README.md) - Full project overview and Docker setup
- [Backend README](../backend/README.md) - Backend services and API documentation
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
