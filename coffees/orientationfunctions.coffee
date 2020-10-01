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



