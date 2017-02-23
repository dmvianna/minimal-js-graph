// D3

const d3Chart = {}

d3Chart.create = function (el, props, state) {
  // svg canvas
  const svg = d3.select(el).append('svg')
    .attr('class', 'd3')
    .attr('width', props.width)
    .attr('height', props.height)

  // First point
  svg.append('g')
    .attr('class', 'd3-line')
  this.update(el, state)
}

d3Chart._scales = function (el, domain) {
  if (!domain) {
    return null
  }
  const width = el.offsetWidth
  const height = el.offsetHeight

  const x = d3.scaleLinear()
    .range([0, width])
    .domain(domain.x)
  const y = d3.scaleLinear()
    .range([height, 0])
    .domain(domain.y)
  return { x, y }
}

d3Chart.update = function (el, state) {

  // remove old line and axes
  d3.select(el).select('.d3-line').select('path').remove()
  d3.select(el).selectAll('.xAxis').remove()

  // get canvas
  const svg = d3.select(el).select('svg')

  // axis
  const scales = this._scales(el, state.domain)
  const xAxis = d3.axisBottom().scale(scales.x)
  const yAxis = d3.axisLeft().scale(scales.y)
  svg.append('g')
    .attr('class','xAxis')
    .attr('transform','translate(0,0)')
    .call(xAxis)
  svg.append('g')
    .attr('class','yAxis')
    .attr('transform','translate(0,0)')
    .call(yAxis)

  // lines
  const g = d3.select(el).selectAll('.d3-line')
  const line = d3.line()
    .y(d => scales.y(Math.max( ...state.domain.y) - d.y))
    .x(d => scales.x(d.x))
  g.append('path')
    .datum(state.data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 2)
    .attr('d', line)
}

const Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },
  componentDidMount: function () {
    const el = ReactDOM.findDOMNode(this)
    d3Chart.create(el, {
      width: '110%',
      height: '110%'
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
      data: [{
        id: 9,
        y: 0,
        x: 10 // start from max x axis (far right of the graph)
      }],
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
      let oldStateData = this.state.data

      if (oldStateData.length > 10) {
        oldStateData.shift()
      }

      oldStateData = oldStateData.map(d => {
        d.x = d.x - 1
        return d
      })
        
      const newData = parseInt(event.data)
      oldStateData.push({
        id: oldStateData[oldStateData.length - 1].id + 1,
        x: oldStateData[oldStateData.length - 1].x + 1,
        y: newData
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
