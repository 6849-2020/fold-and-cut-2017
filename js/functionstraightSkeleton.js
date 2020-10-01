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
