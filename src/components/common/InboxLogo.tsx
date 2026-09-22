import React from 'react';

interface InboxLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'compact';
  badgeText?: string;
  showBadge?: boolean;
}

export const InboxLogo: React.FC<InboxLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
}) => {
  const widthMap = { sm: 140, md: 240, lg: 320, xl: 390 };

  return (
    <img
      src="/inbox-logo.svg"
      alt="Inbox Healthcare"
      width={widthMap[size]}
      height={Math.round(widthMap[size] / 3.545)}
      className={`inline-block h-auto max-w-full select-none ${className}`}
      style={{ maxWidth: '100%', ...(variant === 'icon-only' ? { width: widthMap.sm } : {}) }}
    />
  );
};
