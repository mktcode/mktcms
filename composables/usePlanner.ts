export default function usePlanner() {
  const logo = useState('logo', () => '');
  const logoWidth = useState('logoWidth', () => 100);
  const title = useState('title', () => 'Markus Kottländer');
  const subtitle = useState('subtitle', () => 'Software und Internet');
  const slogan = useState('slogan', () => 'Ein Programmierer zum anfassen!');
  const description = useState('description', () => 'Ich biete Softwareentwicklung und Beratung bei Online-Projekten an.');
  const ctaType = useState('ctaType', () => 0);
  const phone = useState('phone', () => '');
  const email = useState('email', () => '');
  const link = useState('link', () => '');
  const keywords = useState('keywords', () => '');
  
  const showCtaButton = computed(() => {
    if (ctaType.value === 0 && phone.value) {
      return true;
    }

    if (ctaType.value === 1 && email.value) {
      return true;
    }

    if (ctaType.value === 2 && link.value) {
      return true;
    }

    return false;
  });

  const ctyTypes = [
    {
      id: 0,
      name: 'per Telefon',
    },
    {
      id: 1,
      name: 'per E-Mail',
    },
    {
      id: 2,
      name: 'Auf folgender Website',
    }
  ]

  return {
    logo,
    logoWidth,
    title,
    subtitle,
    slogan,
    description,
    ctaType,
    phone,
    email,
    link,
    keywords,
    showCtaButton,
    ctyTypes
  }
}