import React from 'react';

type MessengerFloatingButtonProps = {
  messengerHref?: string;
  zaloHref?: string;
};

export default function MessengerFloatingButton({
  messengerHref = 'https://m.me/1023499277515849',
  zaloHref = 'https://zalo.me/2768914139305378370',
}: MessengerFloatingButtonProps) {
  return (
    <div className="chat-fab-stack" aria-label="Chat shortcuts">
      <a
        className="chat-fab chat-fab--messenger"
        href={messengerHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Mở Messenger để chat"
        title="Mở Messenger để chat"
      >
        <span className="chat-fab__ring" aria-hidden="true" />
        <span className="chat-fab__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.07 2 11.1c0 2.87 1.47 5.45 3.76 7.16V22l3.43-1.88c.9.25 1.85.38 2.81.38 5.52 0 10-4.07 10-9.1S17.52 2 12 2Zm1.05 12.23-2.55-2.72-4.98 2.72 5.47-5.81 2.49 2.72 5.04-2.72-5.47 5.81Z"
            />
          </svg>
        </span>
      </a>

      <a
        className="chat-fab chat-fab--zalo"
        href={zaloHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Mở Zalo để chat"
        title="Mở Zalo để chat"
      >
        <span className="chat-fab__ring" aria-hidden="true" />
        <span className="chat-fab__icon chat-fab__icon--zalo" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 0 0-6.2 17.8V22l2.7-1.5A10 10 0 1 0 12 2Zm4.7 13.1c-.2.6-.9 1.1-1.5 1.2-.4.1-.9.1-1.8-.1-.6-.2-1.4-.4-2.4-.9-2.1-1-3.5-2.9-3.6-3.1-.1-.2-.9-1.2-.9-2.3 0-1.1.6-1.7.8-1.9.2-.2.4-.2.6-.2h.4c.1 0 .3 0 .4.3.2.4.6 1.5.7 1.6.1.2.1.3 0 .5-.1.2-.1.3-.3.5-.1.1-.3.3-.4.4-.1.1-.2.3-.1.5.1.2.6 1.1 1.3 1.7.9.8 1.6 1 1.8 1.1.2.1.4.1.5-.1.2-.2.6-.7.7-.9.2-.2.3-.2.6-.1.2.1 1.4.7 1.7.8.3.1.4.2.5.3.0.1.0.6-.2 1.2Z"
            />
          </svg>
        </span>
      </a>
    </div>
  );
}

