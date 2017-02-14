
const ws = new WebSocket("ws://parrot:3000/")

ws.onopen = () => ws.send("ok")
ws.onmessage = (event, flags) => ws.send(event.data)

const GraphDashboard = React.createClass({
    getInitialState: function() {
    return {
//      int: int
    }
  },
  render: function () {
    return (
      <h1>insert graph here</h1>
    )
  }
})

ReactDOM.render(
  <GraphDashboard />,
  document.getElementById('content')
)
