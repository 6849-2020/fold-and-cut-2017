var edgeHandle, edgeTwoC, edgeTwoD, edgeTwoE, edgeTwoF,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

edgeHandle = function(mySLAV, pq, I, processed, skelEdges, skelVtxs, infEdges) {
  var N, e, endpt1, endpt2, error1, i, j, len, len1, ref, ref1, v, x, y;
  if ((ref = I[2], indexOf.call(processed, ref) >= 0) || (ref1 = I[3], indexOf.call(processed, ref1) >= 0)) {
    return;
  }
  if (edgeTwoC(mySLAV, I, processed, skelEdges, skelVtxs)) {
    return;
  }
  edgeTwoD(I, skelEdges);
  try {
    N = edgeTwoE(mySLAV, I, processed, skelVtxs);
  } catch (error1) {
    for (i = 0, len = skelVtxs.length; i < len; i++) {
      v = skelVtxs[i];
      x = v[0].x;
      y = v[0].y;
      ctx.beginPath();
      ctx.arc(x, c - y - b, 2, 0, 2 * Math.PI);
      ctx.stroke();
    }
    for (j = 0, len1 = skelEdges.length; j < len1; j++) {
      e = skelEdges[j];
      endpt1 = e.endpt1;
      endpt2 = e.endpt2;
      ctx.moveTo(endpt1.x, c - endpt1.y - b);
      ctx.lineTo(endpt2.x, c - endpt2.y - b);
      ctx.stroke();
    }
  }
  return edgeTwoF(mySLAV, N, pq, infEdges);
};

edgeTwoC = function(mySLAV, I, processed, skelEdges, skelVtxs) {
  var Na, Nb, Nc, Pa, Pb, Pc, aOut, bOut, cOut;
  Na = I[2];
  Pa = Na.content.point;
  aOut = Na.content.outEdge;
  Nb = I[3];
  Pb = Nb.content.point;
  bOut = Nb.content.outEdge;
  Nc = Na.pred;
  Pc = Nc.content.point;
  cOut = Nc.content.outEdge;
  if (Nc.pred === Nb) {
    skelEdges.push(new GraphEdge(Pa, I[1]));
    skelEdges.push(new GraphEdge(Pb, I[1]));
    skelEdges.push(new GraphEdge(Pc, I[1]));
    skelVtxs.push([I[1], Na.content.outEdge, Nb.content.outEdge, Nc.content.outEdge]);
    processed.push(Na);
    processed.push(Nb);
    processed.push(Nc);
    return true;
  }
  return false;
};

edgeTwoD = function(I, skelEdges) {
  var Na, Nb, Pa, Pb;
  Na = I[2];
  Nb = I[3];
  Pa = Na.content.point;
  Pb = Nb.content.point;
  skelEdges.push(new GraphEdge(Pa, I[1]));
  return skelEdges.push(new GraphEdge(Pb, I[1]));
};

edgeTwoE = function(mySLAV, I, processed, skelVtxs) {
  var N, Na, Nb, Va, Vb, currLAV, fancyVertex, newV;
  Na = I[2];
  Nb = I[3];
  Va = Na.content;
  Vb = Nb.content;
  processed.push(Na);
  processed.push(Nb);
  fancyVertex = [I[1], Va.inEdge, Va.outEdge, Vb.outEdge];
  skelVtxs.push(fancyVertex);
  currLAV = mySLAV.LAVContaining(Na);
  if (Nb !== Na.succ) {
    console.log("Nb != Na.succ :(");
  }
  if (!(currLAV != null)) {
    console.log("couldn't find LAV containing " + Na.content.print());
    throw error;
  }
  newV = new Vertex(I[1], Va.inEdge, Vb.outEdge);
  N = currLAV.insert(newV, Na.pred);
  currLAV.remove(Na);
  currLAV.remove(Nb);
  return N;
};

edgeTwoF = function(mySLAV, N, pq, infEdges) {
  return computeEvents(mySLAV, N, pq, infEdges);
};
