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

    var margin = { top: 5, right: 20, bottom: 10, left: 10 };

    var width = parseInt(container.style('width')) - margin.left - margin.right;
    var height = 160 - margin.top - margin.bottom;

    var max = d3.max(data, function (d) { return d.value + d.right; });
    var min = d3.min(data, function (d) { return d.value - d.left; });
    var midpoint = min - ((min - max) / 2);

    var x = d3.scaleLinear()
      .domain([midpoint - 0.5, midpoint + 0.5])
      .range([margin.left, width - margin.right]);

    var svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    svg.append('defs')
      .append('marker')
        .attr('id', 'arrow-right')
        .attr('viewBox', '0 -4 8 8')
        .attr('refX', 4)
        .attr('refY', 0)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('orient', 0)
      .append('path')
        .attr('d', 'M0,-4L8,0L0,4');

    svg.append('defs')
      .append('marker')
        .attr('id', 'arrow-left')
        .attr('viewBox', '0 -4 8 8')
        .attr('refX', 4)
        .attr('refY', 0)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('orient', 180)
      .append('path')
        .attr('d', 'M0,-4L8,0L0,4');

    // Draw the axis
    var axis = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (height - margin.bottom) + ')');

    axis.append('line')
        .attr('x1', 0)
        .attr('x2', 100)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('marker-start', 'url(#arrow-left)');

    axis.append('text')
        .attr('x', 20)
        .attr('y', 20)
        .attr('text-anchor', 'start')
        .text('eher links');

    axis.append('line')
        .attr('x1', width - 100 - margin.left)
        .attr('x2', width - margin.left)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('marker-end', 'url(#arrow-right)');

    axis.append('text')
        .attr('x', width - margin.left - 20)
        .attr('y', 20)
        .attr('text-anchor', 'end')
        .text('eher rechts');

    var group = svg.append('g')
        .attr('transform', 'translate(0,' + margin.top + ')');

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

  // Let's hope Mike Bostock never sees this
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
