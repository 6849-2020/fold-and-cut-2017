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
