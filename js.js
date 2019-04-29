// create an array with nodes
prnt = console.log
let nodeList = [
    {id: 1, label: 'A'},
    {id: 2, label: 'B'},
    {id: 3, label: 'C'},
    {id: 4, label: 'D'},
    {id: 5, label: 'E'},
    {id: 6, label: 'F'},
    {id: 7, label: 'G'},
    {id: 8, label: 'H'},
    {id: 9, label: 'I'},
    {id: 10, label: 'J'},
    {id: 11, label: 'K'},
    {id: 12, label: 'L'},
    {id: 13, label: 'M'},
    {id: 14, label: 'N'},
];

var running  = false;

var nodes = new vis.DataSet(nodeList);

// create an array with edges
let edgeFont = {size: 22, color:'black', face:'arial', background: 'white'};
let edgeColor = {color: "black"};

let edgeList = [
    {id: 1, from: 2, to: 9, label: "3", font: edgeFont, color: edgeColor},
    {id: 2, from: 1, to: 2, label: "8", font: edgeFont, color: edgeColor},
    {id: 3, from: 10, to: 4, label:"4", font:edgeFont, color: edgeColor},
    {id: 4, from: 2, to: 4, label:"1", font:edgeFont, color: edgeColor},
    {id: 5, from: 2, to: 10, label: "9", font: edgeFont, color: edgeColor},
    {id: 6, from: 3, to: 10, label: "1", font: edgeFont, color: edgeColor},
    {id: 7, from: 6, to: 9, label:"10", font:edgeFont, color: edgeColor},
    {id: 8, from: 14, to: 5, label:"7", font:edgeFont, color: edgeColor},
    {id: 9, from: 11, to: 3, label: "6", font: edgeFont, color: edgeColor},
    {id: 10, from: 13, to: 2, label: "5", font: edgeFont, color: edgeColor},
    {id: 11, from: 12, to: 4, label:"2", font:edgeFont, color: edgeColor},
    {id: 12, from: 6, to: 5, label:"7", font:edgeFont, color: edgeColor},
    {id: 13, from: 8, to: 3, label: "9", font: edgeFont, color: edgeColor},
    {id: 14, from: 3, to: 14, label: "5", font: edgeFont, color: edgeColor},
    {id: 15, from: 5, to: 4, label:"6", font:edgeFont, color: edgeColor},
    {id: 16, from: 7, to: 5, label:"1", font:edgeFont, color: edgeColor},
];

var edges = new vis.DataSet(edgeList);

// create a network
var container = document.getElementById('mynetwork');

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    height: '100%',
    width: '100%',
    layout:{randomSeed:4},
};

// initialize your network!
var network = new vis.Network(container, data, options);
network.on( 'click', function(properties) {
    // var node_ids = properties.nodes;
    // var edge_ids = properties.edges;
    // var clickedNodes = nodes.get(node_ids);
    // // console.log('clicked nodes:', clickedNodes);
    // var clickedEdges = edges.get(edge_ids);
    // if (clickedEdges.length !== 0 && clickedNodes.length === 0) {
    //     var edge = edges.get(edge_ids)[0];
    //     removeAllHighlighting();
    //     highlightEdge(edge, 'red');
    //     // network.selectNodes([1], [true]);
    // }
    // if (clickedNodes.length !== 0) {
    //     let node = nodes.get(node_ids)[0];
    //     highlightAllEdges(node);
    // }
    //
    // console.log('clicked edges:', clickedEdges);
});

function routerLtoNum(router) {
    return (router.name.charCodeAt(0)-96);
}

function lToNum(letter) {
    prnt(letter);
    return letter.charCodeAt(0)-96;
}

function routerNumtoL(number) {
    return String.fromCharCode(number+96);
}

async function trace_route(node_path, sTime) {
    running = true;
    removeAllHighlighting();
    var path = [];
    for(var i = 0; i < node_path.length; i++) {
        path.push(nodes.get((node_path[i])));
    }
    for (var i = 0; i < path.length-1; i++) {
        await sleep(sTime);
        highlightAllEdges(path[i]);
        await sleep(sTime);
        let edge = findConnectingEdge(path[i], path[i+1]);
        removeAllHighlighting();
        highlightEdge(edge, 'red');
    }
    await sleep(sTime);
    removeAllHighlighting();
    path[path.length - 1]['color'] = 'red';
    nodes.update(path[path.length - 1]);

    running = false;
}

function findConnectingEdge(to, from) {
    for (var i = 0; i < edgeList.length; i++) {
        if(edgeList[i]['to'] === to['id'] || edgeList[i]['to'] === from['id']) {
            if(edgeList[i]['from'] === to['id'] || edgeList[i]['from'] === from['id']) {
                return edgeList[i];
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function highlightAllEdges(node){
    removeAllHighlighting();
    node['color'] = 'red';
    nodes.update(node);
    for (var i = 0; i < edgeList.length; i++) {
        if(edgeList[i]['from'] === node['id'] || edgeList[i]['to'] === node['id']) {
            highlightEdge(edgeList[i], 'lime');
        }
    }

}

function highlightEdge(edge, color) {
    edge['font']['background'] = color;
    edges.update(edge);
}

function removeAllHighlighting() {
    for(var i = 0; i < edgeList.length; i++) {
        edgeList[i]['font']['background'] = 'white';
        edges.update(edgeList[i])
    }
    for(var i = 0; i < nodeList.length; i++) {
        nodeList[i]['color'] = '#97C2FC';
        nodes.update(nodeList[i]);
    }
}

function updateLink() {
    prnt(JSON.stringify(g));
    prnt(JSON.stringify(e));
    var startNode = lToNum(document.getElementById("start_node_link").value.toLowerCase());
    var endNode = lToNum(document.getElementById("stop_node_link").value.toLowerCase());
    var linkVal = document.getElementById("new_link").value;
    for(var i = 0; i < edgeList.length; i++) {
        if (edgeList[i]["from"] == startNode && edgeList[i]['to'] == endNode) {
            var startRouter = rot.get(edgeList[i]['from'])['router'];
            var endRouter = rot.get(edgeList[i]['to'])['router'];
            updateLinkCost(edgeList[i], linkVal);
            startRouter.changeLinkCost(endRouter, parseInt(linkVal));
            // rot.get(startRouter.broadcast());
            prnt(JSON.stringify(startRouter));
            prnt(JSON.stringify(endRouter));
            break;
        } else if (edgeList[i]["to"] == startNode && edgeList[i]['from'] == endNode) {
            var startRouter = rot.get(edgeList[i]['to'])['router'];
            var endRouter = rot.get(edgeList[i]['from'])['router'];
            updateLinkCost(edgeList[i], linkVal);
            startRouter.changeLinkCost(startRouter, parseInt(linkVal));
            // rot.get(startRouter.broadcast());
            prnt(JSON.stringify(startRouter));
            prnt(JSON.stringify(endRouter));
            break;
        }
    }
}

function updateLinkCost(edge, new_val) {
    edge.label = new_val;
    edges.update(edge);
}

function addLink() {
    var fromNode = lToNum(document.getElementById("add_link_from").value.toLowerCase());
    var toNode = lToNum(document.getElementById("add_link_to").value.toLowerCase());
    var val = document.getElementById("link_value_update").value;
    
    var edge = {id: edgeList.length + 1, from: fromNode, to: toNode, label: val, font: edgeFont, color: edgeColor};
    edgeList.push(edge);
    edges.add(edge);

    let neighborRouter = rot.get(fromNode)['router'];
    fillRouter(neighborRouter);
    neighborRouter.broadcast();
    
    rot.get(toNode)['router'].broadcast();
}

function addNode() {
    var nodeLabel = document.getElementById("add_node_label").value;
    var nodeId = lToNum(nodeLabel.toLowerCase());
    var neighbor = lToNum(document.getElementById("neighbor_label").value.toLowerCase());
    var linkVal = document.getElementById("link_value_add").value;
    var node = {id: nodeId, label: nodeLabel}
    nodeList.push(node)
    nodes.add(node);

    var edge = {id: edgeList.length + 1, from: nodeId, to: neighbor, label: linkVal, font: edgeFont, color: edgeColor};
    edgeList.push(edge);
    edges.add(edge);
    network.redraw();

    let tmp = new Router(nodeLabel.toLowerCase());
    let neighborRouter = rot.get(neighbor)['router'];
    var rtr_tmp = {id: nodeId, router: tmp}; 
    rtr.push(rtr_tmp);
    rot.add(rtr_tmp);
    
    fillRouter(tmp);

    neighborRouter.broadcast();
    tmp.broadcast();

}


function changeEdgeBackground(edge) {
    edge['font']['background'] = 'lime';
    edges.update(edge);
    for(var i = 0; i < edgeList.length; i++) {
        if(edgeList[i]['id'] !== edge['id']) {
            edgeList[i]['font']['background'] = 'white';
            edges.update(edgeList[i])
        }
    }
}


class Router {
    constructor(name) {
        this.name = name;
        this.neighbors = {};
        this.neighbors[name] = 0
        this.nodes = {};
        this.nodes[name] = 0
        this.forwardingTable = {};
        this.numNodes = 0;
        this.dMatrix = [[0]]
        this.updateEvents = []
        this.dMatrixIndecies = {}
        this.dMatrixIndecies[name] = 0;

        // Hacky way to bind class context to each method
        this.addNeighbor = this.addNeighbor.bind(this)
        this.broadcast = this.broadcast.bind(this)
        this.update = this.update.bind(this)
        this._addNeighborToMatrix = this._addNeighborToMatrix.bind(this)
        this._subscribeEvent = this._subscribeEvent.bind(this)
        this._getCost = this._getCost.bind(this)
        this._setCost = this._setCost.bind(this)
        this._generateRowCostMapping = this._generateRowCostMapping.bind(this)
        this._setDvForRouter = this._setDvForRouter.bind(this)
        this._allocateNewBlankColumn = this._allocateNewBlankColumn.bind(this)
        this._bellmanFordRouting = this._bellmanFordRouting.bind(this)
    }

    addNeighbor(neighbor, cost) {
        if(neighbor.name in this.neighbors) {
            return;
        }

        this.numNodes += 1;
        this.neighbors[neighbor.name] = cost
        this.nodes[neighbor.name] = this.numNodes;
        var length = Object.keys(this.dMatrixIndecies).length;
        this.dMatrixIndecies[neighbor.name] = length;
        this._addNeighborToMatrix(cost)
        this._subscribeEvent(neighbor.update)
        this.forwardingTable[neighbor.name] = neighbor.name
        neighbor.addNeighbor(this, cost)
    }

    _addNeighborToMatrix(cost) {
        this.dMatrix[0].push(cost);
        var emptyColumnRow = [];
        for(var i=0; i<this.dMatrix[0].length; i++) {
            emptyColumnRow.push(null);
        }
        // this.dMatrix.push(emptyColumnRow);
        for(var row=1; row<this.dMatrix.length; row++) {
            this.dMatrix[row] = jQuery.extend(true, [], emptyColumnRow)
        }

        this.dMatrix.push(jQuery.extend(true, [], emptyColumnRow))
    }

    _subscribeEvent(event) {
        this.updateEvents.push(event);
    }

    _getCost(src, dest) {
        // console.log("getcost")
        // console.log(src)
        // console.log(dest)
        // console.log(this.dMatrixIndecies[src])
        // console.log(this.nodes[dest])
        // console.log(this.dMatrix[this.dMatrixIndecies[src]])
        // console.log(this.dMatrix[this.dMatrixIndecies[src]][this.nodes[dest]])
        return this.dMatrix[this.dMatrixIndecies[src]][this.nodes[dest]];
    }

    _setCost(src, dest, newCost) {
        this.dMatrix[this.dMatrixIndecies[src]][this.nodes[dest]] = newCost;
    }

    broadcast() {
        for(var i=0; i<this.updateEvents.length; i++) {
            this.updateEvents[i](this.name, this._generateRowCostMapping(this.name))
        }
    }

    _generateRowCostMapping(src) {
        var rowCostMapping = {};
        var nodesKeys = Object.keys(this.nodes);
        // console.log(nodesKeys)
        var dest = null;
        for(var i=0; i<nodesKeys.length; i++) {
            dest = nodesKeys[i]
            // console.log(`dest ${dest}`)
            rowCostMapping[dest] = this._getCost(src, dest);
        }
        // console.log(rowCostMapping)
        return rowCostMapping;
    }

    _setDvForRouter(routerName, dvValues) {
        var dvValuesKeys = Object.keys(dvValues);
        var dv = null;
        for(var i=0; i<dvValuesKeys.length; i++) {
            dv = dvValuesKeys[i];
            if(!this.nodes.hasOwnProperty(dv)) {
                this._allocateNewBlankColumn(dv);
            }
            // prnt(routerName, "IN SETDVROUTER", dvValues[dv]);
            this._setCost(routerName, dv, dvValues[dv])
        }
    }

    _allocateNewBlankColumn(node) {
        this.numNodes += 1;
        this.nodes[node] = this.numNodes;
        for(var i=0; i<this.dMatrix.length; i++) {
            this.dMatrix[i].push(null);
        }
    }

    _bellmanFordRouting() {
        var updated = false;
        var nodesKeys = Object.keys(this.nodes);
        var neighborsKeys = Object.keys(this.neighbors);
        var bellmanFordOptions = null;
        var optionsKeys = null;
        var src = null;
        var newMin = null;
        var dest = null;
        for(var i=0; i<nodesKeys.length; i++) {
            dest = nodesKeys[i];
            if(dest === this.name) {
                continue;
            }

            bellmanFordOptions = {}
            for(var j=0; j<neighborsKeys.length; j++) {
                src = neighborsKeys[j]
                if(src === this.name || this._getCost(src, dest) === null) {
                    continue;
                }
                bellmanFordOptions[src] = this.neighbors[src] + this._getCost(src, dest);
            }

            if(Object.keys(bellmanFordOptions).length === 0 && bellmanFordOptions.constructor === Object) {
                continue;
            }

            optionsKeys = Object.keys(bellmanFordOptions);
            newMin = null;
            for(var j=0; j<optionsKeys.length; j++) {
                if(newMin === null || bellmanFordOptions[optionsKeys[j]] < bellmanFordOptions[newMin]){
                    newMin = optionsKeys[j];
                }
            }

            if(this._getCost(this.name, dest) === null || bellmanFordOptions[newMin] < this._getCost(this.name, dest)) {
                prnt(this.name, "IN BELLMANFORD", bellmanFordOptions[newMin]);
                this._setCost(this.name, dest, bellmanFordOptions[newMin]);
                this.forwardingTable[dest] = newMin;
                updated = true;
            }
        }
        return updated;
    }

    _resetDMatrixRowToDefault() {
        var neighborsKeys = Object.keys(this.neighbors);
        for(var i=0; i<neighborsKeys.length; i++){
            prnt(JSON.stringify(neighborsKeys[i]), "THIS ONE**");
            prnt(JSON.stringify(this.neighbors[neighborsKeys[i]]), this.name);
            this._setCost(this.name, neighborsKeys[i], this.neighbors[neighborsKeys[i]])
        }
    }

    update(src, updates) {
        // console.log(`updating ${this.name} from ${src}`);
        // console.log(updates)
        this._setDvForRouter(src, updates);
        prnt("calling bellmanFord", src);
        var update = this._bellmanFordRouting();
        if(update === true) {
            this.broadcast();
        }
        return;
    }

    changeLinkCost(neighbor, newCost) {
        if(this.neighbors[neighbor.name] === newCost) {
            return;
        }

        this.neighbors[neighbor.name] = newCost;
        this._resetDMatrixRowToDefault();
        neighbor.changeLinkCost(this, newCost);
        // this.broadcast();
        this.update(this.name, {})
        // prnt(JSON.stringify(this));
    }

    removeRouter(router) {
        return;
    }
}

prnt = console.log

// a = new Router("a")
// b = new Router("b")
// c = new Router("c")

// a.broadcast()
// b.broadcast()
// c.broadcast()
// a.broadcast()
// b.broadcast()
// c.broadcast()

// prnt(a)
// prnt(b)
// prnt(c)

// c.changeLinkCost(a, 2)

// prnt(a)
// prnt(b)
// prnt(c)

// c.changeLinkCost(a, 7)


// prnt(a)
// prnt(b)
// prnt(c)

/////////

a = new Router("a");
b = new Router("b");
c = new Router("c");
d = new Router("d");
e = new Router("e");
f = new Router("f");
g = new Router("g");
h = new Router("h");
i = new Router("i");
j = new Router("j");
k = new Router("k");
l = new Router("l");
m = new Router("m");
n = new Router("n");

let rtr = [
    {id:1, router: a},
    {id:2, router: b},
    {id:3, router: c},
    {id:4, router: d},
    {id:5, router: e},
    {id:6, router: f},
    {id:7, router: g},
    {id:8, router: h},
    {id:9, router: i},
    {id:10, router: j},
    {id:11, router: k},
    {id:12, router: l},
    {id:13, router: m},
    {id:14, router: n},
];

var rot = new vis.DataSet(rtr);

fillRouter(a);

fillRouter(b);
fillRouter(c);
fillRouter(d);
fillRouter(e);
fillRouter(f);
fillRouter(g);
fillRouter(h);
fillRouter(i);
fillRouter(j);
fillRouter(k);
fillRouter(l);
fillRouter(m);
fillRouter(n);

a.broadcast();
b.broadcast();
c.broadcast();
d.broadcast();
e.broadcast();
f.broadcast();
g.broadcast();
h.broadcast();
i.broadcast();
j.broadcast();
k.broadcast();
l.broadcast();
m.broadcast();
n.broadcast();

// To check forwarding tables
// prnt(a);
// prnt(b);
// prnt(c);
// prnt(d);
// prnt(e);
// prnt(f);
// prnt(g);
// prnt(h);
// prnt(i);
// prnt(j);
// prnt(k);
// prnt(l);
// prnt(m);
// prnt(n);

//Adds all neighbors to router form edges(EdgeList)
function fillRouter(router) {
    for (let i = 0; i < edges.length; i++) {
        var tempEdge = edges.get(i+1);
        if(tempEdge['to'] == routerLtoNum(router)) {
            var tempRouter = rot.get(tempEdge['from']);
            var tempOther = tempRouter['router'];
            router.addNeighbor(tempOther, parseInt(tempEdge['label']))
        } else if (tempEdge['from'] == routerLtoNum(router)) {
            var tempRouter = rot.get(tempEdge['to']);
            var tempOther = tempRouter['router'];
            router.addNeighbor(tempOther, parseInt(tempEdge['label']))
        }
    }
}

function startTransmission() {
    var startNode = document.getElementById("start_node").value.toLowerCase();
    // console.log(startNode);
    var endNode = document.getElementById("stop_node").value.toLowerCase();
    // console.log(endNode);
    var delayTime = parseInt(document.getElementById("delay").value, 10);
    // console.log(delayTime);
    var tempNode = startNode;
    var nodeRoute = [];
    prnt("Starint transmission");
    nodeRoute.push(lToNum(startNode));
    prnt(rot.get(lToNum(startNode))['router']);
    while (tempNode != endNode) {
        var temp = rot.get(lToNum(tempNode))['router'].forwardingTable[endNode];
        // prnt(rot.get(lToNum(temp)));
        tempNode = rot.get(lToNum(temp))['router'].name;
        nodeRoute.push(lToNum(tempNode));
    }
    if(!running)
        trace_route(nodeRoute, delayTime);
}