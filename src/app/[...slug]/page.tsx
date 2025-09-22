import type { Metadata } from 'next';
// Import client component directly in a Server Component file
import ClientLegacyApp from '@/components/ClientLegacyApp';

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL as string) || 'https://imenu.kg/api/';

type VenueResp = {
  companyName?: string;
  description?: string | null;
  logo?: string | null;
  slug?: string;
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug?: string[] }> }
): Promise<Metadata> {
  const { slug } = await params;
  const slugArr = Array.isArray(slug) ? slug : [];
  const venue = typeof slugArr[0] === 'string' ? slugArr[0] : undefined;
  const slugLower = venue ? venue.toLowerCase() : undefined;
  const pathLower = slugArr
    .filter((s): s is string => typeof s === 'string')
    .map((s) => s.toLowerCase())
    .join('/');

  // Apply dynamic metadata for any route under "/:venue/..." (first segment is venue)
  if (!venue) {
    return {
      title: 'iMenu.kg - ваше электронное меню!',
      description: 'iMenu.kg — ваше электронное меню!',
    };
  }

  try {
    const res = await fetch(`${API_BASE}venues/${encodeURIComponent(slugLower!)}/`, {
      headers: {
        // Server-side: default to RU to avoid localStorage access
        'Accept-Language': 'ru',
      },
      // Cache for 5 minutes to avoid hammering the API
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch venue');
    }

    const data = (await res.json()) as VenueResp;

    const title = data?.companyName
      ? `${data.companyName} — iMenu.kg`
      : 'iMenu.kg - ваше электронное меню!';
    const description =
      (data?.description && data.description.trim()) ||
      'iMenu.kg — ваше электронное меню!';
    const ogImages = data?.logo ? [{ url: data.logo }] : undefined;

    return {
      title,
      description,
      icons: {
        icon: data?.logo ? [data.logo] : ['/favicon.svg'],
      },
      openGraph: {
        title,
        description,
        images: ogImages,
        type: 'website',
        url: `https://imenu.kg/${pathLower}`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogImages?.[0]?.url,
      },
      alternates: {
        canonical: `/${pathLower}`,
      },
    };
  } catch {
    // Fallback to defaults on error
    return {
      title: 'iMenu.kg - ваше электронное меню!',
      description: 'iMenu.kg — ваше электронное меню!',
      icons: {
        icon: ['/favicon.svg'],
      },
    };
  }
}

export default function CatchAllNonOptionalPage() {
  return <ClientLegacyApp />;
}
