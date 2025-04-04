import type { z } from "zod";
import type { Website, WebsiteContent, websiteContentFormSchema, websiteFormSchema } from "~/types";

type WebsiteSchema = z.output<typeof websiteFormSchema>
type WebsiteContentSchema = z.output<typeof websiteContentFormSchema>
export type NestedWebsiteFormSchema = Partial<WebsiteSchema & { id: number, contents: Partial<WebsiteContentSchema>[] }>
type WebsiteWithContents = Website & { contents: WebsiteContent[] }

export default function useWebsiteState(website?: WebsiteWithContents) {
  const state = useState<NestedWebsiteFormSchema>('websiteState', () => ({
    id: website?.id,
    image: website?.image || '',
    title: website?.title || '',
    subtitle: website?.subtitle || '',
    description: website?.description || '',
    domain: website?.domain || '',
    path: website?.path || '/',
    isOnline: !!website?.isOnline,
    showMenu: !!website?.showMenu,
    hasContactForm: !!website?.hasContactForm,
    contactFormSubject: website?.contactFormSubject || 'Anfrage',
    contactFormTitle: website?.contactFormTitle || 'Kontakt',
    contactFormText: website?.contactFormText || 'Wir sind werktags von 9 bis 17 Uhr für Sie da.',
    headerVariant: website?.headerVariant || 0,
    showAbout: !!website?.showAbout,
    aboutImage: website?.aboutImage || '',
    aboutTitle: website?.aboutTitle || '',
    aboutSubtitle: website?.aboutSubtitle || '',
    aboutText: website?.aboutText || '',
    showContents: !!website?.showContents,
    contents: website?.contents || [],
    primaryColor: website?.primaryColor || availableColors.value[9].value,
    font: website?.font || 'roboto',
  }))

  return {
    state
  }
}