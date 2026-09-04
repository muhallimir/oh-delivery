# EAS Build + TestFlight

Linked to `@amirsali/oh-delivery` on EAS. Three build profiles configured.

## One-time setup

```bash
npm install -g eas-cli
eas login
eas init --account amirsali --non-interactive
```

(Already done for this repo: project ID `79f633f1-2064-4871-9439-3c0ac18d9183` is in `app.json`.)

## Apple credentials

Pick one:

### Option A: Apple ID (simpler)
```bash
eas credentials:configure-build --platform ios --profile production
```
Prompts for Apple ID + app-specific password + team ID. Stores encrypted on EAS server.

### Option B: App Store Connect API key (CI-friendly)
1. App Store Connect > Users and Access > Keys > App Store Connect API > Generate
2. Save the `.p8` to `~/.appstoreconnect/private_keys/AuthKey_XXX.p8`
3. Set env vars before `eas build`/`eas submit`:
   ```bash
   export EXPO_APPLE_TEAM_ID=XXXXXXXXXX
   export EXPO_APPLE_API_KEY_ID=YYYYYYYYYY
   export EXPO_APPLE_API_ISSUER_ID=zzzzzzzz-xxxx-xxxx-xxxx-zzzzzzzzzzzz
   ```

## Building

```bash
eas build --platform ios --profile development  # simulator-friendly dev client
eas build --platform ios --profile preview      # internal TestFlight (Release)
eas build --platform ios --profile production    # App Store (Release, auto-submit)
```

`--no-wait` returns immediately and prints a URL to monitor.

## Verified build (development profile)

| Build ID | Status | Archive |
|---|---|---|
| `6047837b-f7ed-4d99-8cb6-85eb982aad77` | FINISHED | https://expo.dev/artifacts/eas/QmOemcQNlf0n5eFkK1lgU4IeOquhjlneuyd3LOXAZdE.tar.gz |

## Submitting to TestFlight

```bash
eas submit --platform ios --latest
```

Or explicit:
```bash
eas submit --platform ios \
  --id <BUILD_ID> \
  --apple-id you@example.com \
  --asc-app-id 1234567890 \
  --apple-team-id XXXXXXXXXX
```

## CI extension

The repo has `.github/workflows/ci.yml` that builds and runs Maestro. To add an EAS submit job:

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

Required secrets: `EXPO_TOKEN`, `EXPO_APPLE_TEAM_ID`, `EXPO_APPLE_API_KEY_ID`, `EXPO_APPLE_API_ISSUER_ID`. Optional: `EXPO_APPLE_API_KEY_PATH` (path to a `.p8` file uploaded as a secret file).

## Known fix: do NOT add expo-dev-client to this SDK 54 project

Earlier I added `expo-dev-client: ^57.0.18` to enable the `development` EAS profile. That version is for SDK 57 and caused the EAS cloud `pod install` to error out in 1 minute with `Install pods build phase` failure. Reverting that dev dep fixed it. If you need expo-dev-client for local dev, install it only locally with `npx expo install expo-dev-client` and do not commit it.
