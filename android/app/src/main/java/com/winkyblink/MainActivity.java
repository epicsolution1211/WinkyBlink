package com.winkyblink;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import java.util.List;
import java.util.Arrays;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.reactnativecommunity.rctaudiotoolkit.AudioPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.rnfs.RNFSPackage;
import com.facebook.react.shell.MainReactPackage;
import com.killserver.screenshotprev.RNScreenshotPreventPackage;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "WinkyBlink";
  }

  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new RNGeocoderPackage(),
      new AudioPackage(),
      new ReactNativePushNotificationPackage(),
      new RNFSPackage(),
      new RNScreenshotPreventPackage()
    );
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}
