# react-scripts

### install

```shell
npm i @geckoai/react-scripts
# or
yarn add @geckoai/react-scripts
```

### create app

1. Global install the package `@geckoai/react-scripts`;

```shell
# mac/ubuntu
sudo npm i -g @geckoai/react-scripts
# windows
npm i -g @geckoai/react-scripts
```

2. Create a app

```shell
# input your app-name
react-scripts create app-name

# in your app-name
cd app-name

# start the app
yarn start
# or
npm start
```
### start

```shell
npm start
# or
yarn start
```

### build

```shell
npm build
# or
yarn build
```


### Close bundleAnalyzer

Open file `project.config.js`

```ts
{
  /**
   * BundleAnalyzerPlugin
   * https://www.npmjs.com/package/webpack-bundle-analyzer
   */
  bundleAnalyzer: null
}
```

### Start args

```shell
# boot of dev mode
react-scripts start -M 8192

# boot of build mode
react-scripts build -M 8192

```
or change file `package.json` field `scripts`:

```json
{
  "scripts": {
    "start": "react-scripts start -M 8192",
    "build": "react-scripts build -M 8192"
  }
}
```
