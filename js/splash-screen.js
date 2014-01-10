/** #splash-screen-inner DOM element **/
var allFrames;

/** Width of a carousel frame **/
var frameWidth;

/** Index of the currently visibile carousel frame **/
var framesIdx = 0;

window.onload = function() {
  // Init global vars
  allFrames = document.getElementById('splash-screen-inner');
  frameWidth = allFrames.clientWidth;
  
  // Make splash images annotatable
  anno.makeAnnotatable(document.getElementById('splash-image-1'));
  anno.makeAnnotatable(document.getElementById('splash-image-2'));
  anno.makeAnnotatable(document.getElementById('splash-image-3'));
  anno.makeAnnotatable(document.getElementById('splash-image-4'));

  // Add hard-wired annotations
  var annotations = createAnnotations();
  for (var i=0; i<annotations.length; i++)
    anno.addAnnotation(annotations[i]);

  // Queue animation
  var timeline = new Timeline();
  timeline.add(function() { shiftTo(0); }, 0);
  timeline.add(function() { anno.highlightAnnotation(annotations[0]); }, 2000);
  timeline.add(function() { anno.highlightAnnotation(); }, 5000);
  timeline.add(function() { shiftTo(1); }, 1000);

  timeline.add(function() { anno.highlightAnnotation(annotations[1]); }, 1000);
  timeline.add(function() { anno.highlightAnnotation(); }, 5000);
  timeline.add(function() { shiftTo(2); }, 1000);

  timeline.add(function() { anno.highlightAnnotation(annotations[2]); }, 1000);
  timeline.add(function() { anno.highlightAnnotation(); }, 5000);
  timeline.add(function() { shiftTo(3); }, 1000);

  timeline.add(function() { anno.highlightAnnotation(annotations[3]); }, 1000);
  timeline.add(function() { anno.highlightAnnotation(); }, 5000);

  timeline.add(function() { shiftTo(0); }, 1000);
  timeline.start();

  timeline.onFinish(function() { timeline.start(); });

  var restartTimer;
  anno.addHandler('onMouseOverItem', function() {
    // console.log('stopping the demo');
    timeline.stop();
    if (restartTimer)
      window.clearTimeout(restartTimer);
  });

  anno.addHandler('onMouseOutOfItem', function() {
    // console.log('starting the demo');
    if (restartTimer)
      window.clearTimeout(restartTimer);

    restartTimer = window.setTimeout(function() { timeline.start(); }, 15000);
  });
}

/**
 * Shifts the splash screen carousel to the specified index (0 - 3).
 */
function shiftTo(idx) {
  document.getElementById('splash-progress-field-' + framesIdx).style.backgroundColor = 'rgba(0,0,0,0.4)';
  framesIdx = idx;
  allFrames.style.left = (- idx * frameWidth) + 'px';
  document.getElementById('splash-progress-field-' + framesIdx).style.backgroundColor = '#ff9900';
}

/**
 * Shifts the splash screen carousel by the specified number of frames.
 * Use -1/1 to shift one frame to the right/left. 
 */
function shiftBy(idx) {
  if ((framesIdx + idx > -1) && (framesIdx + idx < 4))
    shiftTo(framesIdx + idx);
}

/**
 * Creates the hard-wired annotations for the splash screen demo.
 */
function createAnnotations() {
  return [
    {
      src: document.getElementById("splash-image-1").src,
      editable: false,
      text: "Here be dragons!",
      shapes: [{
        type: "rect",
        geometry: {
          height: 0.38076923076923075,
          width: 0.22432432432432425,
          x: 0.33513513513513515,
          y: 0.14615384615384616
        }
      }]
    }, {
      src: document.getElementById("splash-image-2").src,
      editable: false,
      text: "You can add your own annotations to these images. <strong>Click and drag</strong> to create one.",
      shapes: [{
        type: "rect",
        geometry: {
          height: 0.24230769230769222,
          width: 0.2243243243243243,
          x: 0.0972972972972973,
          y: 0.5807692307692308
        }
      }]
    }, {
      src: document.getElementById("splash-image-3").src,
      editable: false,
      text: "In case you were wondering: this is where Annotorious was born!",
      shapes: [{
        type: "rect",
        geometry: {
          height: 0.26538461538461544,
          width: 0.11891891891891893,
          x: 0.8432432432432433,
          y: 0.21153846153846154
        }
      }]
    }, {
      src: document.getElementById("splash-image-4").src,
      editable: false,
      text: "We're licensed under the terms of the <a href='http://opensource.org/licenses/MIT'>MIT License</a>!",
      shapes: [{
        type: "rect",
        geometry: {
          height: 0.5,
          width: 0.45945945945945943,
          x: 0.35945945945945945,
          y: 0.36153846153846153
        }
      }]
    }
  ];
}

/**
 * A helper object for sequenced playback of the splash screen demo.
 */
var Timeline = function() {
  this._timeline = [];
  this._pause = false;
  this._currentIdx = 0;
  this._onFinish = undefined;
}

Timeline.prototype.add = function(fn, waitMillis) {
  this._timeline.push({fn: fn, wait: waitMillis});
}

Timeline.prototype.start = function() {
  this._pause = false;
  this._currentIdx = 0;
  this._execute();
}

Timeline.prototype.pause = function() {
  this._pause = true;
}

Timeline.prototype.resume = function() {
  if (this._pause == true) {
    this._pause = false;
    this._execute();
  }
}

Timeline.prototype.stop = function() {
  this._pause = true;
  this._currentIdx = 0;
}

Timeline.prototype.onFinish = function(handler) {
  this._onFinish = handler;
}
   
Timeline.prototype._execute = function() {
  var self = this;
  window.setTimeout(function() {
    if (!self._pause) {
      self._timeline[self._currentIdx].fn();
          
      if (self._timeline.length > (self._currentIdx + 1)) {
        self._currentIdx++;
        self._execute();
      } else if (self._onFinish) {
        self._onFinish();
      }
    }
  }, this._timeline[this._currentIdx].wait);
}
