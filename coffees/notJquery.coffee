printClickSequence = (clickSeq) ->
	s = ""
	if clickSeq.length == 1
		document.getElementById("clicks").innerHTML = s
		return
	for i in [0..(clickSeq.length - 1)]
		click = clickSeq[i]
		if click == "marker"
			s = s + "~ "
		else
			if clickSeq[i+1] == "marker"
				s = s + click.print() + " "
			else
				s = s + click.print() + ", "

	document.getElementById("clicks").innerHTML = s

# removeMarkers also randomly perturbs the points by a little
removeMarkers = (clickSequence) ->
	# remove "marker" from clickSeq
	modifiedClickSeq = []
	start = null
	for i in [0..(clickSequence.length - 1)]
		point = clickSequence[i]
		if point != "marker"
			perturbedPoint = new Point(point.x + Math.random()*0.01 - 0.005, point.y + Math.random()*0.01 - 0.005)
			if start == null
				start = perturbedPoint

			if clickSequence[i+1] == "marker"
				modifiedClickSeq.push(start)
				start = null
			else
				modifiedClickSeq.push(perturbedPoint)

	return modifiedClickSeq

draw = (clickSequence) ->
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	# draw the things all over again
	for i in [0..(clickSequence.length-1)]
		point = clickSequence[i]
		if point == "marker"
			continue

		if clickSequence[i-1] != "marker"
			ctx.beginPath()
			ctx.arc(point.x, c-point.y-b,3,0,2*Math.PI)
			ctx.fillStyle = "green"
			ctx.fill()

			previous = clickSequence[i-1]
			ctx.moveTo(previous.x, c-b-previous.y)
			ctx.lineTo(point.x, c-b-point.y)
			ctx.stroke()

	return

drawPoint = (x, y) ->
	ctx.beginPath()
	ctx.arc(x, c - y - b, 3, 0, 2*Math.PI)
	ctx.fillStyle = "orange"
	ctx.fill()
	ctx.strokeStyle = "black"
	ctx.stroke()

drawCPEdge = (edge, show) ->
	endpt1 = edge.endpt1
	endpt2 = edge.endpt2

	ctx.beginPath()
	ctx.moveTo(endpt1.x, c-endpt1.y-b)
	ctx.lineTo(endpt2.x, c-endpt2.y-b)

	if edge.assignment == "m"
		ctx.strokeStyle = "red"
	else
		if edge.assignment == "v"
			ctx.strokeStyle = "blue"
		else
			if edge.assignment == "u"
				ctx.strokeStyle = "purple"
			else
				if edge.type == "graph" or edge.type == "boundary" or !(edge.type?)
					ctx.strokeStyle = "black"
				else 
					if show
						ctx.strokeStyle = "green"
					else
						ctx.strokeStyle = "white"

	if edge.type == "graph" or !(edge.type?)
		ctx.lineWidth = 2
	else
		ctx.lineWidth = 0.7
	if ctx.strokeStyle != "white"
		ctx.stroke()

testOutputFunction = (clickSeq, show, skeletonOnly) ->
	if skeletonOnly
		[skelEdges, skelVtxs, infEdges, gVtxs, gEdges] = straightSkeleton(removeMarkers(clickSeq))
		tmpSkeleton = []
		for skelv in skelVtxs
			tmpSkeleton.push(skelv[0])

		CP = convert(skelEdges, tmpSkeleton, infEdges, gVtxs, gEdges, [], [], [], [])
		drawSkeleton(CP, gEdges, show)

	else	
		[CP, CPFaces, facesRelations, gEdges, tooManyPerps] = foldAndCut(removeMarkers(clickSeq))
		drawCreasePattern(CP, gEdges, show)

		if !tooManyPerps
			text = exportToFOLD(CP, CPFaces, facesRelations)
		else
			text = ""
			
		$("a#programatically").click( ->
		    	now = text
		   		this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(now);
		)

		# console.log text
	

drawCreasePattern = (CP, gEdges, show) ->
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.strokeStyle = "green"
	ctx.lineWidth = 6
	ctx.strokeRect(0, 0, canvas.width, canvas.height)

	ctx.lineWidth = 1
	ctx.strokeStyle = "black"

	for cpEdge in CP.cPEs 
		drawCPEdge(cpEdge, show)

	for cute in gEdges
		drawCPEdge(cute)

	for cpVertex in CP.cPVs
		if cpVertex.type == "graph" # or cpVertex.type == "quasiGraph"
			x = cpVertex.x
			y = cpVertex.y
			drawPoint(x, y)

drawSkeleton = (CP, gEdges, show) ->
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.strokeStyle = "green"
	ctx.lineWidth = 6
	ctx.strokeRect(0, 0, canvas.width, canvas.height)

	ctx.lineWidth = 1
	ctx.strokeStyle = "black"

	for cpEdge in CP.cPEs 
		if cpEdge.type == "skeleton"
			endpt1 = cpEdge.endpt1
			endpt2 = cpEdge.endpt2

			ctx.beginPath()
			ctx.moveTo(endpt1.x, c-endpt1.y-b)
			ctx.lineTo(endpt2.x, c-endpt2.y-b)

			ctx.strokeStyle = "purple"
			ctx.lineWidth = 0.7
			ctx.stroke()

	for cute in gEdges
		drawCPEdge(cute)

	for cpVertex in CP.cPVs 
		if cpVertex.type == "graph"
			x = cpVertex.x
			y = cpVertex.y
			drawPoint(x, y)

stringToClickSeq = (str) ->
	clickSeq = []
	start = null
	i = 0
	while i < str.length
		char = str[i]
		if char == "~"
			if clickSeq.length > 0
				clickSeq.splice(clickSeq.length - 1, 1)
				clickSeq.push(start)


			clickSeq.push("marker")
			start = null
			i = i + 1
			continue

		if char == "," or char == " " or char == "(" or char == ")"
			i = i + 1
			continue

		if 48 <= char.charCodeAt(0) <= 57 or char == "."
			num1 = ""
			while 48 <= char.charCodeAt(0) <= 57 or char == "."
				num1 = num1 + char
				i = i + 1
				char = str[i]

			i = i + 1
			char = str[i]
			while char == " "
				i = i + 1
				char = str[i]

			num2 = ""
			while 48 <= char.charCodeAt(0) <= 57 or char == "."
				num2 = num2 + char
				i = i + 1
				char = str[i]

			i = i + 1

			x = Number(num1)
			y = Number(num2)

			P = new Point(x, y)
			if start == null
				start = P

			clickSeq.push(P)

	return clickSeq

# Export to FOLD and do stuff
exportToFOLD = (CP, CPFaces, facesRelations) ->
	# do something here
	s = '{
	  "file_spec": 1, \n
	  "file_classes": ["singleModel"],\n
	  "frame_title": "Fold-and-Cut crease pattern",\n
	  "frame_classes": ["creasePattern"],\n
	  "frame_attributes": ["2D"],\n
	  "vertices_coords": ['
	for i in [0..(CP.cPVs.length - 1)]
		v = CP.cPVs[i]
		s = s + '[' + v.x + ',' + v.y + ', 0]'
		if i < CP.cPVs.length - 1
			s = s + ','
	s = s + '], \n "edges_vertices": ['

	for i in [0..(CP.cPEs.length - 1)]
		e = CP.cPEs[i]
		p1 = e.endpt1
		p2 = e.endpt2
		s = s + '[' + CP.cPVs.indexOf(p1) + ',' + CP.cPVs.indexOf(p2) + ']'
		if i < CP.cPEs.length - 1
			s = s + ','

	s = s + '], \n "edges_assignment": ['
	for i in [0..(CP.cPEs.length - 1)]
		e = CP.cPEs[i]
		s = s + '"' + e.assignment.toUpperCase() + '"'
		if i < CP.cPEs.length - 1
			s = s + ','

	s = s + '], \n "faces_vertices": ['
	for i in [0..CPFaces.length - 1]
		fac = CPFaces[i]
		vertices = fac[0]
		s = s + '['
		for j in [0..(vertices.length - 1)]
			v = vertices[j]
			s = s + CP.cPVs.indexOf(v)
			if j < vertices.length - 1
				s = s + ','
		s = s + ']'
		if i < CPFaces.length - 1
			s = s + ','

	# s = s + '], \n "faceOrders": ['
	# for i in [0..facesRelations.length - 1]
	# 	[f, g, o] = facesRelations[i]
	# 	s = s + '[' + CPFaces.indexOf(g) + ', ' + CPFaces.indexOf(f) + ', ' + o + ']'
	# 	if i < facesRelations.length - 1
	# 		s = s + ','

	s = s + ']}'
	return s
