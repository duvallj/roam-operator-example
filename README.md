# Roam Operator API

This repository contains a bare-bones demonstration of how you can use the Roam
Operator API. This is mostly a port of the [Quickstart Guide][1]
into Javascript to make it easier for you to use in your projects.

## Set up

This example requires the [Caddy](https://caddyserver.com/)
webserver, in order to proxy HTTP requests to the Roam API. You can find
instructions on how to install Caddy
[here](https://caddyserver.com/docs/install).

## Running

Once you have caddy installed, navigate to the repository root and type:

```
caddy run
```

into your terminal. You should then be able to access the example at
<http://localhost:2015/>.

Please refer to the [Quickstart Guide][1] and the source code inside this
repository for more details.

[1]: https://developer.ro.am/docs/operator/operator-api-alpha#quick-start
