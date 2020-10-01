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
 			s = s + nood.content.print() + "\n "
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

																

