import { AppState } from 'react-native';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';

let initialized = false;

// iOS silently no-ops the ATT prompt if the app is not in the `.active` state.
// On cold launch, useEffect may fire while UIApplication is still `.inactive`
// (splash transitioning out), so we wait for the first `active` event before
// asking. Timeout protects against a launch that never reaches active.
function waitForActive(timeoutMs = 5000): Promise<void> {
  if (AppState.currentState === 'active') return Promise.resolve();
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      sub.remove();
      resolve();
    };
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') finish();
    });
    const timer = setTimeout(finish, timeoutMs);
  });
}

/**
 * Requests ATT permission (iOS 14+) and then initializes the Google Mobile Ads SDK.
 * Safe to call multiple times — only the first call performs work.
 */
export async function initializeAds(): Promise<void> {
  if (initialized) return;
  initialized = true;

  try {
    await waitForActive();
    const { status } = await getTrackingPermissionsAsync();
    if (status === 'undetermined') {
      await requestTrackingPermissionsAsync();
    }
  } catch (e) {
    if (__DEV__) console.warn('ATT request failed', e);
  }

  try {
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });
    await mobileAds().initialize();
  } catch {
    // Swallow init errors — the app should still be playable without ads
  }
}
