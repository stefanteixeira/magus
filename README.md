<picture>
  <img src="./public/images/magus.png" height="100" alt="Magus logo" />
</picture>

# Magus: a Game Backlog wizard 🧙

Simple app to manage a personal game backlog, inspired by the excellent shelf management from [Grouvee](https://www.grouvee.com/) and fetching data from [IGDB API](https://api-docs.igdb.com/#getting-started). Name is inspired by one of the coolest JRPG characters: Magus from Chrono Trigger.

## Motivation

Have a lightweight app to manage my game backlog and collection, allowing me to:

- Keep just the most relevant game information
- Store data in a local DB, to not rely on external requests and have an easier backup process
- Easily edit game data, in case it is absent or incomplete on IGDB
- Fetch how long to beat information from [HowLongToBeat](https://howlongtobeat.com/)
- Fetch game difficulty information from [GameFAQs](https://gamefaqs.gamespot.com/)

## Setup

The app is written using [Next.js](https://nextjs.org/), TypeScript, [Tailwind](https://tailwindcss.com/) and [daisyUI](https://daisyui.com/) component library. Data is stored in a SQLite database, using [Drizzle](https://orm.drizzle.team/) as an ORM.

### Requirements

In order to run it locally, you will need:

- Node 20 ([nvm](https://github.com/nvm-sh/nvm) is recommended to install and manage Node versions)
- A Twitch Account registered in the [Twitch Developer Portal](https://dev.twitch.tv/console/apps/create)
  - This is required to use IGDB API, further details can be found in their [docs here](https://api-docs.igdb.com/#getting-started)
  - With Twitch Client ID and Client Secret in place, set them as environment variables. Use the `.env.local.example` to create a `.env.local` file with your credentials

### Running the app

- Ensure that you have a `.env.local` file with proper credentials in place
- Install dependencies: `npm install`
- Build the project: `npm run build`
- Create the DB: `npm run db:schema && npm run db:migrate`
- Start the app:
  - Development mode: `npm run dev`
  - Production mode: `npm run start`

App will be available in `http://localhost:3000`.

### Accessing from a Mobile device

The app is responsive enough on Mobile (i.e. not broken, it's decent 😅). You can use [ngrok](https://ngrok.com/download) to create a tunnel and access from your phone.

**PS:** If you are accessing from iOS and is not seeing the background and dark theme, you might have a too old iOS version. I had problems with that on iOS 16.0. Upgrading to the latest (17) fixed it completely.

## How it works?

### Search

Search a game from IGDB database and add it to your games list. When adding a game to your list, you can:

- Edit any information (useful when any data is missing from IGDB)
- Set a star rating
  - Note that half star rating is supported
- Save the game to a shelf
  - Shelves available: _Playing_, _Played_, _Wishlist_, _Backlog_ and _Priority_
- Fetch how long to beat information from HowLongToBeat
  - If it is not available, it will try fetching game length from GameFAQs
- Fetch game difficulty information from GameFAQs

### My Games

Main page from the app, where you can view the list of games and manage your backlog/collection. From this page, multiple actions are possible:

- Filtering
  - Filter games by Name/Platform/Shelf/Genre
  - Change pagination size (defaults to 30 games per page)
- Ordering
  - Click on the column header to change the list ordering. Supported in the following columns: _Name_, _Release Date_, _Finished Date_, _HLTB_, _Difficulty_ and _My Rating_
- View game details (clicking on the game name)
- Set or update a game rating
- Set or update a game shelf
- Edit game information
- Delete a game

### Stats

> [!WARNING]
> This page is a work in progress! Currently, it shows a list of covers from games in the `Played` shelf, filtered by year and supporting ordering by _Name_ or _Finished Date_.

### Add from scratch

It is possible to add a game completely from scratch, without relying on IGDB. This is helpful when a game doesn't exist on IGDB or if it has a lot of missing/incorrect information.

## Testing

Tests are located in `__tests__` folder in the repository root. For now, there are tests in two levels:

- Unit tests, using [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- End-to-end tests, using [Playwright](https://playwright.dev/)
  - These tests use a sample DB (`sqlite_test.db`)

### Running tests

To run unit tests:

- `npm run test`
- `npm run test:coverage` (will save a HTML coverage report inside `coverage` folder)

To run end-to-end tests:

- Ensure that you have `SQLITE_DB_FILENAME` environment variable in your `.env.local` pointing to the test DB (`sqlite_test.db`)
- Install chromium for Playwright: `npx playwright install chromium`
- Run tests: `npx playwright test`

### CI

Tests are run on CI with GitHub Actions: [ci.yml](https://github.com/stefanteixeira/magus/blob/main/.github/workflows/ci.yml)

## TODO

- Migrate to [Next.js App Router](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- Extract Form component
- Set up charts
- Set up Visual Regression tests

## Support

If this project was helpful for you and you want to support it, you can buy me a coffee at ko-fi 😄☕️

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/D1D6SLL0Y)

## License

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
