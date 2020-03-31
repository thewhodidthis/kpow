A featureless JS-only pipe to browser utility like [scat](https://github.com/hughsk/scat) sans deps. 

Fires up a transient server on `PORT` responding with the passed in JavaScript file or snippet attached to an empty HTML page, then attempts to open a browser prewiew according to [`process.platform`](https://nodejs.org/api/process.html#process_process_platform) all in one go. Potential uses include running client side unit tests.

To override the _1999_ default port,
```sh
PORT=8080 npx kpow file.js
```

To pipe file contents,
```sh
cat file.js | npx kpow
```

Or to pipe a JS snippet directly,
```sh
echo "alert('coucou')" | npx kpow
```
