package main

import (
	_ "embed"
	"flag"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path"
)

//go:embed index.html
var body []byte

func main() {
	var opener string
	var script string

	flag.StringVar(&opener, "c", "open", "Command to use for calling the browser")
	flag.StringVar(&script, "i", "", "Path to JS input")

	flag.Parse()

	if script == "" {
		script = flag.Arg(0)
	}

	// Attempt to file open input script.
	file, err := os.Open(script)

	if err != nil {
		if os.IsNotExist(err) {
			// Fall back to reading from standard input.
			file = os.Stdin
		} else {
			log.Fatal(err)
		}
	}

	defer file.Close()

	// Load JS bytes.
	seed, err := ioutil.ReadAll(file)

	if err != nil {
		log.Fatal(err)
	}

	// Choose a random port.
	// https://stackoverflow.com/questions/how-to-use-next-available-port-in-http-listenandserve
	ln, err := net.Listen("tcp", "localhost:0")

	if err != nil {
		log.Fatal(err)
	}

	defer ln.Close()

	// The browser can connect now because the listening socket is open.
	// https://stackoverflow.com/questions/get-notified-when-http-server-starts-listening
	err = exec.Command(opener, "http://"+ln.Addr().String()).Start()

	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		if path.Base(req.URL.Path) == "seed.js" {
			// Locate the Server to be calling Close on.
			ctx := req.Context()
			srv := ctx.Value(http.ServerContextKey).(*http.Server)

			go func() {
				if err := srv.Close(); err != nil {
					log.Fatal(err)
				}
			}()

			// This is necessary when the script loading tag is of type module.
			res.Header().Set("Content-Type", "application/javascript; charset=utf-8")
			res.Header().Set("Connection", "close")

			body = seed
		}

		_, err := res.Write(body)

		if err != nil {
			log.Fatal(err)
		}
	})

	// Start the blocking server loop.
	if err = http.Serve(ln, nil); err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
