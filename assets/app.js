// D3

const d3Chart = {}

d3Chart.create = function (el, props, state) {
  const svg = d3.select(el).append('svg')
    .attr('class', 'd3')
    .attr('width', props.width)
    .attr('height', props.height)
  svg.append('g')
    .attr('class', 'd3-points')
  this.update(el, state)
}

d3Chart._scales = function (el, domain) {
  if (!domain) {
    return null
  }
  const width = el.offsetWidth
  const height = el.offsetHeight

  const x = d3.scaleOrdinal()
    .range([0, width])
    .domain(domain.x)
  const y = d3.scaleLinear()
    .range([0, height])
    .domain(domain.y)
  return { x, y }
}

d3Chart.update = function (el, state) {
  const g = d3.select(el).selectAll('.d3-points')
  const point = g.selectAll('.d3-point')
    .data(state.data)
  point.enter().append('circle')
    .attr('class', 'd3-point')
  point
    .attr('cy', d => d.val)
    .attr('cx', d => d.id)
    .attr('r', d => 5)
  point.exit().remove()
  const scales = this._scales(el, state.domain)
  const prevScales = this._scales(el, state.prevDomain)
  this._drawPoints(el, scales, state.data, prevScales)
}

d3Chart._drawPoints = function (el, scales, data, prevScales) {
  const g = d3.select(el).selectAll('.d3-points')
  const point = g.selectAll('.d3-point')
    .data(data, function(d) { return d.id })
  point.enter().append('circle')
    .attr('class', 'd3-point')
    .attr('cx', d => {
      if (prevScales) {
        return prevScales.x(d.id)
      }
      return scales.x(d.id)
    })
  point
    .attr('cx', d => scales.x(d.id))
    .attr('cy', d => scales.y(d.val))
  point.exit().remove()
}

const Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },
  componentDidMount: function () {
    const el = ReactDOM.findDOMNode(this)
    d3Chart.create(el, {
      width: '100%',
      height: '300px'
    }, this.getChartState())
  },
  componentDidUpdate: function () {
    const el = ReactDOM.findDOMNode(this)
    d3Chart.update(el, this.getChartState())
  },
  getChartState: function () {
    return {
      data: this.props.data,
      domain: this.props.domain
    }
  },
  componentWillUnmount: function () {
    const el = ReactDOM.findDOMNode(this)
    d3Chart.destroy(el)
  },
  render: function () {
    return (
      <div className="Chart"></div>
    )
  }
})

// React

const GraphDashboard = React.createClass({
  getInitialState: function () {
    return {
      data: [{ id: 0, val: 0}],
      domain: {
        x: [0, 10],
        y: [0, 10]
      }
    }
  },
  componentWillMount: function () {
    this.ws = new WebSocket("ws://parrot:3000/")
    this.ws.onopen = () => this.ws.send("ok")
  },
  componentDidMount: function () {
    this.ws.onmessage = (event, flags) => {
      const oldStateData = this.state.data
      if (oldStateData.length > 10) {
        oldStateData.shift()
      }
      const newData = event.data
      oldStateData.push({
        id: oldStateData[oldStateData.length - 1].id + 1,
        val: newData
      })
      this.setState({ data: oldStateData })
    }
  },
  render: function () {
    return (
      <div className='Dashboard'>
        <Chart
          data={this.state.data}
          domain={this.state.domain}
        />
      </div>
    )
  }
})

ReactDOM.render(
  <GraphDashboard />,
  document.getElementById('content')
)
