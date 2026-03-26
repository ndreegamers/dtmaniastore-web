/**
 * Generates a WhatsApp deep-link URL.
 *
 * - Generic (no product): uses the default message or a fallback.
 * - Product page: embeds product name and URL into the message.
 */
export function generateWhatsAppUrl(
  phoneNumber: string,
  productName?: string,
  productUrl?: string,
  defaultMessage?: string
): string {
  let message: string;

  if (productName && productUrl) {
    message = `¡Hola! Vi este producto en su web y me interesa: ${productName} — ${productUrl}`;
  } else if (defaultMessage && defaultMessage.trim()) {
    message = defaultMessage.trim();
  } else {
    message = '¡Hola! Estoy visitando su web y me interesa obtener información.';
  }

  const encoded = encodeURIComponent(message);
  // Normalize phone: strip spaces and leading +
  const phone = phoneNumber.replace(/\s/g, '').replace(/^\+/, '');
  return `https://wa.me/${phone}?text=${encoded}`;
}
