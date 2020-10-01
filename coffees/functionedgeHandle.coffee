edgeHandle = (mySLAV, pq, I, processed, skelEdges, skelVtxs, infEdges) ->				
	if I[2] in processed or I[3] in processed							# convex 2b. Recall I is of the form [event type, Point, Na, Nb]
		return

	if edgeTwoC(mySLAV, I, processed, skelEdges, skelVtxs)
		return

	edgeTwoD(I, skelEdges) 

	try
		N = edgeTwoE(mySLAV, I, processed, skelVtxs)
	catch
		for v in skelVtxs
			x = v[0].x
			y = v[0].y
			ctx.beginPath()
			ctx.arc(x, c-y-b,2,0,2*Math.PI)
			ctx.stroke()

		for e in skelEdges
			endpt1 = e.endpt1
			endpt2 = e.endpt2
			ctx.moveTo(endpt1.x, c-endpt1.y-b)
			ctx.lineTo(endpt2.x, c-endpt2.y-b)
			ctx.stroke()

	edgeTwoF(mySLAV, N, pq, infEdges)												# N is a new node, currently in mySLAV, created from edgeTwoF

# function edgeTwoC checks if I is a peak of roof
# if it is, return true and add 3 edges to skelEdges and a fancyVertex to skelVtxs
# and we don't need to do steps d - f
# otherwise it returns false
# also adds I's parents to processed

edgeTwoC = (mySLAV, I, processed, skelEdges, skelVtxs) ->	
	Na = I[2]; Pa = Na.content.point; aOut = Na.content.outEdge					
	Nb = I[3]; Pb = Nb.content.point; bOut = Nb.content.outEdge
	Nc = Na.pred; Pc = Nc.content.point; cOut = Nc.content.outEdge	

	if Nc.pred == Nb			 											# check equality of nodes? 

		skelEdges.push(new GraphEdge(Pa, I[1]))												
		skelEdges.push(new GraphEdge(Pb, I[1]))
		skelEdges.push(new GraphEdge(Pc, I[1]))

		skelVtxs.push([I[1], Na.content.outEdge, Nb.content.outEdge, Nc.content.outEdge]) # I[1] is a Point with the coordinates of I

		processed.push(Na)
		processed.push(Nb)
		processed.push(Nc)

		return true

	return false

edgeTwoD = (I, skelEdges) ->											# I = ["e", point, Na, Nb]
	Na = I[2]
	Nb = I[3]
	Pa = Na.content.point
	Pb = Nb.content.point						# Pa and Pb are points

	skelEdges.push(new GraphEdge(Pa, I[1]))					# the skelEdges happen to represent the point in the direction of the angle bisector
	skelEdges.push(new GraphEdge(Pb, I[1]))

edgeTwoE = (mySLAV, I, processed, skelVtxs) -> # outputs a new node
# and Na and Nb to processed
# get the LAV in mySLAV containing Na and Nb
# creates a new vertex newV and inserts it after Na.pred in the LAV
# remove Na and Nb from LAV
# add a FancyVertex to skelVtxs
# returns the new node N with content newV

	Na = I[2]
	Nb = I[3]
	Va = Na.content
	Vb = Nb.content								# Va and Vb are vertices 

	processed.push(Na)
	processed.push(Nb)

	fancyVertex = [I[1], Va.inEdge, Va.outEdge, Vb.outEdge]

	skelVtxs.push(fancyVertex)

	# the following modifies mySLAV (confusing part...)
	currLAV = mySLAV.LAVContaining(Na)
	if Nb != Na.succ
		console.log "Nb != Na.succ :("

	# console.log "apparently sometimes currLAV does not exist, so if it's bad, here's the troublemaker: "
	if !(currLAV?)
		console.log "couldn't find LAV containing " + Na.content.print()
		throw error
	# else
	# 	console.log "It's okay, but here it is anyway"
	# 	console.log Na.content.print()

	newV = new Vertex(I[1], Va.inEdge, Vb.outEdge)

	N = currLAV.insert(newV, Na.pred)

	# console.log "added one new vertex : " + newV.print()

	# testCurrLAV = mySLAV.LAVContaining(N)
	# if testCurrLAV?
	# 	console.log "there is a LAV containing " + N.content.print()
	# else
	# 	console.log "there is no LAV containing " + N.content.print()

	currLAV.remove(Na)
	# console.log "after removing Na which is " + Na.content.point.print() 
	# testCurrLAV = mySLAV.LAVContaining(N)
	# if testCurrLAV?
	# 	console.log "there is a LAV containing " + N.content.print()
	# else
	# 	console.log "there is no LAV containing " + N.content.print()

	currLAV.remove(Nb)
	# console.log "after removing Nb which is " + Nb.content.point.print() 
	# testCurrLAV = mySLAV.LAVContaining(N)
	# if testCurrLAV?
	# 	console.log "there is a LAV containing " + N.content.print()
	# else
	# 	console.log "there is no LAV containing " + N.content.print()


	return N

edgeTwoF = (mySLAV, N, pq, infEdges) ->
# compute the intersection of 
# angle bisectors of (N.pred.content[1], N.pred.content[2])
# and (N.content[1], N.content[2]) (these are the in and out edges)
# similarly, the intersection of angBis(N.content[1], N.content[2])
# and angBis(N.succ.content[1], N.succ.content[2])

	# [I, d] = computeI(mySLAV, N, infEdges)
	# if I?
	# 	pq.add(I, d)
	# testCurrLAV = mySLAV.LAVContaining(N)
	# if testCurrLAV?
	# 	console.log "there is a LAV containing " + N.content.print()
	# else
	# 	console.log "there is no LAV containing " + N.content.print()

	computeEvents(mySLAV, N, pq, infEdges)

		