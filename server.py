#!/usr/bin/env python3

import asyncio
import queue
from flask import Flask, send_file, request, Response
import urllib.parse
import urllib.request
import roam_api
from typing import Any

app = Flask(__name__)


@app.route('/')
@app.route('/index.html')
def index():
    return send_file('index.html')


@app.route('/roam-api.js')
def js():
    return send_file('roam-api.js')


@app.route('/v0/<path>', methods=['GET', 'POST'])
def proxy(path):
    req = urllib.request.Request(
        url=urllib.parse.urljoin(
            roam_api.ROAM_BASE_URL, path) + "?" + request.query_string.decode(),
        data=request.get_data(),
        headers={k: request.headers.get(k, "") for k in [
            'Authorization', 'Content-Type', 'Accept'] if request.headers.get(k)},
        method=request.method,
    )
    with urllib.request.urlopen(req) as res:
        excluded_headers = {'content-encoding',
                            'content-length', 'transfer-encoding', 'connection'}
        return Response(response=res.read(), status=res.status, headers={k: v for k, v in res.headers.items() if k.lower() not in excluded_headers})


received_events: queue.Queue[dict[str, Any]] = queue.Queue()


# Flask doesn't have websocket support by default, so the best we can do is polling with a long timeout
@app.route('/next-event')
async def next_knock():
    try:
        event = await asyncio.to_thread(received_events.get, timeout=5)
        return event
    except queue.Empty:
        return {'type': 'retry'}


@app.route('/webhook', methods=['POST'])
def webhook():
    event = request.get_json()
    received_events.put(event)

    return Response()
