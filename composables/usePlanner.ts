export type Target = {
  title: string;
  subtitle: string;
  slogan: string;
  description: string;
  benefits: string[];
  ctaType: number;
  phone: string;
  domain: string
  email: string;
  link: string;
  keywords: string;
  color: string;
}

const googleEmailProviders = ['gmail.com', 'googlemail.com'];
const knownEmailProviders = ['web.de', 'gmx.de', 'yahoo.de', 'outlook.de', 'hotmail.de', 't-online.de', 'freenet.de', 'arcor.de', 'aol.com', 'icloud.com', 'me.com', 'mac.com', 'live.de', 'live.com', 'msn.com'];

export default function usePlanner() {
  const logo = useState('logo', () => '');
  const logoWidth = useState('logoWidth', () => 100);
  const title = useState('title', () => 'Markus Kottländer');
  const subtitle = useState('subtitle', () => 'Software und Internet');
  const slogan = useState('slogan', () => 'Ein Programmierer zum anfassen!');
  const description = useState('description', () => 'Ich biete Softwareentwicklung und Beratung bei Online-Projekten an.');
  const benefits = useState<string[]>('benefits', () => []);
  const ctaType = useState('ctaType', () => 0);
  const phone = useState('phone', () => '');
  const domain = useState('domain', () => '');
  const email = useState('email', () => '');
  const emailIsGmail = computed(() => {
    return googleEmailProviders.includes(email.value.split('@')[1]);
  });
  const emailIsKnown = computed(() => {
    return knownEmailProviders.includes(email.value.split('@')[1]);
  });
  const link = useState('link', () => '');
  const keywords = useState('keywords', () => '');

  const targets = useState<Target[]>('targets', () => []);

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

  const ctaTypes = [
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

  function addTarget() {
    targets.value.push({
      title: title.value,
      subtitle: subtitle.value,
      slogan: slogan.value,
      description: description.value,
      benefits: benefits.value,
      ctaType: ctaType.value,
      phone: phone.value,
      domain: domain.value,
      email: email.value,
      link: link.value,
      keywords: keywords.value,
      color: '#000000',
    });
  }

  return {
    logo,
    logoWidth,
    title,
    subtitle,
    slogan,
    description,
    ctaType,
    phone,
    domain,
    email,
    emailIsGmail,
    emailIsKnown,
    link,
    keywords,
    showCtaButton,
    ctaTypes,
    targets,
    addTarget,
  }
}