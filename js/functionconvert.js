var convert, replaceVertex;

convert = function(skelEdges, skelVtxs, infEdges, gVtxs, gEdges, perps, infPerps, quasiSkelVtxs, quasiGraphVtxs) {
  var BL, BR, TL, TR, aa, ab, ac, allVtxs, bVertex, bottom, boundaryEdges, boundaryPerps, boundarySkels, boundaryVtxs, cen, closestEdge, d, distance, e, edge, edges, edgesWithoutComp, i, j, k, l, left, len, len1, len10, len11, len12, len13, len14, len15, len16, len17, len18, len2, len3, len4, len5, len6, len7, len8, len9, m, maxCoordX, maxCoordY, minCoordX, minCoordY, n, o, p, q, quasiGraphVtxsOnly, quasiSkelVtxsOnly, r, ray, right, s, t, tmpCPV, tmpE, top, u, v, vWithComp, vert, vertices, verticesWithComp, w, x, y, z;
  maxCoordX = canvas.width;
  maxCoordY = canvas.height;
  minCoordX = 0;
  minCoordY = 0;
  quasiSkelVtxsOnly = [];
  for (i = 0, len = quasiSkelVtxs.length; i < len; i++) {
    v = quasiSkelVtxs[i];
    quasiSkelVtxsOnly.push(v[0]);
  }
  quasiGraphVtxsOnly = [];
  for (j = 0, len1 = quasiGraphVtxs.length; j < len1; j++) {
    v = quasiGraphVtxs[j];
    quasiGraphVtxsOnly.push(v[0]);
  }
  allVtxs = skelVtxs.concat(gVtxs).concat(quasiSkelVtxsOnly).concat(quasiGraphVtxsOnly);
  for (k = 0, len2 = allVtxs.length; k < len2; k++) {
    v = allVtxs[k];
    if (v.x > maxCoordX) {
      maxCoordX = v.x;
    }
    if (v.y > maxCoordY) {
      maxCoordY = v.y;
    }
    if (v.x < minCoordX) {
      minCoordX = v.x;
    }
    if (v.y < minCoordY) {
      minCoordY = v.y;
    }
  }
  maxCoordX = maxCoordX + 40;
  maxCoordY = maxCoordY + 40;
  minCoordX = minCoordX - 40;
  minCoordY = minCoordY - 40;
  TL = new Point(minCoordX, maxCoordY);
  TR = new Point(maxCoordX, maxCoordY);
  BL = new Point(minCoordX, minCoordY);
  BR = new Point(maxCoordX, minCoordY);
  top = new GraphEdge(TL, TR);
  bottom = new GraphEdge(BL, BR);
  right = new GraphEdge(TR, BR);
  left = new GraphEdge(TL, BL);
  boundaryVtxs = [TL, TR, BL, BR];
  boundaryPerps = [];
  boundarySkels = [];
  boundaryEdges = [top, bottom, right, left];
  for (l = 0, len3 = infPerps.length; l < len3; l++) {
    ray = infPerps[l];
    r = ray[0];
    closestEdge = null;
    distance = null;
    for (m = 0, len4 = boundaryEdges.length; m < len4; m++) {
      e = boundaryEdges[m];
      if (intersect(e, r) != null) {
        d = dist(intersect(e, r), r.origin);
        if (d < distance || !(distance != null)) {
          closestEdge = e;
          distance = d;
        }
      } else {

      }
    }
    if (!(closestEdge != null)) {
      console.log("Something is stupid, closestEdge doesn't exist");
    }
    if (!(r != null)) {
      console.log("Something is even more stupid, r doesn't exist");
    }
    bVertex = intersect(closestEdge, r);
    boundaryPerps.push([bVertex, ray[1]]);
    boundaryEdges.push(new GraphEdge(bVertex, closestEdge.endpt1));
    boundaryEdges.push(new GraphEdge(bVertex, closestEdge.endpt2));
    boundaryEdges.splice(boundaryEdges.indexOf(closestEdge), 1);
    perps.push([new GraphEdge(r.origin, bVertex), ray[1]]);
  }
  for (n = 0, len5 = infEdges.length; n < len5; n++) {
    r = infEdges[n];
    closestEdge = null;
    distance = null;
    for (o = 0, len6 = boundaryEdges.length; o < len6; o++) {
      e = boundaryEdges[o];
      if (intersect(e, r) != null) {
        d = dist(intersect(e, r), r.origin);
        if (d < distance || !(distance != null)) {
          closestEdge = e;
          distance = d;
        }
      }
    }
    if (!(closestEdge != null)) {
      console.log("Something is stupid, closestEdge doesn't exist");
    }
    if (!(r != null)) {
      console.log("Something is even more stupid, r doesn't exist");
    }
    bVertex = intersect(closestEdge, r);
    boundarySkels.push(bVertex);
    boundaryEdges.push(new GraphEdge(bVertex, closestEdge.endpt1));
    boundaryEdges.push(new GraphEdge(bVertex, closestEdge.endpt2));
    boundaryEdges.splice(boundaryEdges.indexOf(closestEdge), 1);
    skelEdges.push(new GraphEdge(r.origin, bVertex));
  }
  edgesWithoutComp = gEdges.concat(skelEdges).concat(boundaryEdges);
  verticesWithComp = quasiSkelVtxs.concat(quasiGraphVtxs).concat(boundaryPerps);
  vertices = [];
  edges = [];
  for (p = 0, len7 = skelVtxs.length; p < len7; p++) {
    vert = skelVtxs[p];
    tmpCPV = new CreasePatternVertex(vert.x, vert.y, "skeleton");
    for (q = 0, len8 = verticesWithComp.length; q < len8; q++) {
      vWithComp = verticesWithComp[q];
      if (vWithComp[1] === vert) {
        vWithComp[1] = tmpCPV;
      }
    }
    for (s = 0, len9 = perps.length; s < len9; s++) {
      edge = perps[s];
      if (edge[1] === vert) {
        edge[1] = tmpCPV;
      }
    }
    replaceVertex(vert, tmpCPV, edgesWithoutComp, perps, vertices);
  }
  for (t = 0, len10 = quasiSkelVtxs.length; t < len10; t++) {
    vert = quasiSkelVtxs[t];
    tmpCPV = new CreasePatternVertex(vert[0].x, vert[0].y, "quasiSkeleton", vert[1]);
    replaceVertex(vert[0], tmpCPV, edgesWithoutComp, perps, vertices);
  }
  for (u = 0, len11 = quasiGraphVtxs.length; u < len11; u++) {
    vert = quasiGraphVtxs[u];
    tmpCPV = new CreasePatternVertex(vert[0].x, vert[0].y, "quasiGraph", vert[1]);
    replaceVertex(vert[0], tmpCPV, edgesWithoutComp, perps, vertices);
  }
  for (w = 0, len12 = boundaryPerps.length; w < len12; w++) {
    vert = boundaryPerps[w];
    tmpCPV = new CreasePatternVertex(vert[0].x, vert[0].y, "boundaryPerp", vert[1]);
    replaceVertex(vert[0], tmpCPV, edgesWithoutComp, perps, vertices);
  }
  for (x = 0, len13 = gVtxs.length; x < len13; x++) {
    vert = gVtxs[x];
    tmpCPV = new CreasePatternVertex(vert.x, vert.y, "graph");
    replaceVertex(vert, tmpCPV, edgesWithoutComp, perps, vertices);
  }
  for (y = 0, len14 = boundaryVtxs.length; y < len14; y++) {
    vert = boundaryVtxs[y];
    tmpCPV = new CreasePatternVertex(vert.x, vert.y, "boundary");
    replaceVertex(vert, tmpCPV, edgesWithoutComp, perps, vertices);
  }
  for (z = 0, len15 = boundarySkels.length; z < len15; z++) {
    vert = boundarySkels[z];
    tmpCPV = new CreasePatternVertex(vert.x, vert.y, "boundarySkel");
    replaceVertex(vert, tmpCPV, edgesWithoutComp, perps, vertices);
  }
  for (aa = 0, len16 = perps.length; aa < len16; aa++) {
    edge = perps[aa];
    tmpE = new CreasePatternEdge(edge[0].endpt1, edge[0].endpt2, "perp", edge[1]);
    edges.push(tmpE);
  }
  for (ab = 0, len17 = skelEdges.length; ab < len17; ab++) {
    edge = skelEdges[ab];
    edges.push(new CreasePatternEdge(edge.endpt1, edge.endpt2, "skeleton"));
  }
  for (ac = 0, len18 = boundaryEdges.length; ac < len18; ac++) {
    edge = boundaryEdges[ac];
    edges.push(new CreasePatternEdge(edge.endpt1, edge.endpt2, "boundary"));
  }
  cen = TL.plus(BR).times(0.5);
  return new CreasePattern(vertices, edges, cen);
};

replaceVertex = function(vert, tmpCPV, edgesWithoutComp, perps, vertices) {
  var e, edge, i, j, len, len1;
  for (i = 0, len = edgesWithoutComp.length; i < len; i++) {
    e = edgesWithoutComp[i];
    if (e.endpt1 === vert) {
      e.endpt1 = tmpCPV;
    }
    if (e.endpt2 === vert) {
      e.endpt2 = tmpCPV;
    }
  }
  for (j = 0, len1 = perps.length; j < len1; j++) {
    edge = perps[j];
    e = edge[0];
    if (e.endpt1 === vert) {
      e.endpt1 = tmpCPV;
    }
    if (e.endpt2 === vert) {
      e.endpt2 = tmpCPV;
    }
  }
  return vertices.push(tmpCPV);
};
