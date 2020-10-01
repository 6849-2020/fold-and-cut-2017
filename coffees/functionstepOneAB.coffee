	# uses mySLAV.orient()


stepOneAB = (clickSeq) -> 											# Steps 1a and 1b, returns the SLAV (does not compute the angle bisectors)
	leaf = null
	LAV = new CircularDoublyLinkedList()
	vertices = []													# vertices is an array to store the currently unclosed chain
	gVtxs = []
	mySLAV = new SLAV()												# empty SLAV

	for vtx in clickSeq												# SORRY vtx is a Point not a Vertex :( waahh I done goof
		if leaf == null						 						# starting new polygon
			leaf = vtx
			vertices.push(vtx)
			gVtxs.push(vtx)

		else 
			if vtx.x == leaf.x and vtx.y == leaf.y 					# closing the loop, we add two things to the CDLL in this case
				n = vertices.length									# should figure out what happens when you have a 2-gon zzz
																	# just don't have 2-gons man...
				u = vertices[n - 1]									
				inEdgeU = new DirectedSegment(vertices[n - 2], u)
				outEdgeU = new DirectedSegment(u, vtx)

				inEdgeVtx = new DirectedSegment(u, vtx)
				outEdgeVtx = new DirectedSegment(vtx, vertices[1])

				vertexOne = new Vertex(u, inEdgeU, outEdgeU)				
				vertexTwo = new Vertex(vtx, inEdgeVtx, outEdgeVtx)

				LAV.push(vertexOne)
				LAV.push(vertexTwo)

				mySLAV.pushLAV(LAV)									# add LAV to mySLAV

				LAV = new CircularDoublyLinkedList()
				vertices = []
				leaf = null 										# reset  LAV, vertices, and leaf

			else 													# case where vtx is not the first or last (which are the same, lol)
				n = vertices.length
				if n >= 2
					u = vertices[n-1]
					inEdgeU = new DirectedSegment(vertices[n-2], u)
					outEdgeU = new DirectedSegment(u, vtx)

					newVertex = new Vertex(u, inEdgeU, outEdgeU)				
					LAV.push(newVertex)

				vertices.push(vtx)
				gVtxs.push(vtx)
				
	mySLAV.orient()													# possibly reverses some LAVs in mySLAV to make it properly oriented
	gEdges = mySLAV.allEdges()
	
	copySLAV = mySLAV.copy()
	copySLAV.reverse()
	mySLAV.join(copySLAV)

	return [mySLAV, gVtxs, gEdges]