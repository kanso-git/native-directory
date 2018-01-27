# native-directory

This is the Unine directory, built using react-native

# TODO's

1 - Documentation - component level and method level 

2 - Unit test using jest

3 - Add Building search Card

        buildig card should have the following info :
            builing summary

Br2 
Rue Abram-Louis Breguet 2 
2000, Neuchâtel 
Nombre d'étages : 5


Total de locaux :235 (5229.6 m² ) 
- Archives : 1 ( 16.7 m² ) 
- Aula, auditoire : 3 ( 228.2 m² ) 
- Autres surfaces : 94 ( 1593.6 m² ) 
- Bibliothèque : 11 ( 611.9 m² ) 
- Bureau : 91 ( 1822.4 m² ) 
- Cafétéria : 2 ( 85.9 m² ) 
- Local technique : 18 ( 273.1 m² ) 
- Salle de réunion : 8 ( 231.5 m² ) 
- Salle d'enseignement : 5 ( 280.1 m² ) 
- Salle informatique : 2 ( 86.3 m² ) 

4 - Add Local search Card 

# Here are 10 fundamental React-Native commands you might find helpful

1 -  react-native init myProject    # scaffolding new project app called myProject

2 -  react-native run-ios --simulator="iPhone X"    # run the app on iPhone simulator (xcode is required )
   
    a - use window + D (mac) to see the available options on the runing device 
    
    b - todo add more cmd at this level 

3 -  react-native run android  # run the app on android connected device 

4 - troubleshooting commands
    
    a - Ambiguous resolution: module ... # try yarn start --reset-cache or yarn start -- --reset-cache

5 - How to build react native android app for production?
   
    Prerequisite:
    
    1 - key to sign the apk already created and placed under the android/app directory in your project folder.

    2 - Global variables setup in android/gradle.properties

    3 - Adding signing config to your app's gradle config

    Build and Release steps:

    1 - Generating the release APK
    
     yarn run release-android 

     The generated APK can be found under android/app/build/outputs/apk/app-release.apk, and is ready to be distributed.

    2 - Testing the release build of your app (Before uploading the release build to the Play Store)

    Upload the APK to your phone. The -r flag will replace the existing app (if it exists)

    adb install -r ./android/app/build/outputs/apk/app-release.apk

    or uninstall any previous version of the app you already have installed. 
    
    Install it on the device using:
    
    react-native run-android --variant=release


    A more detailed description is mentioned here: 

    https://facebook.github.io/react-native/docs/signed-apk-android.html




