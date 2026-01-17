import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useMemo, useState } from 'react';
import BookingScanner from '../pages/Scanner';
import travelApi from '../services/travelApi';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  passengers: 1,
  notes: ''
};

const extractAmountFromSummary = (summary = []) => {
  const priceRow = summary.find((row) => /price|total|fare|amount/i.test(row.label || ''));
  const valueText = priceRow?.value || '';
  const normalized = String(valueText).replace(/[^0-9.]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

function BookingPanel({ item, bookingType, summary = [], onClose, onSuccess }) {
  const [formState, setFormState] = useState(initialFormState);
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentReference, setPaymentReference] = useState('');
  const [confirmedBookingId, setConfirmedBookingId] = useState('');

  useEffect(() => {
    if (item) {
      setFormState((prev) => ({ ...initialFormState, passengers: prev.passengers || 1 }));
      setStatus({ loading: false, message: '', error: '' });
      setPaymentStatus('pending');
      setPaymentReference('');
      setConfirmedBookingId('');
    }
  }, [item]);

  const payableAmount = useMemo(() => {
    const amountFromSummary = extractAmountFromSummary(summary);
    const fallback = Number(item?.price || item?.pricePerNight || 0);
    return amountFromSummary || (Number.isFinite(fallback) ? fallback : 0);
  }, [item, summary]);

  const paymentReady = useMemo(() => {
    return Boolean(formState.name.trim() && formState.email.trim());
  }, [formState.email, formState.name]);

  const upiPayload = useMemo(() => {
    const amountParam = payableAmount > 0 ? payableAmount.toFixed(2) : '';
    const note = encodeURIComponent(`Booking ${item?._id || ''}`.trim());
    return `upi://pay?pa=apnaplan@upi&pn=Apna%20Plan&cu=INR${amountParam ? `&am=${amountParam}` : ''}${note ? `&tn=${note}` : ''}`;
  }, [item, payableAmount]);

  if (!item) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: '', error: '' });

    try {
      const paymentDetails = {
        method: paymentMethod,
        status: paymentStatus === 'paid' ? 'completed' : 'pending',
        reference: paymentReference.trim(),
        amount: payableAmount
      };

      const booking = await travelApi.createBooking({
        bookingType,
        itemId: item._id,
        passengers: Math.max(1, Number(formState.passengers) || 1),
        traveler: {
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          notes: formState.notes
        },
        notes: formState.notes,
        amount: payableAmount,
        metadata: { summary, payment: paymentDetails }
      });

      if (paymentDetails.status === 'completed') {
        await travelApi.recordBookingPayment(booking.bookingId, {
          amount: payableAmount,
          paymentReference: paymentDetails.reference
        });
      }

      setStatus({ loading: false, message: `Booking ${booking.bookingId} confirmed`, error: '' });
      setConfirmedBookingId(booking.bookingId);
      onSuccess?.(booking);
    } catch (error) {
      setStatus({
        loading: false,
        message: '',
        error: error.response?.data?.message || 'Unable to confirm booking right now.'
      });
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Booking summary</p>
          <h3 className="text-lg font-semibold text-slate-900">{bookingType} reference #{item._id}</h3>
          <dl className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
            {summary.map((row) => (
              <div key={row.label}>
                <dt className="text-xs uppercase tracking-widest text-slate-400">{row.label}</dt>
                <dd className="font-semibold text-slate-900">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-500 transition hover:border-slate-300 hover:text-slate-900">
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Full name
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Phone (optional)
          <input
            type="tel"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Travelers
          <input
            type="number"
            min="1"
            name="passengers"
            value={formState.passengers}
            onChange={handleChange}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
          />
        </label>
        <label className="md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Notes</span>
          <textarea
            name="notes"
            rows="3"
            value={formState.notes}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
            placeholder="Share special requests, meal preferences or pickup instructions"
          />
        </label>

          <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Payment</p>
                <p className="text-sm text-slate-700">Fill name and email to unlock payment options for flights, trains, buses and hotels.</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Payable</p>
                <p className="text-lg font-semibold text-slate-900">{payableAmount ? `INR ${payableAmount.toLocaleString('en-IN')}` : 'TBD'}</p>
              </div>
            </div>

            {!paymentReady && (
              <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Add traveler name and email to continue to payment options.
              </div>
            )}

            <div className={`mt-4 space-y-4 ${paymentReady ? '' : 'pointer-events-none opacity-60 blur-[1px]'}`}>
              <div className="flex flex-wrap gap-2">
                {['upi', 'card', 'netbanking', 'wallet'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] transition ${
                      paymentMethod === method
                        ? 'border-indigo-400 bg-white text-indigo-600 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {method === 'upi'
                      ? 'UPI / QR'
                      : method === 'card'
                        ? 'Card'
                        : method === 'netbanking'
                          ? 'Netbanking'
                          : 'Wallet'}
                  </button>
                ))}
              </div>

              {paymentMethod === 'upi' && (
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-800">Scan and pay</p>
                    <p className="text-xs text-slate-600">Use any UPI app to scan the code. You can also open the link directly.</p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-white px-3 py-1 font-semibold text-indigo-600">apnaplan@upi</span>
                      {payableAmount > 0 && <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-700">INR {payableAmount.toLocaleString('en-IN')}</span>}
                    </div>
                    <a
                      href={upiPayload}
                      className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                    >
                      Open in UPI app
                    </a>
                  </div>
                  <div className="mx-auto rounded-3xl bg-white p-3 shadow-inner">
                    <QRCodeCanvas value={upiPayload} size={152} bgColor="#ffffff" fgColor="#111827" />
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                    Cardholder name
                    <input className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 focus:border-indigo-500 focus:outline-none" placeholder="Name on card" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                    Card number
                    <input className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 focus:border-indigo-500 focus:outline-none" placeholder="0000 1111 2222 3333" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                    Expiry
                    <input className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 focus:border-indigo-500 focus:outline-none" placeholder="MM/YY" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                    CVV
                    <input className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 focus:border-indigo-500 focus:outline-none" placeholder="123" />
                  </label>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-800">Pay via Netbanking</p>
                  <p className="mt-1 text-xs text-slate-600">We will redirect you to your bank&apos;s secure gateway after placing the booking.</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                    {['HDFC', 'ICICI', 'SBI', 'Axis'].map((bank) => (
                      <span key={bank} className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                        {bank}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-800">Pay with wallet</p>
                  <p className="mt-1 text-xs text-slate-600">Use supported wallets or saved credits during payment confirmation.</p>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2 md:items-end">
                <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                  UPI / bank reference (optional)
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(event) => setPaymentReference(event.target.value)}
                    placeholder="Enter transaction / UTR"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </label>
                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Payment status</span>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase ${
                      paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus((prev) => (prev === 'paid' ? 'pending' : 'paid'))}
                    className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      paymentStatus === 'paid'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {paymentStatus === 'paid' ? 'Mark as pending' : 'I scanned and paid'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        <div className="md:col-span-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-600">
            {status.message && <span className="text-emerald-600">{status.message}</span>}
            {status.error && <span className="text-rose-600">{status.error}</span>}
          </div>
          <button
            type="submit"
            disabled={status.loading}
            className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-400"
          >
            {status.loading ? 'Locking your seats...' : 'Confirm booking'}
          </button>
        </div>

        {confirmedBookingId && (
          <div className="md:col-span-2 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Ticket confirmation</p>
            <p className="mt-1 text-sm text-emerald-700">Scan a booking or UPI QR to verify payment status and view the ticket details.</p>
            <div className="mt-4">
              <BookingScanner embedded initialBookingId={confirmedBookingId} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default BookingPanel;
