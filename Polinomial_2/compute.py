import math
import numpy as np
import sympy as sp



def compute(r):
    return math.sin(r)

def lagrange(nodes):


    tmp_x_nodes = [node['X']for node in nodes]
    tmp_y_nodes = [node['Y']for node in nodes]

    x_nodes = np.asarray(tmp_x_nodes,dtype=np.float)
    y_nodes = np.asarray(tmp_y_nodes,dtype=np.float)

    x = sp.symbols('x')
    y = sp.symbols('y')

    pol_base = []
    pol_lag = []

    for i in range(len(x_nodes)):
        LUp = []
        LDown = []
        for j in range(len(nodes)):
            if j != i:
                express=(x-x_nodes[j])
                express_1=(x_nodes[i]-x_nodes[j])
                LUp.append("{" + str(express) + " \over " + str(express_1) + "}")
                LDown.append(express/express_1)
        pol_base.append([i, LUp])
        pol_lag.append(LDown)

    #print pol_base

    P=0
    product_result = []


    for n1 in range(len(pol_lag)):
        test = 1
        for n2 in range(len(pol_lag[n1])):
            test = test * pol_lag[n1][n2]

        ptoria = sp.expand(test)
        product_result.append([n1, sp.latex(ptoria), y_nodes[n1]])

        P = P + (test * y_nodes[n1])

    expt = sp.expand(P)
    latx = sp.latex(expt)

    response_data = {
            'result': latx,
            'basePol': pol_base,
            'sumProduct': product_result,
    }

    return response_data
