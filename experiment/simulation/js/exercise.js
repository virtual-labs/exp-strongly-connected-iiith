'use strict';
import { graph, makeGraph, numNodes } from "./randomGraph.js";
import { addEdges, addNodes,cy, removeEdges, removeNodes, } from "./displayGraph.js";

window.newGraph = newGraph;
window.refreshWorkingArea = refreshWorkingArea;
window.submitSimulation = submitSimulation;
const observ = document.getElementById("observations");
const EMPTY = "";

export let componentsList = [];
let colors = ["green", "violet", "orange", "blue", "yellow", "brown", "black", "grey"]
let nodeNumber = [];

function restoreColor(nodeColor) {
    cy.nodes().style('background-color', nodeColor);
}

function dfs(node, visited, stack) {
    visited[node] = true;
    for (let i = 0; i < graph[node].length; i++) {
        if (!visited[graph[node][i]]) {
            dfs(graph[node][i], visited, stack);
        }
    }
    stack.push(node);
}

function dfs2(node, visited, component, reverseGraph, stack) {
    visited[node] = true;
    component.push(node);
    for (let i = 0; i < reverseGraph[node].length; i++) {
        if (!visited[reverseGraph[node][i]]) {
            dfs2(reverseGraph[node][i], visited, component, reverseGraph, stack);
        }
    }
}

function submitSimulation() {
    // for each component in componentsList
    // check if those nodes have same number
    // if not, return false
    // else return true
    let flag = true;
    for (let i = 0; i < componentsList.length; i++) {
        let num = nodeNumber[componentsList[i][0]];
        for (let j=1;j<=numNodes;j++){
            // is node j in component i?
            if (componentsList[i].includes(j)){
                if (nodeNumber[j] !== num){
                    flag = false;
                    break;
                }
            }
            else{
                if (nodeNumber[j] === num){
                    flag = false;
                    break;
                }
            }
        }

    }
    if (flag) {
        observ.style.color = "green";
        observ.innerHTML = "Correct!";
        // print out the number of components
        observ.innerHTML += " There are " + componentsList.length + " components.";
        // print all the components
        for (let i = 0; i < componentsList.length; i++) {
            observ.innerHTML += " Component " + (i + 1) + ": ";
            for (let j = 0; j < componentsList[i].length; j++) {
                observ.innerHTML += componentsList[i][j] + " ";
            }
            observ.innerHTML += "<br>";
        }
    } else {
        observ.style.color = "red";
        observ.innerHTML = "Incorrect!";
    }
}

export function fillStates() {
    let visited = new Array(numNodes).fill(false);
    let stack = [];
    for (let i = 0; i < numNodes; i++) {
        if (!visited[i]) {
            dfs(i, visited, stack);
        }
    }
    visited = new Array(numNodes).fill(false);
    let reverseGraph = new Array(numNodes);
    for (let i = 0; i < numNodes; i++) {
        reverseGraph[i] = [];
    }
    for (let i = 0; i < numNodes; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            reverseGraph[graph[i][j]].push(i);
        }
    }
    while (stack.length > 0) {
        let node = stack.pop();
        if (!visited[node]) {
            let component = [];
            dfs2(node, visited, component, reverseGraph, stack);
            componentsList.push(component);
        } 
    }
    nodeNumber = new Array(numNodes).fill(-1);
}


export function newGraph() {
    componentsList = [];
    removeNodes();
    removeEdges();
    observ.innerHTML = EMPTY;
    restoreColor("pink");
    refreshWorkingArea();
}

cy.on('tap', 'node', function (evt) {
    let edge = evt.target;
    // get number of node
    let node = edge.id();
    nodeNumber[node] ++;
    nodeNumber[node] %= colors.length;
    edge.style('background-color', colors[nodeNumber[node] % colors.length]);
});

export function refreshWorkingArea() {
    makeGraph();
    addNodes();
    addEdges();
    fillStates();
}
refreshWorkingArea();