var computeB, computeEvents, computeI, stepOneC, testOpposite, weakTestOpposite;

stepOneC = function(mySLAV, infEdges) {
  var i, len, node, pq, ref;
  pq = new PriorityQueue;
  ref = mySLAV.allNodes();
  for (i = 0, len = ref.length; i < len; i++) {
    node = ref[i];
    computeEvents(mySLAV, node, pq, infEdges);
  }
  console.log("HELLOoO");
  return pq;
};

computeEvents = function(mySLAV, node, pq, infEdges) {
  var I, allCandidates, allEdgeEvents, dE, dS, i, j, len, len1, ref, ref1, splitPoint, v;
  v = node.content;
  allEdgeEvents = computeI(mySLAV, node);
  for (i = 0, len = allEdgeEvents.length; i < len; i++) {
    ref = allEdgeEvents[i], I = ref[0], dE = ref[1];
    pq.add(I, dE);
  }
  if (isReflex(v)) {
    allCandidates = computeB(mySLAV, node);
    for (j = 0, len1 = allCandidates.length; j < len1; j++) {
      ref1 = allCandidates[j], splitPoint = ref1[0], dS = ref1[1];
      pq.add(splitPoint, dS);
    }
  }
};

computeI = function(mySLAV, node) {
  var I1, I2, allEdgeEvents, d1, d2, e, u, v, w;
  allEdgeEvents = [];
  v = node.content;
  u = node.pred.content;
  w = node.succ.content;
  e = line(v.inEdge);
  I1 = intersect(u.bbbisector(), v.bbbisector());
  I2 = intersect(v.bbbisector(), w.bbbisector());
  if (I1 != null) {
    d1 = dist(I1, e);
  }
  if (I2 != null) {
    d2 = dist(I2, e);
  }
  if (I1 != null) {
    allEdgeEvents.push([["e", I1, node.pred, node], d1]);
  }
  if (I2 != null) {
    allEdgeEvents.push([["e", I2, node, node.succ], d2]);
  }
  return allEdgeEvents;
};

computeB = function(mySLAV, node) {
  var B, candidates, d, i, len, outU, ref, ref1, testNode;
  candidates = [];
  ref = mySLAV.allNodes();
  for (i = 0, len = ref.length; i < len; i++) {
    testNode = ref[i];
    if (weakTestOpposite(node, testNode) != null) {
      ref1 = weakTestOpposite(node, testNode), B = ref1[0], outU = ref1[1], d = ref1[2];
      candidates.push([["s", B, node, outU], d]);
    }
  }
  return candidates;
};

testOpposite = function(node, testNode) {
  var B, X, d, inV, lineInV, lineOutU, lineOutV, outU, outV, p, q, r, rayOutU, u, v, w;
  v = node.content;
  q = v.point;
  outV = v.outEdge;
  inV = v.inEdge;
  lineOutV = line(outV);
  lineInV = line(inV);
  u = testNode.content;
  w = testNode.succ.content;
  p = u.point;
  outU = u.outEdge;
  rayOutU = new LineOrRay(p, p.plus(outU.dir()), true);
  lineOutU = line(outU);
  if (setIntersect([p, w.point], [q, node.succ.content.point, node.pred.content.point]) != null) {
    return null;
  }
  if (side(q, outU) === "right") {
    return null;
  }
  if ((intersect(v.bbbisector(), lineOutU) != null) && (intersect(lineInV, lineOutU) != null) && (intersect(lineOutV, lineOutU) != null)) {
    X = intersect(lineInV, lineOutU);
    r = angleBisector(X, inV, outU);
    B = intersect(r, v.bbbisector());
    if ((B != null) && side(B, rayOutU) === "left") {
      if (side(B, w.bbbisector()) === "left") {
        if (side(B, u.bbbisector()) === "right") {
          d = dist(B, outV);
          return [B, outU, d];
        }
      }
    }
  }
  return null;
};

weakTestOpposite = function(node, testNode) {
  var B, X, d, inV, l, lineInV, lineOutU, lineOutV, outU, outV, p, q, r, rayInV, rayOutU, reverseRayOutV, u, v, w;
  v = node.content;
  q = v.point;
  outV = v.outEdge;
  inV = v.inEdge;
  lineOutV = line(outV);
  lineInV = line(inV);
  u = testNode.content;
  w = testNode.succ.content;
  p = u.point;
  outU = u.outEdge;
  rayOutU = new LineOrRay(p, p.plus(outU.dir()), true);
  lineOutU = line(outU);
  if (setIntersect([p, w.point], [q, node.succ.content.point, node.pred.content.point]) != null) {
    return null;
  }
  if (side(q, outU) === "right") {
    return null;
  }
  l = line(outU);
  rayInV = new LineOrRay(q, q.plus(inV.dir()), true);
  reverseRayOutV = new LineOrRay(q, q.minus(outV.dir()), true);
  if (!(intersect(l, rayInV) != null) || !(intersect(l, reverseRayOutV) != null)) {
    return null;
  }
  if ((intersect(v.bbbisector(), lineOutU) != null) && (intersect(lineInV, lineOutU) != null) && (intersect(lineOutV, lineOutU) != null)) {
    X = intersect(lineInV, lineOutU);
    r = angleBisector(X, inV, outU);
    B = intersect(r, v.bbbisector());
  }
  if (B != null) {
    d = dist(B, outV);
    return [B, outU, d];
  }
  return null;
};
