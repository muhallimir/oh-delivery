# EAS Build + TestFlight Setup

This repo uses [Expo Application Services](https://docs.expo.dev/build/introduction/) to build signed `.ipa` files for App Store Connect / TestFlight.

## One-time setup

1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```

2. Log in (creates/links your Expo account):
   ```bash
   eas login
   ```

3. Initialize EAS for this project (creates the `extra.eas.projectId` entry in `app.json` and links the EAS project):
   ```bash
   eas init --id-flag-length 32
   ```
   Commit the resulting `app.json` change.

## Apple credentials

Two options:

### Option A: Apple ID (simpler)

```bash
eas submit --platform ios
```
The first time, EAS asks for your Apple ID, App-Specific Password, and Team ID. These are stored encrypted in EAS and reused.

### Option B: App Store Connect API key (recommended for CI)

1. App Store Connect > Users and Access > Keys > App Store Connect API > Generate
2. Download the `.p8` file and note the Key ID and Issuer ID
3. Save the `.p8` as `~/.appstoreconnect/private_keys/AuthKey_XXXX.p8`
4. Set environment variables before submitting:
   ```bash
   export EXPO_APPLE_TEAM_ID=XXXXXXXXXX
   export EXPO_APPLE_API_KEY_ID=YYYYYYYYYY
   export EXPO_APPLE_API_ISSUER_ID=zzzzzzzz-xxxx-xxxx-xxxx-zzzzzzzzzzzz
   ```

## Building

Profiles available:

- `eas build --profile development`  : internal dev client + simulator (no signing needed)
- `eas build --profile preview`      : internal TestFlight, Release config
- `eas build --profile production`    : App Store, Release config with auto-submit

## Submitting to TestFlight

```bash
eas submit --platform ios --latest
```

Or with explicit flags:

```bash
eas submit --platform ios \
  --id <BUILD_ID_FROM_EAS> \
  --apple-id you@example.com \
  --asc-app-id 1234567890 \
  --apple-team-id XXXXXXXXXX
```

## CI

A GitHub Actions workflow (`.github/workflows/ci.yml`) builds the simulator and runs Maestro. To extend it for EAS:

1. Add a `submit` job that runs after a successful `maestro` job:
   ```yaml
   submit:
     needs: maestro
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v4
       - uses: expo/expo-github-action@v8
         with:
           eas-build: true
           eas-json: eas.json
       - uses: expo/expo-github-action@v8
         with:
           eas-submit: true
   ```

2. Add secrets to the GitHub repo: `EXPO_TOKEN`, `EXPO_APPLE_TEAM_ID`, `EXPO_APPLE_API_KEY_ID`, `EXPO_APPLE_API_ISSUER_ID`.
3. Upload the `.p8` as a secret file via `EXPO_APPLE_API_KEY_PATH`.
