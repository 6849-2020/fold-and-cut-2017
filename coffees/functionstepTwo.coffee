# function stepTwo performs step 2a-2f once through, modifies all inputs appropriately
# calls edgeHandle and splitHandle
# edgeHandle calls edgeTwoC, ..., edgeTwoF
# unwritten functions called in this file: splitHandle

stepTwo = (mySLAV, pq, processed, skelEdges, skelVtxs, infEdges) -> 				
	I = pq.pop()														# I is of the form [event type, Point, Na, Nb]
	if I[0] == "e"

		edgeHandle(mySLAV, pq, I, processed, skelEdges, skelVtxs, infEdges)
	else
		splitHandle(mySLAV, pq, I, processed, skelEdges, skelVtxs, infEdges)





	