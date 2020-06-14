## about

A featureless JS-only pipe-to-browser utility like [scat](https://github.com/hughsk/scat) sans dependencies. Comes in handy when running client side unit tests a-la [testling](https://github.com/substack/testling).

## setup

Fetch the latest stable version from the _npm_ registry:

```sh
# Add development dependency
npm install kpow --save-dev
```

## usage

Fires up a transient server on the `PORT` environment variable responding with the passed in JavaScript file or snippet attached to an empty HTML page, then attempts to open a browser prewiew according to [`process.platform`](https://nodejs.org/api/process.html#process_process_platform) all in one go. 

To override the _1999_ default port:

```sh
PORT=8080 npx kpow file.js
```

Be piping:

```sh
echo "alert('coucou')" | cat - file.js | npx kpow
```
