# outputs skelEdges, infEdges, gEdges, skelVtxs, gVtxs
# skelEdges is an array of GraphEdges
# gEdges is an array of GraphEdges
# infEdges is an array of rays
# skelVtxs is an array of things of the form [Point, GraphEdge, GraphEdge, GraphEdge]
# gVtxs is an array of Points


straightSkeleton = (clickSequence) ->				# clickSequence is a sequence of Points
	console.clear()
	
	skelEdges = []									
	skelVtxs = []	
	infEdges = []	# the rays that escape								 
	processed = []									# processed is array of processed nodes
													# processed must be initialized outside of stepTwo because stepTwo loops

	[mySLAV, gVtxs, gEdges] = stepOneAB(clickSequence)				# creates the SLAV from the click sequence
	
	pq = stepOneC(mySLAV, infEdges)							# outputs the priority queue

	while pq.length() != 0
		stepTwo(mySLAV, pq, processed, skelEdges, skelVtxs, infEdges)
		# console.log "-------------------------------------------"
		# for lav in mySLAV.allLAVs
		# 	console.log lav.print()
		# 	console.log "*******************************"

		# console.log "-------------------------------------------"

	for leftOver in mySLAV.allNodes()
		if !(leftOver in processed)
			infEdges.push(leftOver.content.bbbisector())
			#skelVtxs.push

	return [skelEdges, skelVtxs, infEdges, gVtxs, gEdges]