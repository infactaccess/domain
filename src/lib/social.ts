import type { MouseEvent } from 'react';

export const FACEBOOK_WEB_URL = 'https://web.facebook.com/nigeria.impact/';
export const FACEBOOK_APP_URL = `fb://facewebmodal/f?href=${encodeURIComponent(FACEBOOK_WEB_URL)}`;
export const INSTAGRAM_WEB_URL = 'https://www.instagram.com/impact_nigeria_';
export const INSTAGRAM_APP_URL = 'instagram://user?username=impact_nigeria_';
const WHATSAPP_PHONE = '+447539487898';
export const WHATSAPP_WEB_URL = `https://wa.me/${WHATSAPP_PHONE}`;
export const WHATSAPP_APP_URL = `whatsapp://send?phone=${WHATSAPP_PHONE}`;

function isMobileDevice() {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent || navigator.vendor;
  return /android|iphone|ipad|ipod|mobile/i.test(userAgent);
}

export function handleSocialLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  webUrl: string,
  appUrl?: string
) {
  if (!isMobileDevice()) {
    return;
  }

  if (!appUrl) {
    return;
  }

  event.preventDefault();

  const fallbackTimer = window.setTimeout(() => {
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  }, 700);

  const clearFallback = () => {
    window.clearTimeout(fallbackTimer);
    window.removeEventListener('pagehide', clearFallback);
    window.removeEventListener('blur', clearFallback);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      clearFallback();
    }
  };

  window.addEventListener('pagehide', clearFallback, { once: true });
  window.addEventListener('blur', clearFallback, { once: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);

  window.location.href = appUrl;
}

export function handleWhatsAppLinkClick(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();

  const fallbackTimer = window.setTimeout(() => {
    window.open(WHATSAPP_WEB_URL, '_blank', 'noopener,noreferrer');
  }, 700);

  const clearFallback = () => {
    window.clearTimeout(fallbackTimer);
    window.removeEventListener('pagehide', clearFallback);
    window.removeEventListener('blur', clearFallback);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      clearFallback();
    }
  };

  window.addEventListener('pagehide', clearFallback, { once: true });
  window.addEventListener('blur', clearFallback, { once: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);

  window.location.href = WHATSAPP_APP_URL;
}
