#splitHandle = (mySLAV, pq, I, processed, skelEdges, skelVtxs) ->
# recall that this means I = ["s", point, N (Node), oppositeEdge (directed segment)]

splitHandle = (mySLAV, pq, I, processed, skelEdges, skelVtxs, infEdges) ->
	if I[2] in processed
		return

	# the following happens if the split event turns into an edge event, then you should 
	# not even do stepTwoD (don't get repeated skelEdges pls)
	N = I[2]
	dirSeg = I[3]
	for node in mySLAV.allNodes()
		if testOpposite(N,node)? 
			# console.log "after testOpposite passed: "
			# console.log "node.content.outEdge = " + node.content.outEdge.print()
			# console.log "dirSeg = " + dirSeg.print()
			if node.content.outEdge == dirSeg
				Nc = node
				break
	if !(Nc?)
		#console.log "skipping this split"
		return

	# I'm confused by 2c, I don't think peaks of roof happen in the split case???
	splitTwoD(I, skelEdges)
	try
		[N1, N2] = splitTwoE(mySLAV, I, processed, skelVtxs)
	catch
		#console.log "split turned into edge, you should not see splitTwoF after this..."
		# I think the reason this happens is because a split event turns into an 
		# edge event, in that case you shouldn't even process it...
		return
		# console.log "Nc not found"

		# x = I[2].content.point.x
		# y = I[2].content.point.y
		# ctx.beginPath()
		# ctx.arc(x, c-y-b,2,0,2*Math.PI)
		# ctx.stroke()

		# for v in skelVtxs
		# 	x = v[0].x
		# 	y = v[0].y
		# 	ctx.beginPath()
		# 	ctx.arc(x, c-y-b,2,0,2*Math.PI)
		# 	ctx.stroke()

		# for e in skelEdges
		# 	endpt1 = e.endpt1
		# 	endpt2 = e.endpt2
		# 	ctx.moveTo(endpt1.x, c-endpt1.y-b)
		# 	ctx.lineTo(endpt2.x, c-endpt2.y-b)
		# 	ctx.stroke()

	splitTwoF(mySLAV, N1, N2, pq, infEdges)

splitTwoD = (I, skelEdges) ->
	N = I[2]
	P = N.content.point

	skelEdges.push(new GraphEdge(P, I[1])) 

splitTwoE = (mySLAV, I, processed, skelVtxs) -> # recall I = ["s", point, N, dirSeg (edge of the graph)]
	N = I[2] 				#node
	V = N.content			#vertex
	dirSeg = I[3]			#dirSeg is one of the edges of the graph, it is a DirectedSegment
	
	for node in mySLAV.allNodes()
		if testOpposite(N,node)? and node.content.outEdge == dirSeg
			Nc = node
			break
	if !(Nc?)
		throw error

	processed.push(N)
	fancyVertex = [I[1], V.inEdge, V.outEdge, dirSeg]
	skelVtxs.push(fancyVertex)

	# the following modifies mySLAV
	V1 = new Vertex(I[1], V.inEdge, dirSeg)
	V2 = new Vertex(I[1], dirSeg, V.outEdge)

	# console.log "added two new vertices with coordinates: " + I[1].print()
	
	LAV1 = mySLAV.LAVContaining(N)

	# search all nodes in mySLAV for the correct node to follow V1, and the correct note to precede V2

	# cand = new PriorityQueue
	# l = line(dirSeg)
	# ft = foot(I[1], l)

	# for node in mySLAV.allNodes()
	# 	if node.content.outEdge == dirSeg
	# 		# found one
	# 		console.log "found one"
	# 		nodeft = foot(node.content.point, l)
	# 		d = (ft.x - nodeft.x)/(dirSeg.dir().x)
	# 		console.log "d = " + d

	# 		if d > 0
	# 			console.log "Yes, it's greater than zero bro"
	# 			cand.add(node, d)
	
	# Nc = cand.pop() 			# pops out a node
	# Nc should be the one one going in

	Nd = Nc.succ
	Na = N.pred
	Nb = N.succ

	# console.log "Na = " + Na.content.print()
	# console.log "Nb = " + Nb.content.print()
	# console.log "Nc = " + Nc.content.print()
	# console.log "Nd = " + Nd.content.print()

	N1 = new Node(Na, V1, Nd)
	N2 = new Node(Nc, V2, Nb)

	# reassign pred, succ

	Nd.pred = N1
	Nc.succ = N2
	Na.succ = N1
	Nb.pred = N2

	#console.log "the successor of" + Na.content.print() + " is " + Na.succ.content.print()

	# create new lavs

	lava = new CircularDoublyLinkedList()
	lava.nodesList.push(N1)

	newElem = N1.succ
	while newElem != N1
		lava.nodesList.push(newElem)
		#console.log "just added " + newElem.content.print()
		newElem = newElem.succ
		#console.log "now newElem = " + newElem.content.print()

	lava.head = N1
	lava.tail = lava.head.pred
	#console.log "lava.length() = " + lava.length()

	if N2 in lava.nodesList
		# that means there was a merge
		LAV2 = mySLAV.LAVContaining(Nd)

		mySLAV.removeLAV(LAV1)
		mySLAV.removeLAV(LAV2)
		mySLAV.pushLAV(lava)

	else # there was only one lav and it splits
		#console.log "lava.length() = " + lava.length()

		lavb = new CircularDoublyLinkedList()
		lavb.nodesList.push(N2)
		newElem = N2.succ
		while newElem != N2
			lavb.nodesList.push(newElem)
			newElem = newElem.succ

		lavb.head = N2
		lavb.tail = lavb.head.pred

		mySLAV.removeLAV(LAV1)
		mySLAV.pushLAV(lava)
		mySLAV.pushLAV(lavb)
		# console.log "!!!!!!!!!!!!!!!!!!!!"
		# console.log "lava.length() = " + lava.length()
		# console.log lava.print()
		# console.log "!!!!!!!!!!!!!!!!!!!!"
		# console.log lavb.print()
		# console.log "!!!!!!!!!!!!!!!!!!!!"


	return [N1, N2]

splitTwoF = (mySLAV, N1, N2, pq, infEdges) ->
	computeEvents(mySLAV, N1, pq, infEdges)
	computeEvents(mySLAV, N2, pq, infEdges)