import { Helmet } from 'react-helmet-async'

export default function SchemaOrg({ type = 'WebApplication', name, description, url }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: name || 'Vehicle Bookings',
    description: description || 'Manage vehicle bookings, track analytics, and handle customer data efficiently.',
    url: url || 'https://vehiclebookings.app',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
