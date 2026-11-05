# Portfolify

A self-hosted developer portfolio builder and hosting platform. Select a layout, populate your work experience and projects through a live editor, and publish to a clean public URL (`/:username`).

---

## Overview

Portfolify decouples your portfolio content from its visual presentation. You enter your profile, career timeline, projects, skills, and credentials once into a structured schema, and can swap between distinct layout templates at any time without reformatting your data.

Portfolios support a dual-state workflow: edit privately in draft mode with simulated viewport previews (desktop, tablet, mobile), and publish immutable snapshots whenever you are ready to update your public profile.

---

## Templates

Portfolify ships with five layouts designed for different aesthetics:

- **Minimalist Design (`minimal`)**: Swiss-style editorial minimalism with high typographic contrast, hairline rules, and generous whitespace.
- **Dev Terminal (`terminal`)**: Monospace console layout featuring an interactive command bar, prompt styling, and structured career logs.
- **Neo-Brutalist (`brutalist`)**: High-energy brutalist aesthetic with chunky solid borders, hard offset drop shadows, and vibrant color-blocked sections.
- **Glassmorphism Aurora (`glassmorphic`)**: Modern frosted glass cards with translucent backgrounds, ambient gradient lighting, and depth layering.
- **Luxury Minimalism (`luxury`)**: Haute-couture dark palette built on obsidian surfaces, champagne gold accents, and gallery-style project showcases.

---

## Tech Stack

### Frontend (`client/`)
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, OKLCH CSS design tokens, Lucide React
- **State & Data**: TanStack Query (React Query v5), React Router v6
- **Forms & Validation**: React Hook Form, Zod

### Backend (`server/`)
- **Runtime**: Node.js, Express, TypeScript
- **Database & ORM**: PostgreSQL, Drizzle ORM
- **Authentication**: Better Auth (session-based cookies, email verification, password reset)
- **Email Delivery**: Resend
- **Testing**: Vitest, Supertest

---

## Repository Structure

```text
portfolify/
├── client/                     # Vite + React single-page application
│   ├── public/templates/       # Pre-rendered template preview screenshots
│   └── src/
│       ├── components/         # Shared UI, layout, and preview frames
│       ├── context/            # AuthContext, ThemeContext
│       ├── pages/              # Public, dashboard, auth, editor, and preview pages
│       ├── templates/          # Template components, registry, sample data
│       └── types/              # Portfolio data models and TypeScript schemas
├── server/                     # Express REST API and SSR renderer
│   ├── src/
│   │   ├── config/             # Database and Better Auth configuration
│   │   ├── controllers/        # Portfolio CRUD, content, and username handlers
│   │   ├── db/                 # Drizzle schema definitions and migrations
│   │   ├── middleware/         # Auth guards, rate limiting, and input validation
│   │   ├── routes/             # API routes
│   │   └── services/           # SSR template rendering and HTML snapshot delivery
│   └── tests/                  # Vitest integration and endpoint tests
├── .env.example                # Example environment variables
└── package.json                # Root workspace scripts
```

---

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm 9.x or later
- A running PostgreSQL instance

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/portfolify.git
cd portfolify

# Install root dependencies
npm install

# Install client and server dependencies
npm --prefix client install
npm --prefix server install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and application secrets:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolify
BETTER_AUTH_SECRET=generate_a_random_32_character_secret_here
BETTER_AUTH_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=Portfolify <onboarding@resend.dev>
```

### 3. Push Database Schema

Run Drizzle push to apply the schema tables directly to your database:

```bash
npm --prefix server run db:push
```

### 4. Start Development Servers

Run both the backend API and frontend Vite dev server concurrently:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## Available Scripts

From the repository root:

| Command | Description |
|---|---|
| `npm run dev` | Starts client and server concurrently via `concurrently` |
| `npm run build` | Builds TypeScript server (`tsc`) and client production assets (`vite build`) |
| `npm run test` | Runs backend Vitest suites |

From `server/`:

| Command | Description |
|---|---|
| `npm run dev` | Runs Express server with `tsx watch` |
| `npm run db:push` | Pushes Drizzle schema changes to PostgreSQL |
| `npm run db:generate` | Generates SQL migration files |
| `npm test` | Runs server test suite |

From `client/`:

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite dev server with HMR |
| `npm run build` | Compiles TypeScript and builds production client bundle |
| `npm run preview` | Serves production build locally |

---

## API Overview

### Authentication (`/api/auth/*`)
Handled by Better Auth handlers:
- `POST /api/auth/sign-up/email` - Register user with email and password
- `POST /api/auth/sign-in/email` - Authenticate user session
- `POST /api/auth/sign-out` - Clear active session cookie
- `GET /api/auth/get-session` - Retrieve authenticated user session

### Portfolio Management (`/api/portfolio/*`)
Protected endpoints requiring active user session:
- `GET /api/portfolio/list` - List portfolios owned by current user
- `GET /api/portfolio/me` - Fetch primary portfolio metadata and draft content
- `POST /api/portfolio` - Create a new portfolio
- `PATCH /api/portfolio/:id` - Update portfolio metadata (e.g., active template)
- `PUT /api/portfolio/:id/content` - Save draft portfolio content (bio, skills, projects, etc.)
- `GET /api/portfolio/username/check?username=xyz` - Check username availability
- `PATCH /api/portfolio/:id/username` - Claim or change portfolio username
- `POST /api/portfolio/:id/publish` - Generate and publish immutable snapshot
- `POST /api/portfolio/:id/unpublish` - Revert portfolio to draft status
- `DELETE /api/portfolio/:id` - Delete portfolio

### Public Portfolios
- `GET /:username` - Pre-rendered SSR HTML page with social Open Graph meta tags
- `GET /p/:username` - Alternative direct vanity path
- `GET /api/public/:username` - Returns public portfolio JSON payload for client rendering

---

## Testing

Run the test suite against the backend API:

```bash
npm test
```

Tests cover:
- Health check endpoints (`/health`, `/api/health`)
- Reserved username rejection and availability checking
- Non-existent and draft portfolio 404 responses with cache-invalidation headers
- Protected route session verification

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
