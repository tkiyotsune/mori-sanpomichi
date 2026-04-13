import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';

let initialized = false;

/**
 * Requests ATT permission (iOS 14+) and then initializes the Google Mobile Ads SDK.
 * Safe to call multiple times — only the first call performs work.
 */
export async function initializeAds(): Promise<void> {
  if (initialized) return;
  initialized = true;

  try {
    const { status } = await getTrackingPermissionsAsync();
    if (status === 'undetermined') {
      await requestTrackingPermissionsAsync();
    }
  } catch {
    // ATT not available (e.g. simulator / older iOS) — continue without it
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
