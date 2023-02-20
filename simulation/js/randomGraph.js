'use strict';
function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}
export let states = {};

export let graph = [];
export let selectedEdge = [];
export let numEdges;
export let numNodes;

export function makeGraph() {
    numNodes = getRandomArbitrary(5, 8);
    numEdges = getRandomArbitrary(numNodes+3, numNodes+6);
    graph = [];
    for (let i = 0; i < numNodes; i++) {
        graph.push([]);
    }
    for (let i = 0; i < numEdges; i++) {
        let u = getRandomArbitrary(0, numNodes);
        let v = getRandomArbitrary(0, numNodes);
        if (u === v) {
            i--;
            continue;
        }
        if (graph[u].includes(v)) {
            i--;
            continue;
        }
        graph[u].push(v);
    }
}

export function makeGraphInput(dummyGraph) {
    graph = dummyGraph;
}

export function clearGraph() {
    states = {};
    graph = [];
}
