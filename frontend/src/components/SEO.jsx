import { Helmet } from 'react-helmet-async'

const defaults = {
  title: 'Vehicle Bookings',
  description: 'Manage vehicle bookings, track analytics, and handle customer data efficiently.',
  image: '/og-image.png',
  url: 'https://vehiclebookings.app',
}

export default function SEO({ title, description, image, url, keywords, noIndex }) {
  const pageTitle = title ? `${title} | ${defaults.title}` : defaults.title
  const desc = description || defaults.description
  const ogImage = image || defaults.image
  const ogUrl = url || defaults.url

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
