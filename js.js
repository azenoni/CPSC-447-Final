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
    // console.log(startNode);
    var endNode = document.getElementById("stop_node").value;
    // console.log(endNode);
    var delayTime = parseInt(document.getElementById("delay").value, 10);
    // console.log(delayTime);
    if(!running)
        trace_route([8, 3, 10, 2, 4, 5, 6, 9], delayTime);
}

// Returns if a value is a string
function isString (value) {
    return typeof value === 'string' || value instanceof String;
}

// Returns if a value is really a number
function isNumber (value) {
    return typeof value === 'number' && isFinite(value);
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


