
foldAndCut = (clickSeq) ->
	# straight skeleton
	[e, v, i, gV, gE] = straightSkeleton(clickSeq)

	console.log "straight skeleton finished"

	# computePerps
	[e, v, i, gV, gE, perps, iPerps, qSV, qGV, tooManyPerps] = computePerps(e, v, i, gV, gE)

	console.log "computePerps finished"

	# convert to CreasePattern
	CP = convert(e, v, i, gV, gE, perps, iPerps, qSV, qGV)

	console.log "convert finished"

	# foldedState assigns mountains, values, and computes facesRelatiosn
	if !tooManyPerps
		[CPfaces, facesRelations, shady, root] = foldedState(CP)
	# CPfaces, CPRelations, and CP should contain all the info you want :3

	# fold it up
		#fold(CP, shady, root)

	return[CP, CPfaces, facesRelations, gE, tooManyPerps]

