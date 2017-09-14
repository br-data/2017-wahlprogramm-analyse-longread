var marginals = (function () {

  'use strict';

  // Breakpoint between floating and inline marginals
  var BREAKPOINT = 840;

  var hasChanged = false;
  var isInline = false;

  var $marginals = [];

  function init(className) {

    $marginals = document.querySelectorAll(className || '.marginal');
    hasChanged = document.body.clientWidth <= BREAKPOINT;

    if ($marginals) {

      reorder($marginals);
    }
  }

  function reorder() {

    var $marginal, i;

    // Check if the marginals need to be reordered
    if (isInline && BREAKPOINT < document.body.clientWidth ||
      !isInline && BREAKPOINT >= document.body.clientWidth) {

      hasChanged = true;
    }

    if (hasChanged) {

      if (isInline) {

        for (i = 0; i < $marginals.length; i++) {

          $marginal = $marginals[i];

          $marginal.parentNode.insertBefore($marginal, $marginal.previousElementSibling);
          isInline = false;
        }
      } else {

        for (i = 0; i < $marginals.length; i++) {

          $marginal = $marginals[i];

          $marginal.parentNode.insertBefore($marginal.nextElementSibling, $marginal);
          isInline = true;
        }
      }

      hasChanged = false;
    }
  }

  // Export global functions
  return {

    init: init,
    reorder: reorder
  };
})();
