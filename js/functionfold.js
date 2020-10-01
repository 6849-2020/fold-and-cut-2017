var fold, foldCorridor, outputCreasePatternFOLD, outputFoldedStateFOLD,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

outputCreasePatternFOLD = function(CP, CPfaces) {
  return FOLD;
};

fold = function(CP, shady, root) {
  var corr, corridors, k, len;
  corridors = computeCorridors(CP);
  for (k = 0, len = corridors.length; k < len; k++) {
    corr = corridors[k];
    corr.clearFolds();
    foldCorridor(CP, shady, root, corr);
  }
  return CP;
};

foldCorridor = function(CP, shady, root, corr) {
  var P, Q, a, alreadyReflected, b, base, baseOther, basePerp, c, d, doubleFace, face, face1, face2, faceGraphVs, graphV, i, j, k, l, len, len1, len2, len3, m, n, newt, newu, o, p, q, ref, ref1, ref2, ref3, ref4, ref5, ref6, reflectThisFace, results, sharedEdge, sk, t, theta, transformed, u, v, x, xx;
  if (corr.numOfWalls === 1) {
    if (corr.C1 != null) {
      sk = corr.C1;
    } else {
      sk = corr.C2;
    }
  } else {
    if (shady.treeDistance(corr.C1, root) > shady.treeDistance(corr.C2, root)) {
      sk = corr.C2;
    } else {
      sk = corr.C1;
    }
  }
  n = corr.faces.length;
  for (i = k = 0, ref = n - 2; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
    face1 = corr.faces[i];
    face2 = corr.faces[i + 1];
    sharedEdge = setIntersect(face1[1], face2[1]);
    if (sharedEdge.assignment === "m" || sharedEdge.assignment === "v") {
      alreadyReflected = [];
      for (j = l = ref1 = i + 1, ref2 = n - 1; ref1 <= ref2 ? l <= ref2 : l >= ref2; j = ref1 <= ref2 ? ++l : --l) {
        reflectThisFace = corr.faces[j];
        ref3 = reflectThisFace[0];
        for (m = 0, len = ref3.length; m < len; m++) {
          v = ref3[m];
          if (indexOf.call(alreadyReflected, v) >= 0) {
            continue;
          }
          reflect(v.foldedPos, sharedEdge.foldedPos);
          alreadyReflected.push(v);
        }
      }
    }
  }
  ref4 = corr.faces;
  for (o = 0, len1 = ref4.length; o < len1; o++) {
    doubleFace = ref4[o];
    faceGraphVs = [];
    ref5 = doubleFace[0];
    for (p = 0, len2 = ref5.length; p < len2; p++) {
      graphV = ref5[p];
      if (graphV.type === "quasiGraph" || graphV.type === "graph") {
        faceGraphVs.push(graphV);
      }
    }
    if (faceGraphVs.length === 2) {
      base = new CreasePatternEdge(faceGraphVs[0], faceGraphVs[1], "graph", null, "f");
    }
  }
  if ((base.endpt1.component != null) && base.endpt1.component === sk) {
    basePerp = base.endpt1;
    baseOther = base.endpt2;
  } else {
    basePerp = base.endpt2;
    baseOther = base.endpt1;
  }
  x = shady.distance(sk, root);
  xx = x + base.length();
  a = basePerp.foldedPos.x;
  b = basePerp.foldedPos.y;
  c = baseOther.foldedPos.x;
  d = baseOther.foldedPos.y;
  P = new Point(c - a, d - b);
  Q = new Point(xx - x, 0);
  theta = Q.ang() - P.ang();
  transformed = [];
  ref6 = corr.faces;
  results = [];
  for (q = 0, len3 = ref6.length; q < len3; q++) {
    face = ref6[q];
    results.push((function() {
      var len4, r, ref7, results1;
      ref7 = face[0];
      results1 = [];
      for (r = 0, len4 = ref7.length; r < len4; r++) {
        v = ref7[r];
        if (indexOf.call(transformed, v) >= 0) {
          continue;
        }
        t = v.foldedPos.x;
        u = v.foldedPos.y;
        t = t - a;
        u = u - b;
        newt = Math.cos(theta) * t - Math.sin(theta) * u;
        newu = Math.sin(theta) * t + Math.cos(theta) * u;
        t = newt;
        u = newu;
        t = t + x;
        v.foldedPos.x = t;
        v.foldedPos.y = u;
        results1.push(transformed.push(v));
      }
      return results1;
    })());
  }
  return results;
};

outputFoldedStateFOLD = function(CP, CPfaces, facesRelations) {
  return FOLD;
};
