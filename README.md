# Next.js Project with TanStack & shadcn/ui

This is a Next.js project with TanStack Table, TanStack Query, shadcn/ui, Redux, and Tailwind CSS.

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Next.js App Router
- TanStack Table for data tables
- TanStack Query for data fetching
- shadcn/ui components
- Redux for state management
- Tailwind CSS for styling
- TypeScript for type safety
- Authentication with token refresh
- Form validation with react-hook-form and zod
- Internationalization
- Dark mode support
- Protected routes
- Loading states
- API service with Axios interceptors
- WebSocket and MQTT support
- Docker containerization
- GitLab CI/CD pipeline

## Project Structure

- `app/` - Next.js App Router pages
- `components/` - Reusable UI components
- `lib/` - Utility functions, hooks, and services
- `public/` - Static assets
- `types/` - TypeScript type definitions
- `k8s/` - Kubernetes configuration files
- `scripts/` - Utility scripts

## Docker and GitLab CI/CD

This project includes Docker configuration for development and production, as well as GitLab CI/CD pipeline configuration. See [DOCKER_GITLAB.md](DOCKER_GITLAB.md) for more information.

## Testing

This project uses Vitest for testing:

\`\`\`bash
npm run test
# or
yarn test
\`\`\`

For UI testing:

\`\`\`bash
npm run test:ui
# or
yarn test:ui
\`\`\`

For coverage:

\`\`\`bash
npm run coverage
# or
yarn coverage
\`\`\`

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_API_URL`: API URL
- `NEXT_PUBLIC_WEBSOCKET_URL`: WebSocket URL
- `NEXT_PUBLIC_MQTT_URL`: MQTT URL
- `NEXT_PUBLIC_MQTT_USERNAME`: MQTT username
- `NEXT_PUBLIC_MQTT_PASSWORD`: MQTT password

Copy `.env.example` to `.env.local` and update the values.
