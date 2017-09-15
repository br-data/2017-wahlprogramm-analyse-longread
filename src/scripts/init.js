document.addEventListener('DOMContentLoaded', init);
//window.addEventListener('load', init);

function init() {

  var timeout;


  var colors = {
    'AfD': '#129ee6',
    'CDU/CSU': '#121212',
    'FDP': '#ffdd00',
    'SPD': '#d71f1d',
    'Grüne': '#0a8000',
    'Die Linke': '#be3075'
  };

  var timeline = new RileTimeline();

  d3.json('./data/rileTimeline.json', function (data) {

    timeline.init({id: 'rile-timeline', data: data, colors: colors });
  });

  var comparison = new DomainComparison();

  d3.json('./data/domainComparison.json', function (data) {

    comparison.init({id: 'domain-comparison', data: data, colors: colors });
  });

  var welfare = new RileBoxPlot();

  d3.json('./data/rileBoxPlot.json', function (data) {

    welfare.init({id: 'rile-welfare', data: data['Welfare and Quality of Life'], colors: colors });
  });

  var economy = new RileBoxPlot();

  d3.json('./data/rileBoxPlot.json', function (data) {

    economy.init({id: 'rile-economy', data: data['Economy'], colors: colors });
  });

  var external = new RileBoxPlot();

  d3.json('./data/rileBoxPlot.json', function (data) {

    external.init({id: 'rile-external', data: data['External Relations'], colors: colors });
  });

  var society = new RileBoxPlot();

  d3.json('./data/rileBoxPlot.json', function (data) {

    society.init({id: 'rile-society', data: data['Fabric of Society'], colors: colors });
  });

  navigation.init();
  marginals.init();

  window.onresize = function () {

    clearTimeout(timeout);
    timeout = setTimeout(function () {

      timeline.resize();
      comparison.resize();
      welfare.resize();
      economy.resize();
      external.resize();
      society.resize();

      marginals.reorder();
    }, 200);
  };

}



