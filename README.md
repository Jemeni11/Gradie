<a id="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/Jemeni11/Gradie"><img src="public/android-chrome-192x192.png" alt="Logo" width="128" height="128"></a>

<h3 align="center">Gradie</h3>

  <p align="center">
    Turn any image into a vibe.
    <br />
    <a href="https://github.com/Jemeni11/Gradie"><strong>Explore the repo »</strong></a>
    <br />
  </p>
</div>

Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [How It Works](#how-it-works)
- [Modes](#modes)
- [Built With](#built-with)
- [Why did I build this?](#why-did-i-build-this)
- [Contributing](#contributing)
- [Wait a minute, who are you?](#wait-a-minute-who-are-you)
- [License](#license)
- [Changelog](#changelog)

## Introduction

Gradie is a design tool that extracts the most prominent colors from an image and turns them into a smooth, beautiful gradient.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

These features can change at any time. Their existence depends on me having enough time or motivation to implement them all tbh.

- 🖼️ Upload or paste any image (drag & drop, file select, camera on mobile, or paste directly)
- 🎨 Extracts dominant colors from the uploaded image
- 🌈 Creates a smooth gradient using the extracted palette
- 🔄 Multiple gradient types (linear, radial, conic)
- 🎯 Advanced gradient controls (angle adjustment, radial shapes, positioning)
- 🔧 Offers multiple gradient strategies, detailed [below](#modes)
- 📁 Works with uploaded files or pasted images
- 📋 Copy gradient as CSS
- ⚙️ Download gradient as image
- ⚠️ Smart error handling and file validation

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## How It Works

1. You upload or paste an image.
2. Gradie extracts a palette of the most prominent colors.
3. The first color in the palette is considered the dominant color.
4. You choose a Gradie Mode (see [Modes](#modes) for all modes).
5. Customize your gradient with advanced controls like angle, position, and shape options.
6. Gradie generates a smooth gradient using your selection.
7. You export it as CSS or download the image.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Modes

Gradie supports several modes for generating gradients from your image. Each one starts with the most prominent color (palette[0]) and builds from there.

| Mode Name        | Description                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Default**      | Most prominent color + second-most prominent.                                                                          |
| **Surprise Me!** | Most prominent color + a random pick from the rest of the palette.                                                     |
| **Bold Pop**     | Most prominent color + the most visually contrasting color in the palette. Great for high-impact, energetic gradients. |
| **Soft Sweep**   | Most prominent color + the palette color with the most different hue. Creates a warm-to-cool or cool-to-warm effect.   |
| **Full Blend**   | Uses all five palette colors to create a multi-stop gradient.                                                          |
| **Custom**       | You choose any two colors from the extracted palette to create your own combo.                                         |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Built With

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [colorjs.io](https://colorjs.io/)
- [ColorThief](https://lokeshdhakar.com/projects/color-thief/)
- [Vite](https://vitejs.dev/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Why did I build this?

I saw a nice-looking image, thought the colors in it would look nice as a gradient background, and here we are!

(The image is the cover art for [mike's](https://genius.com/artists/Mike-mike-stud) [the lows.](https://genius.com/albums/Mike-mike-stud/The-lows) album, if you're wondering 🫡)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome! If you'd like to improve Gradie, please feel free to submit a pull request.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Wait a minute, who are you?

Hello there! I'm Emmanuel Jemeni, and I am a Frontend Developer.

You can find me on various platforms:

- [LinkedIn](https://www.linkedin.com/in/emmanuel-jemeni)
- [GitHub](https://github.com/Jemeni11)
- [Twitter/X](https://twitter.com/Jemeni11_)
- [Bluesky](https://bsky.app/profile/jemeni11.bsky.social)

If you'd like, you can support me on [GitHub Sponsors](https://github.com/sponsors/Jemeni11/)
or [Buy Me A Coffee](https://www.buymeacoffee.com/jemeni11).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

[MIT License](LICENSE)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Changelog

[Changelog](/CHANGELOG.md)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
