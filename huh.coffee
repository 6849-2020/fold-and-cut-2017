# definition of classes Node, CircularDoublyLinkedList, PriorityQueue, SLAV

# still need to write SLAV.orient(), SLAV.antiOrient(), CircularDoublyLinkedList.reverse(), 
# I will shortly also want a CDLL function to split it, specify later


class Node														# properties : @pred, @content, @succ
	constructor : (pre, cont, suc) -> 																			
		@pred = pre
		@content = cont
		@succ = suc


class CircularDoublyLinkedList 										# properties : @nodesList, @head, @tail, but don't use .head and .tail			
	constructor : (valuesList) ->									# valuesList is an array
		@nodesList = []												# @nodesList is NOT in order
		
		if valuesList?
			for val in valuesList
				@push(val)

	push : (val) ->
		if @head?													# @head is FIXED for a particular CDLL, unless you remove it
			@insert(val, @tail)
		else 
			@head = new Node(null, val, null)
			@head.pred = @head
			@head.succ = @head
			@nodesList.push(@head)
			@tail = @head.pred										# initialize @head and @tail

	insert : (val, prevnode) ->										# insert val after prevnode, and returns the new node
		nood = new Node(prevnode, val, prevnode.succ)
		postnode = prevnode.succ
		prevnode.succ = nood
		postnode.pred = nood

		@nodesList.push(nood)

		@tail = @head.pred 											# @tail is always the predecessor of @head

		return nood

	allContents : -> 													# returns an array containing the contents of every node
		C = []
		for nood in @nodesList
			C.push(nood.content)
		return C 													# hm it will probably return it even if I don't tell it to
																	# because it's weird

	length : ->
		return @nodesList.length

	remove : (nood) ->												# remove nood from the CDLL
		if @length() == 0
			return

		if @length() == 1 and nood == @head
			@nodesList = []
			@head = null
			@tail = null

		else
			prevnode = nood.pred
			postnode = nood.succ

			prevnode.succ = postnode
			postnode.pred = prevnode

			@nodesList.splice(@nodesList.indexOf(nood), 1)

			if nood == @head
				@head = @head.succ

			@tail = @head.pred

	reverse : ->													# reverse the CDLL
		for nood in @nodesList										# note that this changes the CDLL
			tmp = nood.succ
			nood.succ = nood.pred
			nood.pred = tmp

			nood.content.inEdge = new DirectedSegment(nood.pred.content.point, nood.content.point)
			nood.content.outEdge = new DirectedSegment(nood.content.point, nood.succ.content.point)
			nood.content.bisector = angleBisector(nood.content.point, nood.content.inEdge, nood.content.outEdge)
			# ^ big mistake !! oh well

		@head = @tail
		@tail = @head.pred
		return @

	copy : ->
		copyCDLL = new CircularDoublyLinkedList()
		copyCDLL.push(@head.content.copy())
		elem = @head.succ
		while elem != @head	
			copyCDLL.push(elem.content.copy())
			elem = elem.succ

		return copyCDLL

	isInside : (otherLAV) ->										# tests containment of POSITIVELY ORIENTED LAVs 
																	# (it is not as clear what containment means for non-positively oriented LAVs) 
		if inside(@head.content.point, otherLAV)									# in order to test insideness, only need to test one point
			return true												# ASSUMING NO INTERSECTION OR DEGENERACY
		return false				

	orientation : ->												# returns +1 if positively oriented, and -1 if negatively
		A = 0
		for node in @nodesList
			v = node.content.point
			w = node.succ.content.point
			x1 = v.x
			x2 = w.x
			y1 = v.y
			y2 = w.y

			A = A + (x2 - x1)*(y2 + y1)

		if A > 0
			return -1
		return 1

	positiveOrient : ->												# orient the polygon counterclockwise
		if @orientation() == -1															# modifies the LAV in place
			@reverse()
		return @

	print : ->
		s = " "
		for nood in @nodesList
 			s = s + nood.content.print() + ", "
 		return s



class PriorityQueue													# list of things sorted in decreasing priority. 
																	# properties : @list
	constructor : ->												# my priority queues always starts empty because I'm dumb
		@list = []													# @list should be a list of things of the form [content, priority no.]

	add : (content, number) -> 										# smaller number means higher priority
		if @list.length == 0
			@list.push([content, number])

		else
			resolved = false
			for i in [0..(@list.length - 1)]
				if number <= @list[i][1] and !resolved
					@list.splice(i,0,[content, number])
					resolved = true
			if !resolved
				@list.push([content,number])

	pop : ->														# removes the highest priority element
		I = @list.splice(0,1)										# ohh splice returns an array so we need I[0][0] not just I[0]
		return I[0][0] 												# returns the highest priority element without its priority number

	length : ->
		return @list.length

	values : ->														# returns the list of values in order
		contents = []
		for i in [0..(@list.length - 1)]
			thing = @list[i]
			contents.push(thing[0])
		return contents

###	print : ->
		s = " " 
		for element in @list 
			s = s + s[0] + " ; "
			printing is weird the contents are gonna be weird ###

class SLAV			# it's literally an array of LAVs											# properties: @allLAVs
	constructor : (setOfLAVs) ->
		@allLAVs = []
		if setOfLAVs?
			@allLAVs = setOfLAVs

	pushLAV : (newLAV) ->
		@allLAVs.push(newLAV)

	removeLAV : (oldLAV) ->
		n = @allLAVs.indexOf(oldLAV)
		@allLAVs.splice(n, 1)

	allEdges : ->													# returns a list of all graph edges pointed to
		E = []
		for lav in @allLAVs 										# lav is a CDLL, each content is of the form [vertex, inEdge, outEdge]
			for element in lav.allContents()						# the lav.allContents() should be a list of vertices
				E.push(element.outEdge.undirect())								# I think they should stay directed
																	# by default think about outEdges
				
		return E

	allNodes : ->
		N = []
		for lav in @allLAVs
			for nood in lav.nodesList
				N.push(nood)
		return N

	printLAVs : ->
 		s = ""
 		for lav in @allLAVs
 			s = s + "new LAV \n" + lav.print()
 		return s

	printEdges : ->
		s = ""
		for seg in @allEdges()
			s = s + seg.print() + ", "

		return s

	printContents : ->
		s = " "
		for nood in @allNodes()
 			s = s + nood.content.print() + "\n "

 		return s

	LAVContaining : (nood) ->										# given a node, find the LAV which contains it if it exists
		for lav in @allLAVs											# otherwise returns null
			if nood in lav.nodesList
				return lav

		return null

	reverse : ->
		for lav in @allLAVs
			lav.reverse()

		return @

	copy : ->
		copySLAV = new SLAV()
		for lav in @allLAVs
			copySLAV.pushLAV(lav.copy())

		return copySLAV

	join : (otherSLAV) ->
		for lav in otherSLAV.allLAVs
			@allLAVs.push(lav)

		return @

	orient : ->														# properly orients the SLAV (changes this)
																	# with assumption that it's a set of polygons with holes
		for lav in @allLAVs
			lav.positiveOrient()
		n = @allLAVs.length
		parityArray = []

		for i in [0..(n-1)]
			lav = @allLAVs[i]
			count = 0
			for otherLav in @allLAVs
				if otherLav == lav
					continue
				if lav.isInside(otherLav)
					count = count + 1
			parityArray[i] = count%2

		for i in [0..(n-1)]
			if parityArray[i] == 1
				lav = @allLAVs[i]
				lav.reverse()
		return @

	antiOrient : ->													# anti-canonical orientation
		@orient()
		@reverse()
		return @

																

computePerps = (skelEdges, skelVtxs, infEdges, gVtxs, gEdges) ->
	perps = []
	infPerps = []
	quasiSkelVtxs = []
	quasiGraphVtxs = []

	tmpSkeleton = []
	for skelV in skelVtxs
		v = skelV[0]

		tmpSkeleton.push(v)

		for index in [1..3]
			e = skelV[index] 		# oh I think skelV is just an array of 4 things

			if !(foot(v, e)?)		# if you leave the face, don't drop any perpendiculars
				continue

			ray = perp(v, e)

			type = "s"
			while type != "none"
				type = dropPerp(ray, v, skelEdges, infEdges, gEdges, perps, infPerps)
				# dropPerp finds the closest intersection of ray with a skelEdge, infEdge, or graphEdge
				# if there is no intersection it adds ray to infPerps and returns "none"
				# if there is an intersection, it modifies ray 
				# adds an edge to perps
				# and returns the type of intersection "s", "i", or "g"

				switch type
					when "s", "i" then quasiSkelVtxs.push([ray.origin, v])
					when "g" then quasiGraphVtxs.push([ray.origin, v])
					else break


	skelVtxs = tmpSkeleton # replace skelVtxs with just the points
	
	return [skelEdges, skelVtxs, infEdges, gVtxs, gEdges, perps, infPerps, quasiSkelVtxs, quasiGraphVtxs]
	# note : qsVs, qGvs, infPerps, perpendiculars are arrays of pairs (vertex/ray, corresponding SkelVtxs (component))

dropPerp = (ray, v, skelEdges, infEdges, gEdges, perps, infPerps) ->
	[pt, type, dis, edge] = [null, "none", null, null]

	# do not intersect with edge if the edge has ray.origin as one of its endpoints

	for gE in gEdges
		if gE.endpt1 == ray.origin or gE.endpt2 == ray.origin
			continue
		p = intersect(ray, gE)
		if p?
			d = dist(ray.origin, p)
			if d < dis or !(dis?)
				[pt, type, dis, edge] = [p, "g", d, gE]	
			
	for sE in skelEdges
		if sE.endpt1 == ray.origin or sE.endpt2 == ray.origin
			continue
		p = intersect(ray, sE)
		if p?
			d = dist(ray.origin, p)
			if d < dis or !(dis?)
				[pt, type, dis, edge] = [p, "s", d, sE]


	for iE in infEdges
		if iE.origin == ray.origin
			continue
		p = intersect(ray, iE)
		if p?
			d = dist(ray.origin, p)
			if d < dis or !(dis?)
				[pt, type, dis, edge] = [p, "i", d, iE]

	# okay, now we have pt, type, edge
	# first add to perps or infPerps

	switch type
		when "i", "s", "g" then perps.push([new GraphEdge(ray.origin, pt), v])
		else 
			infPerps.push([ray, v]) 
			return type

	# now replace the edge endpt1--endpt2 with the edges endpt1--pt, pt--endpt2
	switch type
		when "s", "g"
			if type == "s"
				edgeSet = skelEdges
			else 
				edgeSet = gEdges

			endpt1 = edge.endpt1
			endpt2 = edge.endpt2
			edge1 = new GraphEdge(endpt1, pt)
			edge2 = new GraphEdge(pt, endpt2)
			n = edgeSet.indexOf(edge)
			edgeSet.splice(n,1)
			edgeSet.push(edge1)
			edgeSet.push(edge2)

		when "i" 
			orig = edge.origin
			edge1 = new GraphEdge(orig, pt)
			edge2 = new LineOrRay(pt, pt.plus(edge.dir), true)

			skelEdges.push(edge1)
			n = infEdges.indexOf(edge)
			infEdges.splice(n,1)
			infEdges.push(edge2)

	# finally, replace ray with its reflection 
	# this is really dumb I can't write a new function because I want the origin to be pt, which we already computed
	ft = foot(ray.origin, line(edge))

	reflection = ft.plus(ft).minus(ray.origin)

	ray.origin = pt
	ray.dir = reflection.minus(pt)

	return type












# takes skelEdges, skelVtxs, infEdges, gVtxs, gEdges, perps, infPerps, quasiSkelVtxs, quasiGraphVtxs
# and returns a crease pattern whoo!

convert = (skelEdges, skelVtxs, infEdges, gVtxs, gEdges, perps, infPerps, quasiSkelVtxs, quasiGraphVtxs) ->
	maxCoordX = 0
	maxCoordY = 0
	minCoordX = 0
	minCoordY = 0
	quasiSkelVtxsOnly = [v[0] for v in quasiSkelVtxs]
	quasiGraphVtxsOnly = [v[0] for v in quasiGraphVtxs]

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
	maxCoordX = maxCoordX + 1
	maxCoordY = maxCoordY + 1
	minCoordX = minCoordX - 1
	minCoordY = minCoordY - 1

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
		
		console.log "starting new infPerp"
		closestEdge = null
		distance = null
		for e in boundaryEdges
			if intersect(e, r)?
				d = dist(intersect(e, r), r.origin)
				if d < distance or !(distance?)
					closestEdge = e
					distance = d 
			else
				console.log "the following two don't intersect:"
				console.log r.print()
				console.log e.print()

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


	for edge in gEdges
		edges.push(new CreasePatternEdge(edge.endpt1, edge.endpt2, "graph"))

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
edgeHandle = (mySLAV, pq, I, processed, skelEdges, skelVtxs, infEdges) ->				
	if I[2] in processed or I[3] in processed							# convex 2b. Recall I is of the form [event type, Point, Na, Nb]
		return

	if edgeTwoC(mySLAV, I, processed, skelEdges, skelVtxs)
		return

	edgeTwoD(I, skelEdges) # doesn't use mySLAV oop
	N = edgeTwoE(mySLAV, I, processed, skelVtxs)
	edgeTwoF(mySLAV, N, pq, infEdges)												# N is a new node, currently in mySLAV, created from edgeTwoF

# function edgeTwoC checks if I is a peak of roof
# if it is, return true and add 3 edges to skelEdges and a fancyVertex to skelVtxs
# and we don't need to do steps d - f
# otherwise it returns false
# also adds I's parents to processed

edgeTwoC = (mySLAV, I, processed, skelEdges, skelVtxs) ->	
	console.log "in edgeTwoC"
	Na = I[2]; Pa = Na.content.point; aOut = Na.content.outEdge					
	Nb = I[3]; Pb = Nb.content.point; bOut = Nb.content.outEdge
	Nc = Na.pred; Pc = Nc.content.point; cOut = Nc.content.outEdge	

	console.log "Nc.pred = " + Nc.pred.content.print()
	console.log "Nb = " + Nb.content.print()

	if Nc.pred == Nb			 											# check equality of nodes? 

		skelEdges.push(new GraphEdge(Pa, I[1]))												# I think this is okay because they will be the same object
		skelEdges.push(new GraphEdge(Pb, I[1]))
		skelEdges.push(new GraphEdge(Pc, I[1]))

		skelVtxs.push([I[1], aOut.undirect(), bOut.undirect(), cOut.undirect()]) # I[1] is a Point with the coordinates of I

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
	console.log "in edgeTwoE"

	Na = I[2]
	Nb = I[3]
	Va = Na.content
	Vb = Nb.content								# Va and Vb are vertices :/

	processed.push(Na)
	console.log "processed " + Na.content.print()
	processed.push(Nb)
	console.log "processed " + Nb.content.print()

	fancyVertex = [I[1], Va.inEdge.undirect(), Va.outEdge.undirect(), Vb.outEdge.undirect()]

	skelVtxs.push(fancyVertex)

	# the following modifies mySLAV (confusing part...)
	currLAV = mySLAV.LAVContaining(Na)
	# wait apparently sometimes Na can be a vertex that's already processed, so
	# it's not in mySLAV anymore, but then Nb has to be (hopefully :/)

	console.log "apparently sometimes currLAV does not exist, so if it's bad, here's the troublemaker: "
	if !(currLAV?)
		console.log Na.content.print()
	else
		console.log "It's okay, but here it is anyway"
		console.log Na.content.print()

	newV = new Vertex(I[1], Va.inEdge, Vb.outEdge)
	N = currLAV.insert(newV, Na.pred)
	currLAV.remove(Na)
	currLAV.remove(Nb)

	return N

edgeTwoF = (mySLAV, N, pq, infEdges) ->
# compute the intersection of 
# angle bisectors of (N.pred.content[1], N.pred.content[2])
# and (N.content[1], N.content[2]) (these are the in and out edges)
# similarly, the intersection of angBis(N.content[1], N.content[2])
# and angBis(N.succ.content[1], N.succ.content[2])

	[I, d] = computeI(mySLAV, N, infEdges)
	if I?
		pq.add(I, d)

		

outputCreasePatternFOLD = (CP, CPfaces) ->
	# output the unfolded crease pattern
	return FOLD

# the following actually fold the crease pattern in 3D

fold  = (CP, shady, root) ->
	# changes CP (actually folds it up) keep it in the xy plane how about? my points are like 2D man
	corridors = computeCorridors(CP)
	for corr in corridors
		# fold the corridor, first unfold everything
		corr.clearFolds()
		foldCorridor(CP, shady, root, corr)

	# don't forget to fold the whole thing after you're done
	CP.toggleFold()

	return CP


foldCorridor = (CP, shady, root, corr) ->
	if corr.numOfWalls == 1
		if corr.C1?
			sk = corr.C1
		else
			sk = corr.C2

	else
		if shady.treeDistance(corr.C1, root) > shady.treeDistance(corr.C2, root)
			sk = corr.C2
		else
			sk = corr.C1

	# sk is the component of the wall closer to the root

	n = corr.faces.length

	for i in [0..(n-2)]
		face1 = corr.faces[i]
		face2 = corr.faces[i+1]

		sharedEdge = setIntersect(face1[1], face2[1])
		# remember that sharedEdge.foldedPos contains the GraphEdge corresponding to sharedEdge when it's folded

		if sharedEdge.assignment == "m" or sharedEdge.assignment == "v"
			alreadyReflected = []
			for j in [(i+1)..(n-1)]
				reflectThisFace = corr.faces[j]
				for v in reflectThisFace[0]
					if v in alreadyReflected
						continue

					reflect(v.foldedPos, sharedEdge.foldedPos)	
					alreadyReflected.push(v)

	# find a graph edge in the corridor, it should be at y = 0
	for edge in corr.nonWallEdges
		if edge.type == "graph"
			base = edge
			break

	# the endpoints of base (a graph type edge) are basePerp and baseOther
	if base.endpt1.component? and base.endpt1.component == sk
			basePerp = base.endpt1
			baseOther = base.endpt2
	else
		basePerp = base.endpt2
		baseOther = base.endpt1


	x = shady.distance(sk, root)
	xx = x + base.length()

	# okay, now we want basePerp.foldedPos = (x, 0) and baseOther.foldedPos = (xx, 0)
	# what is the transformation that takes a segment (a,b)--(c,d) to (x,0)--(xx,0)?? (of the same length)
	# whatever that transformation is, apply it to every point in the corridor (ONLY ONCE EACH)

	a = basePerp.foldedPos.x
	b = basePerp.foldedPos.y
	c = baseOther.foldedPos.x
	d = baseOther.foldedPos.y

	# + translate1 by (-a, -b)
	# do a rotation about 0 that takes (c - a, d - b) to (xx - x, 0)
	# + translate2 by (x, 0)
	P = new Point(c-a, d-b)
	Q = new Point(xx - x, 0)

	theta = Q.ang() - P.ang()
	# rotate theta counterclockwise to get from P to Q
	# the rotation is : (x, y) -> (cos * x - sin * y, sin * x + cos * y)

	transformed = []
	for face in corr.faces
		for v in face[0]
			if v in transformed
				continue

			t = v.foldedPos.x
			u = v.foldedPos.y

			t = t - a
			u = u - b

			newt = Math.cos(theta)*t - Math.sin(theta)*u
			newu = Math.sin(theta)*t + Math.cos(theta)*u

			t = newt
			u = newu

			t = t + x

			v.foldedPos.x = t
			v.foldedPos.y = u

			transformed.push(v)

outputFoldedStateFOLD = (CP, CPfaces, facesRelations) ->
	# converts this to a fold file
	# the coordinates of the vertices and the edges are contained in CP
	# CPfaces contains the faces_vertices and faces_edges 
	return FOLD
foldAndCut = (clickSeq) ->
	# straight skeleton
	[e, v, i, gV, gE] = straightSkeleton(clickSeq)

	# computePerps
	[e, v, i, gV, gE, perps, iPerps, qSV, qGV] = computePerps(e, v, i, gV, gE)

	# convert to CreasePattern
	CP = convert(e, v, i, gV, gE, perps, iPerps, qSV, qGV)

	# foldedState assigns mountains, values, and computes facesRelatiosn
	[CPfaces, facesRelations, shady, root] = foldedState(CP)
	# CPfaces, CPRelations, and CP should contain all the info you want :3

	# fold it up
	fold(CP, shady, root)

	return[CP, CPfaces, facesRelations]


computeCorridors = (CP) -> #CP is a crease pattern
	corridors = [] # list of all corridors

	BAll = CP.boundaryAllCircle()
	n = BAll.length

	for e in CP.cPEs
		if e.type == "boundary"
			i = BAll.indexOf(e.endpt1)
			j = BAll.indexOf(e.endpt2)
			if i == (j+1)%n
				# i comes after j
				v = e.endpt1
				w = e.endpt2
			else
				#j comes after i
				v = e.endpt2
				w = e.endpt1

			# so v always comes after w (counterclockwise)


			if v.type == "boundaryPerp" and w.type == "boundaryPerp"
				done = false
				for corr in corridors
					if (corr.C1 == v.component and corr.C2 == w.component) or (corr.C1 == w.component and corr.C2 == v.component)
						done = true
						break
				if !(done)
					# make a new corridor, if it's not already in corridors
					corridors.push(new Corridor(CP, e, v, w))


			if v.type != "boundaryPerp" and w.type == "boundaryPerp"
				corridors.push(new Corridor(CP, e, v, w))

			if w.type != "boundaryPerp"
				continue

	return corridors

computeShadowTree = (CP, corridors) ->
	skels = []
	for v in CP.cPVs
		if v.type == "skeleton"
			skels.push(v)

	return new OrientedMetricTree(skels, corridors)

corridorsContaining = (perpEdge, corridors) ->
	container = []
	for corr in corridors
		if (perpEdge in corr.wall1_Edges) or (perpEdge in corr.wall2_Edges)
			container.push(corr)

	return container

foldedState = (CP) ->
	corridors = computeCorridors(CP)
	shady = computeShadowTree(CP, corridors)

	CPfaces = []
	facesRelations = []

	for corr in corridors
		CPfaces = CPfaces.concat(corr.faces)
		facesRelations = facesRelations.concat(corr.faceRelations())
		corr.assignAll()

	# root the tree
	for root in shady.vertices
		if shady.degree(root) != 1
		# I actually really don't want to root it at a leaf, 
		# just because of the way I do things later
		# (in foldCorridor, when finding the basePerp, I'll want to make sure
		# sk corresponds to the "outer" wall if there is one)
			break

	for e in CP.cPEs
		if e.type == "boundary"
			e.assign("b")

		if e.type == "perp"
			container = corridorsContaining(e, corridors)
			if container.length == 1
				continue

			sk = e.component # sk is a skeleton vertex that is in corridors.vertices
			[corr1, corr2] = container 
			# corr1 and corr2 are both in corridors.edges and are neighbors of sk,
			# so one of the components for both corr1 and corr2 is sk

			neighborCircleSK = shady.orientation(sk)
			n = neighborCircleSK.length
			i = neighborCircleSK.indexOf(corr1)
			j = neighborCircleSK.indexOf(corr2)

			# make corr2 counterclockwise of corr1 i.e. j = i + 1
			if i == (j+1)%n
				tmp = corr1
				corr1 = corr2
				corr2 = tmp

			# decide whether they corridors points "up" or "down" stored in, only if they both point down is the crease folded
			downs = 0
			for edge in [corr1, corr2]
				if edge.numOfWalls == 1
					downs = downs + 1
				else
					if edge.C1 == sk
						skPrime = edge.C2
					else
						skPrime = edge.C1

					if shady.treeDistance(root, skPrime) > shady.treeDistance(root, sk)
						downs = downs + 1

			if downs == 2
				if corr1.wall1_Edges.indexOf(e)%2 == 0
					e.assign("v")
				else
					e.assign("m")

			else
				e.assign("f") # flat

			# find the faces in corr1 and corr2 actually containing e
			for f in corr1.faces
				if e in f[1] # those are the edges (I hope)
					face1 = f

			for f in corr2.faces
				if e in f[1]
					face2 = f

			if e.assignment == "v"
				facesRelations.push([face1, face2, 1])
				facesRelations.push([face2, face1, 1])
			else if e.assignment == "m"
					facesRelations.push([face1, face2, -1])
					facesRelations.push([face2, face1, -1])

				else if e.assignment == "f"
						facesRelations.push([face1, face2, 0])
						facesRelations.push([face2, face1, 0])

			# NOTE : [face1, face2, 1] means that relative to face1's orientation, face2 is above face1

	return [CPfaces, facesRelations, shady, root]









#splitHandle = (mySLAV, pq, I, processed, skelEdges, skelVtxs) ->
# recall that this means I = ["s", point, N (Node), oppositeEdge (directed segment)]

splitHandle = (mySLAV, pq, I, processed, skelEdges, skelVtxs, infEdges) ->
	if I[2] in processed
		return

	# I'm confused by 2c, I don't think peaks of roof happen in the split case???
	splitTwoD(I, skelEdges)
	[N1, N2] = splitTwoE(mySLAV, I, processed, skelVtxs)
	splitTwoF(mySLAV, N1, N2, pq, infEdges)

splitTwoD = (I, skelEdges) ->
	N = I[2]
	P = N.content.point

	skelEdges.push(new GraphEdge(P, I[1])) 

splitTwoE = (mySLAV, I, processed, skelVtxs) -> # recall I = ["s", point, N, dirSeg (edge of the graph)]
	console.log "In splitTwoE"
	N = I[2] 				#node
	V = N.content			#vertex
	dirSeg = I[3]			#dirSeg is one of the edges of the graph, I have really bad notation, it is not a GraphEdge :(

	processed.push(N)
	fancyVertex = [I[1], V.inEdge.undirect(), V.outEdge.undirect(), dirSeg.undirect()]
	skelVtxs.push(fancyVertex)

	# the following modifies mySLAV
	V1 = new Vertex(I[1], V.inEdge, dirSeg)
	V2 = new Vertex(I[1], dirSeg, V.outEdge)
	LAV1 = mySLAV.LAVContaining(N)
	# search all nodes in mySLAV for the correct node to follow V1, and the correct note to precede V2

	cand = new PriorityQueue
	l = line(dirSeg)
	ft = foot(I[1], l)

	for node in mySLAV.allNodes()
		if node.content.outEdge == dirSeg
			# found one
			console.log "found one"
			nodeft = foot(node.content.point, l)
			d = (ft.x - nodeft.x)/(dirSeg.dir().x)
			console.log "d = " + d

			if d > 0
				console.log "Yes, it's greater than zero bro"
				cand.add(node, d)
	
	Nc = cand.pop() 			# pops out a node
	Nd = Nc.succ
	Na = N.pred
	Nb = N.succ

	N1 = new Node(Na, V1, Nd)
	N2 = new Node(Nc, V2, Nb)

	# reassign pred, succ

	Nd.pred = N1
	Nc.succ = N2
	Na.succ = N1
	Nb.pred = N2

	# create new lavs

	lava = new CircularDoublyLinkedList()
	lava.nodesList.push(N1)

	newElem = N1.succ
	while newElem != N1
		lava.nodesList.push(newElem)
		newElem = newElem.succ

	lava.head = N1
	lava.tail = lava.head.pred

	if N2 in lava.nodesList
		# that means there was a merge
		LAV2 = mySLAV.LAVContaining(Nd)

		# remember to define this function
		mySLAV.removeLAV(LAV1)
		mySLAV.removeLAV(LAV2)
		mySLAV.pushLAV(lava)

	else # there was only one lav and it splits
		lavb = new CircularDoublyLinkedList()
		lava.nodesList.push(N2)
		newElem = N2.succ
		while newElem != N2
			lavb.nodesList.push(newElem)
			newElem = newElem.succ

		lavb.head = N2
		lavb.tail = lavb.head.pred

		mySLAV.removeLAV(LAV1)
		mySLAV.pushLAV(lava)
		mySLAV.pushLAV(lavb)

		return [N1, N2]

splitTwoF = (mySLAV, N1, N2, pq, infEdges) ->
	[I, d] = computeI(mySLAV, N1, infEdges)
	if I?
		pq.add(I, d)

	[I, d] = computeI(mySLAV, N2, infEdges)
	if I?
		pq.add(I, d)
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

	return [mySLAV, gVtxs, gEdges]# outputs pq, a PriorityQueue consisting of all intersection points
# an element of pq has the form [I, dist] = [[type, Point (coordinates), Na, Nb], dist]
# where Na and Nb are Nodes whose content are Vertexes [Point (coordinates), inEdge, outEdge]


stepOneC = (mySLAV, infEdges) ->
	pq = new PriorityQueue				# creates empty PriorityQueue
	for node in mySLAV.allNodes()		# lav is a CDLL whose contents are Vertexes
		[I, d] = computeI(mySLAV, node, infEdges)
		if I?
			pq.add(I, d)					# add it to the priority queue

	console.log "HELLOoO"
	for thing in pq.values()
		if thing[0] == "e"
			console.log thing[0] + ", " + thing[2].content.print() + ", " + thing[3].content.print()
		else
			console.log thing[0] + ", " + thing[2].content.print() + ", " + thing[3].print()	
	return pq

computeI = (mySLAV, node, infEdges) ->	# returns [[event type, point coordinates, parent nodes], distance]
	v = node.content
	u = node.pred.content
	w = node.succ.content

	e = line(v.inEdge)		# one of the edges adjacent to v, doesn't matter which because
										# anglebisector has equal distance to both

	I1 = intersect(u.bisector, v.bisector)
	I2 = intersect(v.bisector, w.bisector)

	if I1?
		d1 = dist(I1, e)
	if I2?
		d2 = dist(I2, e)

	if isReflex(v) and computeB(mySLAV, node)?          # if v is reflex and there exists an opposite edge
		[I3, oppositeEdge] = computeB(mySLAV, node)		# oppositeEdge is a directed segment, one of the original edges
				
		d3 = dist(I3, e)

	# I1, I2, I3, d1, d2, d3 are computed if they exist

	# if there is no interseciton, escape to infinity
	if !(I1? or I2? or I3?)
		infEdges.push(v.bbbisector())
		return [null, null]

	if d1? and (d1 <= d2 or !(d2?))
		I = ["e", I1, node.pred, node]
		d = d1
	else if d2?
			I = ["e", I2, node, node.succ]
			d = d2
		else
			d = null

	if d3? and (d3 <= d or !(d?))
		I = ["s", I3, node, oppositeEdge] 
		d = d3

	return [I, d]

# this is really wrong
# computeB = (mySLAV, node) -> 							# return [B, oppositeEdge]
# 	candidates = new PriorityQueue
# 	v = node.content
# 	outLineV = new LineOrRay(v.point, v.point.plus(v.outEdge.dir),false)
# 	inLineV = new LineOrRay(v.point, v.point.minus(v.inEdge.dir),false)

# 	for testNode in mySLAV.allNodes()					# checks if the edge coming out of testNode is an "opposite" edge
# 		u = testNode.content
# 		outLineU = new LineOrRay(u.point, u.point.plus(u.outEdge.dir), false)
# 		if intersect(v.bisector, outLineU)?
# 			if intersect(outLineV, outLineU)? and intersect(inLineV, outLineU)?
# 				X = intersect(outLineV, outLineU)
# 				r = angleBisector(X, v.outEdge, u.outEdge)
# 				B = intersect(r, v.bisector)						# computed the incenter 

# 				w = testNode.succ.content      							# w is the forward neighbor of u
				
# 				Bw = new LineOrRay(B, w.point, true)	
# 				Bu = new LineOrRay(B, u.point, true)

# 				if !(intersect(Bw, u.bisector)? or intersect(Bu, w.bisector)?)			# check if B is in the region bounded by edge u--w and the two 
# 					e = line(v.inEdge)													# angle bisector rays coming out of it
# 					d = dist(B, e)
# 					candidates.add([B, v.outEdge], d)
# 	return candidates.pop()

computeB = (mySLAV, node) -> 				# node is a reflex angle, in reality it will only happen with graph vertices
	candidates = new PriorityQueue

	v = node.content
	q = v.point
	outV = v.outEdge
	inV = v.inEdge
	lineOutV = new LineOrRay(q, q.plus(outV.dir()), false)
	lineInV = new LineOrRay(q, q.plus(inV.dir()), false)

	# note that the following computes some impossible intersections 
	# when the edge is pointing the wrong way
	# but it's okay because it only returns the closest one,
	# which will always be a good one
	for testNode in mySLAV.allNodes()			# testing edges by their start vertex
		if setIntersect([testNode, testNode.succ], [node, node.succ, node.pred])?
			continue
		u = testNode.content

		w = testNode.succ.content 				# w is the vertex after u
		p = u.point
		outU = u.outEdge
		lineOutU = new LineOrRay(p, p.plus(outU.dir()), false)	# we only care about the Out's for u
		rayOutU = new LineOrRay(p, p.plus(outU.dir()), true)

		if intersect(v.bisector, lineOutU)? and intersect(lineInV, lineOutU)? and intersect(lineOutV, lineOutU)? # not behind and no parallel
			X = intersect(lineInV, lineOutU)
			r = angleBisector(X, inV, outU) 			# carefully pick the right ones to get the right orientation...
			B = intersect(r, v.bisector)

			if B? and side(B, rayOutU) == "left" and side(B, w.bisector) == "left" and side(B, u.bisector) == "right"
				d = dist(B, lineOutV)
				candidates.add([B, outU], d)

	if candidates.length() == 0
		return null
	return candidates.pop()











# function stepTwo performs step 2a-2f once through, modifies all inputs appropriately
# calls edgeHandle and splitHandle
# edgeHandle calls edgeTwoC, ..., edgeTwoF
# unwritten functions called in this file: splitHandle

stepTwo = (mySLAV, pq, processed, skelEdges, skelVtxs, infEdges) -> 				
	I = pq.pop()														# I is of the form [event type, Point, Na, Nb]
	if I[0] == "e"
		console.log "edgeHandling, and mySLAV is currently:"
		console.log mySLAV.printLAVs()

		edgeHandle(mySLAV, pq, I, processed, skelEdges, skelVtxs, infEdges)
	else
		console.log "splitHandling, and mySLAV is currently: "
		console.log mySLAV.printLAVs()
		splitHandle(mySLAV, pq, I, processed, skelEdges, skelVtxs, infEdges)


# nothing more here ...
# function edgeHandle performs steps 2b - 2f of convex case
# modifies mySLAV, processed, skelEdges, skelVtxs

# edgeHandle = (mySLAV, pq, I, processed, skelEdges, skelVtxs) ->				
# 	if I[2] in processed and I[3] in processed							# convex 2b. Recall I is of the form [event type, Point, Na, Nb]
# 		return

# 	if edgeTwoC(mySLAV, I, processed, skelEdges, skelVtxs)
# 		return

# 	edgeTwoD(mySLAV, I, skelEdges)
# 	N = edgeTwoE(mySLAV, I, processed, skelVtxs)
# 	edgeTwoF(mySLAV, N, pq)												# N is a new node, currently in mySLAV, created from edgeTwoF

# # function edgeTwoC checks if I is a peak of roof
# # if it is, return true and add 3 edges to skelEdges and a fancyVertex to skelVtxs
# # and we don't need to do steps d - f
# # otherwise it returns false
# # also adds I's parents to processed

# edgeTwoC = (mySLAV, I, processed, skelEdges, skelVtxs) ->		
# 	Na = I[2]; Va = Na.content.point; aOut = Na.content.outEdge					
# 	Nb = I[3]; Vb = Nb.content.point; bOut = Nb.content.outEdge
# 	Nc = Na.pred; Vc = Nc.content.point; cOut = Nc.content.outEdge	

# 	if Nc.pred == Nb			 											# check equality of nodes? 

# 		skelEdges.push([Va, I[1]])												# I think this is okay because they will be the same object
# 		skelEdges.push([Vb, I[1]])
# 		skelEdges.push([Vc, I[1]])

# 		skelVtxs.push([I[1], aOut.undirect(), bOut.undirect(), cIn.undirect()]) # I[1] is a Point with the coordinates of I
# 																				# aIn, bIn, cIn are actually DirectedSegments	
# 		processed.push(Na)
# 		processed.push(Nb)
# 		processed.push(Nc)

# 		return true

# 	return false

# edgeTwoD = (mySLAV, I, skelEdges) ->											# I = ["e", point, Na, Nb]
# 	Na = I[2]
# 	Nb = I[3]
# 	Va = Na.content.point
# 	Vb = Nb.content.point						# Va and Vb are points

# 	skelEdges.push([Va, I[1]])
# 	skelEdges.push([Vb, I[1]])

# edgeTwoE = (mySLAV, I, processed, skelVtxs) -> # outputs a new node
# # and Na and Nb to processed
# # get the LAV in mySLAV containing Na and Nb
# # creates a new vertex newV and inserts it after Na.pred in the LAV
# # remove Na and Nb from LAV
# # add a FancyVertex to skelVtxs
# # returns the new node N with content newV

# 	Na = I[2]
# 	Nb = I[3]
# 	Va = Na.content
# 	Vb = Nb.content								# Fuck now Va and Vb are vertices :/

# 	processed.push(Na)
# 	processed.push(Nb)

# 	currLAV = mySLAV.LAVContaining(Na)

# 	newV = new Vertex(I[1], Va.inEdge, Vb.outEdge)
# 	N = currLAV.insert(newV, Na.pred)
# 	currLAV.remove(Na)
# 	currLAV.remove(Nb)

# 	fancyVertex = [I[1], Va.inEdge.undirect(), Va.outEdge.undirect(), Vb.outEdge.undirect()]
# 	skelVtxs.push(fancyVertex)

# 	return N

# edgeTwoF = (mySLAV, N, pq) ->
# # compute the intersection of 
# # angle bisectors of (N.pred.content[1], N.pred.content[2])
# # and (N.content[1], N.content[2]) (these are the in and out edges)
# # similarly, the intersection of angBis(N.content[1], N.content[2])
# # and angBis(N.succ.content[1], N.succ.content[2])

# 	Id = computeI(mySLAV, N)
# 	I = Id[0]
# 	d = Id[1]

# 	pq.add(I, d)


	# outputs skelEdges and skelVtxs
# skelEdges is an array of all of the skeleton edges (represented as an array of two points)		
# skelVtxs is an array of the skeleton vertices in the form [fancyVertex],
# where fancyVertex is an array of the form [coordinates, [~3 corresponding graph edges]]

straightSkeleton = (clickSequence) ->				# clickSequence is a sequence of Points
	skelEdges = []									
	skelVtxs = []	
	infEdges = []	# the rays that escape								 
	processed = []									# processed is array of processed nodes
													# processed must be initialized outside of stepTwo because stepTwo loops

	[mySLAV, gVtxs, gEdges] = stepOneAB(clickSequence)				# creates the SLAV from the click sequence
	
	pq = stepOneC(mySLAV, infEdges)							# outputs the priority queue

	while pq.length() != 0
		stepTwo(mySLAV, pq, processed, skelEdges, skelVtxs, infEdges)

	return [skelEdges, skelVtxs, infEdges, gVtxs, gEdges]# geo classes

class Point
	constructor : (x, y) -> 
		@x = x
		@y = y
		@isPoint = true

	ang : -> 
		return Math.atan2(@y, @x)

	plus : (otherPoint) ->							# I would try not to use these man
		x = @x + otherPoint.x						# I just feel like I want to use them...
		y = @y + otherPoint.y
		return new Point(x, y)

	minus : (otherPoint) ->
		x = @x - otherPoint.x
		y = @y - otherPoint.y
		return new Point(x, y)

	times : (num) ->
		x = @x*num
		y = @y*num
		return new Point(x, y)

	isEqualTo : (otherPoint) ->
		if @x == otherPoint.x and @y == otherPoint.y
			return true
		return false

	print : ->
		return "(" + @x + ", " + @y + ")"

class LineOrRay
	constructor : (a, b, rayness) ->
		@origin = a
		@dir = b.minus(a)							# the line has the form @origin + t * @dir, with t>=0 for a ray
		@isRay = rayness							# rayness = true or false

	print : ->
		if @isRay
			return "[ ray: origin = " + @origin.print() + ", dir = " + @dir.print() + " ]"
		else
			return "[ line: origin = " + @origin.print() + ", dir = " + @dir.print() + " ]"

class DirectedSegment
	constructor : (p, q) ->							# starts at @endpt1 and ends at @endpt2
		@endpt1 = p
		@endpt2 = q
		@isSegment = true

	dir : -> 
		return @endpt2.minus(@endpt1)

	undirect : -> 									# returns an undirected segment (GraphEdge)
		return new GraphEdge(@endpt1, @endpt2)

	isEqualTo : (otherDirectedSegment) ->
		return (otherDirectedSegment.endpt1 == @endpt1 and otherDirectedSegment.endpt2 == @endpt2)

	print : ->
		return @endpt1.print() + " --> " + @endpt2.print()

class GraphEdge
	constructor : (a, b) ->
		@endpt1 = a
		@endpt2 = b
		@isSegment = true

	isEqualTo : (otherGraphEdge) ->														# when comparing GraphEdges use this
		if @endpt1 == otherGraphEdge.endpt1 and @endpt2 == otherGraphEdge.endpt2		# they can actually be equal when they're different objects :O
			return true																	
		if @endpt1 == otherGraphEdge.endpt2 and @endpt2 == otherGraphEdge.endpt1
			return true
		return false

	print : ->
		return @endpt1.print() + " -- " + @endpt2.print()

class Vertex 														# properties @point, @inEdge, @outEdge, @bisector
	constructor : (point, inEdge, outEdge) ->						# coords is a Point object
		@point = point
		@inEdge = inEdge
		@outEdge = outEdge
		if @point? and @inEdge? and @outEdge?						# idk I don't want it to anything stupid but
			@bisector = angleBisector(@point, @inEdge, @outEdge)	# I don't think you'd want to create an incomplete Vertex anyway...

	bbbisector : ->													# actually should only use this one :/
		return angleBisector(@point, @inEdge, @outEdge)

	copy : ->
		return new Vertex(@point, @inEdge, @outEdge)

	print : ->
		return "[ " + @point.print() + ", " + @inEdge.print() + ", " + @outEdge.print() + " ]"

# geo functions

line = (segment) -> 												# returns the line holding a DirectedSegment or GraphEdge
	if segment.isRay?
		return new LineOrRay(segment.origin, segment.origin.plus(segment.dir),false)

	return new LineOrRay(segment.endpt1, segment.endpt2, false)		# do not change segment

intersect = (lrs1, lrs2) ->							
	l1 = line(lrs1)
	l2 = line(lrs2)

	a1 = l1.origin.x
	b1 = l1.origin.y
	u1 = l1.dir.x
	v1 = l1.dir.y

	a2 = l2.origin.x
	b2 = l2.origin.y
	u2 = l2.dir.x
	v2 = l2.dir.y 									# solve equations (a1, b1) + t(u1, v1) = (a2, b2) + s(u2, v2) for t

	if (u1*v2 - v1*u2) == 0
		return null									# returns null if they are parallel
	
	t = (a2*v2 - a1*v2 - b2*u2 + b1*u2)/(u1*v2 - v1*u2)
	s = (a2*v1 - a1*v1 - b2*u1 + b1*u1)/(u1*v2 - u2*v1) 
	x = a1 + t*u1
	y = b1 + t*v1

	if (lrs1.isRay? and lrs1.isRay and t < 0) or (lrs2.isRay? and lrs2.isRay and s < 0)
		return null													# doesn't intersect ray

	for sgmnt in [lrs1, lrs2]
		if sgmnt.isSegment?
			if sgmnt.endpt1.x == sgmnt.endpt2.x
				if (sgmnt.endpt1.y - y)*(sgmnt.endpt2.y - y) > 0
					return null
			else
				if (sgmnt.endpt1.x - x)*(sgmnt.endpt2.x - x) > 0
					return null

	return new Point(x, y)

angle = (inDirSeg, outDirSeg) ->					# returns the angle on the left between two directed segments mod 2pi
	a1 = inDirSeg.dir().x
	b1 = inDirSeg.dir().y
	a2 = outDirSeg.dir().x
	b2 = outDirSeg.dir().y

	theta = Math.PI - (Math.atan2(b2, a2) - Math.atan2(b1, a1))
	theta = theta - 2*Math.PI*Math.floor(theta/(2*Math.PI))

isReflex = (v) ->									# takes as input a VERTEX - (point, inEdge, outEdge, bisector)
	if angle(v.inEdge, v.outEdge) > Math.PI
		return true
	else 
		return false								# returns true if the angle between v.inEdge and v.outEdge is > 180
													

angleBisector = (vert, inDirSeg, outDirSeg) ->		
	theta = angle(inDirSeg, outDirSeg)				# a point vert has inDirSeg coming in and outDirSeg going out
	x = outDirSeg.dir().x								# returns the angle bisector of the angle on the left if you walk along the DirSeg's
	y = outDirSeg.dir().y								# the angle bisector is returned as a Ray with origin vert 

	bisectorDir = new Point(Math.cos(theta/2)*x - Math.sin(theta/2)*y, Math.sin(theta/2)*x + Math.cos(theta/2)*y)

	bisector = new LineOrRay(vert, vert.plus(bisectorDir), true) 

dist = (pt, lrs) ->								# returns the distance from pt to line (which is a LineOrRay) or a point to point
	if lrs.isPoint?
		x = pt.x
		y = pt.y
		a = lrs.x
		b = lrs.y
		return Math.sqrt((x-a)**2 + (y-b)**2)

	# else, lrs is actually a line, ray or segment
	l = line(lrs)

	x = pt.x
	y = pt.y
	a = l.origin.x
	b = l.origin.y

	ptOrigin = new DirectedSegment(pt, l.origin)
	originDir = new DirectedSegment(l.origin, l.origin.plus(l.dir))

	theta = angle(ptOrigin, originDir)

	return Math.abs(Math.sin(theta)*Math.sqrt((x-a)**2 + (y-b)**2))

foot = (pt, lrs) -> 			# returns the foot from a Point to a line, ray or segment if it exists
	l = line(lrs)

	[x, y] = [pt.x, pt.y]
	[r, s] = [l.origin.x, l.origin.y]
	[a, b] = [x - r, y - s]

	[c, d] = [l.dir.x, l.dir.y]

	x = r + (a*c + b*d)*c/(c**2 + d**2)
	y = s + (a*c + b*d)*d/(c**2 + d**2)

	if lrs.isSegment? and (((lrs.endpt1.x - x)*(lrs.endpt2.x - x) > 0) or ((lrs.endpt1.y - y)*(lrs.endpt2.y - y) > 0))
		return null

	if lrs.isRay? and lrs.isRay and ((x - lrs.origin.x)*(lrs.dir.x) < 0 or (x - lrs.origin.y)*(lrs.dir.y) < 0)
		return null

	return new Point(x, y)

perp = (pt, lrs) ->				# returns the perpendicular ray
	l = line(lrs)
	ft = foot(pt, l)
	return new LineOrRay(pt, ft, true)

reflect = (pt, lrs) -> 			# modifies pt
	l = line(lrs)
	ft = foot(pt, l)	

	pt.x = 2*ft.x - pt.x
	pt.y = 2*ft.y - pt.y
	return pt
class CreasePatternVertex extends Point
	constructor : (x, y, type, skelVtx, foldedPosition) -> 		# allowed types "skeleton", "graph", "boundary", boundaryPerp", "boundarySkel", "quasiSkeleton", "quasiGraph"
		super(x, y)
		@z = 0 # always in xy plane only
		@type = type
		if @type == "skeleton"
			@component = @
		if @type == "quasiSkeleton" or @type == "quasiGraph" or @type == "boundaryPerp"
			@component = skelVtx

		if foldedPosition?
			@foldedPos = foldedPosition
		else
			@foldedPos = new Point(@x, @y)

	# fold : ->
	# 	@x = @foldedPos.x
	# 	@y = @foldedPos.y

	clearFolds : ->
		@foldedPos.x = @x
		@foldedPos.y = @y

	toggleFold : ->
		tmpX = @x
		tmpY = @y

		@x = @foldedPos.x
		@y = @foldedPos.y

		@foldedPos.x = tmpX
		@foldedPos.y = tmpY

	printFull : ->													#not allowing "inf"
		# if @type == "inf"
		# 	return "[ " + @x.print() + ", " + @type + " ]" 
		if @component?
			return "[ (" + @x + "," + @y + "), " + @type + ", (" + @component.x + "," + @component.y + ") ]"

		return "[ (" + @x + "," + @y + "), " + @type + " ]"

class CreasePatternEdge
	constructor : (endpt1, endpt2, type, skelVtx, assignment) ->	# probably not passing in assignment though...
		@endpt1 = endpt1							# endpt1 and endpt2 are CPVs
		@endpt2 = endpt2
		@type = type 								# allowed types "skeleton", "graph", "boundary", "perp"
		if @type == "perp"
			@component = skelVtx						# only have a @component if the type is "perp"

		if assignment?
			@assignment = assignment
		else
			@assignment = "u"

		@foldedPos = new GraphEdge(@endpt1.foldedPos, @endpt2.foldedPos)

	isEqualTo : (otherCPE) ->
		if (@endpt1 == otherCPE.endpt1 and @endpt2 == otherCPE.endpt2) or (@endpt1 == otherCPE.endpt2 and @endpt2 == otherCPE.endpt1)
			return true
		return false

	length : ->
		return dist(@endpt1, @endpt2)

	assign : (mvbfu) -> 
		@assignment = mvbfu

	print : ->
		return @endpt1.print() + " -- " + @endpt2.print() + " " + @assignment

	printFull : ->
		if @type == "perp"
			return @type + " " + @endpt1.print() + " -- " + @endpt2.print() + " " + @assignment + " " + @component.print()

		return @type + " " + @endpt1.print() + " -- " + @endpt2.print() + " " + @assignment

class CreasePattern 
	constructor : (cPVs, cPEs, center) ->
		@cPVs = cPVs
		@cPEs = cPEs
		@center = center

	addVtx : (cPV) ->
		@cPVs.push(cPV)

	removeVtx : (cPV) ->
		n = @cPVs.indexOf(cPV)
		@cPVs.splice(n,1)

		for i in [0..(@cPEs.length  - 1)]
			if incident(cPV, @cPEs[i])
				@cPEs.splice(i,1)

	addEdge : (cPE) ->
		@cPEs.push(cPE)

	removeEdge : (cPE) ->
		n = @cPEs.indexOf(cPE)
		@cPEs.splice(n,1)

	neighborEdges : (cPV) ->
		N = []
		for e in @cPEs
			if incident(cPV, e)
				N.push(e)

		return N

	neighborVtxs : (cPV) ->
		V = []
		for e in @neighborEdges(cPV)
			if e.endpt1 == cPV
				V.push(e.endpt2)
			else V.push(e.endpt1)

		return V

	degree : (cPV) ->
		return @neighborEdges(cPV).length

	isEdge : (vertex1, vertex2) ->
		for e in @cPEs
			if (e.endpt1 == vertex1 and e.endpt2 == vertex2) or (e.endpt1 == vertex2 and e.endpt2 == vertex1)
				return true

		return false 

	boundaryPerpCircle : ->
		b = new PriorityQueue
		for v in @cPVs
			if v.type == "boundaryPerp"
				theta = v.minus(@center).ang()
				b.add(v, theta)

		return b.values()

	boundaryAllCircle : ->
		b = new PriorityQueue
		for v in @cPVs
			if v.type == "boundaryPerp" or v.type == "boundary" or v.type == "boundarySkel"
				theta = v.minus(@center).ang()
				b.add(v, theta)

		return b.values()

	boundaryEdgeCircle : ->
		b = new ProirityQueue
		for e in @cPEs
			if e.type == "boundary"
				v = e.endpt1
				w = e.endpt2
				m = v.plus(w).times(0.5)
				theta = m.minus(@center).ang()
				b.add(e, theta)

		return b.values()


	rotateCCW : (edge, vertex) ->		# rotate edge about its endpoint counterclockwise
		if edge.endpt1 == vertex
			vertexPrime = edge.endpt2
		else
			vertexPrime = edge.endpt1

		rotatedEdge = edge
		theta = 7 			# 7 > 2pi

		for candidateEdge in @neighborEdges(vertex)
			if candidateEdge == edge
				continue

			if candidateEdge.endpt1 == vertex
				otherVtx = candidateEdge.endpt2
			else 
				otherVtx = candidateEdge.endpt1

			phi = otherVtx.minus(vertex).ang() - vertexPrime.minus(vertex).ang()

			if phi - 2*Math.PI*Math.floor(phi/(2*Math.PI)) < theta
				rotatedEdge = candidateEdge
				theta = phi - 2*Math.PI*Math.floor(phi/(2*Math.PI))

		return rotatedEdge

	rotateCW : (edge, vertex) -> 				# rotate edge about its endpoint vertex clockwise
		for e in @neighborEdges(vertex)
			if @rotateCCW(e, vertex) == edge
				return e

	rotateCW2 : (edge, vertex) ->
		rotEdge = @rotateCW(edge, vertex)

		if rotEdge.endpt1 == vertex
			rotVertex = rotEdge.endpt2
		else 
			rotVertex = rotEdge.endpt1

		return [rotEdge, rotVertex]

	rotateCCW2 : (edge, vertex) ->
		rotEdge = @rotateCCW(edge, vertex)

		if rotEdge.endpt1 == vertex
			rotVertex = rotEdge.endpt2
		else 
			rotVertex = rotEdge.endpt1

		return [rotEdge, rotVertex]

	# fold : ->
	# 	for v in @cPVs
	# 		v.fold()

	toggleFold : ->
		for v in @cPVs
			v.toggleFold()


class Corridor extends CreasePattern
	# this is really horrendous
	# walking along wall1 always has the corridor on the left
	# walking along wall2 always has the corridor on the right
	constructor : (CP, boundaryEdge, vtx1, vtx2) -> # vtx1 comes AFTER vtx2
		@wall1_Vtxs = []
		@wall2_Vtxs = []
		@wall1_Edges = []
		@wall2_Edges = []
		@nonWallEdges = []			# repeats some edges
		@faces = [] 				# a face is a pair [faces_vertices, faces_edges]

		@width = dist(vtx1, vtx2)

		@C1 = vtx1.component
		@C2 = vtx2.component

		if @C1? and @C2? and @C1 != @C2
			@numOfWalls = 2
		else
			@numOfWalls = 1

		start = vtx1
		e = boundaryEdge
		faceV = []
		faceE = []
		
		if vtx1.type == "boundaryPerp"
			@wall1_Vtxs.push(vtx1)
		while true	
			v = start

			while true
				faceV.push(v)
				faceE.push(e)

				if e.type == "perp"
					if e.component == @C1
						@wall1_Vtxs.push(v)
						@wall1_Edges.push(e)
					else 
						@wall2_Vtxs.push(v)
						@wall2_Edges.push(e)
				else
					@nonWallEdges.push(e)

				[e, v] = CP.rotateCW2(e, v)

				if v == start
					break

			@faces.push([faceV, faceE])
			faceV = []
			faceE = []

			v = otherVertex(v, e)
			[e, v] = CP.rotateCCW2(e, v)
			[e, v] = CP.rotateCCW2(e, v)
			start = v

			if e.type == "boundary"
				if v == e.endpt1
					v = e.endpt2
				else
					v = e.endpt1

				if v.component == @C1
					@wall1_Vtxs.push(v)
				else
					@wall2_Vtxs.push(v)

				break


	assign : (edge) ->								# assign M/V to the "graph" and "skeleton" edges
		if edge.type == "graph"
			edge.assign("f")
			return

		container = []
		for face in @faces
			if edge in face[1]
				container.push(face)

		if container.length == 2
			face1 = container[0]
			face2 = container[1]
			i = @gluedIndex(face1)
			j = @gluedIndex(face2)

			# i and j will always be of different parity, if the smaller one is even, then MOUNTAIN, otherwise VALLEY
			# that's kind of asymmetric... huh

			if (i < j and i%2 == 0) or (j < i and j%2 == 0)
				edge.assign("m")
			else
				edge.assign("v")

	gluedIndex : (face) ->
		# returns the index of a face in @faces assuming the faces with a cut edge (unfolded)
		# in between are actually the same
		ind = @faces.indexOf(face)

		if ind == 0
			return ind 

		subtractThisMuch = 0
		for i in [0..ind-1]
			e = setIntersect(@faces[i][1], @faces[i+1][1])
			if e.type == "graph"
				subtractThisMuch = subtractThisMuch + 1

		return ind - subtractThisMuch


	assignAll : ->
		for edge in @wall1_Edges
			@assign(edge)
		for edge in @wall2_Edges
			@assign(edge)
		for edge in @nonWallEdges
			@assign(edge)

	faceRelations : ->						# return an array of face relations
		faceRel = []
		for i in [0..(@faces.length - 2)]
			f = @faces[i]
			g = @faces[i+1]
			if i%2 == 0
				faceRel.push([f,g,-1])
				faceRel.push([g,f,-1])
			else
				faceRel.push([f,g,1])
				faceRel.push([g,f,1])

		return faceRel

	clearFolds : ->
		for face in @faces
			for v in face[0]
				v.clearFolds()		

	print : ->
		if @C1? and @C2?
			return "2-wall-corridor between " + @C1.print() + " and " + @C2.print()
		else
			if @C1?
				return "1-wall-corridor to left of " + @wall1_Vtxs[0].print()
			else
				return "1-wall-corridor to right of " + @wall2_Vtxs[0].print()


class OrientedMetricTree
	constructor : (vertices, edges) ->
		@vertices = vertices	# array of skeleton vertices (cPV)
		@edges = edges 			# array of corridors

	addVtx : (vertex) ->
		@vertices.push(vertex)

	addEdge : (edge) ->
		@edges.push(edge)

	degree : (vertex) ->
		d = 0
		for e in @edges
			if e.C1 == vertex or e.C2 == vertex
				d = d + 1

		return d

	isEdge :(vertex1, vertex2) ->
		for e in @edges
			if (e.C1 == vertex1 and e.C2 == vertex2) or (e.C1 == vertex2 and e.C2 == vertex1)
				return true

		return false

	findLeaf : ->
		for v in @vertices
			if @degree(v) == 1
				return v

	findPath : (start, end) -> 
		s = 0
		neighborhoodS = [[[start, [start]]], [[start, [start]]], [start]]
		# this is totally unreadable [[neighborhood with paths], [outer ring with paths], [neighborhood]]
		e = 0
		neighborhoodE = [[[end, [end]]], [[end, [end]]], [end]]

		while !(setIntersect(neighborhoodS[2], neighborhoodE[2])?)
			if s > e
				e = e + 1
				[N, C, V] = neighborhoodE
				newC = []

				for v in @vertices
					# checks if v is already in N
					if v in V
						continue

					# it's a new vertex
					for boundaryVtx in C
						if @isEdge(boundaryVtx[0], v)
							newC.push([v, boundaryVtx[1].concat([v])])
							V.push(v)
				
				while C.length != 0
					C.splice(0,1)

				for vert in newC
					N.push(vert)
					C.push(vert)

			else
				s = s + 1
				[N, C, V] = neighborhoodS
				newC = []

				for v in @vertices
					# checks if v is already in N
					if v in V
						continue

					# it's a new vertex
					for boundaryVtx in C
						if @isEdge(boundaryVtx[0], v)
							newC.push([v, boundaryVtx[1].concat([v])])
							V.push(v)

				while C.length != 0
					C.splice(0,1)

				for vert in newC
					N.push(vert)
					C.push(vert)

		# after they intersect
		middle = setIntersect(neighborhoodS[2], neighborhoodE[2])

		for m in neighborhoodS[0]
			if m[0] == middle
				m[1].splice(m[1].length - 1, 1)
				p1 = m[1]
				break	

		for m in neighborhoodE[0]
			if m[0] == middle
				p2 = m[1].reverse()

		return p1.concat(p2)


	treeDistance : (vertex1, vertex2) ->
		return @findPath(vertex1, vertex2).length - 1

	distance : (vertex1, vertex2) -> 
		p = @findPath(vertex1, vertex2)
		d = 0

		if p.length == 1
			return 0

		for i in [0..(p.length - 2)]
			d = d + dist(p[i], p[i+1])

		return d

	orientation : (vertex) -> # array of edges in cc order
		edgeCircle = new PriorityQueue

		for e in @edges
			if e.C1 == vertex or e.C2 == vertex
				if e.numOfWalls == 1
					if e.C1?
						repr = e.wall1_Vtxs[0]
					else
						wall = e.wall2_Vtxs
						repr = wall[wall.length - 1] # last one


				else # e.numOfWalls == 2
					if e.C1 == vertex
						wall = e.wall2_Vtxs
						repr = wall[wall.length - 1]
					else
						repr = e.wall1_Vtxs[0]

				edgeCircle.add(e, repr.minus(vertex).ang())

		return edgeCircle.values()

# Functions

incident = (cPV, cPE) ->
	if cPE.endpt1 == cPV or cPE.endpt2 == cPV
		return true

	return false

setIntersect = (A, B) ->
	for a in A
		if a in B
			return a

	return null

otherVertex = (cPV, cPE) ->
	if cPV == cPE.endpt1
		return cPE.endpt2
	else
		return cPE.endpt1
side = (point, dirSeg) ->								# dirSeg can be a ray too, "left" means point is in the *open* half plane
	if dirSeg.isRay? and dirSeg.isRay
		endpt1 = dirSeg.origin
		endpt2 = endpt1.plus(dirSeg.dir)
		dirSeg = new DirectedSegment(endpt1, endpt2)	# change a ray into a directed segment

	if point.isEqualTo(dirSeg.endpt1)
		return "right"

	d = new DirectedSegment(point, dirSeg.endpt1)
	if 0 < angle(d, dirSeg) < Math.PI
		return "left"

	return "right"


inside = (pt, LAV) -> 							# returns true iff point is strictly inside the region defined by LAV if it were positively oriented
	r = Math.random()
	a = new Point(1,r)
	l = new LineOrRay(pt, pt.plus(a), true)
	count = 0
	for nood in LAV.nodesList
		e = nood.content.outEdge	
		if intersect(l, e)?
			count = count + 1

	if count%2 == 0
		insideness = -1
	else
		insideness = 1

	if insideness * LAV.orientation() == 1
		return true
	return false

# orientation functions in class defs
# in CDLL -- reverse, isInside, positiveOrient
# in SLAV -- reverse, orient, antiOrient	
# inside is all wrong !!



# CENTER = new Point(3.5, 3)
# PAPERVERTEX1 = new Point(0,0)
# PAPERVERTEX2 = new Point(7,0)
# PAPERVERTEX3 = new Point(7,6)
# PAPERVERTEX4 = new Point(0,6)
# PAPEREDGE1 = new GraphEdge(PAPERVERTEX1, PAPERVERTEX2)
# PAPEREDGE2 = new GraphEdge(PAPERVERTEX2, PAPERVERTEX3)
# PAPEREDGE3 = new GraphEdge(PAPERVERTEX3, PAPERVERTEX4)
# PAPEREDGE4 = new GraphEdge(PAPERVERTEX4, PAPERVERTEX1)

# # straight skeleton
# [e, v, i, gV, gE] = straightSkeleton([A,B,C,D,E,F,G,A])

# # computePerps
# [e, v, i, gV, gE, perps, iPerps, qSV, qGV] = computePerps(e, v, i, gV, gE)

# # check the crease pattern
# # console.log "lengths of e, v, i, gV, gE, perps, iPerps, qSV, qGV: "
# # console.log e.length + ", " + v.length + ", " + i.length + ", " + gV.length + ", " + gE.length + ", " + perps.length + ", " + iPerps.length + ", " + qSV.length + ", " + qGV.length + "."

# # s = ""
# # for skelE in e
# # 	s = s + skelE.print() + ", "
# # console.log "skelEdges (e) : " + s

# # s = ""
# # for skelV in v
# # 	s = s + skelV.print() + ", "
# # console.log "skelVtxs (v) : " + s

# # s = ""
# # for infE in i
# # 	s = s + infE.print() + ", "
# # console.log "infEdges (i) : " + s

# # s = ""
# # for gVert in gV
# # 	s = s + gVert.print() + ", "
# # console.log "gVtxs (gV) : " + s

# # s = ""
# # for gEdge in gE
# # 	s = s + gEdge.print() + ", "
# # console.log "gEdges (gE) : " + s

# # s = ""
# # for per in perps
# # 	s = s + per[0].print() + ", "
# # console.log "perps (perps) : " + s

# # s = ""
# # for infPerp in iPerps
# # 	s = s + infPerp[0].print() + ", "
# # console.log "infPerps (iPerps) : " + s

# # s = ""
# # for qsv in qSV
# # 	s = s + qsv[0].print() + ", "
# # console.log "quasiSkelVtxs (qSV) : " + s

# # s = ""
# # for qgv in qGV
# # 	s = s + qgv[0].print() + ", "
# # console.log "quasiGraphVtxs (qGV) : " + s

# # convert to CreasePattern
# CP = convert(e, v, i, gV, gE, perps, iPerps, qSV, qGV)

# # check the conversion
# console.log "These are the " + CP.cPVs.length + " vertices in CP"
# for vertex in CP.cPVs
# 	console.log vertex.printFull()
# console.log "These are the " + CP.cPEs.length + " edges in CP"
# for edge in CP.cPEs
# 	console.log edge.printFull()

# # foldedState
# [CPfaces, facesRelations, shady, root] = foldedState(CP)
# # CPfaces, CPRelations, and CP should contain all the info you want :3

# # check the folded state
# for face in CPfaces
# 	console.log " ---- FACE ----"
# 	console.log " ---- vertices : ---- "
# 	for v in face[0]
# 		console.log v.print()
# 	console.log " ---- edges: ---- "
# 	for e in face[1]
# 		console.log e.print()


# console.log "~~~~ Folding it up! ~~~~"

# fold(CP, shady, root)

# console.log "Positions of the vertices now: "
# for vert in CP.cPVs
# 	console.log "*" + vert.printFull()

# CP.toggleFold()

# console.log "Now it should be unfolded: "
# for vert in CP.cPVs
# 	console.log "*" + vert.printFull()

# console.log "testing CreasePattern"

# A = new CreasePatternVertex(0, 6, "boundarySkel")
# B = new CreasePatternVertex(0, 0, "boundarySkel")
# C = new CreasePatternVertex(7, 0, "boundarySkel")
# D = new CreasePatternVertex(7, 6, "boundarySkel")
# E = new CreasePatternVertex(1, 5, "graph")
# F = new CreasePatternVertex(1, 1, "graph")
# G = new CreasePatternVertex(6, 1, "graph")
# H = new CreasePatternVertex(6, 5, "graph")
# I = new CreasePatternVertex(3, 3, "skeleton")
# J = new CreasePatternVertex(4, 3, "skeleton")
# K = new CreasePatternVertex(4, 6, "boundaryPerp", J)
# L = new CreasePatternVertex(3, 6, "boundaryPerp", I)
# M = new CreasePatternVertex(0, 3, "boundaryPerp", I)
# N = new CreasePatternVertex(3, 0, "boundaryPerp", I)
# O = new CreasePatternVertex(4, 0, "boundaryPerp", J)
# P = new CreasePatternVertex(7, 3, "boundaryPerp", J)
# Q = new CreasePatternVertex(4, 5, "quasiGraph", J)
# R = new CreasePatternVertex(3, 5, "quasiGraph", I)
# S = new CreasePatternVertex(1, 3, "quasiGraph", I)
# T = new CreasePatternVertex(3, 1, "quasiGraph", I)
# U = new CreasePatternVertex(4, 1, "quasiGraph", J)
# V = new CreasePatternVertex(6, 3, "quasiGraph", J)

# AM = new CreasePatternEdge(A, M, "boundary")
# MB = new CreasePatternEdge(M, B, "boundary")
# BN = new CreasePatternEdge(B, N, "boundary")
# NO = new CreasePatternEdge(N, O, "boundary")
# OC = new CreasePatternEdge(O, C, "boundary")
# CP = new CreasePatternEdge(C, P, "boundary")
# PD = new CreasePatternEdge(P, D, "boundary")
# DK = new CreasePatternEdge(D, K, "boundary")
# KL = new CreasePatternEdge(K, L, "boundary")
# LA = new CreasePatternEdge(L, A, "boundary")

# ES = new CreasePatternEdge(E, S, "graph")
# SF = new CreasePatternEdge(S, F, "graph")
# FT = new CreasePatternEdge(F, T, "graph")
# TU = new CreasePatternEdge(T, U, "graph")
# UG = new CreasePatternEdge(U, G, "graph")
# GV = new CreasePatternEdge(G, V, "graph")
# VH = new CreasePatternEdge(V, H, "graph")
# HQ = new CreasePatternEdge(H, Q, "graph")
# QR = new CreasePatternEdge(Q, R, "graph")
# RE = new CreasePatternEdge(R, E, "graph")

# AE = new CreasePatternEdge(A, E, "skeleton")
# EI = new CreasePatternEdge(E, I, "skeleton")
# IF = new CreasePatternEdge(I, F, "skeleton")
# FB = new CreasePatternEdge(F, B, "skeleton")
# IJ = new CreasePatternEdge(I, J, "skeleton")
# JH = new CreasePatternEdge(J, H, "skeleton")
# HD = new CreasePatternEdge(H, D, "skeleton")
# JG = new CreasePatternEdge(J, G, "skeleton")
# GC = new CreasePatternEdge(G, C, "skeleton")

# LR = new CreasePatternEdge(L, R, "perp", I)
# RI = new CreasePatternEdge(R, I, "perp", I)
# IT = new CreasePatternEdge(I, T, "perp", I)
# TN = new CreasePatternEdge(T, N, "perp", I)
# IS = new CreasePatternEdge(I, S, "perp", I)
# SM = new CreasePatternEdge(S, M, "perp", I)
# JQ = new CreasePatternEdge(J, Q, "perp", J)
# QK = new CreasePatternEdge(Q, K, "perp", J)
# JV = new CreasePatternEdge(J, V, "perp", J)
# VP = new CreasePatternEdge(V, P, "perp", J)
# JU = new CreasePatternEdge(U, J, "perp", J)
# UO = new CreasePatternEdge(U, O, "perp", J)

# vtxs = [A, B, C, D, E, F, G, H, I , J, K, L, M, N, O, P, Q, R, S, T, U, V]
# edges = [AM, MB, BN, NO, OC, CP, PD, DK, KL, LA, ES, SF, FT, TU, UG, GV, VH, HQ, QR, RE, AE, EI, IF, FB, IJ, JH, HD, JG, GC, LR, RI, IT, TN, IS, SM, JQ, QK, JV, VP, JU, UO]

# CrP = new CreasePattern(vtxs, edges, CENTER)

# corLA = new Corridor(CrP, LA, A, L)
# corMB = new Corridor(CrP, MB, B, M)
# corOC = new Corridor(CrP, OC, C, O)
# corPD = new Corridor(CrP, PD, D, P)
# corKL = new Corridor(CrP, KL, L, K)

# vertices = [I, J]
# shadowEdges = [corLA, corMB, corOC, corPD, corKL]
# shady = new OrientedMetricTree(vertices, shadowEdges)

# console.log shady.isEdge(I, J)
# console.log "distance = " + shady.distance(I, J)
# console.log "tree distance = " + shady.treeDistance(I, J)

# p = shady.findPath(I, J)
# s = ""
# for v in p
# 	s = s + v.print() + " --> " 

# console.log "Path from I to J : " + s

# console.log "Testing orientation of I"
# neighborEdges = shady.orientation(I)
# for e in neighborEdges
# 	console.log e.print()

# console.log "Testing orientation of J"
# neighborEdges = shady.orientation(J)
# for e in neighborEdges
# 	console.log e.print()
# A = new Point(0, 0)
# B = new Point(10, 0)
# C = new Point(13, 5)
# D = new Point(4, 14)

# EXAMPLES: (good things)

# non-convex example

# A = new Point(0,0)
# B = new Point(5,3)
# C = new Point(14,0)
# D = new Point(14,6)
# E = new Point(0,6)

# Another example
# A = new Point(0, 0)
# B = new Point(3, 4)
# C = new Point(7, 0)
# D = new Point(9, 6)
# E = new Point(13, 0)
# F = new Point(13, 10)
# G = new Point(0, 10)

# multiple split example
# A = new Point(0, 0)
# B = new Point(3, 6)
# C = new Point(4, 0)
# D = new Point(6, 8)
# E = new Point(9, 0)
# F = new Point(9, 11)
# G = new Point(0, 11)

# Fuck
# A = new Point(266, 157.4375)
# B = new Point(480, 346.4375)
# C = new Point(671, 163.4375)
# D = new Point(568, 226.4375)

# clickSeq = [A,B,C,D,A]
# # # mySLAV = stepOneAB(clickSeq)[0]
# # # console.log mySLAV.printContents()

# # straightSkeleton(clickSeq)
# [CP, CPfaces, facesRelations] = foldAndCut(clickSeq)

# console.log "Positions of the vertices now: "
# for vert in CP.cPVs
# 	console.log "*" + vert.printFull()

# CP.toggleFold()

# console.log "Now it should be unfolded: "
# for vert in CP.cPVs
# 	console.log "*" + vert.printFull()
rect = canvas.getBoundingClientRect()
a = rect.left
b = rect.top
c = rect.bottom

$(document).ready(f = ->
	clickSeq = []
	start = null
	previous = null


	# the thing in parenthesis executes every time the canvas is clicked
	# I think I should have another thing for when the mouse is down, right? :3
	$("#myCanvas").click(g = (e)->
		x = e.pageX - a
		y = c - e.pageY

		P = new Point(x, y)

		if start == null
			start = P
			previous = P
		else			
			if dist(P, start) < 4
				closed = true

				# draw a line between previous and start
				ctx.moveTo(previous.x, c-b-previous.y)
				ctx.lineTo(start.x, c-b-start.y)
				ctx.stroke()
				previous = null

				clickSeq.push(start)
				start = null

		if !closed
			# draw a line between previous and P if it's not the first
			if previous != P
				ctx.moveTo(previous.x, c-b-previous.y)
				ctx.lineTo(P.x, c-b-P.y)
				ctx.stroke()
				previous = P

			clickSeq.push(P)

			# draw the point
			document.getElementById("coords").innerHTML = P.print()
			ctx.beginPath()
			ctx.arc(x, c-y-b,4,0,2*Math.PI)
			ctx.stroke()

		if start == null
			s = ""
			for click in clickSeq
				s = s + click.print() + ", "

			document.getElementById("clicks").innerHTML = s

			[skelEdges, skelVtxs, infEdges, gVtxs, gEdges] = straightSkeleton(clickSeq)

			# [CP, CPfaces, facesRelations] = foldAndCut(clickSeq)

			# console.log "Positions of the vertices now: "
			# for vert in CP.cPVs
			# 	console.log "*" + vert.printFull()

			# CP.toggleFold()

			# console.log "Now it should be unfolded: "
			# for vert in CP.cPVs
			# 	console.log "*" + vert.printFull()

	)
)