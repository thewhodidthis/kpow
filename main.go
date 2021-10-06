package main

import (
	_ "embed"
	"flag"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"strings"
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
	seed, err := io.ReadAll(file)

	if err != nil {
		log.Fatal(err)
	}

	// Choose a random port.
	// https://stackoverflow.com/questions/how-to-use-next-available-port-in-http-listenandserve
	l, err := net.Listen("tcp", "localhost:0")

	if err != nil {
		log.Fatal(err)
	}

	defer l.Close()

	// The browser can connect now because the listening socket is open.
	// https://stackoverflow.com/questions/get-notified-when-http-server-starts-listening
	err = exec.Command(opener, "http://"+l.Addr().String()).Run()

	if err != nil {
		log.Fatal(err)
	}

	// Ignore off chance favicon requests.
	http.Handle("/favicon.ico", http.NotFoundHandler())
	http.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		if strings.HasSuffix(req.URL.Path, ".js") {
			// Unblock, exit.
			defer func() {
				if f, ok := w.(http.Flusher); ok {
					f.Flush()
				}

				// Locate the current server instance.
				ctx := req.Context()
				srv := ctx.Value(http.ServerContextKey).(*http.Server)

				if err := srv.Close(); err != nil {
					log.Fatal(err)
				}
			}()

			// Added because http.DetectContentType thinks it's "text/plain".
			w.Header().Set("Content-Type", "text/javascript; charset=utf-8")
			w.Header().Set("Connection", "close")

			body = seed
		}

		_, err := w.Write(body)

		if err != nil {
			log.Fatal(err)
		}
	})

	// Start the blocking server loop.
	if err = http.Serve(l, nil); err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
