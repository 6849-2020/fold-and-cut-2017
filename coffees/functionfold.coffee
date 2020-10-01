

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
	# CP.toggleFold()

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

	# fuck I took out the graph edges >:[
	# for edge in corr.nonWallEdges
	# 	if edge.type == "graph"
	# 		base = edge
	# 		break

	for doubleFace in corr.faces
		faceGraphVs = []
		for graphV in doubleFace[0]
			if graphV.type == "quasiGraph" or graphV.type == "graph"
				faceGraphVs.push(graphV)
		if faceGraphVs.length == 2
			base = new CreasePatternEdge(faceGraphVs[0], faceGraphVs[1], "graph", null, "f") # probably do not need all this info

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