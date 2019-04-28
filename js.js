// create an array with nodes

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
    {id: 6, from: 3, to: 10, label: "4", font: edgeFont, color: edgeColor},
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

function startTransmission() {
    var startNode = document.getElementById("start_node").value;
    console.log(startNode);
    var endNode = document.getElementById("stop_node").value;
    console.log(endNode);
    var delayTime = parseInt(document.getElementById("delay").value, 10);
    console.log(delayTime);
    if(!running)
        trace_route([8, 3, 10, 2, 4, 5, 6, 9], delayTime);
}

async function trace_route(node_path, sTime) {
    running = true;
    removeAllHighlighting();
    var path = [];
    for(var i = 0; i < node_path.length; i++) {
        path.push(nodeList[node_path[i]-1]);
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
        this.nodes[neighbor.name] = this.numNodes
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
        // console.log(this.nodes[src])
        // console.log(this.nodes[dest])
        // console.log(this.dMatrix[this.nodes[src]])
        // console.log(this.dMatrix[this.nodes[src]][this.nodes[dest]])
        return this.dMatrix[this.nodes[src]][this.nodes[dest]];
    }

    _setCost(src, dest, newCost) {
        this.dMatrix[this.nodes[src]][this.nodes[dest]] = newCost;
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
                this._setCost(this.name, dest, bellmanFordOptions[newMin]);
                this.forwardingTable[dest] = newMin;
                updated = true;
            }
        }
        return updated;

    }

    update(src, updates) {
        console.log(`updating ${this.name} from ${src}`);
        // console.log(updates)
        this._setDvForRouter(src, updates);
        var update = this._bellmanFordRouting();
        if(update === true) {
            this.broadcast();
        }
        return;
    }
}


prnt = console.log

a = new Router("a")
b = new Router("b")
c = new Router("c")
prnt(a)
prnt(b)

a.addNeighbor(b, 3)
a.addNeighbor(c, 7)
c.addNeighbor(b, 1)

prnt(a)
prnt(b)

a.broadcast()
b.broadcast()
c.broadcast()
a.broadcast()
b.broadcast()
c.broadcast()

prnt(a)
prnt(b)
prnt(c)

/////////

routerA = new Router("a");
routerB = new Router("b");
console.log(routerA);

function routerLtoNum(router) {
    return (router.name.charCodeAt(0)-96);
}

function routerNumtoL(number) {
    return String.fromCharCode(number+96);
}

//Adds all neighbors to router form edges(EdgeList)
function fillRouter(router) {
    for (let i = 0; i < edges.length; i++) {
        var tempEdge = edges.get(i+1);
        if(tempEdge['to'] == routerLtoNum(router)) {
            // router.addNeighbors(tempEdge['from'], parseInt(tempEdge['label']))
            console.log("node id:", routerNumtoL(tempEdge['to']), "to", routerNumtoL(tempEdge['from']), "with cost=", parseInt(tempEdge['label']));
        } else if (tempEdge['from'] == routerLtoNum(router)) {
            // router.addNeighbors(tempEdge['to'], parseInt(tempEdge['label']))
            console.log("node id:", routerNumtoL(tempEdge['from']), "to", routerNumtoL(tempEdge['to']), "with cost=", parseInt(tempEdge['label']));
        }
    }
}


fillRouter(routerA);
fillRouter(routerB);