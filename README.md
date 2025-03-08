# Roam Operator API Example

This repository contains a bare-bones demonstration of how you can use the Roam
Operator API. This is mostly a port of the [Quickstart Guide][1]
to make it easier for you to quickly integrate the Roam API into your projects.

## Setup

There are two options for running this example. You can run it with a Python 3
installation, or you can run it by installing Caddy.

### Python Setup

Any version of Python 3.10 or newer should work with this example. Navigate to
the repository root and run:

```
python3 standalone_server.py
```

You should see the text "serving on <http://localhost:2015/>". Clicking on that
link will take you to a website where you can run the rest of the
[Quickstart Guide][1] instructions.

### Caddy Setup

[Caddy](https://caddyserver.com/) is general-purpose web server software, and
is recommended for building larger projects. You can find instructions on how
to install Caddy [here](https://caddyserver.com/docs/install).

Once you have caddy installed, navigate to the repository root and type:

```
caddy run
```

into your terminal. You should then be able to access the example at
<http://localhost:2015/>.

Please refer to the [Quickstart Guide][1] and the source code inside this
repository for more details.

## Webhooks

If you don't want to poll the Roam API, see the
[`knock.ready`](https://developer.ro.am/docs/operator/knock-ready) event for
knowing when a given knock ID is ready.

Webhooks require a server accessible from the open internet. It can be run
locally with [ngrok](https://ngrok.com/), or on a Director flask image. Either
way, please install all the dependencies with:

```
pip install flask[async]
```

And to run the server, run

```
flask --app server run
```

In the Roam Administration > Developer page where you set up your API key,
add the webhook URL `https://<your hostname}/webhook`, and switch on the event
"job:ready".

[1]: https://developer.ro.am/docs/operator/operator-api-alpha#quick-start
