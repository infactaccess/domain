import type { MouseEvent } from 'react';

export const FACEBOOK_WEB_URL = 'https://web.facebook.com/nigeria.impact/';
export const FACEBOOK_APP_URL = `fb://facewebmodal/f?href=${encodeURIComponent(FACEBOOK_WEB_URL)}`;
export const INSTAGRAM_WEB_URL = 'https://www.instagram.com/accessinfact';
export const INSTAGRAM_APP_URL = 'instagram://user?username=accessinfact';
const WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029VbC3mY88fewpaFvPHx18';
export const WHATSAPP_WEB_URL = `https://wa.me/${WHATSAPP_CHANNEL}`;
export const WHATSAPP_APP_URL = `whatsapp://app?channel=${WHATSAPP_CHANNEL}`;

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
