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

var nodes = new vis.DataSet(nodeList);

// create an array with edges
let edgeFont = {size: 22, color:'black', face:'arial', background: 'white'};

let edgeList = [
    {id: 1, from: 2, to: 9, label: "3", font: edgeFont},
    {id: 2, from: 1, to: 2, label: "8", font: edgeFont},
    {id: 3, from: 10, to: 4, label:"4", font:edgeFont},
    {id: 4, from: 2, to: 4, label:"1", font:edgeFont},
    {id: 5, from: 2, to: 10, label: "9", font: edgeFont},
    {id: 6, from: 3, to: 10, label: "4", font: edgeFont},
    {id: 7, from: 6, to: 9, label:"10", font:edgeFont},
    {id: 8, from: 14, to: 5, label:"7", font:edgeFont},
    {id: 9, from: 11, to: 3, label: "6", font: edgeFont},
    {id: 10, from: 13, to: 2, label: "5", font: edgeFont},
    {id: 11, from: 12, to: 4, label:"2", font:edgeFont},
    {id: 12, from: 6, to: 5, label:"7", font:edgeFont},
    {id: 13, from: 8, to: 3, label: "9", font: edgeFont},
    {id: 14, from: 3, to: 14, label: "5", font: edgeFont},
    {id: 15, from: 5, to: 4, label:"6", font:edgeFont},
    {id: 16, from: 7, to: 5, label:"1", font:edgeFont},
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
    var node_ids = properties.nodes;
    var edge_ids = properties.edges;
    var clickedNodes = nodes.get(node_ids);
    // console.log('clicked nodes:', clickedNodes);
    var clickedEdges = edges.get(edge_ids);
    if (clickedEdges.length !== 0 && clickedNodes.length === 0) {
        var edge = edges.get(edge_ids)[0];
        changeEdgeBackground(edge);
        // network.selectNodes([1], [true]);
    }

    console.log('clicked edges:', clickedEdges);
});

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

