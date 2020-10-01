var CircularDoublyLinkedList, Node, PriorityQueue, SLAV,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Node = (function() {
  function Node(pre, cont, suc) {
    this.pred = pre;
    this.content = cont;
    this.succ = suc;
  }

  return Node;

})();

CircularDoublyLinkedList = (function() {
  function CircularDoublyLinkedList(valuesList) {
    var j, len, val;
    this.nodesList = [];
    if (valuesList != null) {
      for (j = 0, len = valuesList.length; j < len; j++) {
        val = valuesList[j];
        this.push(val);
      }
    }
  }

  CircularDoublyLinkedList.prototype.push = function(val) {
    if (this.head != null) {
      return this.insert(val, this.tail);
    } else {
      this.head = new Node(null, val, null);
      this.head.pred = this.head;
      this.head.succ = this.head;
      this.nodesList.push(this.head);
      return this.tail = this.head.pred;
    }
  };

  CircularDoublyLinkedList.prototype.insert = function(val, prevnode) {
    var nood, postnode;
    nood = new Node(prevnode, val, prevnode.succ);
    postnode = prevnode.succ;
    prevnode.succ = nood;
    postnode.pred = nood;
    this.nodesList.push(nood);
    this.tail = this.head.pred;
    return nood;
  };

  CircularDoublyLinkedList.prototype.allContents = function() {
    var C, j, len, nood, ref;
    C = [];
    ref = this.nodesList;
    for (j = 0, len = ref.length; j < len; j++) {
      nood = ref[j];
      C.push(nood.content);
    }
    return C;
  };

  CircularDoublyLinkedList.prototype.length = function() {
    return this.nodesList.length;
  };

  CircularDoublyLinkedList.prototype.remove = function(nood) {
    var postnode, prevnode;
    if (this.length() === 0) {
      return;
    }
    if (this.length() === 1 && nood === this.head) {
      this.nodesList = [];
      this.head = null;
      return this.tail = null;
    } else {
      prevnode = nood.pred;
      postnode = nood.succ;
      prevnode.succ = postnode;
      postnode.pred = prevnode;
      this.nodesList.splice(this.nodesList.indexOf(nood), 1);
      if (nood === this.head) {
        this.head = this.head.succ;
      }
      return this.tail = this.head.pred;
    }
  };

  CircularDoublyLinkedList.prototype.reverse = function() {
    var j, len, nood, ref, tmp;
    ref = this.nodesList;
    for (j = 0, len = ref.length; j < len; j++) {
      nood = ref[j];
      tmp = nood.succ;
      nood.succ = nood.pred;
      nood.pred = tmp;
      nood.content.inEdge = new DirectedSegment(nood.pred.content.point, nood.content.point);
      nood.content.outEdge = new DirectedSegment(nood.content.point, nood.succ.content.point);
      nood.content.bisector = angleBisector(nood.content.point, nood.content.inEdge, nood.content.outEdge);
    }
    this.head = this.tail;
    this.tail = this.head.pred;
    return this;
  };

  CircularDoublyLinkedList.prototype.copy = function() {
    var copyCDLL, elem;
    copyCDLL = new CircularDoublyLinkedList();
    copyCDLL.push(this.head.content.copy());
    elem = this.head.succ;
    while (elem !== this.head) {
      copyCDLL.push(elem.content.copy());
      elem = elem.succ;
    }
    return copyCDLL;
  };

  CircularDoublyLinkedList.prototype.isInside = function(otherLAV) {
    if (inside(this.head.content.point, otherLAV)) {
      return true;
    }
    return false;
  };

  CircularDoublyLinkedList.prototype.orientation = function() {
    var A, j, len, node, ref, v, w, x1, x2, y1, y2;
    A = 0;
    ref = this.nodesList;
    for (j = 0, len = ref.length; j < len; j++) {
      node = ref[j];
      v = node.content.point;
      w = node.succ.content.point;
      x1 = v.x;
      x2 = w.x;
      y1 = v.y;
      y2 = w.y;
      A = A + (x2 - x1) * (y2 + y1);
    }
    if (A > 0) {
      return -1;
    }
    return 1;
  };

  CircularDoublyLinkedList.prototype.positiveOrient = function() {
    if (this.orientation() === -1) {
      this.reverse();
    }
    return this;
  };

  CircularDoublyLinkedList.prototype.print = function() {
    var j, len, nood, ref, s;
    s = " ";
    ref = this.nodesList;
    for (j = 0, len = ref.length; j < len; j++) {
      nood = ref[j];
      s = s + nood.content.print() + "\n ";
    }
    return s;
  };

  return CircularDoublyLinkedList;

})();

PriorityQueue = (function() {
  function PriorityQueue() {
    this.list = [];
  }

  PriorityQueue.prototype.add = function(content, number) {
    var i, j, ref, resolved;
    if (this.list.length === 0) {
      return this.list.push([content, number]);
    } else {
      resolved = false;
      for (i = j = 0, ref = this.list.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        if (number <= this.list[i][1] && !resolved) {
          this.list.splice(i, 0, [content, number]);
          resolved = true;
        }
      }
      if (!resolved) {
        return this.list.push([content, number]);
      }
    }
  };

  PriorityQueue.prototype.pop = function() {
    var I;
    I = this.list.splice(0, 1);
    return I[0][0];
  };

  PriorityQueue.prototype.length = function() {
    return this.list.length;
  };

  PriorityQueue.prototype.values = function() {
    var contents, i, j, ref, thing;
    contents = [];
    for (i = j = 0, ref = this.list.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      thing = this.list[i];
      contents.push(thing[0]);
    }
    return contents;
  };

  return PriorityQueue;

})();


/*	print : ->
		s = " " 
		for element in @list 
			s = s + s[0] + " ; "
			printing is weird the contents are gonna be weird
 */

SLAV = (function() {
  function SLAV(setOfLAVs) {
    this.allLAVs = [];
    if (setOfLAVs != null) {
      this.allLAVs = setOfLAVs;
    }
  }

  SLAV.prototype.pushLAV = function(newLAV) {
    return this.allLAVs.push(newLAV);
  };

  SLAV.prototype.removeLAV = function(oldLAV) {
    var n;
    n = this.allLAVs.indexOf(oldLAV);
    return this.allLAVs.splice(n, 1);
  };

  SLAV.prototype.allEdges = function() {
    var E, element, j, k, lav, len, len1, ref, ref1;
    E = [];
    ref = this.allLAVs;
    for (j = 0, len = ref.length; j < len; j++) {
      lav = ref[j];
      ref1 = lav.allContents();
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        element = ref1[k];
        E.push(element.outEdge.undirect());
      }
    }
    return E;
  };

  SLAV.prototype.allNodes = function() {
    var N, j, k, lav, len, len1, nood, ref, ref1;
    N = [];
    ref = this.allLAVs;
    for (j = 0, len = ref.length; j < len; j++) {
      lav = ref[j];
      ref1 = lav.nodesList;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        nood = ref1[k];
        N.push(nood);
      }
    }
    return N;
  };

  SLAV.prototype.printLAVs = function() {
    var j, lav, len, ref, s;
    s = "";
    ref = this.allLAVs;
    for (j = 0, len = ref.length; j < len; j++) {
      lav = ref[j];
      s = s + "new LAV \n" + lav.print();
    }
    return s;
  };

  SLAV.prototype.printEdges = function() {
    var j, len, ref, s, seg;
    s = "";
    ref = this.allEdges();
    for (j = 0, len = ref.length; j < len; j++) {
      seg = ref[j];
      s = s + seg.print() + ", ";
    }
    return s;
  };

  SLAV.prototype.printContents = function() {
    var j, len, nood, ref, s;
    s = " ";
    ref = this.allNodes();
    for (j = 0, len = ref.length; j < len; j++) {
      nood = ref[j];
      s = s + nood.content.print() + "\n ";
    }
    return s;
  };

  SLAV.prototype.LAVContaining = function(nood) {
    var j, lav, len, ref;
    ref = this.allLAVs;
    for (j = 0, len = ref.length; j < len; j++) {
      lav = ref[j];
      if (indexOf.call(lav.nodesList, nood) >= 0) {
        return lav;
      }
    }
    return null;
  };

  SLAV.prototype.reverse = function() {
    var j, lav, len, ref;
    ref = this.allLAVs;
    for (j = 0, len = ref.length; j < len; j++) {
      lav = ref[j];
      lav.reverse();
    }
    return this;
  };

  SLAV.prototype.copy = function() {
    var copySLAV, j, lav, len, ref;
    copySLAV = new SLAV();
    ref = this.allLAVs;
    for (j = 0, len = ref.length; j < len; j++) {
      lav = ref[j];
      copySLAV.pushLAV(lav.copy());
    }
    return copySLAV;
  };

  SLAV.prototype.join = function(otherSLAV) {
    var j, lav, len, ref;
    ref = otherSLAV.allLAVs;
    for (j = 0, len = ref.length; j < len; j++) {
      lav = ref[j];
      this.allLAVs.push(lav);
    }
    return this;
  };

  SLAV.prototype.orient = function() {
    var count, i, j, k, l, lav, len, len1, m, n, otherLav, parityArray, ref, ref1, ref2, ref3;
    ref = this.allLAVs;
    for (j = 0, len = ref.length; j < len; j++) {
      lav = ref[j];
      lav.positiveOrient();
    }
    n = this.allLAVs.length;
    parityArray = [];
    for (i = k = 0, ref1 = n - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
      lav = this.allLAVs[i];
      count = 0;
      ref2 = this.allLAVs;
      for (l = 0, len1 = ref2.length; l < len1; l++) {
        otherLav = ref2[l];
        if (otherLav === lav) {
          continue;
        }
        if (lav.isInside(otherLav)) {
          count = count + 1;
        }
      }
      parityArray[i] = count % 2;
    }
    for (i = m = 0, ref3 = n - 1; 0 <= ref3 ? m <= ref3 : m >= ref3; i = 0 <= ref3 ? ++m : --m) {
      if (parityArray[i] === 1) {
        lav = this.allLAVs[i];
        lav.reverse();
      }
    }
    return this;
  };

  SLAV.prototype.antiOrient = function() {
    this.orient();
    this.reverse();
    return this;
  };

  return SLAV;

})();
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
var foldAndCut;

foldAndCut = function(clickSeq) {
  var CP, CPfaces, e, facesRelations, gE, gV, i, iPerps, perps, qGV, qSV, ref, ref1, ref2, root, shady, tooManyPerps, v;
  ref = straightSkeleton(clickSeq), e = ref[0], v = ref[1], i = ref[2], gV = ref[3], gE = ref[4];
  console.log("straight skeleton finished");
  ref1 = computePerps(e, v, i, gV, gE), e = ref1[0], v = ref1[1], i = ref1[2], gV = ref1[3], gE = ref1[4], perps = ref1[5], iPerps = ref1[6], qSV = ref1[7], qGV = ref1[8], tooManyPerps = ref1[9];
  console.log("computePerps finished");
  CP = convert(e, v, i, gV, gE, perps, iPerps, qSV, qGV);
  console.log("convert finished");
  if (!tooManyPerps) {
    ref2 = foldedState(CP), CPfaces = ref2[0], facesRelations = ref2[1], shady = ref2[2], root = ref2[3];
  }
  return [CP, CPfaces, facesRelations, gE, tooManyPerps];
};
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
var stepTwo;

stepTwo = function(mySLAV, pq, processed, skelEdges, skelVtxs, infEdges) {
  var I;
  I = pq.pop();
  if (I[0] === "e") {
    return edgeHandle(mySLAV, pq, I, processed, skelEdges, skelVtxs, infEdges);
  } else {
    return splitHandle(mySLAV, pq, I, processed, skelEdges, skelVtxs, infEdges);
  }
};
var straightSkeleton,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

straightSkeleton = function(clickSequence) {
  var gEdges, gVtxs, i, infEdges, leftOver, len, mySLAV, pq, processed, ref, ref1, skelEdges, skelVtxs;
  console.clear();
  skelEdges = [];
  skelVtxs = [];
  infEdges = [];
  processed = [];
  ref = stepOneAB(clickSequence), mySLAV = ref[0], gVtxs = ref[1], gEdges = ref[2];
  pq = stepOneC(mySLAV, infEdges);
  while (pq.length() !== 0) {
    stepTwo(mySLAV, pq, processed, skelEdges, skelVtxs, infEdges);
  }
  ref1 = mySLAV.allNodes();
  for (i = 0, len = ref1.length; i < len; i++) {
    leftOver = ref1[i];
    if (!(indexOf.call(processed, leftOver) >= 0)) {
      infEdges.push(leftOver.content.bbbisector());
    }
  }
  return [skelEdges, skelVtxs, infEdges, gVtxs, gEdges];
};
var DirectedSegment, GraphEdge, LineOrRay, Point, Vertex, angle, angleBisector, dist, foot, intersect, isReflex, line, perp, reflect;

Point = (function() {
  function Point(x, y) {
    this.x = x;
    this.y = y;
    this.isPoint = true;
  }

  Point.prototype.ang = function() {
    return Math.atan2(this.y, this.x);
  };

  Point.prototype.plus = function(otherPoint) {
    var x, y;
    x = this.x + otherPoint.x;
    y = this.y + otherPoint.y;
    return new Point(x, y);
  };

  Point.prototype.minus = function(otherPoint) {
    var x, y;
    x = this.x - otherPoint.x;
    y = this.y - otherPoint.y;
    return new Point(x, y);
  };

  Point.prototype.times = function(num) {
    var x, y;
    x = this.x * num;
    y = this.y * num;
    return new Point(x, y);
  };

  Point.prototype.isEqualTo = function(otherPoint) {
    if (this.x === otherPoint.x && this.y === otherPoint.y) {
      return true;
    }
    return false;
  };

  Point.prototype.print = function() {
    return "(" + this.x + ", " + this.y + ")";
  };

  return Point;

})();

LineOrRay = (function() {
  function LineOrRay(a, b, rayness) {
    this.origin = a;
    this.dir = b.minus(a);
    this.isRay = rayness;
    if (this.dir.x === 0 && this.dir.y === 0) {
      console.log("ray has direction (0,0) very bad!");
      alert("ray has direction (0,0) very bad!");
    }
  }

  LineOrRay.prototype.print = function() {
    if (this.isRay) {
      return "[ ray: origin = " + this.origin.print() + ", dir = " + this.dir.print() + " ]";
    } else {
      return "[ line: origin = " + this.origin.print() + ", dir = " + this.dir.print() + " ]";
    }
  };

  return LineOrRay;

})();

DirectedSegment = (function() {
  function DirectedSegment(p, q) {
    this.endpt1 = p;
    this.endpt2 = q;
    this.isSegment = true;
  }

  DirectedSegment.prototype.dir = function() {
    return this.endpt2.minus(this.endpt1);
  };

  DirectedSegment.prototype.undirect = function() {
    return new GraphEdge(this.endpt1, this.endpt2);
  };

  DirectedSegment.prototype.isEqualTo = function(otherDirectedSegment) {
    return otherDirectedSegment.endpt1 === this.endpt1 && otherDirectedSegment.endpt2 === this.endpt2;
  };

  DirectedSegment.prototype.print = function() {
    return this.endpt1.print() + " --> " + this.endpt2.print();
  };

  return DirectedSegment;

})();

GraphEdge = (function() {
  function GraphEdge(a, b) {
    this.endpt1 = a;
    this.endpt2 = b;
    this.isSegment = true;
  }

  GraphEdge.prototype.isEqualTo = function(otherGraphEdge) {
    if (this.endpt1 === otherGraphEdge.endpt1 && this.endpt2 === otherGraphEdge.endpt2) {
      return true;
    }
    if (this.endpt1 === otherGraphEdge.endpt2 && this.endpt2 === otherGraphEdge.endpt1) {
      return true;
    }
    return false;
  };

  GraphEdge.prototype.print = function() {
    return this.endpt1.print() + " -- " + this.endpt2.print();
  };

  return GraphEdge;

})();

Vertex = (function() {
  function Vertex(point, inEdge, outEdge) {
    this.point = point;
    this.inEdge = inEdge;
    this.outEdge = outEdge;
    if ((this.point != null) && (this.inEdge != null) && (this.outEdge != null)) {
      this.bisector = angleBisector(this.point, this.inEdge, this.outEdge);
    }
  }

  Vertex.prototype.bbbisector = function() {
    return angleBisector(this.point, this.inEdge, this.outEdge);
  };

  Vertex.prototype.copy = function() {
    return new Vertex(this.point, this.inEdge, this.outEdge);
  };

  Vertex.prototype.print = function() {
    return "[ " + this.point.print() + ", " + this.inEdge.print() + ", " + this.outEdge.print() + " ]";
  };

  return Vertex;

})();

line = function(segment) {
  if (segment.isRay != null) {
    return new LineOrRay(segment.origin, segment.origin.plus(segment.dir), false);
  }
  return new LineOrRay(segment.endpt1, segment.endpt2, false);
};

intersect = function(lrs1, lrs2) {
  var a1, a2, b1, b2, i, l1, l2, len, ref, s, sgmnt, t, u1, u2, v1, v2, x, y;
  l1 = line(lrs1);
  l2 = line(lrs2);
  a1 = l1.origin.x;
  b1 = l1.origin.y;
  u1 = l1.dir.x;
  v1 = l1.dir.y;
  a2 = l2.origin.x;
  b2 = l2.origin.y;
  u2 = l2.dir.x;
  v2 = l2.dir.y;
  if ((u1 * v2 - v1 * u2) === 0) {
    return null;
  }
  t = (a2 * v2 - a1 * v2 - b2 * u2 + b1 * u2) / (u1 * v2 - v1 * u2);
  s = (a2 * v1 - a1 * v1 - b2 * u1 + b1 * u1) / (u1 * v2 - u2 * v1);
  x = a1 + t * u1;
  y = b1 + t * v1;
  if (((lrs1.isRay != null) && lrs1.isRay && t < 0) || ((lrs2.isRay != null) && lrs2.isRay && s < 0)) {
    return null;
  }
  ref = [lrs1, lrs2];
  for (i = 0, len = ref.length; i < len; i++) {
    sgmnt = ref[i];
    if (sgmnt.isSegment != null) {
      if (sgmnt.endpt1.x === sgmnt.endpt2.x) {
        if ((sgmnt.endpt1.y - y) * (sgmnt.endpt2.y - y) > 0) {
          return null;
        }
      } else {
        if ((sgmnt.endpt1.x - x) * (sgmnt.endpt2.x - x) > 0) {
          return null;
        }
      }
    }
  }
  return new Point(x, y);
};

angle = function(inDirSeg, outDirSeg) {
  var a1, a2, b1, b2, theta;
  a1 = inDirSeg.dir().x;
  b1 = inDirSeg.dir().y;
  a2 = outDirSeg.dir().x;
  b2 = outDirSeg.dir().y;
  theta = Math.PI - (Math.atan2(b2, a2) - Math.atan2(b1, a1));
  return theta = theta - 2 * Math.PI * Math.floor(theta / (2 * Math.PI));
};

isReflex = function(v) {
  if (angle(v.inEdge, v.outEdge) > Math.PI) {
    return true;
  } else {
    return false;
  }
};

angleBisector = function(vert, inDirSeg, outDirSeg) {
  var bisector, bisectorDir, theta, x, y;
  theta = angle(inDirSeg, outDirSeg);
  x = outDirSeg.dir().x;
  y = outDirSeg.dir().y;
  bisectorDir = new Point(Math.cos(theta / 2) * x - Math.sin(theta / 2) * y, Math.sin(theta / 2) * x + Math.cos(theta / 2) * y);
  return bisector = new LineOrRay(vert, vert.plus(bisectorDir), true);
};

dist = function(pt, lrs) {
  var a, b, l, originDir, ptOrigin, theta, x, y;
  if (lrs.isPoint != null) {
    x = pt.x;
    y = pt.y;
    a = lrs.x;
    b = lrs.y;
    return Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
  }
  l = line(lrs);
  x = pt.x;
  y = pt.y;
  a = l.origin.x;
  b = l.origin.y;
  ptOrigin = new DirectedSegment(pt, l.origin);
  originDir = new DirectedSegment(l.origin, l.origin.plus(l.dir));
  theta = angle(ptOrigin, originDir);
  return Math.abs(Math.sin(theta) * Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2)));
};

foot = function(pt, lrs) {
  var a, b, c, d, l, r, ref, ref1, ref2, ref3, s, x, y;
  l = line(lrs);
  ref = [pt.x, pt.y], x = ref[0], y = ref[1];
  ref1 = [l.origin.x, l.origin.y], r = ref1[0], s = ref1[1];
  ref2 = [x - r, y - s], a = ref2[0], b = ref2[1];
  ref3 = [l.dir.x, l.dir.y], c = ref3[0], d = ref3[1];
  x = r + (a * c + b * d) * c / (Math.pow(c, 2) + Math.pow(d, 2));
  y = s + (a * c + b * d) * d / (Math.pow(c, 2) + Math.pow(d, 2));
  if ((lrs.isSegment != null) && (((lrs.endpt1.x - x) * (lrs.endpt2.x - x) > 0) || ((lrs.endpt1.y - y) * (lrs.endpt2.y - y) > 0))) {
    return null;
  }
  if ((lrs.isRay != null) && lrs.isRay && ((x - lrs.origin.x) * lrs.dir.x < 0 || (x - lrs.origin.y) * lrs.dir.y < 0)) {
    return null;
  }
  return new Point(x, y);
};

perp = function(pt, lrs) {
  var ft, l;
  l = line(lrs);
  ft = foot(pt, l);
  return new LineOrRay(pt, ft, true);
};

reflect = function(pt, lrs) {
  var ft, l;
  l = line(lrs);
  ft = foot(pt, l);
  pt.x = 2 * ft.x - pt.x;
  pt.y = 2 * ft.y - pt.y;
  return pt;
};
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
var inside, side;

side = function(point, dirSeg) {
  var d, endpt1, endpt2, ref;
  if ((dirSeg.isRay != null) && dirSeg.isRay) {
    endpt1 = dirSeg.origin;
    endpt2 = endpt1.plus(dirSeg.dir);
    dirSeg = new DirectedSegment(endpt1, endpt2);
  }
  if (point.isEqualTo(dirSeg.endpt1)) {
    return "right";
  }
  d = new DirectedSegment(point, dirSeg.endpt1);
  if ((0 < (ref = angle(d, dirSeg)) && ref < Math.PI)) {
    return "left";
  }
  return "right";
};

inside = function(pt, LAV) {
  var a, count, e, i, insideness, l, len, nood, r, ref;
  r = Math.random();
  a = new Point(1, r);
  l = new LineOrRay(pt, pt.plus(a), true);
  count = 0;
  ref = LAV.nodesList;
  for (i = 0, len = ref.length; i < len; i++) {
    nood = ref[i];
    e = nood.content.outEdge;
    if (intersect(l, e) != null) {
      count = count + 1;
    }
  }
  if (count % 2 === 0) {
    insideness = -1;
  } else {
    insideness = 1;
  }
  if (insideness * LAV.orientation() === 1) {
    return true;
  }
  return false;
};
var draw, drawCPEdge, drawCreasePattern, drawPoint, drawSkeleton, exportToFOLD, printClickSequence, removeMarkers, stringToClickSeq, testOutputFunction;

printClickSequence = function(clickSeq) {
  var click, i, k, ref, s;
  s = "";
  if (clickSeq.length === 1) {
    document.getElementById("clicks").innerHTML = s;
    return;
  }
  for (i = k = 0, ref = clickSeq.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
    click = clickSeq[i];
    if (click === "marker") {
      s = s + "~ ";
    } else {
      if (clickSeq[i + 1] === "marker") {
        s = s + click.print() + " ";
      } else {
        s = s + click.print() + ", ";
      }
    }
  }
  return document.getElementById("clicks").innerHTML = s;
};

removeMarkers = function(clickSequence) {
  var i, k, modifiedClickSeq, perturbedPoint, point, ref, start;
  modifiedClickSeq = [];
  start = null;
  for (i = k = 0, ref = clickSequence.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
    point = clickSequence[i];
    if (point !== "marker") {
      perturbedPoint = new Point(point.x + Math.random() * 0.01 - 0.005, point.y + Math.random() * 0.01 - 0.005);
      if (start === null) {
        start = perturbedPoint;
      }
      if (clickSequence[i + 1] === "marker") {
        modifiedClickSeq.push(start);
        start = null;
      } else {
        modifiedClickSeq.push(perturbedPoint);
      }
    }
  }
  return modifiedClickSeq;
};

draw = function(clickSequence) {
  var i, k, point, previous, ref;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (i = k = 0, ref = clickSequence.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
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
  var CP, CPFaces, facesRelations, gEdges, gVtxs, infEdges, k, len, ref, ref1, skelEdges, skelVtxs, skelv, text, tmpSkeleton, tooManyPerps;
  if (skeletonOnly) {
    ref = straightSkeleton(removeMarkers(clickSeq)), skelEdges = ref[0], skelVtxs = ref[1], infEdges = ref[2], gVtxs = ref[3], gEdges = ref[4];
    tmpSkeleton = [];
    for (k = 0, len = skelVtxs.length; k < len; k++) {
      skelv = skelVtxs[k];
      tmpSkeleton.push(skelv[0]);
    }
    CP = convert(skelEdges, tmpSkeleton, infEdges, gVtxs, gEdges, [], [], [], []);
    return drawSkeleton(CP, gEdges, show);
  } else {
    ref1 = foldAndCut(removeMarkers(clickSeq)), CP = ref1[0], CPFaces = ref1[1], facesRelations = ref1[2], gEdges = ref1[3], tooManyPerps = ref1[4];
    drawCreasePattern(CP, gEdges, show);
    if (!tooManyPerps) {
      text = exportToFOLD(CP, CPFaces, facesRelations);
    } else {
      text = "";
    }
    return $("a#programatically").click(function() {
      var now;
      now = text;
      return this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(now);
    });
  }
};

drawCreasePattern = function(CP, gEdges, show) {
  var cpEdge, cpVertex, cute, k, l, len, len1, len2, m, ref, ref1, results, x, y;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ref = CP.cPEs;
  for (k = 0, len = ref.length; k < len; k++) {
    cpEdge = ref[k];
    drawCPEdge(cpEdge, show);
  }
  for (l = 0, len1 = gEdges.length; l < len1; l++) {
    cute = gEdges[l];
    drawCPEdge(cute);
  }
  ref1 = CP.cPVs;
  results = [];
  for (m = 0, len2 = ref1.length; m < len2; m++) {
    cpVertex = ref1[m];
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
  var cpEdge, cpVertex, cute, endpt1, endpt2, k, l, len, len1, len2, m, ref, ref1, results, x, y;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ref = CP.cPEs;
  for (k = 0, len = ref.length; k < len; k++) {
    cpEdge = ref[k];
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
  for (l = 0, len1 = gEdges.length; l < len1; l++) {
    cute = gEdges[l];
    drawCPEdge(cute);
  }
  ref1 = CP.cPVs;
  results = [];
  for (m = 0, len2 = ref1.length; m < len2; m++) {
    cpVertex = ref1[m];
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
  var P, char, clickSeq, i, num1, num2, ref, ref1, ref2, start, x, y;
  clickSeq = [];
  start = null;
  i = 0;
  while (i < str.length) {
    char = str[i];
    if (char === "~") {
      if (clickSeq.length > 0) {
        clickSeq.splice(clickSeq.length - 1, 1);
        clickSeq.push(start);
      }
      clickSeq.push("marker");
      start = null;
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
      P = new Point(x, y);
      if (start === null) {
        start = P;
      }
      clickSeq.push(P);
    }
  }
  return clickSeq;
};

exportToFOLD = function(CP, CPFaces, facesRelations) {
  var e, fac, i, j, k, l, m, n, o, p1, p2, ref, ref1, ref2, ref3, ref4, s, v, vertices;
  s = '{ "file_spec": 1, \n "file_classes": ["singleModel"],\n "frame_title": "Fold-and-Cut crease pattern",\n "frame_classes": ["creasePattern"],\n "frame_attributes": ["2D"],\n "vertices_coords": [';
  for (i = k = 0, ref = CP.cPVs.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
    v = CP.cPVs[i];
    s = s + '[' + v.x + ',' + v.y + ', 0]';
    if (i < CP.cPVs.length - 1) {
      s = s + ',';
    }
  }
  s = s + '], \n "edges_vertices": [';
  for (i = l = 0, ref1 = CP.cPEs.length - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; i = 0 <= ref1 ? ++l : --l) {
    e = CP.cPEs[i];
    p1 = e.endpt1;
    p2 = e.endpt2;
    s = s + '[' + CP.cPVs.indexOf(p1) + ',' + CP.cPVs.indexOf(p2) + ']';
    if (i < CP.cPEs.length - 1) {
      s = s + ',';
    }
  }
  s = s + '], \n "edges_assignment": [';
  for (i = m = 0, ref2 = CP.cPEs.length - 1; 0 <= ref2 ? m <= ref2 : m >= ref2; i = 0 <= ref2 ? ++m : --m) {
    e = CP.cPEs[i];
    s = s + '"' + e.assignment.toUpperCase() + '"';
    if (i < CP.cPEs.length - 1) {
      s = s + ',';
    }
  }
  s = s + '], \n "faces_vertices": [';
  for (i = n = 0, ref3 = CPFaces.length - 1; 0 <= ref3 ? n <= ref3 : n >= ref3; i = 0 <= ref3 ? ++n : --n) {
    fac = CPFaces[i];
    vertices = fac[0];
    s = s + '[';
    for (j = o = 0, ref4 = vertices.length - 1; 0 <= ref4 ? o <= ref4 : o >= ref4; j = 0 <= ref4 ? ++o : --o) {
      v = vertices[j];
      s = s + CP.cPVs.indexOf(v);
      if (j < vertices.length - 1) {
        s = s + ',';
      }
    }
    s = s + ']';
    if (i < CPFaces.length - 1) {
      s = s + ',';
    }
  }
  s = s + ']}';
  return s;
};
var FOLD, a, b, c, rect;

FOLD = require('fold');

rect = canvas.getBoundingClientRect();

a = rect.left;

b = rect.top;

c = rect.bottom;

$(document).ready(function() {
  var CP, clickSeq, gEdges, live, previous, repeat, show, skeletonOnly, start, text;
  clickSeq = ["marker"];
  start = null;
  previous = null;
  repeat = null;
  show = false;
  live = true;
  skeletonOnly = false;
  CP = new CreasePattern();
  gEdges = [];
  text = "";
  if (show) {
    document.getElementById("toggle").innerHTML = "Unused creases ON";
  } else {
    document.getElementById("toggle").innerHTML = "Unused creases OFF";
  }
  if (live) {
    document.getElementById("live").innerHTML = "Live computation ON";
  } else {
    document.getElementById("live").innerHTML = "Live computation OFF";
  }
  if (skeletonOnly) {
    document.getElementById("skeleton").innerHTML = "Skeleton only ON";
  } else {
    document.getElementById("skeleton").innerHTML = "Skeleton only OFF";
  }
  $("#myCanvas").mouseup(function(e) {
    var P, closed, x, y;
    $("#myCanvas").unbind("mousemove");
    if (repeat != null) {
      repeat = null;
    } else {
      x = e.pageX - a;
      y = c - e.pageY;
      P = new Point(x, y);
      if (start === null) {
        start = P;
        previous = P;
      } else {
        if (dist(P, start) < 6) {
          closed = true;
          ctx.moveTo(previous.x, c - b - previous.y);
          ctx.lineTo(start.x, c - b - start.y);
          ctx.stroke();
          previous = null;
          clickSeq.push(start);
          clickSeq.push("marker");
          start = null;
        }
      }
      if (!closed) {
        if (previous !== P) {
          ctx.beginPath();
          ctx.moveTo(previous.x, c - b - previous.y);
          ctx.lineTo(P.x, c - b - P.y);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "black";
          ctx.stroke();
          previous = P;
        }
        clickSeq.push(P);
        ctx.beginPath();
        ctx.arc(x, c - y - b, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();
      }
    }
    if (start === null) {
      printClickSequence(clickSeq);
      if (live) {
        testOutputFunction(clickSeq, show, skeletonOnly);
      }
    }
    return $("#myCanvas").mousemove(function(e) {
      x = e.pageX - a;
      y = c - e.pageY;
      return document.getElementById("coords").innerHTML = "(" + x + ", " + y + ")";
    });
  });
  $("#myCanvas").mousedown(function(e) {
    var P, i, len, point, x, y;
    $("#myCanvas").unbind("mousemove");
    x = e.pageX - a;
    y = c - e.pageY;
    P = new Point(x, y);
    if (start === null) {
      for (i = 0, len = clickSeq.length; i < len; i++) {
        point = clickSeq[i];
        if (point === "marker") {
          continue;
        }
        if (dist(P, point) < 4) {
          repeat = point;
          break;
        }
      }
    }
    return $("#myCanvas").mousemove(function(e) {
      if (!(repeat != null)) {
        return;
      }
      x = e.pageX - a;
      y = c - e.pageY;
      document.getElementById("coords").innerHTML = "(" + x + ", " + y + ")";
      repeat.x = x;
      repeat.y = y;
      return draw(clickSeq);
    });
  });
  $(document).keydown(function(e) {
    if (e.which === 27) {
      while (clickSeq[clickSeq.length - 1] !== "marker") {
        clickSeq.splice(clickSeq.length - 1, 1);
      }
      start = null;
      previous = null;
      printClickSequence(clickSeq);
      if (live) {
        return testOutputFunction(clickSeq, show, skeletonOnly);
      }
    }
  });
  $(document).keydown(function(e) {
    if (start === null && e.which === 88) {
      if (clickSeq.length > 1) {
        clickSeq.splice(clickSeq.length - 1);
        while (clickSeq[clickSeq.length - 1] !== "marker") {
          clickSeq.splice(clickSeq.length - 1, 1);
        }
        printClickSequence(clickSeq);
        if (live) {
          return testOutputFunction(clickSeq, show, skeletonOnly);
        }
      }
    }
  });
  $("#skeleton").click(function(e) {
    if (skeletonOnly) {
      skeletonOnly = false;
      document.getElementById("skeleton").innerHTML = "Skeleton only OFF";
    } else {
      skeletonOnly = true;
      document.getElementById("skeleton").innerHTML = "Skeleton only ON";
    }
    if (live) {
      return testOutputFunction(clickSeq, show, skeletonOnly);
    }
  });
  $("#live").click(function(e) {
    if (live) {
      live = false;
      document.getElementById("live").innerHTML = "Live computation OFF";
    } else {
      live = true;
      document.getElementById("live").innerHTML = "Live computation ON";
    }
    if (live) {
      return testOutputFunction(clickSeq, show, skeletonOnly);
    }
  });
  $("#toggle").click(function(e) {
    if (show) {
      show = false;
    } else {
      show = true;
    }
    return testOutputFunction(clickSeq, show, skeletonOnly);
  });
  $("#myCanvas").mousemove(function(e) {
    var x, y;
    x = e.pageX - a;
    y = c - e.pageY;
    return document.getElementById("coords").innerHTML = "(" + x + ", " + y + ")";
  });
  $("#manual").click(function() {
    clickSeq = stringToClickSeq($("input:text").val());
    printClickSequence(clickSeq);
    if (live) {
      return testOutputFunction(clickSeq, show, skeletonOnly);
    }
  });
  return $("a#programatically").click(function() {
    var now;
    now = text;
    return this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(now);
  });
});
