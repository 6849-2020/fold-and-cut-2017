# outputs pq, a PriorityQueue consisting of all intersection points
# an element of pq has the form [I, dist] = [[type, Point (coordinates), Na, Nb], dist]
# where Na and Nb are Nodes whose content are Vertexes [Point (coordinates), inEdge, outEdge]


stepOneC = (mySLAV, infEdges) ->
	pq = new PriorityQueue				# creates empty PriorityQueue
	for node in mySLAV.allNodes()		# lav is a CDLL whose contents are Vertexes
		# [I, d] = computeI(mySLAV, node)
		# if I?
		# 	pq.add(I, d)					# add it to the priority queue

		# if isReflex(node.content)
		# 	[B, d] = computeB(mySLAV, node)
		# 	if B?
		# 		pq.add(B, d)

		# # if no intersection, add to infEdges
		# if !(I?) and !(B?)
		# 	infEdges.push(v.bbbisector())
		computeEvents(mySLAV, node, pq, infEdges)


	# the following is for debugging, don't be confused ...
	console.log "HELLOoO"
	# for thing in pq.values()
	# 	console.log thing[0] + " : " + thing[1].print()
		# if thing[0] == "s"
		# 	console.log thing[2].content.print()
		# 	console.log thing[1].print()
		# 	console.log thing[3].print()		

	return pq

computeEvents = (mySLAV, node, pq, infEdges) ->
	v = node.content

	allEdgeEvents = computeI(mySLAV, node) # returns an array of [I = ["e", point, node, node], d]
	for [I, dE] in allEdgeEvents 
		pq.add(I, dE)					# add it to the priority queue

	if isReflex(v)
		allCandidates = computeB(mySLAV, node) # allCandidates is an array
		for [splitPoint, dS] in allCandidates
			pq.add(splitPoint, dS)

	# because of leftovers, we don't actually need this!! wtf
	# # if no intersection, add to infEdges
	# if allEdgeEvents.length == 0 and (!(isReflex(v)) or (allCandidates.length == 0))
	#  	escape = true
	#  	bis = v.bbbisector()
	#  	# horrendous, but you have to make sure bis doesn't intersect any edges
	#  	# to see this, even just take two triangles at awkward angles to each other
	# 	for node in mySLAV.allNodes()
	# 		if (v.point != node.content.outEdge.endpt1) and (v.point != node.content.outEdge.endpt2) and (intersect(node.content.outEdge, bis)?)
	# 			escape = false
	# # 			console.log v.bbbisector() + " intersects " + node.content.outEdge
	# 	if escape
	# 		infEdges.push(bis)
	# 		console.log "added an infEdge coming out of the VERTEX " + v.print()
	return

computeI = (mySLAV, node) ->	# returns [[event type, point coordinates, parent nodes], distance]
	allEdgeEvents = []

	v = node.content
	u = node.pred.content
	w = node.succ.content

	e = line(v.inEdge)		# one of the edges adjacent to v, doesn't matter which because
										# anglebisector has equal distance to both

	I1 = intersect(u.bbbisector(), v.bbbisector())
	I2 = intersect(v.bbbisector(), w.bbbisector())

	if I1?
		d1 = dist(I1, e)
	if I2?
		d2 = dist(I2, e)

	# actually need to return BOTH edge events, not just the closer one
	if I1?
		allEdgeEvents.push([["e", I1, node.pred, node], d1])
	if I2?
		allEdgeEvents.push([["e", I2, node, node.succ], d2])

	# return the closer one, if any

	return allEdgeEvents # allEdgeEvents in an array of pairs [I, d]

	# if isReflex(v) and computeB(mySLAV, node)?          # if v is reflex and there exists an opposite edge
	# 	[I3, oppositeEdge] = computeB(mySLAV, node)		# oppositeEdge is a directed segment, one of the original edges
				
	# 	d3 = dist(I3, e)

	# # I1, I2, I3, d1, d2, d3 are computed if they exist

	# # if there is no interseciton, escape to infinity
	# if !(I1? or I2? or I3?)
	# 	infEdges.push(v.bbbisector())
	# 	return [null, null]

	# if d1? and (d1 <= d2 or !(d2?))
	# 	I = ["e", I1, node.pred, node]
	# 	d = d1
	# else if d2?
	# 		I = ["e", I2, node, node.succ]
	# 		d = d2
	# 	else
	# 		d = null

	# if d3? and (d3 <= d or !(d?))
	# 	I = ["s", I3, node, oppositeEdge] 
	# 	d = d3

	# return [I, d]

computeB = (mySLAV, node) -> 				# node is a reflex angle, in reality it will only happen with graph vertices
	candidates = []

	for testNode in mySLAV.allNodes()			# testing edges by their start vertex
		if weakTestOpposite(node, testNode)?
			[B, outU, d] = weakTestOpposite(node, testNode)
			candidates.push([["s", B, node, outU], d])
			# the above is ([splitPoint, d], d)

	# if candidates.length() == 0
	# 	return [null, null]

	# [X, oppEdge, dist] = candidates.pop()
	# splitPoint = ["s", X, node, oppEdge]
	# return [splitPoint, dist] # [B, d]

	# return all possible split events, as an array of [splitPoint, d]'s
	return candidates


testOpposite = (node, testNode) ->
	v = node.content
	q = v.point
	outV = v.outEdge
	inV = v.inEdge
	# lineOutV = new LineOrRay(q, q.plus(outV.dir()), false)
	# lineInV = new LineOrRay(q, q.plus(inV.dir()), false)
	lineOutV = line(outV)
	lineInV = line(inV)

	u = testNode.content

	w = testNode.succ.content 				# w is the vertex after u
	p = u.point
	outU = u.outEdge
	# lineOutU = new LineOrRay(p, p.plus(outU.dir()), false)	
	rayOutU = new LineOrRay(p, p.plus(outU.dir()), true)
	lineOutU = line(outU)

	if setIntersect([p, w.point], [q, node.succ.content.point, node.pred.content.point])?
		return null

	if side(q, outU) == "right"
		return null

	if intersect(v.bbbisector(), lineOutU)? and intersect(lineInV, lineOutU)? and intersect(lineOutV, lineOutU)? # not behind and no parallel
		X = intersect(lineInV, lineOutU)
		r = angleBisector(X, inV, outU) 			# carefully pick the right ones to get the right orientation...
		B = intersect(r, v.bbbisector())

		# if B?
		# 	console.log "B exists :D! B = " + B.print()

		if B? and side(B, rayOutU) == "left" 
			if side(B, w.bbbisector()) == "left" 
				if side(B, u.bbbisector()) == "right"
					d = dist(B, outV)
					#console.log "testOpposite( " + node.content.point.print() + " , " + testNode.content.point.print() + " ) passed"

					return [B, outU, d]

	# console.log "testOpposite( " + node.content.point.print() + " , " + testNode.content.point.print() + " ) failed"
	# console.log "the outEdge of testNode was : " + testNode.content.outEdge.print()
	return null

weakTestOpposite = (node, testNode) ->
	v = node.content
	q = v.point
	outV = v.outEdge
	inV = v.inEdge
	# lineOutV = new LineOrRay(q, q.plus(outV.dir()), false)
	# lineInV = new LineOrRay(q, q.plus(inV.dir()), false)
	lineOutV = line(outV)
	lineInV = line(inV)

	u = testNode.content
	w = testNode.succ.content 				# w is the node after u
	p = u.point
	outU = u.outEdge

	# lineOutU = new LineOrRay(p, p.plus(outU.dir()), false)	
	rayOutU = new LineOrRay(p, p.plus(outU.dir()), true)
	lineOutU = line(outU)

	if setIntersect([p, w.point], [q, node.succ.content.point, node.pred.content.point])?
		return null

	if side(q, outU) == "right"
		return null

	l = line(outU)
	rayInV = new LineOrRay(q, q.plus(inV.dir()), true)
	reverseRayOutV = new LineOrRay(q, q.minus(outV.dir()), true)

	if !(intersect(l, rayInV)?) or !(intersect(l, reverseRayOutV)?)
		return null

	if intersect(v.bbbisector(), lineOutU)? and intersect(lineInV, lineOutU)? and intersect(lineOutV, lineOutU)? # not behind and no parallel
		X = intersect(lineInV, lineOutU)
		r = angleBisector(X, inV, outU) 			
		B = intersect(r, v.bbbisector())

	if B?
		d = dist(B, outV)
		return [B, outU, d]
		
	return null






