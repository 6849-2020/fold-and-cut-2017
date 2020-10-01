
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
					newCorr = new Corridor(CP, e, v, w)
					corridors.push(newCorr)

			if v.type != "boundaryPerp" and w.type == "boundaryPerp"
				newCorr = new Corridor(CP, e, v, w)
				done = false
				if newCorr.numOfWalls == 2
					for corr in corridors
						if (corr.C1 == newCorr.C1 and corr.C2 == newCorr.C2) or (corr.C2 == newCorr.C1 and corr.C1 == newCorr.C2)
							done = true
							break
				if !(done)
					corridors.push(newCorr)

			if w.type != "boundaryPerp"
				continue

	# for corrOne in corridors
	# 	for corrTwo in corridors
	# 		if corrOne != corrTwo 
	# 			if corrOne.numOfWalls == 2 and corrTwo.numOfWalls == 2
	# 				if (corrOne.C1 == corrTwo.C1 and corrOne.C2 == corrTwo.C2) or (corrOne.C2 == corrTwo.C1 and corrOne.C1 == corrTwo.C2)
	# 					alert "uh oh"

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

			needSwitch = false
			checkIndex = (i+1)%n

			while checkIndex != j
				checkCorr = neighborCircleSK[checkIndex]
				if checkCorr.numOfWalls > 1
					needSwitch = true
					break
				checkIndex = (checkIndex + 1)%n

			if needSwitch
				tmp = corr1
				corr1 = corr2
				corr2 = tmp
				tmpInd = i
				i = j
				j = tmpInd

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
				for fac in corr1.faces
					if e in fac[1]
						break

				gluedInd = corr1.gluedIndex(fac)

				if sk == corr1.C2
					lastFace = corr1.faces[corr1.faces.length - 1]
					numOfGluedFaces = corr1.gluedIndex(lastFace)
					gluedInd = numOfGluedFaces - gluedInd


				if gluedInd%2 == 0
					e.assign("v")
				else
					e.assign("m")

			else
				e.assign("f") # flat

			# if sk = root and the edges are at the split, the above assignment is wrong, we reassign
			if sk == root and j < i
				if e.assignment == "m"
					e.assign("v")
				else
					e.assign("m")

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

	for corr in corridors
		CPfaces = CPfaces.concat(corr.faces)
		facesRelations = facesRelations.concat(corr.faceRelations())
		corr.assignAll()
			# NOTE : [face1, face2, 1] means that relative to face1's orientation, face2 is above face1
			# this disagrees with FOLD... although it might not even matter here

	return [CPfaces, facesRelations, shady, root]









