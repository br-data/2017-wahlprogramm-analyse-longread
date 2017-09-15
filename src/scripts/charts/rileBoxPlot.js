var RileBoxPlot = function () {

  var id, data, colors;

  function init(options) {

    id = options.id;
    data = options.data;
    colors = options.colors;

    draw();
  }

  function draw() {

    var container = d3.select('#' + id);

    var margin = { top: 15, right: 20, bottom: 20, left: 10 };

    var width = parseInt(container.style('width')) - margin.left - margin.right;
    var height = 150 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
      .domain([-1, 1])
      .range([margin.left, width - margin.right]);

    var svg = container.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    // Draw the axis
    svg.append('g')
        .attr('transform', 'translate(0,' + 130 + ')')
        .attr('class', 'axis')
        .call(d3.axisBottom(x));

    var group = svg.append('g');

    // Draw the deviation lines
    group.selectAll('line')
        .data(data)
        .enter()
      .append('line')
        .attr('x1', function (d) { return x(d.value - d.left); })
        .attr('x2', function (d) { return x(d.value + d.right); })
        .attr('y1', function (d, i) { return i * 20 + 7.5; })
        .attr('y2', function (d, i) { return i * 20 + 7.5; })
        .attr('stroke', function (d) { return colors[d.party]; })
        .attr('stroke-width', 4.5);

    // Draw the median line
    group.selectAll('circle')
        .data(data)
        .enter()
      .append('circle')
        .attr('cx', function (d) { return x(d.value); })
        .attr('cy', function (d, i) { return (i * 20) + 7.5; })
        .attr('r', 7.5)
        .attr('fill', '#fff')
        .attr('stroke', function (d) { return colors[d.party]; })
        .attr('stroke-width', 2);
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
