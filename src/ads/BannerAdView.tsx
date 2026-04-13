import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from './ids';

/**
 * Approximate height of an ANCHORED_ADAPTIVE_BANNER on iPhone.
 * Screens should leave at least `AD_BANNER_HEIGHT + safe-area bottom` of
 * clearance above the banner so foreground controls don't overlap it.
 */
export const AD_BANNER_HEIGHT = 60;

/**
 * Adaptive banner placed at the bottom of a screen.
 * Respects the bottom safe area so the banner doesn't clip under the
 * iPhone home indicator. Renders invisibly until the ad has loaded.
 */
export default function BannerAdView() {
  const insets = useSafeAreaInsets();
  const [loaded, setLoaded] = useState(false);

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom }]}
      pointerEvents="box-none"
    >
      <View style={[styles.bannerWrap, !loaded && styles.hidden]}>
        <BannerAd
          unitId={AD_UNIT_IDS.banner}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => {
            console.log('[AdMob] Banner loaded');
            setLoaded(true);
          }}
          onAdFailedToLoad={(error) => {
            console.warn('[AdMob] Banner failed to load:', error?.message ?? error);
            setLoaded(false);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bannerWrap: {
    alignItems: 'center',
  },
  hidden: {
    opacity: 0,
  },
});
