const { registerHook } = require('./integrationHooks');

const teardownCallbacks = [];

function registerLoggingHook(channel, formatter) {
  teardownCallbacks.push(
    registerHook(channel, (payload) => {
      if (process.env.ENABLE_INTEGRATION_LOGS === 'false') {
        return null;
      }
      const message = formatter(payload);
      if (message) {
        // eslint-disable-next-line no-console
        console.log(message);
      }
      return null;
    })
  );
}

registerLoggingHook('persistence:booking_created', (booking) => `Mock persistence adapter captured booking ${booking.bookingId}`);
registerLoggingHook('persistence:booking_updated', (booking) => `Mock persistence adapter updated booking ${booking.bookingId}`);
registerLoggingHook('payments:payment_recorded', (details) => `Mock payments webhook for booking ${details.bookingId} amount ${details.amount}`);
registerLoggingHook('analytics:inventory_reserved', (details) => `Inventory reserved for ${details.type}:${details.itemId} -> ${details.units}`);
registerLoggingHook('analytics:inventory_released', (details) => `Inventory released for ${details.type}:${details.itemId} -> ${details.units}`);

module.exports = {
  teardownCallbacks
};
