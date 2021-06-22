## about

A featureless JS-only pipe-to-browser utility like [scat](https://github.com/hughsk/scat) sans deps, which comes in handy when running client side unit tests a-la [testling](https://github.com/substack/testling) for example. At core equivalent to:

```sh
printf 'HTTP/1.1 200 OK\r\n\n%s\n' "<script>console.log('coucou');</script>" | nc -c -l 1234
```

## setup

Download from the _npm_ registry:

```sh
# Add to package.json
npm install kpow --save-dev
```

## usage

Fires up a transient server on a random port with the passed in file attached to an empty HTML page, then attempts to launch a browser prewiew using `-c` in one go.

Override the default `open(1)` command:

```sh
npx kpow -c xdg-open file.js
```

Be piping:

```sh
echo "alert('coucou')" | cat - file.js | npx kpow
```
