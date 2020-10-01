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
