const base = import.meta.env.BASE_URL

export const links = [
  {
    title: 'delaFun',
    logo: base + 'logo-delafun.png',
    url: 'https://www.facebook.com/delafunofficial',
    label: '@delafun',
    image: base + 'thumbnails/delafun.jpg',
    position: '50% 50%',
    socials: [
      { name: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/delafunofficial' },
      { name: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/delafunofficial/' },
      { name: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@delafun8801' }
    ]
  },
  {
    title: 'Depozit Fotovoltaice',
    subtitle: 'Magazin online',
    url: 'https://depozit-fotovoltaice.ro/',
    label: 'depozit-fotovoltaice.ro',
    image: base + 'thumbnails/depozit-fotovoltaice.jpg',
    position: '50% 50%'
  }
]
