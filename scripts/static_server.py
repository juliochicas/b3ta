#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import sys


def main():
    port = 8080
    host = "0.0.0.0"
    args = sys.argv[1:]
    for index, arg in enumerate(args):
        if arg in {"--port", "-p"} and index + 1 < len(args):
            try:
                port = int(args[index + 1])
            except ValueError:
                pass
        elif arg in {"--host", "--bind", "-b"} and index + 1 < len(args):
            host = args[index + 1]
        else:
            try:
                port = int(arg)
            except ValueError:
                pass

    server = ThreadingHTTPServer((host, port), SimpleHTTPRequestHandler)
    print(f"Serving static site on http://{host}:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()