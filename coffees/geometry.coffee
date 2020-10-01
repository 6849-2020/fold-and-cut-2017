# geo classes

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

		if @dir.x == 0 and @dir.y == 0
			console.log "ray has direction (0,0) very bad!"
			alert "ray has direction (0,0) very bad!"

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
