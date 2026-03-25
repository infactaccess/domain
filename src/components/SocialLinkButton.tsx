'use client';

import type { ReactNode } from 'react';
import { handleSocialLinkClick } from '@/lib/social';

type SocialLinkButtonProps = {
  href: string;
  appUrl?: string;
  className?: string;
  children: ReactNode;
};

export default function SocialLinkButton({
  href,
  appUrl,
  className,
  children,
}: SocialLinkButtonProps) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => handleSocialLinkClick(event, href, appUrl)}
    >
      {children}
    </a>
  );
}
