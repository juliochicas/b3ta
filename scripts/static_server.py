#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import argparse


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("port", nargs="?", type=int)
    parser.add_argument("--port", dest="flag_port", type=int)
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--bind", dest="host")
    args, _ = parser.parse_known_args()

    port = args.flag_port or args.port or 8080
    server = ThreadingHTTPServer((args.host, port), SimpleHTTPRequestHandler)
    print(f"Serving static site on http://{args.host}:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()