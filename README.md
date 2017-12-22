# Leflair Website - Client Application

- Yarn
- React
- Typescript
- Webpack
- CSS Modules
- Express
- Server-Side Rendering

## Setup Guide

### 1. Install Yarn

This project uses `yarn` for dependency locking and faster installation.

Mac users can install `yarn` using Homebrew or MacPorts. Note that the installation command for homebrew is different if you are using `nvm` to manage node versions.

```sh
brew install yarn # homebrew
brew install yarn --ignore-dependencies # homebrew with nvm
sudo port install yarn # macports
```

Windows users can install `yarn` using Chocolatey:

```sh
choco install yarn
```

WSL or Ubuntu users can install from the `yarn` package repo:

```sh
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```

Users of other Linux distros should refer to [the documentation](https://yarnpkg.com/lang/en/docs/install/#linux-tab).

### 2. Install & run the app

```sh
yarn install && yarn run develop
```

## Development Mode

Development mode does not implement server-side rendering. Instead, it uses Webpack Dev Server and React Hot Loader to offer hot-reload of React code and CSS modules.

`yarn run develop` starts the dev server.

Configuration for the dev server can be found in: `webpack/develop.config.js`

## Production Build

`yarn run build` builds the project's distributable bundles and outputs them to the `dist` directory.

The build process uses tree shaking, code minification and ahead-of-time compression (gizp) to produce self-contained server and client bundles.

## Known Issues

### CSS Modules, Webpack & Typescript

We are using the `typings-for-css-modules-loader` to generate Typescript definitions for our CSS modules. This gives us fancy stuff like intellisense for CSS.

There are two known issues with this:

1. The Webpack loader will only generate the typings file if the component importing the stylesheet is in use in the application.
2. After generating the typings file for the first time, Webpack needs to be restarted so that it can add the newly-created file to its cache.

# Router

This project contains a very simple, lightweight router. Routes may be registered by adding a route object to the `routes` array in the `src/app/router.tsx` file.

Route paths use Express parameter syntax. The router can handle two different kinds of routes. Component routes and Action routes.

## Component Routes

The simplest kind of route, a component route simply renders the supplied component, injecting any route params.

```typescript
    { route: '/sale/:saleId', component: SaleComponent }

    // The SaleComponent will receive { params: { saleId: 'whatever' } } as props
```

## Action Routes

Action routes accept an async function which resolves to a component. The function will be called and the returned component rendered.

This can be useful for loading data asynchronously before rendering a view.

```typescript
    const loadSaleAndRender = async (params) => {
        const data = await fetch(`endpoint/path/${params.saleId}`);

        return <SaleComponent data={data} />;
    }

    { route: '/sale/:saleId', action: loadSaleAndRender }

    // The loadSaleAndRender function will receive { saleId: 'whatever' } as params
```

# Project Guidelines

## Static Assets

Files in the `webpack/assets` directory will be copied to `dist/public` as part of the build process and served by the application in production.

For example, an image stored in `webpack/assets/images/logo.png` would be available at `http://deployment-domain.com/images/logo.png` in production.

## Translation Files

I18n files are stored in `webpack/assets/locales` and copied into the distribution bundle as part of the build process (see also "Static Assets").

## Server-Side Rendering

Only pages which are entirely static content (linked in footer) or which are publicly-facing and fetch data from the server (home, sale, product etc.) should be server-rendered.

Pages like login and the account management screens do not need to be SSR-capable. We can reduce development effort by only implementing SSR for pages where it will have a major impact.

## Prefer Stateless Functional Components

