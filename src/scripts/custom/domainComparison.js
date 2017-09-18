var DomainComparison = function () {

  var id, data, colors;

  function init(options) {

    id = options.id;
    data = options.data;
    colors = options.colors;

    draw(id, data);
  }

  function draw(id, data) {

    var margin = { top: 10, right: 10, bottom: 10, left: 30 };

    var width = 150 - margin.left - margin.right;
    var height = 150 - margin.top - margin.bottom;

    var keys = Object.keys(data[0].values);

    var x = d3.scaleBand()
        .padding(0.5)
        .domain(keys)
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(data, function (d) {
          return d3.max(keys, function (key) {
            return d.values[key];
          });
        })])
        .nice();

    var yAxis = d3.axisLeft(y)
      .ticks(3)
      .tickFormat(function(d) { return d + ' %'; })
      .tickSize(0);

    var xAxis = d3.axisBottom(x)
      .ticks(0)
      .tickFormat(function(d) { return ''; })
      .tickSize(0);

    var container = d3.select('#' + id)
      .selectAll('div')
        .data(data)
        .enter()
      .append('div')
        .classed('small', true);

    var plot = container
      .append('svg')
        .attr('id', 'chart-' + id)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    plot.append('g')
      .selectAll('rect')
        .data(function (d) {
          return Object.keys(d.values).map(function (key) {
            return {
              key: key,
              value: d.values[key]
            };
          });
        })
        .enter()
      .append('rect')
        .attr('x', function (d) { return x(d.key); })
        .attr('y', function (d) { return y(d.value); })
        .attr('width', x.bandwidth())
        .attr('height', function (d) { return height - y(d.value); })
        .attr('fill', function (d) { return colors[d.key]; })
        .attr('fill-opacity', function (d) { return colors[d.key]; });

    container.append('p')
        .text(function (d) { return d.domain; });

    plot.append('g')
        .call(yAxis);

    plot.append('g')
        .attr('transform', 'translate(0,' + height +')')
        .call(xAxis);
  }

  function resize() {

  }

  return {

    init: init,
    draw: draw,
    resize: resize
  };
};
