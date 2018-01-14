# native-directory

This is the Unine directory, built using react-native

# TODO's

1 - Enhance the display by adding sub titles  AK: Done 0n 12.01.2018

2 - Manage the dispay of the titles (rules added in V2.1) AK: Done 0n 12.01.2018

3 - Android build and setup (splash screen) AK: Done 0n 12.01.2018

4 - Align users AK: Done 0n 12.01.2018

5 - Manage exception and not connected case exception

6 - Test the backButton "hardwareButton" on Android

7 - Documentation - component level and method level 

8 - Unit test using jest

# Here are 10 fundamental React-Native commands you might find helpful

1 -  react-native init myProject    # scaffolding new project app called myProject

2 -  react-native run-ios --simulator="iPhone X"    # run the app on iPhone simulator (xcode is required )
   
    a - use window + D (mac) to see the available options on the runing device 
    
    b - todo add more cmd at this level 

3 -  react-native run android  # run the app on android connected device 

4 - troubleshooting commands
    
    a - Ambiguous resolution: module ... # try yarn start --reset-cache or yarn start -- --reset-cache

5 - How to build react native android app for production?
  
  You will have to create a key to sign the apk. Use below to create your key:

  keytool -genkey -v -keystore my-app-key.keystore -alias my-app-alias -keyalg RSA -keysize 2048 -validity 10000

  Use a password when prompted

Once the key is generated, use it to generate the installable build:

react-native bundle --platform android --dev false --entry-file index.android.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res/

Generate the build using gradle

cd android && ./gradlew assembleRelease

Upload the APK to your phone. The -r flag will replace the existing app (if it exists)

adb install -r ./app/build/outputs/apk/app-release-unsigned.apk

A more detailed description is mentioned here: 

https://facebook.github.io/react-native/docs/signed-apk-android.html




