# SF360 PWA - Authentication Setup Guide

## Overview

This document provides comprehensive instructions for setting up the fullstack authentication system for the SF360 PWA application. The implementation includes:

1. **Firebase Authentication** - Phone auth, email/password, and social login
2. **Twilio SMS** - SMS verification and OTP delivery
3. **AWS Cognito** - Enterprise-grade user management (optional)
4. **Enhanced Login/Onboarding** - Multi-method authentication flows

## Table of Contents

- [Architecture](#architecture)
- [Services Overview](#services-overview)
- [Setup Instructions](#setup-instructions)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SF360 PWA Frontend                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Enhanced Login Component                              │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │  Phone   │  │  Email   │  │  Social  │            │ │
│  │  │  Login   │  │  Login   │  │  Login   │            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
│           │              │              │                    │
│           ▼              ▼              ▼                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Authentication Services Layer                │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │ │
│  │  │   Firebase   │  │    Twilio    │  │    AWS     │  │ │
│  │  │     Auth     │  │     SMS      │  │  Cognito   │  │ │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Token Validation & User Management                    │ │
│  │  • Firebase Admin SDK                                  │ │
│  │  • AWS Cognito Integration                             │ │
│  │  • Session Management                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Services Overview

### 1. FirebaseAuthService
**Location:** `src/app/services/firebase-auth.service.ts`

**Features:**
- Phone authentication with SMS verification
- Email/password authentication
- Email verification
- Password reset
- User profile management
- Token management
- Phone number linking

**Key Methods:**
```typescript
// Send SMS verification
sendPhoneVerificationCode(phoneNumber: string): Promise<string>

// Verify SMS code
verifyPhoneCode(code: string): Promise<UserCredential>

// Email/password sign in
signInWithEmail(email: string, password: string): Observable<UserCredential>

// Sign up with email
signUpWithEmail(email: string, password: string): Observable<UserCredential>

// Get ID token for backend auth
getIdToken(): Promise<string | null>
```

### 2. TwilioSmsService
**Location:** `src/app/services/twilio-sms.service.ts`

**Features:**
- Direct SMS messaging
- Twilio Verify API integration
- OTP generation
- Phone number formatting and validation
- Login notifications

**Key Methods:**
```typescript
// Send custom SMS
sendSMS(toPhoneNumber: string, message: string): Observable<SMSResponse>

// Send verification code (Verify API)
sendVerificationCode(phoneNumber: string, channel: 'sms' | 'call'): Observable<VerifyResponse>

// Verify code
verifyCode(phoneNumber: string, code: string): Observable<VerifyResponse>

// Send OTP
sendOTP(phoneNumber: string, otp: string, businessName?: string): Observable<SMSResponse>

// Generate OTP
generateOTP(length?: number): string
```

### 3. AwsCognitoService
**Location:** `src/app/services/aws-cognito.service.ts`

**Features:**
- User sign up and confirmation
- Sign in with username/password
- Password reset and change
- User attribute management
- Token refresh
- User pools integration

**Key Methods:**
```typescript
// Sign up
signUp(params: SignUpParams): Promise<any>

// Confirm sign up
confirmSignUp(username: string, code: string): Promise<any>

// Sign in
signIn(params: SignInParams): Promise<AuthTokens>

// Forgot password
forgotPassword(username: string): Promise<any>

// Change password
changePassword(oldPassword: string, newPassword: string): Promise<any>
```

---

## Setup Instructions

### Prerequisites

1. **Node.js** (v12.22.12 or later)
2. **npm** (v6.14.16 or later)
3. **Angular CLI** (v9.1.12)
4. **Firebase Account** (https://console.firebase.google.com)
5. **Twilio Account** (https://www.twilio.com/console)
6. **AWS Account** (https://aws.amazon.com) - Optional for Cognito

### 1. Firebase Setup

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name (e.g., "sf360-pwa")
4. Enable Google Analytics (optional)
5. Create project

#### Step 2: Enable Authentication Methods
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following:
   - **Phone** authentication
   - **Email/Password** authentication
   - **Google** (optional)
   - **Facebook** (optional)

#### Step 3: Configure Phone Authentication
1. Add test phone numbers if needed (for development)
2. Configure your app domain for reCAPTCHA
3. Add authorized domains:
   - `localhost`
   - `sf360-pwa-2c1902145fd2.herokuapp.com`
   - Your custom domain

#### Step 4: Get Firebase Configuration
1. Go to **Project Settings** > **General**
2. Scroll to "Your apps"
3. Click Web icon (</>) to add a web app
4. Register app and copy configuration
5. The configuration is already in `src/environments/environment.ts`

### 2. Twilio Setup

#### Step 1: Create Twilio Account
1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Verify your email and phone number
3. Complete the onboarding questionnaire

#### Step 2: Get Phone Number
1. Go to **Phone Numbers** > **Manage** > **Buy a number**
2. Search for a number with SMS capabilities
3. Purchase the number
4. Note down your phone number

#### Step 3: Get Account Credentials
1. Go to [Twilio Console](https://www.twilio.com/console)
2. Copy your **Account SID**
3. Copy your **Auth Token**
4. Save these securely

#### Step 4: Setup Verify API (Recommended)
1. Go to **Verify** > **Services**
2. Create a new Verify service
3. Configure verification settings:
   - Code length: 6 digits
   - Code expiry: 10 minutes
4. Copy the **Service SID**

#### Step 5: Update Environment Variables
Add to `src/environments/environment.ts`:
```typescript
TWILIO_ACCOUNT_SID: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
TWILIO_AUTH_TOKEN: 'your_auth_token_here',
TWILIO_PHONE_NUMBER: '+1234567890',
TWILIO_VERIFY_SERVICE_SID: 'VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
```

### 3. AWS Cognito Setup (Optional)

#### Step 1: Create User Pool
1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito)
2. Click "Manage User Pools"
3. Click "Create a user pool"
4. Enter pool name (e.g., "sf360-users")
5. Configure sign-in options:
   - Email address
   - Phone number
   - Username

#### Step 2: Configure Pool Settings
1. **Password policy:**
   - Minimum length: 8 characters
   - Require uppercase, lowercase, numbers, symbols
2. **MFA:** Optional or Required
3. **Account recovery:** Email or Phone
4. **Email/SMS providers:** Configure AWS SES or use default

#### Step 3: Create App Client
1. In your User Pool, go to **App clients**
2. Click "Add an app client"
3. Name: "sf360-web-client"
4. Uncheck "Generate client secret" (for web apps)
5. Create app client
6. Copy the **App client ID**

#### Step 4: Get Pool Details
1. Copy your **User Pool ID** (e.g., us-east-1_xxxxxxxxx)
2. Copy your **Region** (e.g., us-east-1)
3. Update `src/environments/environment.ts`:
```typescript
AWS_COGNITO_USER_POOL_ID: 'us-east-1_XXXXXXXXX',
AWS_COGNITO_CLIENT_ID: 'your_client_id_here',
AWS_COGNITO_REGION: 'us-east-1'
```

---

## Configuration

### Environment Variables

#### Development (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,

  // Existing config...

  // Firebase (already configured)
  firebase: {
    apiKey: 'AIzaSyAeRLeyg9EN8F7gwycCnzH2mSNb3fdAq74',
    authDomain: 'kudigo-b891c.firebaseapp.com',
    // ... rest of config
  },

  // Twilio
  TWILIO_ACCOUNT_SID: 'YOUR_ACCOUNT_SID',
  TWILIO_AUTH_TOKEN: 'YOUR_AUTH_TOKEN',
  TWILIO_PHONE_NUMBER: '+1234567890',
  TWILIO_VERIFY_SERVICE_SID: 'YOUR_SERVICE_SID',

  // AWS Cognito
  AWS_COGNITO_USER_POOL_ID: 'us-east-1_XXXXXXXXX',
  AWS_COGNITO_CLIENT_ID: 'YOUR_CLIENT_ID',
  AWS_COGNITO_REGION: 'us-east-1',
  AWS_COGNITO_IDENTITY_POOL_ID: 'us-east-1:...' // Optional
};
```

#### Production (`src/environments/environment.prod.ts`)
- Use the same structure but with production credentials
- **Important:** Never commit real credentials to Git
- Use Heroku environment variables for sensitive data

### Heroku Environment Variables

Set environment variables on Heroku (recommended for production):

```bash
# Twilio
heroku config:set TWILIO_ACCOUNT_SID=ACxxxxxxxxx --app sf360-pwa
heroku config:set TWILIO_AUTH_TOKEN=your_token --app sf360-pwa
heroku config:set TWILIO_PHONE_NUMBER=+1234567890 --app sf360-pwa
heroku config:set TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxx --app sf360-pwa

# AWS Cognito
heroku config:set AWS_COGNITO_USER_POOL_ID=us-east-1_XXX --app sf360-pwa
heroku config:set AWS_COGNITO_CLIENT_ID=your_client_id --app sf360-pwa
heroku config:set AWS_COGNITO_REGION=us-east-1 --app sf360-pwa
```

---

## Usage Examples

### Example 1: Phone Login with Firebase

```typescript
// In your component
import { FirebaseAuthService } from '../services/firebase-auth.service';

constructor(private firebaseAuth: FirebaseAuthService) {}

async loginWithPhone() {
  try {
    // Initialize reCAPTCHA
    this.firebaseAuth.initRecaptcha('recaptcha-container');

    // Send verification code
    const verificationId = await this.firebaseAuth.sendPhoneVerificationCode('+233240000000');

    // After user enters code
    const credential = await this.firebaseAuth.verifyPhoneCode('123456');

    // Get ID token for backend
    const idToken = await this.firebaseAuth.getIdToken();

    // Send to backend for session creation
    // ... your backend API call
  } catch (error) {
    console.error('Login error:', error);
  }
}
```

### Example 2: SMS Verification with Twilio

```typescript
// In your component
import { TwilioSmsService } from '../services/twilio-sms.service';

constructor(private twilioSms: TwilioSmsService) {}

sendVerification() {
  const phoneNumber = '+233240000000';

  this.twilioSms.sendVerificationCode(phoneNumber, 'sms').subscribe(
    result => {
      if (result.success) {
        console.log('Verification code sent');
      }
    },
    error => console.error('Error:', error)
  );
}

verifyCode() {
  const code = '123456';
  const phoneNumber = '+233240000000';

  this.twilioSms.verifyCode(phoneNumber, code).subscribe(
    result => {
      if (result.valid) {
        console.log('Code verified!');
      }
    },
    error => console.error('Error:', error)
  );
}
```

### Example 3: AWS Cognito Sign Up

```typescript
// In your component
import { AwsCognitoService } from '../services/aws-cognito.service';

constructor(private cognito: AwsCognitoService) {}

async signUp() {
  try {
    const result = await this.cognito.signUp({
      username: 'user@example.com',
      password: 'SecurePass123!',
      email: 'user@example.com',
      phoneNumber: '+233240000000'
    });

    console.log('Sign up successful, check email for verification code');
  } catch (error) {
    console.error('Sign up error:', error);
  }
}

async confirmSignUp() {
  try {
    await this.cognito.confirmSignUp('user@example.com', '123456');
    console.log('Account confirmed!');
  } catch (error) {
    console.error('Confirmation error:', error);
  }
}
```

---

## Deployment

### Build for Production

```bash
# Navigate to project directory
cd ~/Desktop/sf360-pwa

# Install dependencies
npm install

# Build for production
npm run build -- --prod

# Or with specific environment
ng build --prod --configuration=production
```

### Deploy to Heroku

```bash
# Add changes to git
git add .

# Commit changes
git commit -m "Add comprehensive authentication services (Firebase, Twilio, AWS Cognito)"

# Push to Heroku
git push heroku master

# Or if using a different branch
git push heroku your-branch:master
```

### Verify Deployment

```bash
# Check app logs
heroku logs --tail --app sf360-pwa

# Open app in browser
heroku open --app sf360-pwa

# Check config vars
heroku config --app sf360-pwa
```

---

## Troubleshooting

### Common Issues

#### 1. Firebase reCAPTCHA Not Showing

**Problem:** reCAPTCHA doesn't appear or phone auth fails

**Solution:**
- Ensure the `recaptcha-container` div exists in your HTML:
  ```html
  <div id="recaptcha-container"></div>
  ```
- Add your domain to Firebase authorized domains
- Clear browser cache and cookies

#### 2. Twilio SMS Not Sending

**Problem:** SMS not being delivered

**Solution:**
- Verify account SID and auth token are correct
- Check Twilio account balance
- Verify phone number has SMS capabilities
- Check Twilio logs in console for errors
- Ensure phone number is in E.164 format (+233240000000)

#### 3. CORS Errors with Twilio/AWS

**Problem:** Cross-origin errors when calling APIs directly from frontend

**Solution:**
- **Never call Twilio/AWS APIs directly from frontend**
- Create backend proxy endpoints
- Use backend to make Twilio/AWS API calls
- Return results to frontend

Example backend proxy (Node.js/Express):
```javascript
// Backend API endpoint
app.post('/api/auth/send-sms-verification', async (req, res) => {
  const { phoneNumber } = req.body;

  // Call Twilio from backend
  const result = await twilioClient.verify
    .services(VERIFY_SERVICE_SID)
    .verifications
    .create({ to: phoneNumber, channel: 'sms' });

  res.json({ success: true, sid: result.sid });
});
```

#### 4. Environment Variables Not Loading

**Problem:** Configuration values are undefined

**Solution:**
- Verify environment files are in `src/environments/`
- Check build configuration in `angular.json`
- Restart development server after changes
- For Heroku, verify config vars are set:
  ```bash
  heroku config --app sf360-pwa
  ```

#### 5. Token Validation Errors

**Problem:** Backend rejects Firebase/Cognito tokens

**Solution:**
- Install Firebase Admin SDK or AWS SDK in backend
- Verify tokens server-side:
  ```javascript
  // Firebase Admin SDK
  const decodedToken = await admin.auth().verifyIdToken(idToken);

  // AWS Cognito
  const verifier = CognitoJwtVerifier.create({
    userPoolId: USER_POOL_ID,
    tokenUse: "access",
    clientId: CLIENT_ID
  });
  const payload = await verifier.verify(token);
  ```

---

## Security Best Practices

### 1. Never Expose Credentials in Frontend
- Store sensitive keys (Twilio auth token, AWS secrets) only in backend
- Use environment variables
- Never commit credentials to Git

### 2. Use Backend Proxy for All Auth Operations
```
Frontend → Backend API → External Service (Twilio/AWS/Firebase)
```

### 3. Implement Rate Limiting
- Limit SMS/email sends per user
- Prevent brute force attacks
- Use Firebase/Cognito built-in protection

### 4. Validate All Inputs
- Sanitize phone numbers
- Validate email formats
- Check password strength

### 5. Use HTTPS
- Always use HTTPS in production
- Enable SSL on Heroku
- Configure secure cookies

---

## Next Steps

1. **Replace Placeholder Credentials**
   - Add real Twilio credentials
   - Add real AWS Cognito details (if using)

2. **Create Backend API Endpoints**
   - Token validation endpoints
   - SMS proxy endpoints
   - User session management

3. **Update Login Component**
   - Replace or enhance existing login component
   - Add UI for auth method selection
   - Integrate enhanced authentication

4. **Testing**
   - Test phone authentication flow
   - Test email authentication flow
   - Test SMS delivery
   - Test token validation

5. **Documentation**
   - Document API endpoints
   - Create user guides
   - Add inline code comments

---

## Support & Resources

- **Firebase Documentation:** https://firebase.google.com/docs/auth
- **Twilio Documentation:** https://www.twilio.com/docs
- **AWS Cognito Documentation:** https://docs.aws.amazon.com/cognito
- **Angular Documentation:** https://angular.io/docs

---

## License

Copyright © 2025 SF360 PWA. All rights reserved.
