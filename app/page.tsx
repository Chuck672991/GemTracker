import type { RatesResponse } from '@/lib/types';
import { Dashboard } from '@/components/dashboard';

async function getInitialRates(): Promise<RatesResponse | undefined> {
  try {
    // Use an absolute URL for server-side fetch in Next.js
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/rates`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return undefined;
    return res.json();
  } catch {
    return undefined;
  }
}

export default async function HomePage() {
  const initialData = await getInitialRates();

  return <Dashboard initialData={initialData} />;
}
