# Tonalize

A Color Palette Generator built with Next.js and TypeScript  
© Jamil Ahmed

---

## Table of Contents

- [About](#about)  
- [Features](#features)  
- [Demo / Screenshots](#demo--screenshots)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Usage](#usage)  
- [Configuration](#configuration)  
- [Contributing](#contributing)  
- [License](#license)

---

## About

Tonalize is a tool to generate color palettes — ideal for designers and developers who want to derive harmonized colors from a base color or set of colors. It is built with Next.js + TypeScript.  
([github.com](https://github.com/jamil-codes/Tonalize))

---

## Features

- Generate complementary, analogous, triadic, tetradic palettes  
- Preview color combinations on UI  
- Copy hex codes to clipboard  
- Responsive layout  
- Type safety (TypeScript)  
- Easy to extend and integrate  

---

## Demo / Screenshots

*(Add live demo link and images here)*

---

## Tech Stack

- **Framework**: Next.js (React)  
- **Language**: TypeScript  
- **Styling**: CSS / PostCSS  
- **Misc**: (You can include things like any utility libraries, color math libs, etc.)

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)  
- npm / Yarn / pnpm  

### Install dependencies

```bash
# clone the repo
git clone https://github.com/jamil-codes/Tonalize.git

cd Tonalize

# install (choose your package manager)
npm install
# or
pnpm install
# or
yarn install
```

### Run in development

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view in browser.

### Build & production

```bash
npm run build
npm start
```

---

## Usage

1. Open the app in browser  
2. Select or input a base color  
3. Generate a palette set (e.g. complementary, analogous, etc.)  
4. Click any generated color to copy its hex  

You can also use or adapt internal functions for palette generation in other projects.

---

## Configuration

You can adjust settings via config files, for example:

- `next.config.ts` — Next.js configuration  
- `tsconfig.json` — TypeScript rules  
- `postcss.config.mjs` — PostCSS / styling setup  

You may also add environment variables or extend palette logic as needed.

---

## Contributing

Contributions are welcome. Here’s how you can help:

1. Fork the repository  
2. Create a new feature or bugfix branch  
3. Write your changes (with TypeScript, tests, etc.)  
4. Open a pull request  
5. We’ll review and merge  

Please adhere to code style, run formatting and linting, and include tests (if applicable).

---

## License

This project is open source, and is licenced under Apache 2.0 Licence

