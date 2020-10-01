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
