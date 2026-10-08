# Farm2Home Angular Frontend

Complete Angular frontend generated from the supplied Farm2Home OpenAPI 3.1 specification.

## Stack

- Angular 21 LTS, standalone components
- Reactive Forms
- Angular Router
- Angular HttpClient
- RxJS
- Custom responsive SCSS theme
- Light and dark modes
- JWT authentication with role-based route guards

Angular 21 was selected because it remains supported and has broader Node.js compatibility than Angular 22.

## Backend expected

Run the Spring Boot backend on:

```text
http://localhost:8080
```

The Angular development server uses `proxy.conf.json` to proxy:

- `/api/**` -> `http://localhost:8080/api/**`
- `/uploads/**` -> `http://localhost:8080/uploads/**`

This avoids hard-coding cross-origin API calls during local development.

## Run on Windows

1. Install Node.js 20.19+ or a compatible Node.js 22 release.
2. Keep the Spring Boot backend running on port 8080.
3. Double-click `START_FRONTEND.bat`, or run:

```bash
npm install
npm start
```

4. Open:

```text
http://localhost:4200
```

## Production build

```bash
npm run build:prod
```

The generated files will be under `dist/farm2home-frontend`.

## Implemented flows

### Public / customer
- Marketplace home page
- Product browsing
- Product search
- Product category filtering
- Product details
- Customer registration
- OTP send, resend and verification
- Login
- Local cart
- Buy now
- Cart checkout
- Customer order history

### Farmer
- Farmer registration
- Farmer profile
- Farmer profile update
- Government ID front/back upload
- Farm photo upload
- Verification status
- Farmer dashboard
- My products
- Add product
- Edit product
- Delete product
- Product image upload
- Farmer order list

### Admin
- Admin dashboard
- Pending farmer list
- Farmer detail review
- Farmer approval
- Farmer rejection with remarks
- Category list
- Add category

## Authentication

The frontend uses the actual login response shape supplied for this project:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "phoneNumber": "**********",
    "role": "CUSTOMER",
    "token": "<JWT_TOKEN>"
  }
}
```

The client stores:

- `phoneNumber`
- `role`
- `token`

Authenticated requests receive:

```text
Authorization: Bearer <JWT_TOKEN>
```

Routes are protected for:

- `CUSTOMER`
- `FARMER`
- `ADMIN`

## Important OpenAPI limitation handled by this project

The supplied OpenAPI specification declares the common response as:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

but it does not define the object/array schema inside `data` for products, orders, farmer profiles, categories, and admin responses.

For that reason the frontend includes tolerant response normalizers under:

```text
src/app/core/utils/api.util.ts
src/app/core/utils/product.util.ts
```

They accept common response shapes such as a direct `data` array or nested keys such as `products`, `orders`, `categories`, and `farmers`.

After running against the real backend, these can be tightened to exact DTO interfaces once actual response DTO schemas are exposed by Swagger.

## Product and document images

Uploads are sent with `FormData` using the field names from the backend API:

- Product images: `images`
- Government ID: `frontImage`, `backImage`
- Farm photo: `file`

Image URLs returned as file names or `uploads/...` paths are resolved through `/uploads`.

If your Spring Boot static-resource mapping uses a different URL, change `resolveAssetUrl()` in:

```text
src/app/core/utils/product.util.ts
```

## API source

The exact supplied API document is retained at:

```text
docs/openapi.json
```

## Endpoint coverage

Business endpoints from the supplied API are wired into the frontend. `/api/test` is intentionally not shown in the user interface because it is a development/test endpoint.

## Security note

For this local project the JWT session is kept in browser localStorage. For a production deployment, an HttpOnly secure cookie architecture is preferable when the backend supports it.
