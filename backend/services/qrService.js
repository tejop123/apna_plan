const QRCode = require('qrcode');

async function generateBookingQr({ bookingId, upiIntent }) {
  const payload = upiIntent || bookingId;
  if (!payload) return null;
  try {
    const dataUrl = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M', margin: 1, scale: 6 });
    return dataUrl;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Failed to generate QR', error.message);
    }
    return null;
  }
}

module.exports = { generateBookingQr };
