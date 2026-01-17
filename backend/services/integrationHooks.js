const channels = new Map();

function normalizeChannel(channel) {
  if (!channel || typeof channel !== 'string') {
    throw new Error('channel must be a non-empty string');
  }
  return channel.trim().toLowerCase();
}

function registerHook(channel, handler) {
  const normalized = normalizeChannel(channel);
  if (typeof handler !== 'function') {
    throw new Error('handler must be a function');
  }

  const currentListeners = channels.get(normalized) || new Set();
  currentListeners.add(handler);
  channels.set(normalized, currentListeners);

  return () => {
    currentListeners.delete(handler);
    if (!currentListeners.size) {
      channels.delete(normalized);
    }
  };
}

async function emitHook(channel, payload = {}, context = {}) {
  const normalized = normalizeChannel(channel);
  const listeners = channels.get(normalized);
  if (!listeners || !listeners.size) {
    return [];
  }

  const executions = Array.from(listeners).map((listener) =>
    Promise.resolve()
      .then(() => listener(payload, context))
      .catch((error) => {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn(`[integration-hooks:${normalized}] listener failed`, error);
        }
        return { error: error.message };
      })
  );

  return Promise.all(executions);
}

function listHooks() {
  return Array.from(channels.entries()).map(([channel, listeners]) => ({
    channel,
    listeners: listeners.size
  }));
}

function clearHooks() {
  channels.clear();
}

module.exports = {
  registerHook,
  emitHook,
  listHooks,
  clearHooks
};
