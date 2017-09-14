document.addEventListener('DOMContentLoaded', init);
//window.addEventListener('load', init);

function init() {

  navigation.init();
  marginals.init();

  resize();
}

function resize() {

  var timeout;

  window.onresize = function () {

    clearTimeout(timeout);
    timeout = setTimeout(function () {

      marginals.reorder();
    }, 200);
  };
}
