import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

/**
 * AdMob unit IDs.
 *
 * IMPORTANT: Set USE_PRODUCTION_ADS to true ONLY for the final App Store build.
 * Real production ad unit IDs only serve ads after the app is published on the
 * App Store and the AdMob app has been approved — local Release builds will
 * receive "No Fill" responses and show nothing. Keep this false during all
 * TestFlight / local testing.
 */
const USE_PRODUCTION_ADS = true;

const PROD_BANNER_IOS = 'ca-app-pub-6637778639316730/1388480778';

export const AD_UNIT_IDS = {
  banner: USE_PRODUCTION_ADS
    ? Platform.select({
        ios: PROD_BANNER_IOS,
        android: TestIds.BANNER, // TODO: replace with Android banner unit ID
        default: TestIds.BANNER,
      })!
    : TestIds.BANNER,
};
