var Corridor, CreasePattern, CreasePatternEdge, CreasePatternVertex, OrientedMetricTree, incident, otherVertex, setIntersect,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

CreasePatternVertex = (function(superClass) {
  extend(CreasePatternVertex, superClass);

  function CreasePatternVertex(x, y, type, skelVtx, foldedPosition) {
    CreasePatternVertex.__super__.constructor.call(this, x, y);
    this.z = 0;
    this.type = type;
    if (this.type === "skeleton") {
      this.component = this;
    }
    if (this.type === "quasiSkeleton" || this.type === "quasiGraph" || this.type === "boundaryPerp") {
      this.component = skelVtx;
    }
    if (foldedPosition != null) {
      this.foldedPos = foldedPosition;
    } else {
      this.foldedPos = new Point(this.x, this.y);
    }
  }

  CreasePatternVertex.prototype.clearFolds = function() {
    this.foldedPos.x = this.x;
    return this.foldedPos.y = this.y;
  };

  CreasePatternVertex.prototype.toggleFold = function() {
    var tmpX, tmpY;
    tmpX = this.x;
    tmpY = this.y;
    this.x = this.foldedPos.x;
    this.y = this.foldedPos.y;
    this.foldedPos.x = tmpX;
    return this.foldedPos.y = tmpY;
  };

  CreasePatternVertex.prototype.printFull = function() {
    if (this.component != null) {
      return "[ (" + this.x + "," + this.y + "), " + this.type + ", (" + this.component.x + "," + this.component.y + ") ]";
    }
    return "[ (" + this.x + "," + this.y + "), " + this.type + " ]";
  };

  return CreasePatternVertex;

})(Point);

CreasePatternEdge = (function() {
  function CreasePatternEdge(endpt1, endpt2, type, skelVtx, assignment) {
    this.endpt1 = endpt1;
    this.endpt2 = endpt2;
    this.type = type;
    if (this.type === "perp") {
      this.component = skelVtx;
    }
    if (assignment != null) {
      this.assignment = assignment;
    } else {
      this.assignment = "u";
    }
    this.foldedPos = new GraphEdge(this.endpt1.foldedPos, this.endpt2.foldedPos);
  }

  CreasePatternEdge.prototype.isEqualTo = function(otherCPE) {
    if ((this.endpt1 === otherCPE.endpt1 && this.endpt2 === otherCPE.endpt2) || (this.endpt1 === otherCPE.endpt2 && this.endpt2 === otherCPE.endpt1)) {
      return true;
    }
    return false;
  };

  CreasePatternEdge.prototype.length = function() {
    return dist(this.endpt1, this.endpt2);
  };

  CreasePatternEdge.prototype.assign = function(mvbfu) {
    return this.assignment = mvbfu;
  };

  CreasePatternEdge.prototype.print = function() {
    return this.endpt1.print() + " -- " + this.endpt2.print() + " " + this.assignment;
  };

  CreasePatternEdge.prototype.printFull = function() {
    if (this.type === "perp") {
      return this.type + " " + this.endpt1.print() + " -- " + this.endpt2.print() + " " + this.assignment + " " + this.component.print();
    }
    return this.type + " " + this.endpt1.print() + " -- " + this.endpt2.print() + " " + this.assignment;
  };

  return CreasePatternEdge;

})();

CreasePattern = (function() {
  function CreasePattern(cPVs, cPEs, center) {
    this.cPVs = cPVs;
    this.cPEs = cPEs;
    this.center = center;
  }

  CreasePattern.prototype.addVtx = function(cPV) {
    return this.cPVs.push(cPV);
  };

  CreasePattern.prototype.removeVtx = function(cPV) {
    var i, k, n, ref, results;
    n = this.cPVs.indexOf(cPV);
    this.cPVs.splice(n, 1);
    results = [];
    for (i = k = 0, ref = this.cPEs.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      if (incident(cPV, this.cPEs[i])) {
        results.push(this.cPEs.splice(i, 1));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  CreasePattern.prototype.addEdge = function(cPE) {
    return this.cPEs.push(cPE);
  };

  CreasePattern.prototype.removeEdge = function(cPE) {
    var n;
    n = this.cPEs.indexOf(cPE);
    return this.cPEs.splice(n, 1);
  };

  CreasePattern.prototype.neighborEdges = function(cPV) {
    var N, e, k, len, ref;
    N = [];
    ref = this.cPEs;
    for (k = 0, len = ref.length; k < len; k++) {
      e = ref[k];
      if (incident(cPV, e)) {
        N.push(e);
      }
    }
    return N;
  };

  CreasePattern.prototype.neighborVtxs = function(cPV) {
    var V, e, k, len, ref;
    V = [];
    ref = this.neighborEdges(cPV);
    for (k = 0, len = ref.length; k < len; k++) {
      e = ref[k];
      if (e.endpt1 === cPV) {
        V.push(e.endpt2);
      } else {
        V.push(e.endpt1);
      }
    }
    return V;
  };

  CreasePattern.prototype.degree = function(cPV) {
    return this.neighborEdges(cPV).length;
  };

  CreasePattern.prototype.isEdge = function(vertex1, vertex2) {
    var e, k, len, ref;
    ref = this.cPEs;
    for (k = 0, len = ref.length; k < len; k++) {
      e = ref[k];
      if ((e.endpt1 === vertex1 && e.endpt2 === vertex2) || (e.endpt1 === vertex2 && e.endpt2 === vertex1)) {
        return true;
      }
    }
    return false;
  };

  CreasePattern.prototype.boundaryPerpCircle = function() {
    var b, k, len, ref, theta, v;
    b = new PriorityQueue;
    ref = this.cPVs;
    for (k = 0, len = ref.length; k < len; k++) {
      v = ref[k];
      if (v.type === "boundaryPerp") {
        theta = v.minus(this.center).ang();
        b.add(v, theta);
      }
    }
    return b.values();
  };

  CreasePattern.prototype.boundaryAllCircle = function() {
    var b, k, len, ref, theta, v;
    b = new PriorityQueue;
    ref = this.cPVs;
    for (k = 0, len = ref.length; k < len; k++) {
      v = ref[k];
      if (v.type === "boundaryPerp" || v.type === "boundary" || v.type === "boundarySkel") {
        theta = v.minus(this.center).ang();
        b.add(v, theta);
      }
    }
    return b.values();
  };

  CreasePattern.prototype.boundaryEdgeCircle = function() {
    var b, e, k, len, m, ref, theta, v, w;
    b = new ProirityQueue;
    ref = this.cPEs;
    for (k = 0, len = ref.length; k < len; k++) {
      e = ref[k];
      if (e.type === "boundary") {
        v = e.endpt1;
        w = e.endpt2;
        m = v.plus(w).times(0.5);
        theta = m.minus(this.center).ang();
        b.add(e, theta);
      }
    }
    return b.values();
  };

  CreasePattern.prototype.rotateCCW = function(edge, vertex) {
    var candidateEdge, k, len, otherVtx, phi, ref, rotatedEdge, theta, vertexPrime;
    if (edge.endpt1 === vertex) {
      vertexPrime = edge.endpt2;
    } else {
      vertexPrime = edge.endpt1;
    }
    rotatedEdge = edge;
    theta = 7;
    ref = this.neighborEdges(vertex);
    for (k = 0, len = ref.length; k < len; k++) {
      candidateEdge = ref[k];
      if (candidateEdge === edge) {
        continue;
      }
      if (candidateEdge.endpt1 === vertex) {
        otherVtx = candidateEdge.endpt2;
      } else {
        otherVtx = candidateEdge.endpt1;
      }
      phi = otherVtx.minus(vertex).ang() - vertexPrime.minus(vertex).ang();
      if (phi - 2 * Math.PI * Math.floor(phi / (2 * Math.PI)) < theta) {
        rotatedEdge = candidateEdge;
        theta = phi - 2 * Math.PI * Math.floor(phi / (2 * Math.PI));
      }
    }
    return rotatedEdge;
  };

  CreasePattern.prototype.rotateCW = function(edge, vertex) {
    var e, k, len, ref;
    ref = this.neighborEdges(vertex);
    for (k = 0, len = ref.length; k < len; k++) {
      e = ref[k];
      if (this.rotateCCW(e, vertex) === edge) {
        return e;
      }
    }
  };

  CreasePattern.prototype.rotateCW2 = function(edge, vertex) {
    var rotEdge, rotVertex;
    rotEdge = this.rotateCW(edge, vertex);
    if (rotEdge.endpt1 === vertex) {
      rotVertex = rotEdge.endpt2;
    } else {
      rotVertex = rotEdge.endpt1;
    }
    return [rotEdge, rotVertex];
  };

  CreasePattern.prototype.rotateCCW2 = function(edge, vertex) {
    var rotEdge, rotVertex;
    rotEdge = this.rotateCCW(edge, vertex);
    if (rotEdge.endpt1 === vertex) {
      rotVertex = rotEdge.endpt2;
    } else {
      rotVertex = rotEdge.endpt1;
    }
    return [rotEdge, rotVertex];
  };

  CreasePattern.prototype.toggleFold = function() {
    var k, len, ref, results, v;
    ref = this.cPVs;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      v = ref[k];
      results.push(v.toggleFold());
    }
    return results;
  };

  return CreasePattern;

})();

Corridor = (function(superClass) {
  extend(Corridor, superClass);

  function Corridor(CP, boundaryEdge, vtx1, vtx2) {
    var e, faceE, faceSize, faceV, ref, ref1, ref2, ref3, rep, start, v;
    this.wall1_Vtxs = [];
    this.wall2_Vtxs = [];
    this.wall1_Edges = [];
    this.wall2_Edges = [];
    this.nonWallEdges = [];
    this.faces = [];
    this.width = dist(vtx1, vtx2);
    this.C1 = vtx1.component;
    this.C2 = vtx2.component;
    start = vtx1;
    e = boundaryEdge;
    faceV = [];
    faceE = [];
    if (vtx1.type === "boundaryPerp") {
      this.wall1_Vtxs.push(vtx1);
    }
    while (true) {
      v = start;
      while (true) {
        faceV.push(v);
        faceE.push(e);
        if (e.type === "perp") {
          if (e.component === this.C2) {
            this.wall2_Vtxs.push(v);
            this.wall2_Edges.push(e);
          } else {
            this.wall1_Vtxs.push(v);
            this.wall1_Edges.push(e);
          }
        } else {
          this.nonWallEdges.push(e);
        }
        ref = CP.rotateCW2(e, v), e = ref[0], v = ref[1];
        if (v === start) {
          break;
        }
      }
      this.faces.push([faceV, faceE]);
      faceSize = faceV.length;
      faceV = [];
      faceE = [];
      v = otherVertex(v, e);
      ref1 = CP.rotateCCW2(e, v), e = ref1[0], v = ref1[1];
      if (faceSize === 3 && e.type !== "perp") {
        start = v;
      } else {
        ref2 = CP.rotateCCW2(e, v), e = ref2[0], v = ref2[1];
        if (e.type === "perp") {
          ref3 = CP.rotateCCW2(e, v), e = ref3[0], v = ref3[1];
        }
        start = v;
      }
      if (e.type === "boundary") {
        if (v === e.endpt1) {
          v = e.endpt2;
        } else {
          v = e.endpt1;
        }
        if (v.component === this.C2) {
          this.wall2_Vtxs.push(v);
        } else {
          this.wall1_Vtxs.push(v);
        }
        break;
      }
    }
    if (this.wall1_Vtxs.length > 0) {
      rep = this.wall1_Vtxs[0];
      this.C1 = rep.component;
    }
    if ((this.C1 != null) && (this.C2 != null) && this.C1 !== this.C2) {
      this.numOfWalls = 2;
    } else {
      this.numOfWalls = 1;
    }
  }

  Corridor.prototype.assign = function(edge) {
    var container, face, face1, face2, i, j, k, len, ref;
    if (edge.type === "graph") {
      edge.assign("f");
      return;
    }
    container = [];
    ref = this.faces;
    for (k = 0, len = ref.length; k < len; k++) {
      face = ref[k];
      if (indexOf.call(face[1], edge) >= 0) {
        container.push(face);
      }
    }
    if (container.length === 2) {
      face1 = container[0];
      face2 = container[1];
      i = this.gluedIndex(face1);
      j = this.gluedIndex(face2);
      if ((i < j && i % 2 === 0) || (j < i && j % 2 === 0)) {
        return edge.assign("m");
      } else {
        return edge.assign("v");
      }
    }
  };

  Corridor.prototype.gluedIndex = function(face) {
    var e, i, ind, k, ref, subtractThisMuch;
    ind = this.faces.indexOf(face);
    if (ind === 0) {
      return ind;
    }
    subtractThisMuch = 0;
    for (i = k = 0, ref = ind - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      e = setIntersect(this.faces[i][1], this.faces[i + 1][1]);
      if (e.type === "graph") {
        subtractThisMuch = subtractThisMuch + 1;
      }
    }
    return ind - subtractThisMuch;
  };

  Corridor.prototype.assignAll = function() {
    var edge, k, l, len, len1, len2, o, ref, ref1, ref2, results;
    ref = this.wall1_Edges;
    for (k = 0, len = ref.length; k < len; k++) {
      edge = ref[k];
      this.assign(edge);
    }
    ref1 = this.wall2_Edges;
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      edge = ref1[l];
      this.assign(edge);
    }
    ref2 = this.nonWallEdges;
    results = [];
    for (o = 0, len2 = ref2.length; o < len2; o++) {
      edge = ref2[o];
      results.push(this.assign(edge));
    }
    return results;
  };

  Corridor.prototype.faceRelations = function() {
    var f, faceRel, g, i, k, ref;
    faceRel = [];
    for (i = k = 0, ref = this.faces.length - 2; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      f = this.faces[i];
      g = this.faces[i + 1];
      if (i % 2 === 0) {
        faceRel.push([f, g, -1]);
        faceRel.push([g, f, -1]);
      } else {
        faceRel.push([f, g, 1]);
        faceRel.push([g, f, 1]);
      }
    }
    return faceRel;
  };

  Corridor.prototype.clearFolds = function() {
    var face, k, len, ref, results, v;
    ref = this.faces;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      face = ref[k];
      results.push((function() {
        var l, len1, ref1, results1;
        ref1 = face[0];
        results1 = [];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          v = ref1[l];
          results1.push(v.clearFolds());
        }
        return results1;
      })());
    }
    return results;
  };

  Corridor.prototype.print = function() {
    if ((this.C1 != null) && (this.C2 != null)) {
      return "2-wall-corridor between " + this.C1.print() + " and " + this.C2.print();
    } else {
      if (this.C1 != null) {
        return "1-wall-corridor to left of " + this.wall1_Vtxs[0].print();
      } else {
        return "1-wall-corridor to right of " + this.wall2_Vtxs[0].print();
      }
    }
  };

  return Corridor;

})(CreasePattern);

OrientedMetricTree = (function() {
  function OrientedMetricTree(vertices, edges) {
    this.vertices = vertices;
    this.edges = edges;
  }

  OrientedMetricTree.prototype.addVtx = function(vertex) {
    return this.vertices.push(vertex);
  };

  OrientedMetricTree.prototype.addEdge = function(edge) {
    return this.edges.push(edge);
  };

  OrientedMetricTree.prototype.degree = function(vertex) {
    var d, e, k, len, ref;
    d = 0;
    ref = this.edges;
    for (k = 0, len = ref.length; k < len; k++) {
      e = ref[k];
      if (e.C1 === vertex || e.C2 === vertex) {
        d = d + 1;
      }
    }
    return d;
  };

  OrientedMetricTree.prototype.isEdge = function(vertex1, vertex2) {
    var e, k, len, ref;
    ref = this.edges;
    for (k = 0, len = ref.length; k < len; k++) {
      e = ref[k];
      if ((e.C1 === vertex1 && e.C2 === vertex2) || (e.C1 === vertex2 && e.C2 === vertex1)) {
        return true;
      }
    }
    return false;
  };

  OrientedMetricTree.prototype.findLeaf = function() {
    var k, len, ref, v;
    ref = this.vertices;
    for (k = 0, len = ref.length; k < len; k++) {
      v = ref[k];
      if (this.degree(v) === 1) {
        return v;
      }
    }
  };

  OrientedMetricTree.prototype.findPath = function(start, end) {
    var C, N, V, boundaryVtx, e, k, l, len, len1, len2, len3, len4, len5, len6, len7, m, middle, neighborhoodE, neighborhoodS, newC, o, p1, p2, q, r, ref, ref1, ref2, ref3, s, t, u, v, vert, z;
    s = 0;
    neighborhoodS = [[[start, [start]]], [[start, [start]]], [start]];
    e = 0;
    neighborhoodE = [[[end, [end]]], [[end, [end]]], [end]];
    while (!(setIntersect(neighborhoodS[2], neighborhoodE[2]) != null)) {
      if (s > e) {
        e = e + 1;
        N = neighborhoodE[0], C = neighborhoodE[1], V = neighborhoodE[2];
        newC = [];
        ref = this.vertices;
        for (k = 0, len = ref.length; k < len; k++) {
          v = ref[k];
          if (indexOf.call(V, v) >= 0) {
            continue;
          }
          for (l = 0, len1 = C.length; l < len1; l++) {
            boundaryVtx = C[l];
            if (this.isEdge(boundaryVtx[0], v)) {
              newC.push([v, boundaryVtx[1].concat([v])]);
              V.push(v);
            }
          }
        }
        while (C.length !== 0) {
          C.splice(0, 1);
        }
        for (o = 0, len2 = newC.length; o < len2; o++) {
          vert = newC[o];
          N.push(vert);
          C.push(vert);
        }
      } else {
        s = s + 1;
        N = neighborhoodS[0], C = neighborhoodS[1], V = neighborhoodS[2];
        newC = [];
        ref1 = this.vertices;
        for (q = 0, len3 = ref1.length; q < len3; q++) {
          v = ref1[q];
          if (indexOf.call(V, v) >= 0) {
            continue;
          }
          for (r = 0, len4 = C.length; r < len4; r++) {
            boundaryVtx = C[r];
            if (this.isEdge(boundaryVtx[0], v)) {
              newC.push([v, boundaryVtx[1].concat([v])]);
              V.push(v);
            }
          }
        }
        while (C.length !== 0) {
          C.splice(0, 1);
        }
        for (t = 0, len5 = newC.length; t < len5; t++) {
          vert = newC[t];
          N.push(vert);
          C.push(vert);
        }
      }
    }
    middle = setIntersect(neighborhoodS[2], neighborhoodE[2]);
    ref2 = neighborhoodS[0];
    for (u = 0, len6 = ref2.length; u < len6; u++) {
      m = ref2[u];
      if (m[0] === middle) {
        m[1].splice(m[1].length - 1, 1);
        p1 = m[1];
        break;
      }
    }
    ref3 = neighborhoodE[0];
    for (z = 0, len7 = ref3.length; z < len7; z++) {
      m = ref3[z];
      if (m[0] === middle) {
        p2 = m[1].reverse();
      }
    }
    return p1.concat(p2);
  };

  OrientedMetricTree.prototype.treeDistance = function(vertex1, vertex2) {
    return this.findPath(vertex1, vertex2).length - 1;
  };

  OrientedMetricTree.prototype.distance = function(vertex1, vertex2) {
    var d, i, k, p, ref;
    p = this.findPath(vertex1, vertex2);
    d = 0;
    if (p.length === 1) {
      return 0;
    }
    for (i = k = 0, ref = p.length - 2; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      d = d + dist(p[i], p[i + 1]);
    }
    return d;
  };

  OrientedMetricTree.prototype.orientation = function(vertex) {
    var e, edgeCircle, k, len, ref, repr, wall;
    edgeCircle = new PriorityQueue;
    ref = this.edges;
    for (k = 0, len = ref.length; k < len; k++) {
      e = ref[k];
      if (e.C1 === vertex || e.C2 === vertex) {
        if (e.numOfWalls === 1) {
          if (e.C1 != null) {
            repr = e.wall1_Vtxs[0];
          } else {
            wall = e.wall2_Vtxs;
            repr = wall[wall.length - 1];
          }
        } else {
          if (e.C1 === vertex) {
            wall = e.wall2_Vtxs;
            repr = wall[wall.length - 1];
          } else {
            repr = e.wall1_Vtxs[0];
          }
        }
        edgeCircle.add(e, repr.minus(vertex).ang());
      }
    }
    return edgeCircle.values();
  };

  return OrientedMetricTree;

})();

incident = function(cPV, cPE) {
  if (cPE.endpt1 === cPV || cPE.endpt2 === cPV) {
    return true;
  }
  return false;
};

setIntersect = function(A, B) {
  var a, k, len;
  for (k = 0, len = A.length; k < len; k++) {
    a = A[k];
    if (indexOf.call(B, a) >= 0) {
      return a;
    }
  }
  return null;
};

otherVertex = function(cPV, cPE) {
  if (cPV === cPE.endpt1) {
    return cPE.endpt2;
  } else {
    return cPE.endpt1;
  }
};
