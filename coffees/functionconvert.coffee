# takes skelEdges, skelVtxs, infEdges, gVtxs, gEdges, perps, infPerps, quasiSkelVtxs, quasiGraphVtxs
# and returns a crease pattern whoo!

convert = (skelEdges, skelVtxs, infEdges, gVtxs, gEdges, perps, infPerps, quasiSkelVtxs, quasiGraphVtxs) ->
	# maxCoordX = 1000000 #canvas.width
	# maxCoordY = 1000000 #canvas.height
	# minCoordX = -1000000 #0
	# minCoordY = -1000000 #0

	maxCoordX = canvas.width 
	maxCoordY = canvas.height 
	minCoordX = 0
	minCoordY= 0

	quasiSkelVtxsOnly = []
	for v in quasiSkelVtxs
		quasiSkelVtxsOnly.push(v[0])

	quasiGraphVtxsOnly = []
	for v in quasiGraphVtxs
		quasiGraphVtxsOnly.push(v[0])

	allVtxs = skelVtxs.concat(gVtxs).concat(quasiSkelVtxsOnly).concat(quasiGraphVtxsOnly)

	for v in allVtxs
		if v.x > maxCoordX
			maxCoordX = v.x
		if v.y > maxCoordY
			maxCoordY = v.y
		if v.x < minCoordX
			minCoordX = v.x
		if v.y < minCoordY
			minCoordY = v.y

	# okay wado
	maxCoordX = maxCoordX + 40
	maxCoordY = maxCoordY + 40
	minCoordX = minCoordX - 40
	minCoordY = minCoordY - 40
	
	TL = new Point(minCoordX, maxCoordY)
	TR = new Point(maxCoordX, maxCoordY)
	BL = new Point(minCoordX, minCoordY)
	BR = new Point(maxCoordX, minCoordY)

	top = new GraphEdge(TL, TR)
	bottom = new GraphEdge(BL, BR)
	right = new GraphEdge(TR, BR)
	left = new GraphEdge(TL, BL)

	boundaryVtxs = [TL, TR, BL, BR]
	boundaryPerps = []
	boundarySkels = []
	boundaryEdges = [top, bottom, right, left]

	for ray in infPerps
		r = ray[0]
		
		# console.log "r = " + r.print() + " does not intersect: "
		closestEdge = null
		distance = null
		for e in boundaryEdges
			if intersect(e, r)?
				d = dist(intersect(e, r), r.origin)
				if d < distance or !(distance?)
					closestEdge = e
					distance = d 
			else
				# console.log e.print()

		if !(closestEdge?)
			console.log "Something is stupid, closestEdge doesn't exist"
		if !(r?)
			console.log "Something is even more stupid, r doesn't exist"
		
		bVertex = intersect(closestEdge, r)
		boundaryPerps.push([bVertex, ray[1]])

		boundaryEdges.push(new GraphEdge(bVertex, closestEdge.endpt1))
		boundaryEdges.push(new GraphEdge(bVertex, closestEdge.endpt2))
		boundaryEdges.splice(boundaryEdges.indexOf(closestEdge), 1)

		perps.push([new GraphEdge(r.origin, bVertex), ray[1]])

	

	for r in infEdges # skeleton rays
		closestEdge = null
		distance = null
		for e in boundaryEdges
			if intersect(e, r)?
				d = dist(intersect(e, r), r.origin)
				if d < distance or !(distance?)
					closestEdge = e
					distance = d

		if !(closestEdge?)
			console.log "Something is stupid, closestEdge doesn't exist"
		if !(r?)
			console.log "Something is even more stupid, r doesn't exist"

		bVertex = intersect(closestEdge, r)
		boundarySkels.push(bVertex)

		boundaryEdges.push(new GraphEdge(bVertex, closestEdge.endpt1))
		boundaryEdges.push(new GraphEdge(bVertex, closestEdge.endpt2))
		boundaryEdges.splice(boundaryEdges.indexOf(closestEdge), 1)

		skelEdges.push(new GraphEdge(r.origin, bVertex))



	edgesWithoutComp = gEdges.concat(skelEdges).concat(boundaryEdges)
	#edgesWithComp = perps, guess don'tneed that

	verticesWithComp = quasiSkelVtxs.concat(quasiGraphVtxs).concat(boundaryPerps)

	vertices = []
	edges = []

	#first, change the skelVtxs (including as components of verticesWithComp)
	for vert in skelVtxs
		tmpCPV = new CreasePatternVertex(vert.x, vert.y, "skeleton")
		for vWithComp in verticesWithComp
			if vWithComp[1] == vert
				vWithComp[1] = tmpCPV

		for edge in perps
			if edge[1] == vert
				edge[1] = tmpCPV

		replaceVertex(vert, tmpCPV, edgesWithoutComp, perps, vertices)

	# now change other vertices
	for vert in quasiSkelVtxs
		tmpCPV = new CreasePatternVertex(vert[0].x, vert[0].y, "quasiSkeleton", vert[1])
		replaceVertex(vert[0], tmpCPV, edgesWithoutComp, perps, vertices)

	for vert in quasiGraphVtxs
		tmpCPV = new CreasePatternVertex(vert[0].x, vert[0].y, "quasiGraph", vert[1])
		replaceVertex(vert[0], tmpCPV, edgesWithoutComp, perps, vertices)

	for vert in boundaryPerps
		tmpCPV = new CreasePatternVertex(vert[0].x, vert[0].y, "boundaryPerp", vert[1])
		replaceVertex(vert[0], tmpCPV, edgesWithoutComp, perps, vertices)

	for vert in gVtxs
		tmpCPV = new CreasePatternVertex(vert.x, vert.y, "graph")
		replaceVertex(vert, tmpCPV, edgesWithoutComp, perps, vertices,)

	for vert in boundaryVtxs 
		tmpCPV = new CreasePatternVertex(vert.x, vert.y, "boundary")
		replaceVertex(vert, tmpCPV, edgesWithoutComp, perps, vertices)

	for vert in boundarySkels
		tmpCPV = new CreasePatternVertex(vert.x, vert.y, "boundarySkel")
		replaceVertex(vert, tmpCPV, edgesWithoutComp, perps, vertices)

	# now changing edges
	for edge in perps
		tmpE = new CreasePatternEdge(edge[0].endpt1, edge[0].endpt2, "perp", edge[1])
		edges.push(tmpE)


	# for edge in gEdges
	# 	edges.push(new CreasePatternEdge(edge.endpt1, edge.endpt2, "graph"))

	for edge in skelEdges
		edges.push(new CreasePatternEdge(edge.endpt1, edge.endpt2, "skeleton"))

	for edge in boundaryEdges
		edges.push(new CreasePatternEdge(edge.endpt1, edge.endpt2, "boundary"))

	cen = TL.plus(BR).times(0.5)

	return new CreasePattern(vertices, edges, cen)



replaceVertex = (vert, tmpCPV, edgesWithoutComp, perps, vertices) ->
	for e in edgesWithoutComp
		if e.endpt1 == vert
			e.endpt1 = tmpCPV
		if e.endpt2 == vert
			e.endpt2 = tmpCPV

	for edge in perps
		e = edge[0]
		if e.endpt1 == vert
			e.endpt1 = tmpCPV
		if e.endpt2 == vert
			e.endpt2 = tmpCPV

	vertices.push(tmpCPV)
