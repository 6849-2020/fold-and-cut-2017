var splitHandle, splitTwoD, splitTwoE, splitTwoF,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

splitHandle = function(mySLAV, pq, I, processed, skelEdges, skelVtxs, infEdges) {
  var N, N1, N2, Nc, dirSeg, error1, i, len, node, ref, ref1, ref2;
  if (ref = I[2], indexOf.call(processed, ref) >= 0) {
    return;
  }
  N = I[2];
  dirSeg = I[3];
  ref1 = mySLAV.allNodes();
  for (i = 0, len = ref1.length; i < len; i++) {
    node = ref1[i];
    if (testOpposite(N, node) != null) {
      if (node.content.outEdge === dirSeg) {
        Nc = node;
        break;
      }
    }
  }
  if (!(Nc != null)) {
    return;
  }
  splitTwoD(I, skelEdges);
  try {
    ref2 = splitTwoE(mySLAV, I, processed, skelVtxs), N1 = ref2[0], N2 = ref2[1];
  } catch (error1) {
    return;
  }
  return splitTwoF(mySLAV, N1, N2, pq, infEdges);
};

splitTwoD = function(I, skelEdges) {
  var N, P;
  N = I[2];
  P = N.content.point;
  return skelEdges.push(new GraphEdge(P, I[1]));
};

splitTwoE = function(mySLAV, I, processed, skelVtxs) {
  var LAV1, LAV2, N, N1, N2, Na, Nb, Nc, Nd, V, V1, V2, dirSeg, fancyVertex, i, lava, lavb, len, newElem, node, ref;
  N = I[2];
  V = N.content;
  dirSeg = I[3];
  ref = mySLAV.allNodes();
  for (i = 0, len = ref.length; i < len; i++) {
    node = ref[i];
    if ((testOpposite(N, node) != null) && node.content.outEdge === dirSeg) {
      Nc = node;
      break;
    }
  }
  if (!(Nc != null)) {
    throw error;
  }
  processed.push(N);
  fancyVertex = [I[1], V.inEdge, V.outEdge, dirSeg];
  skelVtxs.push(fancyVertex);
  V1 = new Vertex(I[1], V.inEdge, dirSeg);
  V2 = new Vertex(I[1], dirSeg, V.outEdge);
  LAV1 = mySLAV.LAVContaining(N);
  Nd = Nc.succ;
  Na = N.pred;
  Nb = N.succ;
  N1 = new Node(Na, V1, Nd);
  N2 = new Node(Nc, V2, Nb);
  Nd.pred = N1;
  Nc.succ = N2;
  Na.succ = N1;
  Nb.pred = N2;
  lava = new CircularDoublyLinkedList();
  lava.nodesList.push(N1);
  newElem = N1.succ;
  while (newElem !== N1) {
    lava.nodesList.push(newElem);
    newElem = newElem.succ;
  }
  lava.head = N1;
  lava.tail = lava.head.pred;
  if (indexOf.call(lava.nodesList, N2) >= 0) {
    LAV2 = mySLAV.LAVContaining(Nd);
    mySLAV.removeLAV(LAV1);
    mySLAV.removeLAV(LAV2);
    mySLAV.pushLAV(lava);
  } else {
    lavb = new CircularDoublyLinkedList();
    lavb.nodesList.push(N2);
    newElem = N2.succ;
    while (newElem !== N2) {
      lavb.nodesList.push(newElem);
      newElem = newElem.succ;
    }
    lavb.head = N2;
    lavb.tail = lavb.head.pred;
    mySLAV.removeLAV(LAV1);
    mySLAV.pushLAV(lava);
    mySLAV.pushLAV(lavb);
  }
  return [N1, N2];
};

splitTwoF = function(mySLAV, N1, N2, pq, infEdges) {
  computeEvents(mySLAV, N1, pq, infEdges);
  return computeEvents(mySLAV, N2, pq, infEdges);
};
