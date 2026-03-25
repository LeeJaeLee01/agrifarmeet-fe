import React from 'react';

type MessengerFloatingButtonProps = {
  href?: string;
  ariaLabel?: string;
};

export default function MessengerFloatingButton({
  href = 'https://m.me/1023499277515849',
  ariaLabel = 'Mở Messenger để chat',
}: MessengerFloatingButtonProps) {
  return (
    <a
      className="messenger-fab"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <span className="messenger-fab__ring" aria-hidden="true" />
      <span className="messenger-fab__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.07 2 11.1c0 2.87 1.47 5.45 3.76 7.16V22l3.43-1.88c.9.25 1.85.38 2.81.38 5.52 0 10-4.07 10-9.1S17.52 2 12 2Zm1.05 12.23-2.55-2.72-4.98 2.72 5.47-5.81 2.49 2.72 5.04-2.72-5.47 5.81Z"
          />
        </svg>
      </span>
    </a>
  );
}

