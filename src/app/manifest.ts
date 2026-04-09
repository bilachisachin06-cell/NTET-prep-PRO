import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NTET Prep Pro',
    short_name: 'NTET Pro',
    description: 'Advanced preparation portal for National Teachers Eligibility Test.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ECEFF1',
    theme_color: '#64B5F6',
    orientation: 'portrait',
    icons: [
      {
        src: 'https://picsum.photos/seed/ntet-app/192/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'https://picsum.photos/seed/ntet-app/192/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://picsum.photos/seed/ntet-app/512/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'https://picsum.photos/seed/ntet-app/512/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['education', 'medical', 'books'],
    shortcuts: [
      {
        name: 'Study Material',
        short_name: 'Study',
        description: 'Open Study Material',
        url: '/notes',
        icons: [{ src: 'https://picsum.photos/seed/notes/192/192', sizes: '192x192' }]
      },
      {
        name: 'Smart Practice',
        short_name: 'Practice',
        description: 'Open Smart Practice Hub',
        url: '/smart-practice',
        icons: [{ src: 'https://picsum.photos/seed/practice/192/192', sizes: '192x192' }]
      },
      {
        name: 'Mock Tests',
        short_name: 'Tests',
        description: 'Open Mock Tests',
        url: '/tests',
        icons: [{ src: 'https://picsum.photos/seed/tests/192/192', sizes: '192x192' }]
      }
    ],
    screenshots: [
      {
        src: 'https://picsum.photos/seed/screenshot1/1080/1920',
        type: 'image/png',
        sizes: '1080x1920',
        label: 'Dashboard of NTET Prep Pro',
        form_factor: 'narrow'
      }
    ]
  };
}
