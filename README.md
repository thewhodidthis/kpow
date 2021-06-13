## about

A featureless JS-only pipe-to-browser utility like [scat](https://github.com/hughsk/scat) sans dependencies. Comes in handy when running client side unit tests a-la [testling](https://github.com/substack/testling) for example.

## setup

Fetch the [latest stable version](https://npm.im/kpow) from the _npm_ registry:

```sh
# Add to package.json
npm install kpow --save-dev
```

## usage

Fires up a transient server on the `PORT` environment variable responding with the passed in file attached to an empty HTML page, then attempts to launch a browser prewiew using `-c, --command` in one go.

Override the _1999_ default port and `open(1)` command:

```sh
PORT=8080 npx kpow file.js -c xdg-open
```

Be piping:

```sh
echo "alert('coucou')" | cat - file.js | npx kpow
```
