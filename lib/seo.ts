const BASE = 'https://deposit.now';

export function breadcrumbJsonLd(path: string, title: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'deposit.now',
        item: BASE,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: `${BASE}${path}`,
      },
    ],
  };
}

export function pageGraph(
  pageJsonLd: Record<string, unknown>,
  path: string,
  title: string
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [pageJsonLd, breadcrumbJsonLd(path, title)],
  };
}