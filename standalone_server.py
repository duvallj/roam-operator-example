#!/usr/bin/env python3

import http.server
import json
import traceback
import urllib.error
import urllib.parse
from http import HTTPStatus
from typing import LiteralString


import roam_api


class ProxyingHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    A server that proxies all requests to "/v0/*" to a backend service, and
    looks in the filesystem for all other requests.

    This is only provided so you can get started with the example without
    having to install any other software, it is **NOT** intended to be used as
    a base upon which to build a real server!
    """

    def do_GET(self) -> None:
        if self.path.startswith('/v0/'):
            try:
                parsed = urllib.parse.urlparse(self.path)
                body = urllib.parse.parse_qs(parsed.query)
                body = {key: value[0] for key, value in body.items()}
                return self.proxy_to_roam_api("GET", parsed.path[len('/v0/'):], body)
            except Exception as e:
                self.log_error("\n".join(traceback.format_exception(e)))
                self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR)
                return

        return super().do_GET()

    def do_POST(self):
        if self.path.startswith('/v0/'):
            try:
                parsed = urllib.parse.urlparse(self.path)
                l = self.headers.get('Content-Length')
                body = self.rfile.read(int(l if l else "0"))
                body = json.loads(body)
                return self.proxy_to_roam_api("POST", parsed.path[len('/v0/'):], body)
            except Exception as e:
                self.log_error("\n".join(traceback.format_exception(e)))
                self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR)
                return

        return self.send_error(HTTPStatus.BAD_REQUEST)

    def proxy_to_roam_api(self, method: LiteralString, path: str, body: dict[str, str]):
        """
        Proxies the current request to the Roam API
        """
        authorization = self.headers.get('Authorization')
        if not authorization or not authorization.startswith('Bearer '):
            return self.send_error(HTTPStatus.UNAUTHORIZED)

        api_key = authorization[len('Bearer '):]
        client = roam_api.Client(api_key)
        res = client.make_request(method, path, body)

        self.send_response(HTTPStatus.OK)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

        res = json.dumps(res)
        self.wfile.write(res.encode('utf-8'))


def run(address: str = '', port: int = 8000):
    print(
        f"serving on http://{'localhost' if not address else address}:{port}/")
    httpd = http.server.ThreadingHTTPServer(
        (address, port), ProxyingHTTPRequestHandler)
    httpd.serve_forever()


if __name__ == "__main__":
    run(port=2015)
