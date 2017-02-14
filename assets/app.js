
const GraphDashboard = React.createClass({
  componentWillMount: function () {
    this.ws = new WebSocket("ws://parrot:3000/")
    this.ws.onopen = () => this.ws.send("ok")
  },
  componentDidMount: function () {
    this.ws.onmessage = (event, flags) => {
      const stateData = this.state.data
      if (stateData.length > 10) {
        stateData.shift()
      }
      stateData.push(event.data) 
      this.setState({ data: stateData })
    }
  },
  getInitialState: function () {
    return {
      data: [0]
    }
  },
  render: function () {
    return (
      <h1>{this.state.data}</h1>
    )
  }
})

ReactDOM.render(
  <GraphDashboard />,
  document.getElementById('content')
)
