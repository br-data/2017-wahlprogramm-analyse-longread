document.addEventListener('DOMContentLoaded', init);
//window.addEventListener('load', init);

function init() {

  var timeout;

  var chart1 = new RileTimeline();

  var colors = {
    'AfD': '#129ee6',
    'CDU/CSU': '#121212',
    'FDP': '#ffdd00',
    'SPD': '#d71f1d',
    'Grüne': '#0a8000',
    'Die Linke': '#be3075'
  };

  d3.json('./data/rileTimeline.json', function (data) {

    chart1.init('rile-timeline', data, colors);
  });

  navigation.init();
  marginals.init();

  window.onresize = function () {

    clearTimeout(timeout);
    timeout = setTimeout(function () {

      chart1.resize();
      marginals.reorder();
    }, 200);
  };

}



