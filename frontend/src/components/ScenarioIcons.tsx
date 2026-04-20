import type { ReactNode } from 'react';

import type { EventIconName } from '@/types';

type IconProps = {
  className?: string;
};

function BaseIcon({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function EventIcon({
  name,
  className = 'h-5 w-5',
}: IconProps & { name: EventIconName }) {
  switch (name) {
    case 'baby':
      return (
        <BaseIcon className={className}>
          <path d="M9 4h6" />
          <path d="M10 4v3a2 2 0 0 0 4 0V4" />
          <path d="M8 10.5a4 4 0 0 1 8 0V15a4 4 0 0 1-8 0z" />
          <path d="M10 19h4" />
          <path d="M11 15.5h2" />
        </BaseIcon>
      );
    case 'marriage':
      return (
        <BaseIcon className={className}>
          <circle cx="9" cy="13" r="4" />
          <circle cx="15" cy="13" r="4" />
          <path d="M9 5l.8-1.6a1.4 1.4 0 0 1 2.4 0L13 5" />
          <path d="M11 5h2" />
        </BaseIcon>
      );
    case 'divorce':
      return (
        <BaseIcon className={className}>
          <circle cx="9" cy="13" r="4" />
          <circle cx="15" cy="13" r="4" />
          <path d="M7 6l10 12" />
        </BaseIcon>
      );
    case 'move':
      return (
        <BaseIcon className={className}>
          <path d="M4 11.5L12 5l8 6.5" />
          <path d="M6.5 10.5V19h11v-8.5" />
          <path d="M10 19v-4.5h4V19" />
          <path d="M4 19h16" />
        </BaseIcon>
      );
    case 'income':
      return (
        <BaseIcon className={className}>
          <ellipse cx="12" cy="6.5" rx="5.5" ry="2.5" />
          <path d="M6.5 6.5v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4" />
          <path d="M6.5 10.5v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4" />
        </BaseIcon>
      );
    case 'esi_loss':
      return (
        <BaseIcon className={className}>
          <path d="M8 7.5h8" />
          <path d="M10 7.5V6a2 2 0 0 1 4 0v1.5" />
          <rect x="5" y="7.5" width="14" height="10.5" rx="2" />
          <path d="M8 12.75l8 0" />
          <path d="M12 10l0 5.5" />
        </BaseIcon>
      );
    default:
      return null;
  }
}

export function CoverageIcon({
  type,
  className = 'h-5 w-5',
}: IconProps & { type: string | null }) {
  switch (type) {
    case 'ESI':
      return (
        <BaseIcon className={className}>
          <path d="M8 7.5h8" />
          <path d="M10 7.5V6a2 2 0 0 1 4 0v1.5" />
          <rect x="5" y="7.5" width="14" height="10.5" rx="2" />
          <path d="M10 12.5h4" />
        </BaseIcon>
      );
    case 'Medicaid':
      return (
        <BaseIcon className={className}>
          <path d="M12 4.5l6 2.5v4.75c0 3.8-2.4 6.95-6 8.25-3.6-1.3-6-4.45-6-8.25V7z" />
          <path d="M12 9v5" />
          <path d="M9.5 11.5h5" />
        </BaseIcon>
      );
    case 'CHIP':
      return (
        <BaseIcon className={className}>
          <circle cx="12" cy="8" r="2.5" />
          <path d="M8.5 18c.6-2.6 2.1-4 3.5-4s2.9 1.4 3.5 4" />
          <path d="M6 19h12" />
        </BaseIcon>
      );
    case 'Marketplace':
      return (
        <BaseIcon className={className}>
          <path d="M5.5 8.5h13l-1.2 8H7z" />
          <path d="M9 8.5a3 3 0 0 1 6 0" />
          <path d="M9.5 12.5h5" />
        </BaseIcon>
      );
    default:
      return (
        <BaseIcon className={className}>
          <circle cx="12" cy="12" r="7" />
          <path d="M9.5 12h5" />
        </BaseIcon>
      );
  }
}
