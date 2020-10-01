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

	toggleFold : -> # switches between the folded state and the flat state, remembering both
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
	# THIS ASSUMES vtx2 is a boundaryPerp!!
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

		# @C2 is right, @C1 might be wrong

		# start building the corridor
		# if @numOfWalls == 1
		# 	# doubleLayered says whether the corridor has cut edges in it or not
		# 	doubleLayered = false

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
					if e.component == @C2
						@wall2_Vtxs.push(v)
						@wall2_Edges.push(e)
					else 
						@wall1_Vtxs.push(v)
						@wall1_Edges.push(e)
				else
					@nonWallEdges.push(e)

				[e, v] = CP.rotateCW2(e, v)

				if v == start
					break

			@faces.push([faceV, faceE])
			faceSize = faceV.length
			faceV = []
			faceE = []

			v = otherVertex(v, e)
			[e, v] = CP.rotateCCW2(e, v)
			if faceSize == 3 and e.type != "perp"
				start = v
			else
				[e, v] = CP.rotateCCW2(e, v)
				# new shit
				if e.type == "perp"
					[e, v] = CP.rotateCCW2(e, v)
				# end new shit
				start = v	

			if e.type == "boundary"
				if v == e.endpt1
					v = e.endpt2
				else
					v = e.endpt1

				if v.component == @C2
					@wall2_Vtxs.push(v)
				else
					@wall1_Vtxs.push(v)

				break

		if @wall1_Vtxs.length > 0
			rep = @wall1_Vtxs[0]
			@C1 = rep.component

		if @C1? and @C2? and @C1 != @C2
			@numOfWalls = 2
		else
			@numOfWalls = 1

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
