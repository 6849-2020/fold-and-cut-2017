var computePerps, dropPerp, leaveFaceTest,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

computePerps = function(skelEdges, skelVtxs, infEdges, gVtxs, gEdges) {
  var count, e, index, infPerps, j, k, l, len, len1, len2, m, oldInfs, oldSkels, perps, quasiGraphVtxs, quasiSkelVtxs, ray, skelV, skele, skeli, tmpSkeleton, tooManyPerps, type, v;
  perps = [];
  infPerps = [];
  quasiSkelVtxs = [];
  quasiGraphVtxs = [];
  tooManyPerps = false;
  oldSkels = [];
  for (j = 0, len = skelEdges.length; j < len; j++) {
    skele = skelEdges[j];
    oldSkels.push(skele);
  }
  oldInfs = [];
  for (k = 0, len1 = infEdges.length; k < len1; k++) {
    skeli = infEdges[k];
    oldInfs.push(skeli);
  }
  tmpSkeleton = [];
  for (l = 0, len2 = skelVtxs.length; l < len2; l++) {
    skelV = skelVtxs[l];
    v = skelV[0];
    tmpSkeleton.push(v);
    for (index = m = 1; m <= 3; index = ++m) {
      e = skelV[index];
      if (leaveFaceTest(v, e, skelVtxs, oldSkels, oldInfs)) {
        continue;
      }
      ray = perp(v, e);
      if (ray.dir.x === 0 && ray.dir.y === 0) {
        alert("line 31 dir = (0, 0)");
      }
      count = 0;
      type = "s";
      while (type !== "none" && (count < 40)) {
        type = dropPerp(ray, v, skelEdges, infEdges, gEdges, perps, infPerps);
        switch (type) {
          case "s":
          case "i":
            quasiSkelVtxs.push([ray.origin, v]);
            break;
          case "g":
            quasiGraphVtxs.push([ray.origin, v]);
            break;
          default:
            break;
        }
        count = count + 1;
        if (count === 40) {
          tooManyPerps = true;
        }
      }
    }
  }
  skelVtxs = tmpSkeleton;
  return [skelEdges, tmpSkeleton, infEdges, gVtxs, gEdges, perps, infPerps, quasiSkelVtxs, quasiGraphVtxs, tooManyPerps];
};

dropPerp = function(ray, v, skelEdges, infEdges, gEdges, perps, infPerps) {
  var d, dis, edge, edge1, edge2, edgeSet, endpt1, endpt2, ft, gE, iE, j, k, l, len, len1, len2, n, orig, p, pt, ref, ref1, ref2, ref3, reflection, sE, type;
  ref = [null, "none", null, null], pt = ref[0], type = ref[1], dis = ref[2], edge = ref[3];
  for (j = 0, len = gEdges.length; j < len; j++) {
    gE = gEdges[j];
    if (gE.endpt1 === ray.origin || gE.endpt2 === ray.origin) {
      continue;
    }
    p = intersect(ray, gE);
    if (p != null) {
      d = dist(ray.origin, p);
      if (d < dis || !(dis != null)) {
        ref1 = [p, "g", d, gE], pt = ref1[0], type = ref1[1], dis = ref1[2], edge = ref1[3];
      }
    }
  }
  for (k = 0, len1 = skelEdges.length; k < len1; k++) {
    sE = skelEdges[k];
    if (sE.endpt1 === ray.origin || sE.endpt2 === ray.origin) {
      continue;
    }
    p = intersect(ray, sE);
    if (p != null) {
      d = dist(ray.origin, p);
      if (d < dis || !(dis != null)) {
        ref2 = [p, "s", d, sE], pt = ref2[0], type = ref2[1], dis = ref2[2], edge = ref2[3];
      }
    }
  }
  for (l = 0, len2 = infEdges.length; l < len2; l++) {
    iE = infEdges[l];
    if (iE.origin === ray.origin) {
      continue;
    }
    p = intersect(ray, iE);
    if (p != null) {
      d = dist(ray.origin, p);
      if (d < dis || !(dis != null)) {
        ref3 = [p, "i", d, iE], pt = ref3[0], type = ref3[1], dis = ref3[2], edge = ref3[3];
      }
    }
  }
  switch (type) {
    case "i":
    case "s":
    case "g":
      perps.push([new GraphEdge(ray.origin, pt), v]);
      break;
    default:
      infPerps.push([ray, v]);
      return type;
  }
  switch (type) {
    case "s":
    case "g":
      if (type === "s") {
        edgeSet = skelEdges;
      } else {
        edgeSet = gEdges;
      }
      endpt1 = edge.endpt1;
      endpt2 = edge.endpt2;
      edge1 = new GraphEdge(endpt1, pt);
      edge2 = new GraphEdge(pt, endpt2);
      n = edgeSet.indexOf(edge);
      edgeSet.splice(n, 1);
      edgeSet.push(edge1);
      edgeSet.push(edge2);
      break;
    case "i":
      orig = edge.origin;
      edge1 = new GraphEdge(orig, pt);
      edge2 = new LineOrRay(pt, pt.plus(edge.dir), true);
      skelEdges.push(edge1);
      n = infEdges.indexOf(edge);
      infEdges.splice(n, 1);
      infEdges.push(edge2);
  }
  ft = foot(ray.origin, line(edge));
  reflection = ft.plus(ft).minus(ray.origin);
  ray.origin = pt;
  ray.dir = reflection.minus(pt);
  return type;
};

leaveFaceTest = function(v, e, skelVtxs, oldSkels, oldInfs) {
  var face_edges, face_vertices, fancyV, i, j, k, l, leaving, len, len1, len2, len3, m, o, ray, ref, ref1, ref2, segOrRay, skele, skeli, vert;
  face_vertices = [e.endpt1, e.endpt2];
  for (j = 0, len = skelVtxs.length; j < len; j++) {
    fancyV = skelVtxs[j];
    vert = fancyV[0];
    for (i = k = 1; k <= 3; i = ++k) {
      if (e.isEqualTo(fancyV[i])) {
        face_vertices.push(vert);
        break;
      }
    }
  }
  face_edges = [e];
  for (l = 0, len1 = oldSkels.length; l < len1; l++) {
    skele = oldSkels[l];
    if ((ref = skele.endpt1, indexOf.call(face_vertices, ref) >= 0) && (ref1 = skele.endpt2, indexOf.call(face_vertices, ref1) >= 0)) {
      face_edges.push(skele);
    }
  }
  for (m = 0, len2 = oldInfs.length; m < len2; m++) {
    skeli = oldInfs[m];
    if ((ref2 = skeli.origin, indexOf.call(face_vertices, ref2) >= 0) && (side(skeli.origin.plus(skeli.dir), e) === "left")) {
      face_edges.push(skeli);
    }
  }
  ray = perp(v, e);
  leaving = true;
  for (o = 0, len3 = face_edges.length; o < len3; o++) {
    segOrRay = face_edges[o];
    if (segOrRay.isSegment != null) {
      if (segOrRay.endpt1 === v || segOrRay.endpt2 === v) {
        continue;
      }
    }
    if (segOrRay.isRay) {
      if (segOrRay.origin === v) {
        continue;
      }
    }
    if (intersect(ray, segOrRay) != null) {
      leaving = false;
    }
  }
  return leaving;
};
