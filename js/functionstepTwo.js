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
