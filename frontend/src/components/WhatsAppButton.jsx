import React from 'react';

/**
 * Floating WhatsApp button — fixed bottom-right.
 * Opens wa.me chat in a new tab with a pre-filled message.
 */
const WHATSAPP_NUMBER = '916301851597'; // +91 6301851597 (Shathabdhi Organics)
const DEFAULT_MESSAGE = encodeURIComponent(
  "Hi Shathabdhi Organics! I'd like to know more about your products."
);

const WhatsAppButton = () => {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${DEFAULT_MESSAGE}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-testid="whatsapp-float-btn"
      className="hidden md:block fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 animate-ping"></span>
        {/* Main button */}
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe57] shadow-lg shadow-black/20 transition-all duration-300 group-hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-7 h-7 fill-white"
            aria-hidden="true"
          >
            <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.802 2.722.802.116 0 .244 0 .357-.043.616-.058 2.106-.83 2.378-1.39.115-.243.143-.515.143-.773 0-.057 0-.144-.014-.2-.6-.4-1.418-.85-1.844-1.36zM16 4C9.397 4 4 9.397 4 16c0 2.124.572 4.16 1.59 5.954L4.044 27.957l6.218-1.546A11.965 11.965 0 0 0 16 28c6.603 0 12-5.397 12-12S22.603 4 16 4zm0 21.97c-1.93 0-3.83-.515-5.474-1.504l-.4-.243-3.69.93.93-3.604-.244-.4A9.94 9.94 0 0 1 6 16c0-5.488 4.487-9.97 9.974-9.97 5.49 0 9.97 4.482 9.97 9.97s-4.48 9.97-9.97 9.97z" />
          </svg>
        </span>
        {/* Tooltip on hover */}
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap bg-stone-900 text-white text-xs tracking-wider uppercase px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat on WhatsApp
        </span>
      </div>
    </a>
  );
};

export default WhatsAppButton;
