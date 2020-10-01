var draw, drawCPEdge, drawCreasePattern, drawPoint, drawSkeleton, exportToFOLD, printClickSequence, removeMarkers, stringToClickSeq, testOutputFunction;

printClickSequence = function(clickSeq) {
  var click, i, k, ref, s;
  s = "";
  if (clickSeq.length === 1) {
    document.getElementById("clicks").innerHTML = s;
    return;
  }
  for (i = k = 0, ref = clickSeq.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
    click = clickSeq[i];
    if (click === "marker") {
      s = s + "~ ";
    } else {
      if (clickSeq[i + 1] === "marker") {
        s = s + click.print() + " ";
      } else {
        s = s + click.print() + ", ";
      }
    }
  }
  return document.getElementById("clicks").innerHTML = s;
};

removeMarkers = function(clickSequence) {
  var i, k, modifiedClickSeq, perturbedPoint, point, ref, start;
  modifiedClickSeq = [];
  start = null;
  for (i = k = 0, ref = clickSequence.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
    point = clickSequence[i];
    if (point !== "marker") {
      perturbedPoint = new Point(point.x + Math.random() * 0.01 - 0.005, point.y + Math.random() * 0.01 - 0.005);
      if (start === null) {
        start = perturbedPoint;
      }
      if (clickSequence[i + 1] === "marker") {
        modifiedClickSeq.push(start);
        start = null;
      } else {
        modifiedClickSeq.push(perturbedPoint);
      }
    }
  }
  return modifiedClickSeq;
};

draw = function(clickSequence) {
  var i, k, point, previous, ref;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (i = k = 0, ref = clickSequence.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
    point = clickSequence[i];
    if (point === "marker") {
      continue;
    }
    if (clickSequence[i - 1] !== "marker") {
      ctx.beginPath();
      ctx.arc(point.x, c - point.y - b, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "green";
      ctx.fill();
      previous = clickSequence[i - 1];
      ctx.moveTo(previous.x, c - b - previous.y);
      ctx.lineTo(point.x, c - b - point.y);
      ctx.stroke();
    }
  }
};

drawPoint = function(x, y) {
  ctx.beginPath();
  ctx.arc(x, c - y - b, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.strokeStyle = "black";
  return ctx.stroke();
};

drawCPEdge = function(edge, show) {
  var endpt1, endpt2;
  endpt1 = edge.endpt1;
  endpt2 = edge.endpt2;
  ctx.beginPath();
  ctx.moveTo(endpt1.x, c - endpt1.y - b);
  ctx.lineTo(endpt2.x, c - endpt2.y - b);
  if (edge.assignment === "m") {
    ctx.strokeStyle = "red";
  } else {
    if (edge.assignment === "v") {
      ctx.strokeStyle = "blue";
    } else {
      if (edge.assignment === "u") {
        ctx.strokeStyle = "purple";
      } else {
        if (edge.type === "graph" || edge.type === "boundary" || !(edge.type != null)) {
          ctx.strokeStyle = "black";
        } else {
          if (show) {
            ctx.strokeStyle = "green";
          } else {
            ctx.strokeStyle = "white";
          }
        }
      }
    }
  }
  if (edge.type === "graph" || !(edge.type != null)) {
    ctx.lineWidth = 2;
  } else {
    ctx.lineWidth = 0.7;
  }
  if (ctx.strokeStyle !== "white") {
    return ctx.stroke();
  }
};

testOutputFunction = function(clickSeq, show, skeletonOnly) {
  var CP, CPFaces, facesRelations, gEdges, gVtxs, infEdges, k, len, ref, ref1, skelEdges, skelVtxs, skelv, text, tmpSkeleton, tooManyPerps;
  if (skeletonOnly) {
    ref = straightSkeleton(removeMarkers(clickSeq)), skelEdges = ref[0], skelVtxs = ref[1], infEdges = ref[2], gVtxs = ref[3], gEdges = ref[4];
    tmpSkeleton = [];
    for (k = 0, len = skelVtxs.length; k < len; k++) {
      skelv = skelVtxs[k];
      tmpSkeleton.push(skelv[0]);
    }
    CP = convert(skelEdges, tmpSkeleton, infEdges, gVtxs, gEdges, [], [], [], []);
    return drawSkeleton(CP, gEdges, show);
  } else {
    ref1 = foldAndCut(removeMarkers(clickSeq)), CP = ref1[0], CPFaces = ref1[1], facesRelations = ref1[2], gEdges = ref1[3], tooManyPerps = ref1[4];
    drawCreasePattern(CP, gEdges, show);
    if (!tooManyPerps) {
      text = exportToFOLD(CP, CPFaces, facesRelations);
    } else {
      text = "";
    }
    return $("a#programatically").click(function() {
      var now;
      now = text;
      return this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(now);
    });
  }
};

drawCreasePattern = function(CP, gEdges, show) {
  var cpEdge, cpVertex, cute, k, l, len, len1, len2, m, ref, ref1, results, x, y;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ref = CP.cPEs;
  for (k = 0, len = ref.length; k < len; k++) {
    cpEdge = ref[k];
    drawCPEdge(cpEdge, show);
  }
  for (l = 0, len1 = gEdges.length; l < len1; l++) {
    cute = gEdges[l];
    drawCPEdge(cute);
  }
  ref1 = CP.cPVs;
  results = [];
  for (m = 0, len2 = ref1.length; m < len2; m++) {
    cpVertex = ref1[m];
    if (cpVertex.type === "graph") {
      x = cpVertex.x;
      y = cpVertex.y;
      results.push(drawPoint(x, y));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

drawSkeleton = function(CP, gEdges, show) {
  var cpEdge, cpVertex, cute, endpt1, endpt2, k, l, len, len1, len2, m, ref, ref1, results, x, y;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ref = CP.cPEs;
  for (k = 0, len = ref.length; k < len; k++) {
    cpEdge = ref[k];
    if (cpEdge.type === "skeleton") {
      endpt1 = cpEdge.endpt1;
      endpt2 = cpEdge.endpt2;
      ctx.beginPath();
      ctx.moveTo(endpt1.x, c - endpt1.y - b);
      ctx.lineTo(endpt2.x, c - endpt2.y - b);
      ctx.strokeStyle = "purple";
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
  }
  for (l = 0, len1 = gEdges.length; l < len1; l++) {
    cute = gEdges[l];
    drawCPEdge(cute);
  }
  ref1 = CP.cPVs;
  results = [];
  for (m = 0, len2 = ref1.length; m < len2; m++) {
    cpVertex = ref1[m];
    if (cpVertex.type === "graph") {
      x = cpVertex.x;
      y = cpVertex.y;
      results.push(drawPoint(x, y));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

stringToClickSeq = function(str) {
  var P, char, clickSeq, i, num1, num2, ref, ref1, ref2, start, x, y;
  clickSeq = [];
  start = null;
  i = 0;
  while (i < str.length) {
    char = str[i];
    if (char === "~") {
      if (clickSeq.length > 0) {
        clickSeq.splice(clickSeq.length - 1, 1);
        clickSeq.push(start);
      }
      clickSeq.push("marker");
      start = null;
      i = i + 1;
      continue;
    }
    if (char === "," || char === " " || char === "(" || char === ")") {
      i = i + 1;
      continue;
    }
    if ((48 <= (ref = char.charCodeAt(0)) && ref <= 57) || char === ".") {
      num1 = "";
      while ((48 <= (ref1 = char.charCodeAt(0)) && ref1 <= 57) || char === ".") {
        num1 = num1 + char;
        i = i + 1;
        char = str[i];
      }
      i = i + 1;
      char = str[i];
      while (char === " ") {
        i = i + 1;
        char = str[i];
      }
      num2 = "";
      while ((48 <= (ref2 = char.charCodeAt(0)) && ref2 <= 57) || char === ".") {
        num2 = num2 + char;
        i = i + 1;
        char = str[i];
      }
      i = i + 1;
      x = Number(num1);
      y = Number(num2);
      P = new Point(x, y);
      if (start === null) {
        start = P;
      }
      clickSeq.push(P);
    }
  }
  return clickSeq;
};

exportToFOLD = function(CP, CPFaces, facesRelations) {
  var e, fac, i, j, k, l, m, n, o, p1, p2, ref, ref1, ref2, ref3, ref4, s, v, vertices;
  s = '{ "file_spec": 1, \n "file_classes": ["singleModel"],\n "frame_title": "Fold-and-Cut crease pattern",\n "frame_classes": ["creasePattern"],\n "frame_attributes": ["2D"],\n "vertices_coords": [';
  for (i = k = 0, ref = CP.cPVs.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
    v = CP.cPVs[i];
    s = s + '[' + v.x + ',' + v.y + ', 0]';
    if (i < CP.cPVs.length - 1) {
      s = s + ',';
    }
  }
  s = s + '], \n "edges_vertices": [';
  for (i = l = 0, ref1 = CP.cPEs.length - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; i = 0 <= ref1 ? ++l : --l) {
    e = CP.cPEs[i];
    p1 = e.endpt1;
    p2 = e.endpt2;
    s = s + '[' + CP.cPVs.indexOf(p1) + ',' + CP.cPVs.indexOf(p2) + ']';
    if (i < CP.cPEs.length - 1) {
      s = s + ',';
    }
  }
  s = s + '], \n "edges_assignment": [';
  for (i = m = 0, ref2 = CP.cPEs.length - 1; 0 <= ref2 ? m <= ref2 : m >= ref2; i = 0 <= ref2 ? ++m : --m) {
    e = CP.cPEs[i];
    s = s + '"' + e.assignment.toUpperCase() + '"';
    if (i < CP.cPEs.length - 1) {
      s = s + ',';
    }
  }
  s = s + '], \n "faces_vertices": [';
  for (i = n = 0, ref3 = CPFaces.length - 1; 0 <= ref3 ? n <= ref3 : n >= ref3; i = 0 <= ref3 ? ++n : --n) {
    fac = CPFaces[i];
    vertices = fac[0];
    s = s + '[';
    for (j = o = 0, ref4 = vertices.length - 1; 0 <= ref4 ? o <= ref4 : o >= ref4; j = 0 <= ref4 ? ++o : --o) {
      v = vertices[j];
      s = s + CP.cPVs.indexOf(v);
      if (j < vertices.length - 1) {
        s = s + ',';
      }
    }
    s = s + ']';
    if (i < CPFaces.length - 1) {
      s = s + ',';
    }
  }
  s = s + ']}';
  return s;
};
