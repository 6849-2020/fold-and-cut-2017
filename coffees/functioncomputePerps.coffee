computePerps = (skelEdges, skelVtxs, infEdges, gVtxs, gEdges) ->
	perps = []
	infPerps = []
	quasiSkelVtxs = []
	quasiGraphVtxs = []

	tooManyPerps = false

	# remember the original skelEdges and infEdges
	oldSkels = []
	for skele in skelEdges
		oldSkels.push(skele)
	oldInfs = []
	for skeli in infEdges
		oldInfs.push(skeli)

	tmpSkeleton = []
	for skelV in skelVtxs
		v = skelV[0]

		tmpSkeleton.push(v)

		for index in [1..3]
			e = skelV[index] 		# oh I think skelV is just an array of 4 things

			if leaveFaceTest(v, e, skelVtxs, oldSkels, oldInfs)
				continue	

			ray = perp(v, e)
			if ray.dir.x == 0 and ray.dir.y == 0
				alert "line 31 dir = (0, 0)"

			count = 0 # only drop 40 perpendiculars, to avoid infinite perpendicular case

			type = "s"
			while type != "none" and (count < 40)
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

				count = count + 1
				if count == 40
					tooManyPerps = true

	skelVtxs = tmpSkeleton # replace skelVtxs with just the points
	
	return [skelEdges, tmpSkeleton, infEdges, gVtxs, gEdges, perps, infPerps, quasiSkelVtxs, quasiGraphVtxs, tooManyPerps]
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
	# want the origin to be pt, which we already computed

	ft = foot(ray.origin, line(edge))

	reflection = ft.plus(ft).minus(ray.origin)

	ray.origin = pt
	ray.dir = reflection.minus(pt)

	return type

# faceContaining_Edges = (ray, skelVtxs, gEdge, infEdges) ->


leaveFaceTest = (v, e, skelVtxs, oldSkels, oldInfs) ->
	face_vertices = [e.endpt1, e.endpt2]
	for fancyV in skelVtxs
		vert = fancyV[0]
		for i in [1..3]
			if e.isEqualTo(fancyV[i])
				face_vertices.push(vert)
				break

	face_edges = [e]
	for skele in oldSkels
		if (skele.endpt1 in face_vertices) and (skele.endpt2 in face_vertices)
			face_edges.push(skele)

	for skeli in oldInfs
		if (skeli.origin in face_vertices) and (side(skeli.origin.plus(skeli.dir), e) == "left")
			face_edges.push(skeli)

	ray = perp(v, e)

	leaving = true
	for segOrRay in face_edges
		if segOrRay.isSegment?
			if segOrRay.endpt1 == v or segOrRay.endpt2 == v
				continue

		if segOrRay.isRay
			if segOrRay.origin == v
				continue

		if intersect(ray, segOrRay)?
			leaving = false

	return leaving







