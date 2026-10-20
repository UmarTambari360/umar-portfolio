import 'dotenv/config';
import { db, pool } from './index.js';
import { projects } from './schema/projects.js';

/**
 * Safe by default: only inserts projects whose slug does not exist yet, so
 * re-running it never touches anything you created in the admin panel.
 * Pass --reset to wipe the table first (development only!).
 */
async function seed(): Promise<void> {
  const reset = process.argv.includes('--reset');
  console.log('Seeding initial portfolio projects into PostgreSQL...');

  if (reset) {
    console.log('--reset given: deleting ALL existing projects first.');
    await db.delete(projects);
  }

  await db.insert(projects).values([
    {
      name: 'Pen Times Magazine',
      slug: 'pen-times-magazine',
      tagline: 'Digital news publication platform engineered with a decoupled monorepo architecture and GraphQL API.',
      description: 'A full-stack editorial news platform built for Pen Times Media in Katsina, Nigeria. Rebuilt as a high-performance monorepo featuring a Next.js frontend and an Express.js GraphQL backend (Apollo Server / Yoga + Pothos schema builder), PostgreSQL database with Drizzle ORM, Redis session caching, and Cloudinary media pipelines.',
      stack: [
        'Next.js',
        'TypeScript',
        'Express.js',
        'GraphQL',
        'Pothos',
        'PostgreSQL',
        'Drizzle ORM',
        'Redis',
        'Tailwind CSS'
      ],
      status: 'in_progress',
      liveUrl: 'https://pentimes.ng',
      githubUrl: 'https://github.com/umar-farouq/pentimes-monorepo',
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000',
      featured: true,
      priority: 1,
      startedAt: new Date('2025-06-01'),
      shippedAt: null,
    },
    {
      name: 'Event Management System',
      slug: 'event-management-system',
      tagline: 'Full-stack campus event ticketing & management platform integrated with Paystack payments and resilient webhooks.',
      description: 'An enterprise event management platform engineered for Ahmadu Bello University events. Developed using Next.js App Router, TypeScript, PostgreSQL with Drizzle ORM, Supabase Auth, and Paystack integration. Features automated payment verification via ngrok-tested webhooks and fallback polling mechanisms.',
      stack: [
        'Next.js',
        'React',
        'TypeScript',
        'PostgreSQL',
        'Drizzle ORM',
        'Supabase',
        'Paystack',
        'Tailwind CSS',
        'shadcn/ui'
      ],
      status: 'shipped',
      liveUrl: 'https://events.abu.edu.ng',
      githubUrl: 'https://github.com/umar-farouq/event-management-system',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000',
      featured: true,
      priority: 2,
      startedAt: new Date('2025-01-15'),
      shippedAt: new Date('2025-08-30'),
    },
  ]).onConflictDoNothing({ target: projects.slug });

  console.log('Database seeding completed successfully!');
  await pool.end();
}

seed().catch((err: unknown) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

