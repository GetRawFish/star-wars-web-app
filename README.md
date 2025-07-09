# Star Wars Single Page Application (Vue.js)

A responsive Vue.js application that displays Star Wars characters and planets data from the SWAPI (Star Wars API). Built with Vue 3, TypeScript, Sass and modern web technologies.

![App Home Screenshot](https://github.com/GetRawFish/star-wars-web-app/blob/develop/raw/screenshot-1.jpg)
![App People Screenshot](https://github.com/GetRawFish/star-wars-web-app/blob/develop/raw/screenshot-2.jpg)
![App Planets Screenshot](https://github.com/GetRawFish/star-wars-web-app/blob/develop/raw/screenshot-3.jpg)

## Features

- Browse Star Wars characters and planets
- Search and sort functionalities
- Responsive design with mobile support
- Detailed view for each entity with related data
- Client-side caching for better performance

## Local Setup & Run Instructions

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GetRawFish/star-wars-web-app.git
   cd star-wars-web-app
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   docker compose up
   ```
4. Open your browser to:
   ```text
   http://localhost:5173
   ```
   Testing

### Running Tests

To run unit tests with Vitest:

```bash
 npm run test:unit
 # or
 yarn test:unit
```

To run e2e tests with Playwright:

```bash
 npm run test:test:e2e
 # or
 yarn test:test:e2e
```

\*\* Before running first test you may install playwright on your machine:

```bash
npx playwright install --with-deps
```

## CI Integration

The project uses GitHub Actions for continuous integration. The CI pipeline includes:

1. ESLint checks
2. Unit tests with Vitest
3. Component tests
4. TypeScript type checking

View CI results in the GitHub Actions tab of the repository.

## Architectural Decisions

### State Management

The application doesn't use a dedicated state management library (like Pinia or Vuex) because:

- The state requirements are simple and can be handled effectively with Vue's built-in reactivity system
- Component-level state and props provide sufficient data flow for this application's needs
- Event buses and composables handle cross-component communication when needed
- This approach minimizes complexity while maintaining good performance

### Styling Approach

The application uses a combination of modern styling solutions:

1. Sass for advanced CSS features:

- Variables for theming and consistent values
- Nesting for better selector organization
- Mixins for reusable style patterns
- Import partials for modular CSS architecture

2. Component-scoped styles through:

- Vue SFC `<style lang="scss">` blocks
- CSS Modules for isolated component styles

Benefits of this combination:

- Sass provides powerful CSS preprocessing capabilities
- Scoped styles prevent naming conflicts
- Optimal production builds through PurgeCSS
- Maintainable and scalable styling architecture

### Component Architecture

The application follows Vue 3's Composition API with:

- Smart/Container components that manage data
- Dumb/Presentational components that handle UI
- Layout components for consistent page structure
- Composables for reusable logic

### Performance Optimizations

- Client-side caching of API responses
- Lazy loading of routes and heavy components
- Debounced search inputs
- Efficient pagination implementation
- Tree-shaking with Vite

### Project Structure

```text
src/
├── assets/          # Static assets
├── components/      # Reusable components
├── composables/     # Composition API functions
├── router/          # Vue router configuration
├── types/           # TypeScript definitions
├── views/           # Route components
├── App.vue          # Root component
└── main.ts          # Application entry
```

### License

MIT License
