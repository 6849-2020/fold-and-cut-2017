var stepOneAB;

stepOneAB = function(clickSeq) {
  var LAV, copySLAV, gEdges, gVtxs, i, inEdgeU, inEdgeVtx, leaf, len, mySLAV, n, newVertex, outEdgeU, outEdgeVtx, u, vertexOne, vertexTwo, vertices, vtx;
  leaf = null;
  LAV = new CircularDoublyLinkedList();
  vertices = [];
  gVtxs = [];
  mySLAV = new SLAV();
  for (i = 0, len = clickSeq.length; i < len; i++) {
    vtx = clickSeq[i];
    if (leaf === null) {
      leaf = vtx;
      vertices.push(vtx);
      gVtxs.push(vtx);
    } else {
      if (vtx.x === leaf.x && vtx.y === leaf.y) {
        n = vertices.length;
        u = vertices[n - 1];
        inEdgeU = new DirectedSegment(vertices[n - 2], u);
        outEdgeU = new DirectedSegment(u, vtx);
        inEdgeVtx = new DirectedSegment(u, vtx);
        outEdgeVtx = new DirectedSegment(vtx, vertices[1]);
        vertexOne = new Vertex(u, inEdgeU, outEdgeU);
        vertexTwo = new Vertex(vtx, inEdgeVtx, outEdgeVtx);
        LAV.push(vertexOne);
        LAV.push(vertexTwo);
        mySLAV.pushLAV(LAV);
        LAV = new CircularDoublyLinkedList();
        vertices = [];
        leaf = null;
      } else {
        n = vertices.length;
        if (n >= 2) {
          u = vertices[n - 1];
          inEdgeU = new DirectedSegment(vertices[n - 2], u);
          outEdgeU = new DirectedSegment(u, vtx);
          newVertex = new Vertex(u, inEdgeU, outEdgeU);
          LAV.push(newVertex);
        }
        vertices.push(vtx);
        gVtxs.push(vtx);
      }
    }
  }
  mySLAV.orient();
  gEdges = mySLAV.allEdges();
  copySLAV = mySLAV.copy();
  copySLAV.reverse();
  mySLAV.join(copySLAV);
  return [mySLAV, gVtxs, gEdges];
};
