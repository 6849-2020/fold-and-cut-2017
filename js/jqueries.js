var FOLD, a, b, c, rect;

FOLD = require('fold');

rect = canvas.getBoundingClientRect();

a = rect.left;

b = rect.top;

c = rect.bottom;

$(document).ready(function() {
  var CP, clickSeq, gEdges, live, previous, repeat, show, skeletonOnly, start, text;
  clickSeq = ["marker"];
  start = null;
  previous = null;
  repeat = null;
  show = false;
  live = true;
  skeletonOnly = false;
  CP = new CreasePattern();
  gEdges = [];
  text = "";
  if (show) {
    document.getElementById("toggle").innerHTML = "Unused creases ON";
  } else {
    document.getElementById("toggle").innerHTML = "Unused creases OFF";
  }
  if (live) {
    document.getElementById("live").innerHTML = "Live computation ON";
  } else {
    document.getElementById("live").innerHTML = "Live computation OFF";
  }
  if (skeletonOnly) {
    document.getElementById("skeleton").innerHTML = "Skeleton only ON";
  } else {
    document.getElementById("skeleton").innerHTML = "Skeleton only OFF";
  }
  $("#myCanvas").mouseup(function(e) {
    var P, closed, x, y;
    $("#myCanvas").unbind("mousemove");
    if (repeat != null) {
      repeat = null;
    } else {
      x = e.pageX - a;
      y = c - e.pageY;
      P = new Point(x, y);
      if (start === null) {
        start = P;
        previous = P;
      } else {
        if (dist(P, start) < 6) {
          closed = true;
          ctx.moveTo(previous.x, c - b - previous.y);
          ctx.lineTo(start.x, c - b - start.y);
          ctx.stroke();
          previous = null;
          clickSeq.push(start);
          clickSeq.push("marker");
          start = null;
        }
      }
      if (!closed) {
        if (previous !== P) {
          ctx.beginPath();
          ctx.moveTo(previous.x, c - b - previous.y);
          ctx.lineTo(P.x, c - b - P.y);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "black";
          ctx.stroke();
          previous = P;
        }
        clickSeq.push(P);
        ctx.beginPath();
        ctx.arc(x, c - y - b, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();
      }
    }
    if (start === null) {
      printClickSequence(clickSeq);
      if (live) {
        testOutputFunction(clickSeq, show, skeletonOnly);
      }
    }
    return $("#myCanvas").mousemove(function(e) {
      x = e.pageX - a;
      y = c - e.pageY;
      return document.getElementById("coords").innerHTML = "(" + x + ", " + y + ")";
    });
  });
  $("#myCanvas").mousedown(function(e) {
    var P, i, len, point, x, y;
    $("#myCanvas").unbind("mousemove");
    x = e.pageX - a;
    y = c - e.pageY;
    P = new Point(x, y);
    if (start === null) {
      for (i = 0, len = clickSeq.length; i < len; i++) {
        point = clickSeq[i];
        if (point === "marker") {
          continue;
        }
        if (dist(P, point) < 4) {
          repeat = point;
          break;
        }
      }
    }
    return $("#myCanvas").mousemove(function(e) {
      if (!(repeat != null)) {
        return;
      }
      x = e.pageX - a;
      y = c - e.pageY;
      document.getElementById("coords").innerHTML = "(" + x + ", " + y + ")";
      repeat.x = x;
      repeat.y = y;
      return draw(clickSeq);
    });
  });
  $(document).keydown(function(e) {
    if (e.which === 27) {
      while (clickSeq[clickSeq.length - 1] !== "marker") {
        clickSeq.splice(clickSeq.length - 1, 1);
      }
      start = null;
      previous = null;
      printClickSequence(clickSeq);
      if (live) {
        return testOutputFunction(clickSeq, show, skeletonOnly);
      }
    }
  });
  $(document).keydown(function(e) {
    if (start === null && e.which === 88) {
      if (clickSeq.length > 1) {
        clickSeq.splice(clickSeq.length - 1);
        while (clickSeq[clickSeq.length - 1] !== "marker") {
          clickSeq.splice(clickSeq.length - 1, 1);
        }
        printClickSequence(clickSeq);
        if (live) {
          return testOutputFunction(clickSeq, show, skeletonOnly);
        }
      }
    }
  });
  $("#skeleton").click(function(e) {
    if (skeletonOnly) {
      skeletonOnly = false;
      document.getElementById("skeleton").innerHTML = "Skeleton only OFF";
    } else {
      skeletonOnly = true;
      document.getElementById("skeleton").innerHTML = "Skeleton only ON";
    }
    if (live) {
      return testOutputFunction(clickSeq, show, skeletonOnly);
    }
  });
  $("#live").click(function(e) {
    if (live) {
      live = false;
      document.getElementById("live").innerHTML = "Live computation OFF";
    } else {
      live = true;
      document.getElementById("live").innerHTML = "Live computation ON";
    }
    if (live) {
      return testOutputFunction(clickSeq, show, skeletonOnly);
    }
  });
  $("#toggle").click(function(e) {
    if (show) {
      show = false;
    } else {
      show = true;
    }
    return testOutputFunction(clickSeq, show, skeletonOnly);
  });
  $("#myCanvas").mousemove(function(e) {
    var x, y;
    x = e.pageX - a;
    y = c - e.pageY;
    return document.getElementById("coords").innerHTML = "(" + x + ", " + y + ")";
  });
  $("#manual").click(function() {
    clickSeq = stringToClickSeq($("input:text").val());
    printClickSequence(clickSeq);
    if (live) {
      return testOutputFunction(clickSeq, show, skeletonOnly);
    }
  });
  return $("a#programatically").click(function() {
    var now;
    now = text;
    return this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(now);
  });
});
