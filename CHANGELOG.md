# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[//]: # "Types of changes"
[//]: # "- **Added** for new features."
[//]: # "- **Changed** for changes in existing functionality."
[//]: # "- **Deprecated** for soon-to-be removed features."
[//]: # "- **Removed** for now removed features."
[//]: # "- **Fixed** for any bug fixes."
[//]: # "- **Security** in case of vulnerabilities."

## 2026-06-11

### Changed

- Migrated linting and formatting toolchain from ESLint, Prettier, and Stylelint to oxlint and oxfmt for significantly faster performance.
- Switched from `@vitejs/plugin-react` inline Babel config to `@rolldown/plugin-babel` with the react-compiler preset.
- Simplified `pnpm-workspace.yaml` by replacing the extensive list of dependency overrides with a trust policy and `minimumReleaseAge`.
- Upgraded core dependencies: React 19.2.7, TypeScript 6.0, Vite 8.0, Tailwind CSS 4.3, and various other packages.
- Moved `paths` configuration from `tsconfig.json` into `tsconfig.app.json` and added a wildcard path mapping.
- Reformatted `index.html` meta tags and icon links to single-line format for consistency.
- Updated `lint-staged` config to use oxlint and oxfmt instead of the previous ESLint/Prettier/Stylelint pipeline.

### Removed

- Removed `.env.example`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, and `.stylelintrc.json` as they are no longer needed.
- Removed `@eslint/js`, `eslint-plugin-react-refresh`, `typescript-eslint`, `prettier`, `prettier-plugin-tailwindcss`, `stylelint` and related stylelint dependencies.

### Fixed

- Resolved "Cannot call impure function during render" lint error by wrapping `Math.random` in a lazy `useState` initializer.
- Resolved "Calling setState synchronously within an effect" lint error by moving the analytics consent `localStorage` read into a lazy `useState` initializer, eliminating the synchronous `setShowBanner` call inside the effect.

## 2026-06-10

### Changed

- Refactored the analytics integration to be completely privacy-first, replacing PostHog with a lightweight, consent-based Umami tracker.
- Reduced the scope of tracked analytics to only the bare minimum (page visits, generation, and downloads) and updated the privacy dialog and FAQ to reflect this.
- Completely overhauled the gradient export pipeline to use a robust canvas-based approach (supersampling, downsampling, and dithering).
- Updated the pre-commit hook to use `pnpm exec lint-staged` instead of `npx` and explicitly added `lint-staged` as a devDependency.

### Removed

- Removed the experimental "Enhanced Gradient" UI toggle, as the new export pipeline automatically handles color banding mitigation.
- Removed the heavy `posthog-js` dependency, significantly reducing bundle size.
- Removed obsolete `uploadMethod` arguments from the image upload logic (leftover dead code from PostHog).

### Fixed

- Fixed persistent color banding issues in downloaded gradient images by generating independent noise seeds for RGB channels and intelligently applying dithering only to lossless formats.
- Resolved ESLint `no-explicit-any` errors in the analytics utility by formally extending the global `Window` interface.

### Security

- Resolved numerous high and moderate severity vulnerabilities by enforcing secure dependency resolutions via `pnpm` overrides.
