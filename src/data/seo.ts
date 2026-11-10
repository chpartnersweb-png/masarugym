import { gym } from './gym';

export const seo = {
  title: '津市のボクシングジム｜まさるボクシングジム【三重県】',
  description: '三重県津市東丸之内のまさるボクシングジム。公式試合への挑戦から、ダイエット・体力づくり・ストレス解消まで。REレギュラーコースは予約不要・通い放題、毎回ミット打ちなどの指導付。料金・入会方法・体験予約・会員専用駐車場をご案内します。',
  socialImageAlt: 'まさるボクシングジム｜DO IT!! FOR YOURSELF。グローブを構えるボクサーのイメージビジュアル。',
};

export function createStructuredData(canonical: string) {
  const businessId = `${canonical}#gym`;
  const websiteId = `${canonical}#website`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ExerciseGym',
        '@id': businessId,
        name: gym.name,
        url: canonical,
        description: '三重県津市東丸之内のボクシングジム。公式試合を目指すトレーニングのほか、ダイエット・体力づくり・ストレス解消に対応。火曜・祝日休館、試合日などで不定休あり。',
        telephone: gym.phone.replace(/^0/, '+81-'),
        email: gym.email,
        address: {
          '@type': 'PostalAddress',
          postalCode: gym.postalCode,
          addressRegion: gym.postalAddress.region,
          addressLocality: gym.postalAddress.locality,
          streetAddress: gym.postalAddress.street,
          addressCountry: 'JP',
        },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.name + ' ' + gym.address)}`,
        sameAs: [gym.instagram],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '17:00',
            closes: '21:30',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday', 'Sunday'],
            opens: '14:00',
            closes: '18:00',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: canonical,
        name: gym.name,
        inLanguage: 'ja',
        publisher: { '@id': businessId },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: seo.title,
        description: seo.description,
        inLanguage: 'ja',
        isPartOf: { '@id': websiteId },
        about: { '@id': businessId },
        mainEntity: { '@id': businessId },
      },
    ],
  };
}
