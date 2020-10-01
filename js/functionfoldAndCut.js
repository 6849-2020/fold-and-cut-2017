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
