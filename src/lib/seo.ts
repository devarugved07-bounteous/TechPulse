import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { siteUrl } from "@/lib/utils";

export function defaultMetadata() {
  const url = siteUrl();
  return {
    metadataBase: new URL(url),
    title: {
      default: `${SITE_NAME} — Technology Intelligence`,
      template: `%s · ${SITE_NAME}`,
    },
    description: SITE_TAGLINE,
    openGraph: {
      title: SITE_NAME,
      description: SITE_TAGLINE,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}
