var RileTimeline = function () {

  var id, data, colors;

  function init(_id, _data, _colors) {

    id = _id;
    data = _data;
    colors = _colors;

    draw();
  }

  function draw() {

    var container = d3.select('#' + id);

    var margin = { top: 20, right: 20, bottom: 30, left: 40 };

    var width = parseInt(container.style('width')) - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;

    var svg = container
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scaleLinear()
      .range([0, width])
      .domain([-0.65, 0.55]);

    var y = d3.scaleLinear()
      .range([0, height])
      .domain(d3.extent(
        d3.merge(data.map(function (d) {
          return d3.extent(d.values, function (e) {
            return e.date;
          });
        }))
      ));

    var line = d3.line()
        .x(function(d) { return x(d.rile); })
        .y(function(d) { return y(d.date); });

    var dotted = d3.line()
        .x(function(d) { return x(d.rile); })
        .y(function(d) { return y(d.date); });

    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    svg.append('g')
        .call(d3.axisLeft(y)
          .tickValues([2002,2005,2009,2013,2017])
          .tickFormat(d3.format('.0f'))
        );

    var group = svg.selectAll('groups')
        .data(data)
        .enter()
      .append('g');

    group.selectAll('paths')
        .data(function (d) {
          return [d.values.filter(function (e) {
            return e.date <= 2013;
          })];
        })
        .enter()
      .append('path')
        .attr('stroke', function (d) { return colors[d[0].party]; })
        .attr('stroke-width', 4.5)
        .attr('fill', 'none')
        .attr('d', line);

    group.selectAll('paths')
        .data(function (d) {
          return [d.values.filter(function (e) {
            return e.date >= 2013;
          })];
        })
        .enter()
      .append('path')
        .attr('stroke', function (d) { return colors[d[0].party]; })
        .attr('stroke-width', 2.25)
        .attr('stroke-dasharray', ('5, 5'))
        .attr('fill', 'none')
        .attr('d', dotted);

    group.selectAll('circles')
        .data(function (d) { return d.values; })
        .enter()
      .append('circle')
        .attr('cx', function (d) { return x(d.rile); })
        .attr('cy', function (d) { return y(d.date); })
        .attr('r', 7.5)
        .attr('stroke', function (d) { return colors[d.party]; })
        .attr('stroke-width', '2')
        .attr('fill', '#fff');
  }

  function resize() {

    d3.select('#' + id + ' svg').remove();

    draw();
  }

  // Export global functions
  return {

    init: init,
    draw: draw,
    resize: resize
  };
};
