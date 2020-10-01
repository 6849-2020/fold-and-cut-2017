var computeCorridors, computeShadowTree, corridorsContaining, foldedState,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

computeCorridors = function(CP) {
  var BAll, corr, corridors, done, e, i, j, k, l, len, len1, len2, m, n, newCorr, ref, v, w;
  corridors = [];
  BAll = CP.boundaryAllCircle();
  n = BAll.length;
  ref = CP.cPEs;
  for (k = 0, len = ref.length; k < len; k++) {
    e = ref[k];
    if (e.type === "boundary") {
      i = BAll.indexOf(e.endpt1);
      j = BAll.indexOf(e.endpt2);
      if (i === (j + 1) % n) {
        v = e.endpt1;
        w = e.endpt2;
      } else {
        v = e.endpt2;
        w = e.endpt1;
      }
      if (v.type === "boundaryPerp" && w.type === "boundaryPerp") {
        done = false;
        for (l = 0, len1 = corridors.length; l < len1; l++) {
          corr = corridors[l];
          if ((corr.C1 === v.component && corr.C2 === w.component) || (corr.C1 === w.component && corr.C2 === v.component)) {
            done = true;
            break;
          }
        }
        if (!done) {
          newCorr = new Corridor(CP, e, v, w);
          corridors.push(newCorr);
        }
      }
      if (v.type !== "boundaryPerp" && w.type === "boundaryPerp") {
        newCorr = new Corridor(CP, e, v, w);
        done = false;
        if (newCorr.numOfWalls === 2) {
          for (m = 0, len2 = corridors.length; m < len2; m++) {
            corr = corridors[m];
            if ((corr.C1 === newCorr.C1 && corr.C2 === newCorr.C2) || (corr.C2 === newCorr.C1 && corr.C1 === newCorr.C2)) {
              done = true;
              break;
            }
          }
        }
        if (!done) {
          corridors.push(newCorr);
        }
      }
      if (w.type !== "boundaryPerp") {
        continue;
      }
    }
  }
  return corridors;
};

computeShadowTree = function(CP, corridors) {
  var k, len, ref, skels, v;
  skels = [];
  ref = CP.cPVs;
  for (k = 0, len = ref.length; k < len; k++) {
    v = ref[k];
    if (v.type === "skeleton") {
      skels.push(v);
    }
  }
  return new OrientedMetricTree(skels, corridors);
};

corridorsContaining = function(perpEdge, corridors) {
  var container, corr, k, len;
  container = [];
  for (k = 0, len = corridors.length; k < len; k++) {
    corr = corridors[k];
    if ((indexOf.call(corr.wall1_Edges, perpEdge) >= 0) || (indexOf.call(corr.wall2_Edges, perpEdge) >= 0)) {
      container.push(corr);
    }
  }
  return container;
};

foldedState = function(CP) {
  var CPfaces, checkCorr, checkIndex, container, corr, corr1, corr2, corridors, downs, e, edge, f, fac, face1, face2, facesRelations, gluedInd, i, j, k, l, lastFace, len, len1, len2, len3, len4, len5, len6, m, n, needSwitch, neighborCircleSK, numOfGluedFaces, o, p, q, r, ref, ref1, ref2, ref3, ref4, ref5, root, shady, sk, skPrime, tmp, tmpInd;
  corridors = computeCorridors(CP);
  shady = computeShadowTree(CP, corridors);
  CPfaces = [];
  facesRelations = [];
  ref = shady.vertices;
  for (k = 0, len = ref.length; k < len; k++) {
    root = ref[k];
    if (shady.degree(root) !== 1) {
      break;
    }
  }
  ref1 = CP.cPEs;
  for (l = 0, len1 = ref1.length; l < len1; l++) {
    e = ref1[l];
    if (e.type === "boundary") {
      e.assign("b");
    }
    if (e.type === "perp") {
      container = corridorsContaining(e, corridors);
      if (container.length === 1) {
        continue;
      }
      sk = e.component;
      corr1 = container[0], corr2 = container[1];
      neighborCircleSK = shady.orientation(sk);
      n = neighborCircleSK.length;
      i = neighborCircleSK.indexOf(corr1);
      j = neighborCircleSK.indexOf(corr2);
      needSwitch = false;
      checkIndex = (i + 1) % n;
      while (checkIndex !== j) {
        checkCorr = neighborCircleSK[checkIndex];
        if (checkCorr.numOfWalls > 1) {
          needSwitch = true;
          break;
        }
        checkIndex = (checkIndex + 1) % n;
      }
      if (needSwitch) {
        tmp = corr1;
        corr1 = corr2;
        corr2 = tmp;
        tmpInd = i;
        i = j;
        j = tmpInd;
      }
      downs = 0;
      ref2 = [corr1, corr2];
      for (m = 0, len2 = ref2.length; m < len2; m++) {
        edge = ref2[m];
        if (edge.numOfWalls === 1) {
          downs = downs + 1;
        } else {
          if (edge.C1 === sk) {
            skPrime = edge.C2;
          } else {
            skPrime = edge.C1;
          }
          if (shady.treeDistance(root, skPrime) > shady.treeDistance(root, sk)) {
            downs = downs + 1;
          }
        }
      }
      if (downs === 2) {
        ref3 = corr1.faces;
        for (o = 0, len3 = ref3.length; o < len3; o++) {
          fac = ref3[o];
          if (indexOf.call(fac[1], e) >= 0) {
            break;
          }
        }
        gluedInd = corr1.gluedIndex(fac);
        if (sk === corr1.C2) {
          lastFace = corr1.faces[corr1.faces.length - 1];
          numOfGluedFaces = corr1.gluedIndex(lastFace);
          gluedInd = numOfGluedFaces - gluedInd;
        }
        if (gluedInd % 2 === 0) {
          e.assign("v");
        } else {
          e.assign("m");
        }
      } else {
        e.assign("f");
      }
      if (sk === root && j < i) {
        if (e.assignment === "m") {
          e.assign("v");
        } else {
          e.assign("m");
        }
      }
      ref4 = corr1.faces;
      for (p = 0, len4 = ref4.length; p < len4; p++) {
        f = ref4[p];
        if (indexOf.call(f[1], e) >= 0) {
          face1 = f;
        }
      }
      ref5 = corr2.faces;
      for (q = 0, len5 = ref5.length; q < len5; q++) {
        f = ref5[q];
        if (indexOf.call(f[1], e) >= 0) {
          face2 = f;
        }
      }
      if (e.assignment === "v") {
        facesRelations.push([face1, face2, 1]);
        facesRelations.push([face2, face1, 1]);
      } else if (e.assignment === "m") {
        facesRelations.push([face1, face2, -1]);
        facesRelations.push([face2, face1, -1]);
      } else if (e.assignment === "f") {
        facesRelations.push([face1, face2, 0]);
        facesRelations.push([face2, face1, 0]);
      }
    }
  }
  for (r = 0, len6 = corridors.length; r < len6; r++) {
    corr = corridors[r];
    CPfaces = CPfaces.concat(corr.faces);
    facesRelations = facesRelations.concat(corr.faceRelations());
    corr.assignAll();
  }
  return [CPfaces, facesRelations, shady, root];
};
