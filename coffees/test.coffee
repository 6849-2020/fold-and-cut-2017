# CENTER = new Point(3.5, 3)
# PAPERVERTEX1 = new Point(0,0)
# PAPERVERTEX2 = new Point(7,0)
# PAPERVERTEX3 = new Point(7,6)
# PAPERVERTEX4 = new Point(0,6)
# PAPEREDGE1 = new GraphEdge(PAPERVERTEX1, PAPERVERTEX2)
# PAPEREDGE2 = new GraphEdge(PAPERVERTEX2, PAPERVERTEX3)
# PAPEREDGE3 = new GraphEdge(PAPERVERTEX3, PAPERVERTEX4)
# PAPEREDGE4 = new GraphEdge(PAPERVERTEX4, PAPERVERTEX1)

# A = new Point(0, 0)
# B = new Point(10, 0)
# C = new Point(13, 5)
# D = new Point(4, 14)

# EXAMPLES: (good things)

# non-convex example

# A = new Point(0,0)
# B = new Point(5,3)
# C = new Point(14,0)
# D = new Point(14,6)
# E = new Point(0,6)

# Another example
# A = new Point(0, 0)
# B = new Point(3, 4)
# C = new Point(7, 0)
# D = new Point(9, 6)
# E = new Point(13, 0)
# F = new Point(13, 10)
# G = new Point(0, 10)

# multiple split example
# A = new Point(0, 0)
# B = new Point(3, 6)
# C = new Point(4, 0)
# D = new Point(6, 8)
# E = new Point(9, 0)
# F = new Point(9, 11)
# G = new Point(0, 11)

# Fuck
# A = new Point(266, 157.4375)
# B = new Point(480, 346.4375)
# C = new Point(671, 163.4375)
# D = new Point(568, 226.4375)

# # straight skeleton
# [e, v, i, gV, gE] = straightSkeleton([A,B,C,D,E,F,G,A])

# # computePerps
# [e, v, i, gV, gE, perps, iPerps, qSV, qGV] = computePerps(e, v, i, gV, gE)

# # check the crease pattern
# # console.log "lengths of e, v, i, gV, gE, perps, iPerps, qSV, qGV: "
# # console.log e.length + ", " + v.length + ", " + i.length + ", " + gV.length + ", " + gE.length + ", " + perps.length + ", " + iPerps.length + ", " + qSV.length + ", " + qGV.length + "."

# # s = ""
# # for skelE in e
# # 	s = s + skelE.print() + ", "
# # console.log "skelEdges (e) : " + s

# # s = ""
# # for skelV in v
# # 	s = s + skelV.print() + ", "
# # console.log "skelVtxs (v) : " + s

# # s = ""
# # for infE in i
# # 	s = s + infE.print() + ", "
# # console.log "infEdges (i) : " + s

# # s = ""
# # for gVert in gV
# # 	s = s + gVert.print() + ", "
# # console.log "gVtxs (gV) : " + s

# # s = ""
# # for gEdge in gE
# # 	s = s + gEdge.print() + ", "
# # console.log "gEdges (gE) : " + s

# # s = ""
# # for per in perps
# # 	s = s + per[0].print() + ", "
# # console.log "perps (perps) : " + s

# # s = ""
# # for infPerp in iPerps
# # 	s = s + infPerp[0].print() + ", "
# # console.log "infPerps (iPerps) : " + s

# # s = ""
# # for qsv in qSV
# # 	s = s + qsv[0].print() + ", "
# # console.log "quasiSkelVtxs (qSV) : " + s

# # s = ""
# # for qgv in qGV
# # 	s = s + qgv[0].print() + ", "
# # console.log "quasiGraphVtxs (qGV) : " + s

# # convert to CreasePattern
# CP = convert(e, v, i, gV, gE, perps, iPerps, qSV, qGV)

# # check the conversion
# console.log "These are the " + CP.cPVs.length + " vertices in CP"
# for vertex in CP.cPVs
# 	console.log vertex.printFull()
# console.log "These are the " + CP.cPEs.length + " edges in CP"
# for edge in CP.cPEs
# 	console.log edge.printFull()

# # foldedState
# [CPfaces, facesRelations, shady, root] = foldedState(CP)
# # CPfaces, CPRelations, and CP should contain all the info you want :3

# # check the folded state
# for face in CPfaces
# 	console.log " ---- FACE ----"
# 	console.log " ---- vertices : ---- "
# 	for v in face[0]
# 		console.log v.print()
# 	console.log " ---- edges: ---- "
# 	for e in face[1]
# 		console.log e.print()


# console.log "~~~~ Folding it up! ~~~~"

# fold(CP, shady, root)

# console.log "Positions of the vertices now: "
# for vert in CP.cPVs
# 	console.log "*" + vert.printFull()

# CP.toggleFold()

# console.log "Now it should be unfolded: "
# for vert in CP.cPVs
# 	console.log "*" + vert.printFull()

# console.log "testing CreasePattern"

# A = new CreasePatternVertex(0, 6, "boundarySkel")
# B = new CreasePatternVertex(0, 0, "boundarySkel")
# C = new CreasePatternVertex(7, 0, "boundarySkel")
# D = new CreasePatternVertex(7, 6, "boundarySkel")
# E = new CreasePatternVertex(1, 5, "graph")
# F = new CreasePatternVertex(1, 1, "graph")
# G = new CreasePatternVertex(6, 1, "graph")
# H = new CreasePatternVertex(6, 5, "graph")
# I = new CreasePatternVertex(3, 3, "skeleton")
# J = new CreasePatternVertex(4, 3, "skeleton")
# K = new CreasePatternVertex(4, 6, "boundaryPerp", J)
# L = new CreasePatternVertex(3, 6, "boundaryPerp", I)
# M = new CreasePatternVertex(0, 3, "boundaryPerp", I)
# N = new CreasePatternVertex(3, 0, "boundaryPerp", I)
# O = new CreasePatternVertex(4, 0, "boundaryPerp", J)
# P = new CreasePatternVertex(7, 3, "boundaryPerp", J)
# Q = new CreasePatternVertex(4, 5, "quasiGraph", J)
# R = new CreasePatternVertex(3, 5, "quasiGraph", I)
# S = new CreasePatternVertex(1, 3, "quasiGraph", I)
# T = new CreasePatternVertex(3, 1, "quasiGraph", I)
# U = new CreasePatternVertex(4, 1, "quasiGraph", J)
# V = new CreasePatternVertex(6, 3, "quasiGraph", J)

# AM = new CreasePatternEdge(A, M, "boundary")
# MB = new CreasePatternEdge(M, B, "boundary")
# BN = new CreasePatternEdge(B, N, "boundary")
# NO = new CreasePatternEdge(N, O, "boundary")
# OC = new CreasePatternEdge(O, C, "boundary")
# CP = new CreasePatternEdge(C, P, "boundary")
# PD = new CreasePatternEdge(P, D, "boundary")
# DK = new CreasePatternEdge(D, K, "boundary")
# KL = new CreasePatternEdge(K, L, "boundary")
# LA = new CreasePatternEdge(L, A, "boundary")

# ES = new CreasePatternEdge(E, S, "graph")
# SF = new CreasePatternEdge(S, F, "graph")
# FT = new CreasePatternEdge(F, T, "graph")
# TU = new CreasePatternEdge(T, U, "graph")
# UG = new CreasePatternEdge(U, G, "graph")
# GV = new CreasePatternEdge(G, V, "graph")
# VH = new CreasePatternEdge(V, H, "graph")
# HQ = new CreasePatternEdge(H, Q, "graph")
# QR = new CreasePatternEdge(Q, R, "graph")
# RE = new CreasePatternEdge(R, E, "graph")

# AE = new CreasePatternEdge(A, E, "skeleton")
# EI = new CreasePatternEdge(E, I, "skeleton")
# IF = new CreasePatternEdge(I, F, "skeleton")
# FB = new CreasePatternEdge(F, B, "skeleton")
# IJ = new CreasePatternEdge(I, J, "skeleton")
# JH = new CreasePatternEdge(J, H, "skeleton")
# HD = new CreasePatternEdge(H, D, "skeleton")
# JG = new CreasePatternEdge(J, G, "skeleton")
# GC = new CreasePatternEdge(G, C, "skeleton")

# LR = new CreasePatternEdge(L, R, "perp", I)
# RI = new CreasePatternEdge(R, I, "perp", I)
# IT = new CreasePatternEdge(I, T, "perp", I)
# TN = new CreasePatternEdge(T, N, "perp", I)
# IS = new CreasePatternEdge(I, S, "perp", I)
# SM = new CreasePatternEdge(S, M, "perp", I)
# JQ = new CreasePatternEdge(J, Q, "perp", J)
# QK = new CreasePatternEdge(Q, K, "perp", J)
# JV = new CreasePatternEdge(J, V, "perp", J)
# VP = new CreasePatternEdge(V, P, "perp", J)
# JU = new CreasePatternEdge(U, J, "perp", J)
# UO = new CreasePatternEdge(U, O, "perp", J)

# vtxs = [A, B, C, D, E, F, G, H, I , J, K, L, M, N, O, P, Q, R, S, T, U, V]
# edges = [AM, MB, BN, NO, OC, CP, PD, DK, KL, LA, ES, SF, FT, TU, UG, GV, VH, HQ, QR, RE, AE, EI, IF, FB, IJ, JH, HD, JG, GC, LR, RI, IT, TN, IS, SM, JQ, QK, JV, VP, JU, UO]

# CrP = new CreasePattern(vtxs, edges, CENTER)

# corLA = new Corridor(CrP, LA, A, L)
# corMB = new Corridor(CrP, MB, B, M)
# corOC = new Corridor(CrP, OC, C, O)
# corPD = new Corridor(CrP, PD, D, P)
# corKL = new Corridor(CrP, KL, L, K)

# vertices = [I, J]
# shadowEdges = [corLA, corMB, corOC, corPD, corKL]
# shady = new OrientedMetricTree(vertices, shadowEdges)

# console.log shady.isEdge(I, J)
# console.log "distance = " + shady.distance(I, J)
# console.log "tree distance = " + shady.treeDistance(I, J)

# p = shady.findPath(I, J)
# s = ""
# for v in p
# 	s = s + v.print() + " --> " 

# console.log "Path from I to J : " + s

# console.log "Testing orientation of I"
# neighborEdges = shady.orientation(I)
# for e in neighborEdges
# 	console.log e.print()

# console.log "Testing orientation of J"
# neighborEdges = shady.orientation(J)
# for e in neighborEdges
# 	console.log e.print()

# clickSeq = [A,B,C,D,A]
# # # mySLAV = stepOneAB(clickSeq)[0]
# # # console.log mySLAV.printContents()

# # straightSkeleton(clickSeq)
# [CP, CPfaces, facesRelations] = foldAndCut(clickSeq)

# console.log "Positions of the vertices now: "
# for vert in CP.cPVs
# 	console.log "*" + vert.printFull()

# CP.toggleFold()

# console.log "Now it should be unfolded: "
# for vert in CP.cPVs
# 	console.log "*" + vert.printFull()
