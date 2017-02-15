# minimal-js-graph

This is a toy full stack implementation of:

- A server that sends (random) data to the client via [Websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API);
- A client that displays that data in a live chart ([D3](https://d3js.org/)).

Barebones, sure. If you want to try it yourself, just replace

`/assets/app.js`
```js
 this.ws = new WebSocket("ws://parrot:3000/")
```

with the address of your server ("localhost"?) and you should be fine.
