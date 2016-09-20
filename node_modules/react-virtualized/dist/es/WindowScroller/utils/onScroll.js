var mountedInstances = [];
var originalBodyPointerEvents = null;
var disablePointerEventsTimeoutId = null;

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export var IS_SCROLLING_TIMEOUT = 150;

function enablePointerEventsIfDisabled() {
  if (disablePointerEventsTimeoutId) {
    disablePointerEventsTimeoutId = null;

    document.body.style.pointerEvents = originalBodyPointerEvents;

    originalBodyPointerEvents = null;
  }
}

function enablePointerEventsAfterDelayCallback() {
  enablePointerEventsIfDisabled();
  mountedInstances.forEach(function (component) {
    return component._enablePointerEventsAfterDelayCallback();
  });
}

function enablePointerEventsAfterDelay() {
  if (disablePointerEventsTimeoutId) {
    clearTimeout(disablePointerEventsTimeoutId);
  }

  disablePointerEventsTimeoutId = setTimeout(enablePointerEventsAfterDelayCallback, IS_SCROLLING_TIMEOUT);
}

function onScrollWindow(event) {
  if (originalBodyPointerEvents == null) {
    originalBodyPointerEvents = document.body.style.pointerEvents;

    document.body.style.pointerEvents = 'none';

    enablePointerEventsAfterDelay();
  }
  mountedInstances.forEach(function (component) {
    return component._onScrollWindow(event);
  });
}

export function registerScrollListener(component) {
  if (!mountedInstances.length) {
    window.addEventListener('scroll', onScrollWindow);
  }
  mountedInstances.push(component);
}

export function unregisterScrollListener(component) {
  mountedInstances = mountedInstances.filter(function (c) {
    return c !== component;
  });
  if (!mountedInstances.length) {
    window.removeEventListener('scroll', onScrollWindow);
    if (disablePointerEventsTimeoutId) {
      clearTimeout(disablePointerEventsTimeoutId);
      enablePointerEventsIfDisabled();
    }
  }
}