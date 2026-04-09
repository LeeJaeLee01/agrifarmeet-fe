import React, { useEffect, useRef, useState } from 'react';

type MessengerFloatingButtonProps = {
  messengerHref?: string;
  zaloHref?: string;
};

export default function MessengerFloatingButton({
  messengerHref = 'https://m.me/1023499277515849',
  zaloHref = 'https://zalo.me/2768914139305378370',
}: MessengerFloatingButtonProps) {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const stackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!stackRef.current) return;
      if (!stackRef.current.contains(event.target as Node)) {
        setShowContactInfo(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="chat-fab-stack" aria-label="Chat shortcuts" ref={stackRef}>
      {showContactInfo ? (
        <div className="chat-fab-contact-tab" role="note" aria-label="Thông tin liên hệ">
          <p><strong>Công ty TNHH Agrifarmeet</strong></p>
          <p>MST: 0111166829</p>
          <p>DC: 20 Vo Chi Cong, phuong Tay Ho, Ha Noi</p>
          <p>Email: contact@agrifarmeet.vn</p>
          <p>SDT: 0981817189</p>
        </div>
      ) : null}

      <button
        className="chat-fab chat-fab--hotline"
        type="button"
        aria-label="Xem thong tin lien he"
        title="Xem thong tin lien he"
        onClick={() => setShowContactInfo((v) => !v)}
      >
        <span className="chat-fab__ring" aria-hidden="true" />
        <span className="chat-fab__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path
              fill="currentColor"
              d="M6.62 10.79a15.9 15.9 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.28.56 3.49.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.21.19 2.39.56 3.49a1 1 0 0 1-.25 1.01l-2.19 2.29Z"
            />
          </svg>
        </span>
      </button>

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
        <img
          src={`${process.env.PUBLIC_URL || ''}/zalo.webp`}
          alt="Zalo"
          className="chat-fab__logo"
          draggable={false}
        />
      </a>
    </div>
  );
}

