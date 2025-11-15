// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  RECEIPT_BASE_URL: 'https://test360.kudigostorefront.com/orders?id=',
  RESOURCES_BASE_URL: 'https://kudigo-api-test03-9090d5b20290.herokuapp.com/api/v5.0/resources/',
  // RESOURCES_BASE_URL: 'https://test-kudigo-api.herokuapp.com/api/v5.0/resources/',
  // BASE_URL: 'https://testapi.cudigo.com/api/v6.0/web_analytics/',
  BASE_URL: 'https://kudigo-api-test03-9090d5b20290.herokuapp.com/api/v6.0/web_analytics/',
  // BASE_URL: 'https://www.kudigo.com/api/v6.0/web_analytics/',
  FDK_BASE_URL: 'https://storefrontmall.freshdesk.com/api/v2/',
  PAGA_URL: 'https://beta-collect.paga.com/',
  PAGA_WEBSERVICES_URL: 'https://mypaga.com/paga-webservices/',
  firebase: {
    apiKey: 'AIzaSyAeRLeyg9EN8F7gwycCnzH2mSNb3fdAq74',
    authDomain: 'kudigo-b891c.firebaseapp.com',
    databaseURL: 'https://kudigo-b891c.firebaseio.com',
    projectId: 'kudigo-b891c',
    storageBucket: 'kudigo-b891c.appspot.com',
    messagingSenderId: '129573425499',
    appId: '1:129573425499:web:4585dfa1922a4bb1f80a7e',
    measurementId: 'G-WXX5WW2K5R'
  },
  STACK_KEY: '7efad8a35b5ac5964d3ca586a1447736',
  API_KEY: 'AIzaSyBvChwvFGVcDcEgq-a96o3xCEZIdstzakg',
  PROTOCOL: 'http://',
  STOREFRONTMALL_URL: 'kudigoretail.com',
  facebook: {
       app_id: "174301441341430"
  },
  fdk: 'dDVlNkdBZ0tYMzNBaGZrM2hJTTpY',
  PAGA_HASH_KEY: '6515d771280f49f88d92ad41c42d6f0ea1cdb2c4a6e54266bd02e0da92dcc273e31bcec8b24d469ab0df8ad1d0f454517076f56d871548d1b492af5b51db9e3a',
  PAGA_API_KEY: 'MTAwRjI3RjYtNjRBQi00OUYyLTg0ODEtODM5RjBEMjZGNTA2OnpCOColc3ZZcTZUSmRIKw==',

  // Twilio Configuration (TODO: Replace with your actual Twilio credentials)
  TWILIO_ACCOUNT_SID: 'AC_YOUR_TWILIO_ACCOUNT_SID',
  TWILIO_AUTH_TOKEN: 'YOUR_TWILIO_AUTH_TOKEN',
  TWILIO_PHONE_NUMBER: '+1234567890', // Your Twilio phone number
  TWILIO_VERIFY_SERVICE_SID: 'VA_YOUR_VERIFY_SERVICE_SID', // Optional: For Twilio Verify API

  // AWS Cognito Configuration (TODO: Replace with your actual AWS Cognito details)
  AWS_COGNITO_USER_POOL_ID: 'us-east-1_XXXXXXXXX',
  AWS_COGNITO_CLIENT_ID: 'YOUR_COGNITO_CLIENT_ID',
  AWS_COGNITO_REGION: 'us-east-1',
  AWS_COGNITO_IDENTITY_POOL_ID: 'us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' // Optional

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
