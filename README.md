# AstroAuth

## A template for Astro & Firebase with authentication and database integrations.

A template with Firebase Auth Module and Cloud Firestore connected to an exising Astro project. This template includes basic authentication solutions for your app, like registering, signing in, changing password and some CRUD methods for database functionality.

##### This is demo of note-taking app, which uses markdown to style note contents. It contains basic auth functions, listed below. Note contents are encrypted and stored in Firestore.

##### This is a learning project. It's my first time working with Firebase, and writing documentation, so both the code and docs themselves are not pretty. I'm open on collaborating to improve this project.

## CONTENTS:

-   [Project features](#project-features)
-   [Setup](#setup)
-   [Tech stack and technology choices](#tech-stack)
-   [Project structure and API](#project-structure-and-api)
-   [Known issues](#known-issues)
-   [Protips](#protips)
-   [License](#license)

## Project features:

Authentication features:

-   User registration
-   Email verification
-   Middleware to protect sensitive routes
-   User sign-in
-   User sign-out
-   Password reset
-   Password change
-   Account deletion

Database features:

-   Creating files
-   Reading files
-   Editing file name
-   Deleting files
-   Automatic saving of file content
-   Changing file content
-   Data encryption for file contents

## Setup

It's strongly advised to follow Astro's guide on how to connect a backend service such as Firebase to your project. You can find it here: [Guide to connecting a backend ->](https://docs.astro.build/en/guides/backend/google-firebase/). However, all the instructions to get your project working can be found below. Some familiarity working with Astro and Firebase is required.

### Checklist:

-   Configure your project in Firebase Console:

    -   Email verification templates
    -   Firebase Security Rules for DB
    -   Change password policy in Firebase Console
    -   Set authorized domains in Firebase Console

-   Configure your project in your IDE:

    -   Firebase client-side config
    -   Firebase server-side config
    -   Set your SSR adapter in astro.config.mjs
    -   Set the return URL for outgoing emails
    -   Crypto Key for data encryption and decryption

### Explanation in greater detail:

#### Firebase Console configuration:

-   Configure your project in Firebase Console:

    -   Create a project on Firebase website. Choose a web app project and follow the instructions.
    -   Add authentication to the project. Choose email/password as a sign-in method.
    -   Add Cloud Firestore to your project. Choose DB location closest to your users. Start in production mode.

-   Firebase template for emails:

    -   Go to Firebase Console > Authentication > Templates
    -   Change your email address verification template to appropriate for your project. Change senders name, subject etc.

-   Firebase security rules: - Go to Firebase console > Firestore Database > Rules. Then copy this code:

    ```
    rules_version = '2';
    service cloud.firestore {
        match /databases/{database}/documents {
            match /users/{userId} {
                allow read, write, delete: if request.auth.uid == userId;
                match /notes/{noteId} {
                    allow read, write, delete: if request.auth.uid == userId;
                }
            }
        }
    }
    ```

-   Change password policy for Authentication:
    -   Go to Firebase Console > Authentication > Settings > Password policy.
    -   Check these fields:
        -   "Require uppercase character"
        -   "Require special character"
        -   "Require numeric character"
-   Set authorized domains for Authentication:
    -   Go to Firebase Console > Authentication > Settings > Authorized domains.
    -   Add your own domain and click "Ok".

#### IDE configuration:

-   Clone the repo and open the console. Run:
    `npm i`

-   Firebase client-side config:

    -   Go to Firebase Console > Project Overview > Project Settings > General
    -   Copy your Firebase Config to src/firebase/client.ts and save it.

    -   Firebase server-side config: - Create and .env file in the root of your project (remember to include it in your .gitignore file and to never push your .env file to your repository!)

    ```
    FIREBASE_PRIVATE_KEY_ID=YOUR_PRIVATE_KEY_ID
    FIREBASE_PRIVATE_KEY=YOUR_PRIVATE_KEY
    FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    FIREBASE_CLIENT_EMAIL=YOUR_CLIENT_EMAIL
    FIREBASE_CLIENT_ID=YOUR_CLIENT_ID
    FIREBASE_AUTH_URI=YOUR_AUTH_URI
    FIREBASE_TOKEN_URI=YOUR_TOKEN_URI
    FIREBASE_AUTH_CERT_URL=YOUR_AUTH_CERT_URL
    FIREBASE_CLIENT_CERT_URL=YOUR_CLIENT_CERT_URL
    ```

    -   Go to Firebase Console > Project Overview > Project Settings > Service Accounts. - Generate new private key. Open the .json file and copy values to the corresponding to fields in .env file.

-   Set your SSR adapter in astro.config.mjs:

    -   If you are using Netlify as your hosting provider, skip this step. Otherwise go to [Astro website](https://docs.astro.build/en/guides/server-side-rendering/) and follow the instructions.

-   Set the return URL for outgoing links:

    -   Go to src/pages/p/verify-email.astro
    -   Find the sendEmailVerification() function
    -   Change "url" in the object to "https://[YOUR DOMAIN HERE]/p/dashboard"

-   CRYPTO key for encryption and decryption:
    -   Add a line CRYPTO_KEY="YOUR KEY HERE" in your .env file
    -   Generate an crypto key for your project. You can do it using CryptoJS library or any other way you prefer. Don't make it a simple phrase, that you came up with, for example: "CryptoKeyToMyApp123". Use some kind of a generator.
    -   Assign your key to .env variable.

## Tech stack:

Technologies used in this project:

-   Astro 4.16.5 (obviously)
-   Firebase 10.14.1 (obviously)
-   Typescript 5.6.3 - for type safety
-   SCSS 1.80.2 - for styling
-   ESLint 9.13.0 - for better code quality
-   uuid 10.0.0 - for generating user IDs
-   xss 1.0.15 - for server side input sanitization
-   React-toastify 10.0.6 - for toast system
-   Marked 14.1.3 - for interpreting markdown language
-   DOMpurify 3.1.7 - for client side input sanitization
-   disposable-email-domains-js 1.4.0 - for checking if user is registering with disposable, temporary email address.
-   CryptoJS 4.2.0 - for data encryption and decryption

## Project structure and API:

### public/

public folder contains only two images. Both are used to signal to user if their file is saved to database or is in process of being saved.

### tsconfig.json

Config with configured import aliases. Standard stuff otherwise.

### src/

Main project folder with source code.

-   #### components/

    Place to store your content. Currently you can find there a Toast.tsx used for displaying toast notification in the app and Note.astro used to show user's saved notes on the dashboard page.

-   #### firebase/
    Folder where both your apps (one for server actions, and one for client-side actions) reside. Make sure you fill these apps with your API Keys and configs.
-   #### layouts/
    This folder contains three files.
    -   AccountLayout.astro should be used only for pages where user is authenticated. This way you can make a navigation or profile menu appear only when they might be relevant. If user is not present, it will automatically redirect to /sign-in. It also allows users to logout.
    -   PublicLayout.astro is used when user is anonymous or not logged in.
    -   WrapperLayout.astro is meant to be present on every page of your website. It contains the head of html files, view transitions initialization, toast system component and some global styles if you want to use them this way (or just use scss vars in sass folder.)
-   #### lib/
    The lib/ folder has three parts.
    -   auth/ subfolder contains get-user.ts file. There you cand find methods for getting current user in frontmatter of your Astro page, of another functions, which finds current user in API Routes.
        Both these functions use cookies to find and validate users.
    -   encryption/ contains two files used for encrypting note contents and decrypting them. CryptoJS is used. Both functions return strings. Remember to set up your CRYPTO_KEY in .env file.
    -   welcome.ts is used when creating Welcome file for newly registered users. Basics of markdown language can be found there.
-   #### pages/

    -   api/ - this is where all your API Routes are stored. Access to them is protected via middleware
        -   auth/ - Authentication methods for your application
            -   change-password.ts - allows user to change their password. Gets current user's uid and then changes their password using auth.updateUser().
            -   delete-user.ts - deletes user from Auth system and from Firestore. Gets current user, deletes him, deletes cookie session from the browser and also document in Firestore with user's uid.
            -   sign-in.ts - This function works together with sign-in.astro page's logic. Firstly, user is signing in with email and password on client's side. Request to Firebase is made to check if credentials are valid, and idToken is received. idToken is then sent to this route. When idToken gets successfully validated session cookie is created and appended to browser's memory. Cookie always gets deleted, when user closes the browser. You can change it in sign-in.astro (setAuthPersistence()). After appending the cookie, the responses is sent to the client, and he gets redirected to "/p/dashboard". You can also change cookie's expiration time. Currently it's set to one day, but as was said earlier, each time user closes the browser, the cookie is also lost. This method is not protected via middleware.
            -   sign-out.ts - deletes session cookie and redirects the user. From client's side, the user also gets logged out, when he clicks the button in navbar. This method is not protected via middleware.
        -   db/ - Firestore methods for your app.
            -   create-note.ts - method to create new notes in your Firestore database. Firstly, note title is sanitized to prevent problems and current user is found. Then checks are performed: if title exists, it's not longer than 64 characters or shorter than 1 character. Final check is to find a note with identical title. If none is present, then note is actually created in "notes" collection in document named with current user's uid.
            -   delete-note.ts - deletes note demanded by user. Finds user and note with requested title, and deletes it.
            -   edit-note-title.ts - Deletes file with old name and creates a new one with changed title. Data is sanitized and then checks are performed. New title, old title and user are necessary. If title with the new name already exists error is thrown. If all checks are passed, the old note gets deleted and new note with demanded name is created. User gets redirected to the new note.
            -   save-note.ts - this method automatically triggers 3 seconds after user stopped typing in [note].astro file. It gets current user, note title and note content. Data is sanitized and content of the note gets updated as a result. Content of every note is encrypted using CryptoJS.
        -   register/
            -   register.ts - method to register new users to your app. Route receives data from request, This is then sanitized and goes through checks. You can change those checks if you want your app's policy to be even stricter or looser. Remember to then also change those requirements in Firebase Console. If everything behaves correctly, then user uid is generated using uuidv4(). User is created in auth system and new document in "users" collection is appended. It's name is user uuid and it also has one more collection named "notes". Initial note named "Welcome" is created to teach user how to write in markdown language.
    -   p/ - folder where all your protected sites are stored. "p" stands for protected. Middleware checks all request made to these sites for presence of the authenticated user. If user is not authenticated, he gets redirected.

        -   [note].astro - this is where note can be viewed and edited. Note title is parsed from URL params. Then corresponding note gets found in Firestore DB. If none is found, user gets redirected to 404.astro page. Content of the note is decrypted using decryptData() function. Everything then populates assigned fields in HTML. UI is split in view parts. On the left, textarea is located, where user can edit their note content. On the right content parsed through markdown interpreter is shown. Above all that, utility menu can be found. There user can change note title, delete note or get a clue if their note has been saved, or not.
            In script tag logic for deleting notes can be found. Note title gets decoded from URL and request to API Route gets made. If everything goes successfully, user gets redirected to dashboard after 3 seconds.
            Next function is responsible for saving note content. Textarea is listening for inputs. After every input debounceSaveNote() activates. If another input is received, timeout resets to 3 seconds. If no additional input is received in next 3 seconds, then timeout doesn't clear and saveNoToFirebase activates. Request to API is made, and if successful, icon in the utility menu is changed and toast notification is shown.
            Last function in this file is editing note title. Dialog is used to show a modal window with inputs. Inputs are sanitized and checked to ensure they exist and aren't too long. If everything meets criteria request to API Route is made. After changing the title user gets redirected to the new note page.
        -   dashboard.astro - Dashboard, where all saved notes are shown. Frontmatter downloads all the notes made by user and then populates the Note component in HTML portion of the file. In the dashboard user can create new notes and link to them. Simple checks are made when form is submitted and data is getting sanitized. Then request to API Route is made and if successful user gets redirected to their newly made note.
        -   profile.astro - Page, where user can manage their account. Some info about user is shown, like email address, verification status, creation time or profile photo url. On this page user can delete their account or change password to their account. To delete account user clicks a corresponding button and request to API is made. If account get successfully deleted, user gets redirected to index page. Change password is more complicated. User has to provide their current password, new password and repeated new password. Checks are made to ensure the new password complies with the password policy set in Firebase Console. Then user gets verified if the current password user provided is actually correct. If it is, then request to API Route is being made. After successful response, user gets logged out.
        -   verify-email.astro - page, where not verified users get sent. On button press auth gets current user and sends email verification to their email address. Please remember to change back going url in sendEmailVerification() function.

    -   404.astro - 404 page. Where note can't be found, user gets redirected here.
    -   forgot-password.astro - page where user can reset their password. Users input gets sanitized and email gets sent.
    -   index.astro - index page. Not protected. Insert your own content.
    -   register.astro - page, where users can register. Frontmatter searches for current user. If he gets found, redirect to dashboard occurs. On the page, form for registering can be found. User has to provide an email address, password and a repeat of their password, to get registered. Checks are made, if passwords meet the criteria and if email is not one of the disposable email addresses. If everything passes request to API Route gets made. If response is ok, user gets redirected to sign-in page.
    -   sign-in.astro - page, where users can sign in. Frontmatter searches for current user. If user gets found, redirection to dashboard page occurs. User's inputs get sanitized and userCredentials get obtained. Then idToken gets sent to API Route, verified and session cookie gets made. If everything goes alright, user is redirected to dashboard. User's email is saved to LocalStorage, for changing password.
    -   sass/
        -   \_layout.scss - default layout for the app. Everything is located here, in .scss file instead of each astro page in case you wanted to completely remove all styles and replace them with your own. Site is not responsive. These styles were written because working with pure white background is annoying after like 30 minutes. This way it's easier on the eyes.
        -   \_reset.scss - standard reset file
        -   index.scss - importing all subfiles for scss. This filed is linked to layouts in Layout folder.
    -   env.d.ts - types for your .env variables.
    -   middleware.ts - middleware checks if user is authenticated when accessing protected routes. If request is made to routes starting with "/p", "/api/auth" or "/api/db" middleware takes action. Firstly, it checks if firebase session cookie is present. If not, user redirected. Then validity of session cookie is verified. If it's ok, then email verification happens. If user is present, but not verified they got redirected to /p/verify-email. If user is found, and has their email is verified, he can access site they wanted. sign-in and sign-out API routes are excluded from middleware. If they weren't user wouldn't be able to sign in, or sign out, even after passing correct credentials. This also applies for verify-email page. Proceed carefully when changing anything in middleware. From experience I can say, that it is very easy to make an infinite loop of redirects, which crashes the app.

## Known issues:

-   There is a method to check password's compliance with Firebase Console rules. Should be used instead of manually checking it on client when registering, or changing password. This would make code more modular, and would make sure, that requirements for password are equal between app and Firebase.
-   User can't create files named "dashboard", "profile", and "verify-email", cause he gets redirected. When note with any of these names get made, it shows up correctly, but instead of going to [note].astro page, it redirects to corresponding page, that was earlier coded by you. To fix it [note].astro should be in another folder named maybe "notes", but that requires some reconfiguration and it would be easier to do it yourself, because you might not be making note-taking app, but something else and other folder name would be more accurate.

-   ESlint sometimes work, sometimes not. Sometimes it activates, sometimes it doesn't. Dunno why.
-   ```
      document.startViewTransition(() => {
      window.location.href = `/p/${pureTitle}`;
      });
    ```
    This code doesn't actually start view transition. Dunno why. It's located at the bottom of [note].astro file.
-   Pain to debug. Catching and throwing errors is bad. Usually, when something goes wrong only toast with "Something went wrong" shows up. This will be fixed in the future and error handling will be improved.
-   I'm not sure, if wrapping everything in trycatch blocks is actually a good practice. Wish to be informed and educated.
-   Downloading all the notes instead of maybe 10. Currently all the notes made by user are downloaded when user navigates to dashboard page. It should be capped and some sort of lazy loading should be implemented.
-   TESTING - no Jest testing was made or anything of this sort. All the issues that came to my head I checked manually.
-   No stress testing. No idea how many users this software can handle at once.
-   when resetting password via email additional toast.error shows up. Everything works, but toast is shouldn't be there.
-   when registering additional toast.error shows up. Everything works, but toast is shouldn't be there.

## Protips:

-   Add confirm button before deleting account, so user doesn't delete their profile by accident.
-   You can add a button, which shows only textarea, or only parsed content in [note].astro.
-   Write your styles in .astro pages not .scss as I did. This will make styling pages easier. I did it this way, so my styles are easy to remove and replace.
-   Firebase Admin SDK bypasses all Security Rules set by you. Those rules only apply to client-side request made in script tag. Requests made in the fronmatter always can download any data you want ignoring the rules.

## Future enhancements:

I'm happy to collaborate on improving this project with other developers. If you are looking for a way to contribute, hit me up on GitHub. Any feedback from any person, who managed to find any security vulnerability is greatly appreciated.

#### Future enhancements:

-   Testing with Jest or other testing framework.
-   More modularity and settings. You can choose if you want to enable DB section of the project or email verification.
-   Security improvements.
-   More modularity when performing checks for passwords compliance with requirements. Make an isolated component for this purpose.
-   Two factor authentication.
-   Remove localStorage for storing user's email and use auth.currentUser instead in profile.astro.
-   Allow user to delete account on verify-email.astro screen

## License:

Copyright 2024 Jakub Latko

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
