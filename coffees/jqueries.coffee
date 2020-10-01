FOLD = require('fold')
rect = canvas.getBoundingClientRect()

a = rect.left
b = rect.top
c = rect.bottom

$(document).ready(->
	clickSeq = ["marker"]
	start = null
	previous = null
	repeat = null

	show = false # show flat creases
	live = true # update live (kind of slow sometimes)
	skeletonOnly = false # debugging only show skeleton

	CP = new CreasePattern()
	gEdges = []
	text = ""

	if show
		document.getElementById("toggle").innerHTML = "Unused creases ON"
	else
		document.getElementById("toggle").innerHTML = "Unused creases OFF"

	if live
		document.getElementById("live").innerHTML = "Live computation ON"
	else
		document.getElementById("live").innerHTML = "Live computation OFF"

	if skeletonOnly
		document.getElementById("skeleton").innerHTML = "Skeleton only ON"
	else
		document.getElementById("skeleton").innerHTML = "Skeleton only OFF"

	# drawing polygon
	$("#myCanvas").mouseup((e)->
		$("#myCanvas").unbind("mousemove")
			# at the end set repeat to null again
		if repeat?
			repeat = null
		else
		#indent below
			x = e.pageX - a
			y = c - e.pageY

			P = new Point(x, y)

			if start == null
				start = P
				previous = P
				# note P / start is pushed into clickSeq in the next block (if !closed ...)
			else			
				if dist(P, start) < 6
					closed = true

					# draw a line between previous and start
					ctx.moveTo(previous.x, c-b-previous.y)
					ctx.lineTo(start.x, c-b-start.y)
					ctx.stroke()
					previous = null

					clickSeq.push(start)
					clickSeq.push("marker")
					start = null

			if !closed
				# draw a line between previous and P if it's not the first
				if previous != P
					ctx.beginPath()
					ctx.moveTo(previous.x, c-b-previous.y)
					ctx.lineTo(P.x, c-b-P.y)
					ctx.lineWidth = 1
					ctx.strokeStyle = "black"
					ctx.stroke()
					previous = P

				clickSeq.push(P)

				# draw the point
				ctx.beginPath()
				ctx.arc(x, c-y-b,3,0,2*Math.PI)
				ctx.fillStyle = "green"
				ctx.fill()

		if start == null
			printClickSequence(clickSeq)

			if live
				testOutputFunction(clickSeq, show, skeletonOnly)

		$("#myCanvas").mousemove((e) ->
			x = e.pageX - a
			y = c - e.pageY
			document.getElementById("coords").innerHTML = "(" + x + ", " + y + ")"
		)
	)

	# changing polygon
	$("#myCanvas").mousedown((e) ->
		$("#myCanvas").unbind("mousemove")

		x = e.pageX - a
		y = c - e.pageY

		P = new Point(x, y)
		if start == null
		# you can't change points when you're in the middle of a polygon
			for point in clickSeq
				if point == "marker"
					continue
				if dist(P, point) < 4
					repeat = point
					break

		
		$("#myCanvas").mousemove((e) ->
			if !(repeat?)
				return
			x = e.pageX - a
			y = c - e.pageY

			document.getElementById("coords").innerHTML = "(" + x + ", " + y + ")"

			repeat.x = x
			repeat.y = y
			draw(clickSeq)
		)
	)

	# abort polygon esc
	$(document).keydown((e) ->
		if e.which == 27 # esc
			while clickSeq[clickSeq.length - 1] != "marker"
				clickSeq.splice((clickSeq.length - 1), 1)

			start = null
			previous = null

			printClickSequence(clickSeq)
			if live
				testOutputFunction(clickSeq, show, skeletonOnly)
	)

	# delete polygon x
	$(document).keydown((e) ->
		if start == null and e.which == 88 # x
			if clickSeq.length > 1

				# remove the last polygon
				clickSeq.splice(clickSeq.length - 1)
				while clickSeq[clickSeq.length - 1] != "marker"
					clickSeq.splice((clickSeq.length - 1), 1)

				# print + draw stuff
				printClickSequence(clickSeq)
				if live
					testOutputFunction(clickSeq, show, skeletonOnly)
	)

	# skeleton only
	$("#skeleton").click((e) ->
		if skeletonOnly 
			skeletonOnly = false
			document.getElementById("skeleton").innerHTML = "Skeleton only OFF"
		else
			skeletonOnly = true
			document.getElementById("skeleton").innerHTML = "Skeleton only ON"

		if live
			testOutputFunction(clickSeq, show, skeletonOnly)
	)

	# live computing
	$("#live").click((e) ->
		if live
			live = false
			document.getElementById("live").innerHTML = "Live computation OFF"
		else
			live = true
			document.getElementById("live").innerHTML = "Live computation ON"

		if live
			testOutputFunction(clickSeq, show, skeletonOnly)
	)

	# unused creases
	$("#toggle").click( (e) ->
		if show
			show = false
		else
			show = true

		testOutputFunction(clickSeq, show, skeletonOnly)
	)

	# show coordinates
	$("#myCanvas").mousemove((e) ->
		x = e.pageX - a
		y = c - e.pageY
		document.getElementById("coords").innerHTML = "(" + x + ", " + y + ")"
	)

	# manual input
	$("#manual").click( ->
		clickSeq = stringToClickSeq($("input:text").val())

		printClickSequence(clickSeq)
		if live
			testOutputFunction(clickSeq, show, skeletonOnly)
	)
	
	$("a#programatically").click( ->
	    	now = text
	   		this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(now);
		)
)

# http://stackoverflow.com/questions/14121417/can-i-use-jquery-to-create-a-file-and-its-content-dynamically

# $ ->
# 	text = exportToFOLD(null, null, null)
# 	el = $("#demaineview")[0]
# 	opts =
# 		viewButtons: true
# 		axisButtons: true
# 		attrViewer: true
# 		examples: false
# 		import: false
# 		export: false
# 		properties: false
# 	view = FOLD.viewer.addViewer(el, opts)
# 	FOLD.viewer.processInput(text, view)
# 	console.log "Still alive"
