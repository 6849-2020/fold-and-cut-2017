var draw, drawCPEdge, drawCreasePattern, drawPoint, drawSkeleton, exportToFOLD, printClickSequence, removeMarkers, stringToClickSeq, testOutputFunction;

printClickSequence = function(clickSeq) {
  var click, j, len, s;
  s = "";
  for (j = 0, len = clickSeq.length; j < len; j++) {
    click = clickSeq[j];
    if (click === "marker") {
      s = s + "~ ";
    } else {
      s = s + click.print() + " ";
    }
  }
  return document.getElementById("clicks").innerHTML = s;
};

removeMarkers = function(clickSequence) {
  var j, len, modifiedClickSeq, point;
  modifiedClickSeq = [];
  for (j = 0, len = clickSequence.length; j < len; j++) {
    point = clickSequence[j];
    if (point !== "marker") {
      modifiedClickSeq.push(point);
    }
  }
  return modifiedClickSeq;
};

draw = function(clickSequence) {
  var i, j, point, previous, ref;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (i = j = 0, ref = clickSequence.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
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
  var CP, CPFaces, facesRelations, gEdges, gVtxs, infEdges, j, len, ref, ref1, skelEdges, skelVtxs, skelv, tmpSkeleton, tooManyPerps;
  if (skeletonOnly) {
    ref = straightSkeleton(removeMarkers(clickSeq)), skelEdges = ref[0], skelVtxs = ref[1], infEdges = ref[2], gVtxs = ref[3], gEdges = ref[4];
    tmpSkeleton = [];
    for (j = 0, len = skelVtxs.length; j < len; j++) {
      skelv = skelVtxs[j];
      tmpSkeleton.push(skelv[0]);
    }
    CP = convert(skelEdges, tmpSkeleton, infEdges, gVtxs, gEdges, [], [], [], []);
    return drawSkeleton(CP, gEdges, show);
  } else {
    ref1 = foldAndCut(removeMarkers(clickSeq)), CP = ref1[0], CPFaces = ref1[1], facesRelations = ref1[2], gEdges = ref1[3], tooManyPerps = ref1[4];
    return drawCreasePattern(CP, gEdges, show);
  }
};

drawCreasePattern = function(CP, gEdges, show) {
  var cpEdge, cpVertex, cute, j, k, l, len, len1, len2, ref, ref1, results, x, y;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 726, 561);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, 726, 561);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ref = CP.cPEs;
  for (j = 0, len = ref.length; j < len; j++) {
    cpEdge = ref[j];
    console.log(cpEdge.assignment);
    drawCPEdge(cpEdge, show);
  }
  for (k = 0, len1 = gEdges.length; k < len1; k++) {
    cute = gEdges[k];
    drawCPEdge(cute);
  }
  ref1 = CP.cPVs;
  results = [];
  for (l = 0, len2 = ref1.length; l < len2; l++) {
    cpVertex = ref1[l];
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
  var cpEdge, cpVertex, cute, endpt1, endpt2, j, k, l, len, len1, len2, ref, ref1, results, x, y;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 726, 561);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, 726, 561);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ref = CP.cPEs;
  for (j = 0, len = ref.length; j < len; j++) {
    cpEdge = ref[j];
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
  for (k = 0, len1 = gEdges.length; k < len1; k++) {
    cute = gEdges[k];
    drawCPEdge(cute);
  }
  ref1 = CP.cPVs;
  results = [];
  for (l = 0, len2 = ref1.length; l < len2; l++) {
    cpVertex = ref1[l];
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
  var char, clickSeq, i, num1, num2, ref, ref1, ref2, x, y;
  clickSeq = [];
  i = 0;
  while (i < str.length) {
    char = str[i];
    if (char === "~") {
      clickSeq.push("marker");
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
      clickSeq.push(new Point(x, y));
    }
  }
  return clickSeq;
};

exportToFOLD = function(CP, CPfaces, facesRelations) {
  return '{ "file_spec": 1, "file_creator": "A text editor", "file_author": "Jason Ku", "file_classes": ["singleModel"], "frame_title": "Three-fold 3D example", "frame_classes": ["foldedForm"], "frame_attributes": ["3D"], "vertices_coords": [ [0,1,0], [0,0,1], [0,-1,0], [1,0,0], [0,0,-1], [0,0,-1] ], "faces_vertices": [ [0,1,2], [0,2,3], [0,4,1], [1,5,2] ], "edges_vertices": [ [0,2], [0,1], [1,2], [2,3], [0,3], [1,4], [1,5], [0,4], [2,5] ], "edges_assignment": [ "V", "M", "M", "B", "B", "B", "B", "B", "B" ], "faceOrders": [ [2,0,-1], [3,0,-1] ] }';
};
