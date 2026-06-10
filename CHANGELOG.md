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

## 2026-06-10

### Changed

- Refactored the analytics integration to be completely privacy-first, replacing PostHog with a lightweight, consent-based Umami tracker.
- Reduced the scope of tracked analytics to only the bare minimum (page visits, generation, and downloads) and updated the privacy dialog and FAQ to reflect this.
- Completely overhauled the gradient export pipeline to use a robust canvas-based approach (supersampling, downsampling, and dithering).

### Removed

- Removed the experimental "Enhanced Gradient" UI toggle, as the new export pipeline automatically handles color banding mitigation.
- Removed the heavy `posthog-js` dependency, significantly reducing bundle size.

### Fixed

- Fixed persistent color banding issues in downloaded gradient images by generating independent noise seeds for RGB channels and intelligently applying dithering only to lossless formats.
