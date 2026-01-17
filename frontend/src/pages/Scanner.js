import { BrowserMultiFormatReader } from '@zxing/browser';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import travelApi from '../services/travelApi';

function parseBookingIdFromPayload(text) {
  if (!text) return null;

  // Try UPI intent: upi://pay?...&tr=BOOKING_ID
  try {
    const url = new URL(text);
    const tr = url.searchParams.get('tr');
    if (tr) return tr;
    const tn = url.searchParams.get('tn');
    if (tn && tn.toLowerCase().startsWith('booking-')) {
      return tn.replace(/^booking-/i, '').trim();
    }
  } catch (e) {
    // Not a URL, fall back to raw text
  }

  // If QR has just the bookingId
  const trimmed = String(text).trim();
  if (trimmed.length >= 8) {
    return trimmed;
  }
  return null;
}

function StatusPill({ label, tone }) {
  const toneClass = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-sky-100 text-sky-700',
    danger: 'bg-red-100 text-red-700'
  }[tone || 'info'];
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClass}`}>{label}</span>;
}

function BookingScanner({ embedded = false, initialBookingId = '' }) {
  const [scanResult, setScanResult] = useState('');
  const [booking, setBooking] = useState(null);
  const [upiIntent, setUpiIntent] = useState('');
  const [qr, setQr] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const lastScanRef = useRef('');

  const handleScan = useCallback(async (text) => {
    if (!text) return;
    if (text === lastScanRef.current) return;
    lastScanRef.current = text;
    const bookingId = parseBookingIdFromPayload(text);
    setScanResult(text);
    if (!bookingId) {
      setError('Could not detect booking id in this code');
      setBooking(null);
      setUpiIntent('');
      setQr('');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await travelApi.getBooking(bookingId);
      setBooking(data.booking);
      setUpiIntent(data.upiIntent || '');
      setQr(data.qr || '');
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to fetch booking details.';
      setError(message);
      setBooking(null);
      setUpiIntent('');
      setQr('');
    } finally {
      setLoading(false);
    }
  }, []);

  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!initialBookingId) return;
    setLoading(true);
    travelApi
      .getBooking(initialBookingId)
      .then((data) => {
        setBooking(data.booking);
        setUpiIntent(data.upiIntent || '');
        setQr(data.qr || '');
      })
      .catch((err) => {
        const message = err?.response?.data?.message || 'Unable to fetch booking details.';
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [initialBookingId]);

  useEffect(() => {
    if (!videoRef.current) return undefined;
    if (isScanning) return undefined;

    const codeReader = new BrowserMultiFormatReader();
    setIsScanning(true);

    codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
      if (result?.getText) {
        handleScan(result.getText());
      }
      if (err && err?.name !== 'NotFoundException') {
        setError(err.message || 'Camera access failed');
      }
    });

    return () => {
      codeReader.reset();
      setIsScanning(false);
    };
  }, [handleScan, isScanning]);

  const paymentStatusTone = useMemo(() => {
    if (!booking) return 'info';
    if (booking.paymentStatus === 'completed') return 'success';
    if (booking.paymentStatus === 'pending') return 'warning';
    return 'info';
  }, [booking]);

  return (
    <div className={embedded ? 'space-y-6' : 'page-shell bg-white py-12'}>
      <div className={embedded ? 'space-y-6' : 'page-container max-w-4xl space-y-6'}>
        {!embedded && (
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">UPI / Booking Scanner</h1>
            <p className="mt-2 text-sm text-slate-600">Scan a UPI QR (with booking reference) or a booking QR to pull payment status and details.</p>
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div className="relative overflow-hidden rounded-xl bg-black">
            <video ref={videoRef} className="w-full" playsInline muted />
          </div>
        </div>

        {scanResult && (
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-xs text-slate-700 break-all">
            <p className="font-semibold">Last scan:</p>
            <p>{scanResult}</p>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {loading && <p className="text-sm text-slate-500">Fetching booking…</p>}

        {booking && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Booking</p>
                <h2 className="text-xl font-semibold text-slate-900">{booking.bookingId}</h2>
                <p className="text-sm text-slate-600">{booking.bookingType?.toUpperCase()} · {booking.itemId}</p>
              </div>
              <StatusPill label={`Payment: ${booking.paymentStatus || 'pending'}`} tone={paymentStatusTone} />
            </div>

            <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <div>
                <p className="font-semibold text-slate-900">Traveler</p>
                <p>{booking.traveler?.name}</p>
                <p className="text-slate-600">{booking.traveler?.email}</p>
                {booking.traveler?.phone && <p className="text-slate-600">{booking.traveler.phone}</p>}
              </div>
              <div>
                <p className="font-semibold text-slate-900">Amount</p>
                <p>Base: ₹{booking.amount}</p>
                {booking.discountAmount !== undefined && <p>Discount: ₹{booking.discountAmount}</p>}
                <p className="font-semibold">Payable: ₹{booking.netAmount ?? booking.amount}</p>
              </div>
            </div>

            {upiIntent && (
              <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="text-sm font-semibold text-indigo-900">UPI Intent</p>
                <p className="mt-1 break-all text-xs text-indigo-800">{upiIntent}</p>
                <a
                  href={upiIntent}
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                >
                  Open UPI app
                </a>
                {qr && (
                  <div className="mt-3 flex flex-col items-start gap-2">
                    <p className="text-xs font-semibold text-indigo-900">QR (tap to enlarge):</p>
                    <img src={qr} alt="Booking QR" className="h-40 w-40 rounded-xl border border-indigo-200 bg-white p-2 shadow" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingScanner;
