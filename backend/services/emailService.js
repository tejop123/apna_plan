const nodemailer = require('nodemailer');

// Create transporter based on environment
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  // For production, consider using OAuth2 or other secure methods
  ...(process.env.EMAIL_HOST && {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
});

/**
 * Send booking confirmation email
 */
async function sendBookingConfirmation(userEmail, booking) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: userEmail,
    subject: `Booking Confirmation - ${booking.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1890ff;">Booking Confirmed! ✓</h2>
          <p>Dear ${booking.traveler.name},</p>
          <p>Your ${booking.bookingType} booking has been confirmed.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Type:</strong> ${booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)}</p>
            <p><strong>Amount:</strong> ₹${booking.netAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
            ${booking.travelDate ? `<p><strong>Travel Date:</strong> ${new Date(booking.travelDate).toLocaleDateString()}</p>` : ''}
          </div>

          <div style="margin: 20px 0;">
            <h3>Next Steps</h3>
            <ul>
              <li>Check your email for ticket details</li>
              <li>Download your ticket from our app</li>
              <li>Arrive 2 hours early for flights</li>
            </ul>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            For support, contact: support@apnaplan.com
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send payment success email
 */
async function sendPaymentSuccess(userEmail, booking, transaction) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: userEmail,
    subject: `Payment Received - ${booking.bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #52c41a;">Payment Successful ✓</h2>
          <p>Dear ${booking.traveler.name},</p>
          <p>Your payment has been processed successfully.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Payment Details</h3>
            <p><strong>Amount Paid:</strong> ₹${transaction.amount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${transaction.paymentMethod}</p>
            <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
            <p><strong>Date:</strong> ${new Date(transaction.createdAt).toLocaleString()}</p>
          </div>

          <p>Your booking is now confirmed. You will receive ticket details shortly.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Payment success email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send payment success email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send booking reminder email
 */
async function sendBookingReminder(userEmail, booking) {
  const daysUntilTravel = Math.ceil(
    (new Date(booking.travelDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: userEmail,
    subject: `Reminder: Your ${booking.bookingType} trip is in ${daysUntilTravel} days`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #faad14;">Trip Reminder 📅</h2>
          <p>Dear ${booking.traveler.name},</p>
          <p>Your trip is coming up in ${daysUntilTravel} days!</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Travel Details</h3>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Travel Date:</strong> ${new Date(booking.travelDate).toLocaleDateString()}</p>
            <p><strong>Type:</strong> ${booking.bookingType}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3>Important Reminders</h3>
            <ul>
              <li>Download your ticket from our app</li>
              <li>Check weather and pack accordingly</li>
              <li>Reach the station/airport 2 hours early</li>
              <li>Keep your booking reference handy</li>
            </ul>
          </div>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Booking reminder email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send booking reminder email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send review request email
 */
async function sendReviewRequest(userEmail, booking) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: userEmail,
    subject: `Rate your ${booking.bookingType} experience`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1890ff;">How was your trip? ⭐</h2>
          <p>Dear ${booking.traveler.name},</p>
          <p>We'd love to hear about your travel experience! Your feedback helps us improve our services.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/reviews/${booking.bookingId}" 
               style="background-color: #1890ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Leave a Review
            </a>
          </div>

          <p>Share your experience and help other travelers make informed decisions.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Review request email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send review request email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send promotional/offer email
 */
async function sendPromotionalEmail(userEmail, subject, content) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: userEmail,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          ${content}
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            You received this email because you're subscribed to our newsletter.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Promotional email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send promotional email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify email transporter connection
 */
async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log('Email transporter verified successfully');
    return true;
  } catch (error) {
    console.error('Email transporter verification failed:', error);
    return false;
  }
}

module.exports = {
  sendBookingConfirmation,
  sendPaymentSuccess,
  sendBookingReminder,
  sendReviewRequest,
  sendPromotionalEmail,
  verifyTransporter
};
