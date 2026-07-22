# Sibanye-Stillwater Health App — Mobile Frontend (v1)

React Native + Expo frontend for the Mobile Health / Telemedicine RFP.
This is **frontend only** — screens use mock data, no backend/API wired up yet.

Built on **Expo SDK 54** (React Native 0.81, React Navigation 7) to match the
current Expo Go app on iOS and Android.

## What's included in this build

- **Theme system** (`src/theme/theme.ts`) — blue / gold / platinum brand colors, spacing, typography. Change colors here and the whole app updates.
- **Reusable components** — `Button`, `Card`, `TextField`, `StatusBadge`
- **Login screen** — employee number + password, SSO button placeholder
- **Home dashboard** — greeting header, fitness-for-duty status, quick actions, upcoming appointments, recent notifications
- **Bottom tab navigation** — Home, Appointments, Telemedicine, Messages, Profile (the last 4 are placeholder screens for now)

## How to run and test on your phone

1. Install [Expo Go](https://expo.dev/go) on your iOS or Android phone (App Store / Play Store).
2. On your computer, unzip this project and open a terminal in the folder.
3. Install dependencies:
   ```
   npm install
   ```
4. Start the dev server:
   ```
   npx expo start
   ```
5. Scan the QR code shown in the terminal:
   - **iOS**: use the Camera app
   - **Android**: use the Expo Go app's "Scan QR code" option
6. The app will open in Expo Go on your phone.

Login screen accepts any input right now (tap **Sign In** to proceed to the dashboard — auth isn't wired up yet).

## Project structure

```
src/
  theme/          Design tokens (colors, spacing, typography)
  components/      Reusable UI: Button, Card, TextField, StatusBadge
  screens/         LoginScreen, HomeScreen, PlaceholderScreen
  navigation/      RootNavigator (stack), MainTabs (bottom tabs)
  data/            Mock data for dashboard content
```

## Next steps (once you've tested this)

- Appointments screen (booking/scheduling UI)
- Telemedicine screen (video call UI shell)
- Secure messaging screen
- Profile screen (EMR/HRIS-synced health profile)
- Incident/injury reporting form
- Push notification handling
- Wiring screens to your existing backend (`healthapp` repo API)

## Notes

- Built with **Expo SDK 54** (`expo@~54.0.0`), React Native 0.81.4, React 19.1, React Navigation 7.
- `@expo/vector-icons` is pinned to `15.0.3` with an `expo-font` override to `14.0.12` in `package.json` — this avoids a known crash where newer vector-icons versions pull in an incompatible expo-font on SDK 54. Don't remove the `overrides` block.
- TypeScript throughout, strict-checked (`npx tsc --noEmit` passes clean).
- Bundle verified: `npx expo export --platform android` produces a clean Hermes bundle (924 modules) with no missing-asset or dependency errors.

## Troubleshooting

- **"Project is incompatible with this version of Expo Go"**: means the project's SDK and your Expo Go app's SDK don't match. Check `package.json` — `"expo": "~54.0.0"` should match your Expo Go app's supported SDK (visible in the Expo Go app's settings/about screen, or in the error you get when scanning). If your Expo Go has moved to SDK 55+, tell me and I'll upgrade the project to match.
- Always run `npm install` fresh after unzipping — do not copy `node_modules` between machines or from a previous version of this project.
- If you previously ran `npm install` on an older version of this project in the same folder, delete `node_modules` and `package-lock.json` before reinstalling to avoid stale versions.
