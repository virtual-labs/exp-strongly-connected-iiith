'use strict';
import { graph, makeGraph, states, numNodes } from "./randomGraph.js";
import { addNodes, addEdges, cy, removeEdges, addReverseEdges, removeNodes } from "./displayGraph.js";

window.nextSimulation = nextSimulation;
window.previousSimulation = previousSimulation;
window.newGraph = newGraph;
window.refreshWorkingArea = refreshWorkingArea;

const observ = document.getElementById("observations");
const EMPTY = "";

export let componentsList = [];
let numStates = 0;
let pointer = 0;
let decide = true;
let currentStackSize = 0;
let currentGraphState = 1;

function appendStack(node) {
    let svgns = "http://www.w3.org/2000/svg";
    let rect = document.createElementNS(svgns, 'rect');
    rect.setAttribute('x', currentStackSize * 60 + 10);
    rect.setAttribute('y', 110);
    rect.setAttribute('height', '80');
    rect.setAttribute('width', '50');
    rect.setAttribute('fill', 'blue');
    let text = document.createElementNS(svgns, 'text');
    text.setAttribute('x', currentStackSize * 60 + 30);
    text.setAttribute('y', 150);
    text.setAttribute('fill', 'white');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.textContent = node;
    document.getElementById('stack').appendChild(rect);
    document.getElementById('stack').appendChild(text);
    currentStackSize++;
}

function removeStack() {
    let stack = document.getElementById('stack');
    stack.removeChild(stack.lastChild);
    stack.removeChild(stack.lastChild);
    currentStackSize--;
}

function changeColor(node, color) {
    cy.getElementById(node).style('background-color', color);
}

function restoreColor(nodeColor) {
    cy.nodes().style('background-color', nodeColor);
}

function appendState(graphState, node, component, stack, observation) {
    let state = {
        graphState: graphState,
        node: node,
        component: component,
        stack: stack,
        observation: observation
    }
    states[numStates] = state;
    numStates++;
}

function dfs(node, visited, stack) {
    visited[node] = true;
    for (let i = 0; i < graph[node].length; i++) {
        if (!visited[graph[node][i]]) {
            appendState(1, graph[node][i], componentsList.slice(), stack.slice(), "DFS on node " + graph[node][i].toString() + " is started");
            dfs(graph[node][i], visited, stack);
        } else {
            appendState(1, graph[node][i], componentsList.slice(), stack.slice(), "Node " + graph[node][i].toString() + " is already visited");
        }
    }
    stack.push(node);
    appendState(1, node, componentsList.slice(), stack.slice(), "DFS on node " + node.toString() + " is complete and node " + node.toString() + " is pushed to stack");
}

function dfs2(node, visited, component, reverseGraph, stack) {
    visited[node] = true;
    component.push(node);
    for (let i = 0; i < reverseGraph[node].length; i++) {
        if (!visited[reverseGraph[node][i]]) {
            appendState(2, reverseGraph[node][i], componentsList.slice(), stack.slice(), "DFS2 on node " + reverseGraph[node][i].toString() + " is started");
            dfs2(reverseGraph[node][i], visited, component, reverseGraph, stack);
        } else {
            appendState(2, reverseGraph[node][i], componentsList.slice(), stack.slice(), "Node " + reverseGraph[node][i].toString() + " is already visited");
        }
    }
}

function colorComponents(components) {
    // console.log(components);
    if(components === []) return;
    let colors = ["green", "violet", "orange", "blue", "yellow", "brown", "black", "grey"]
    for (let i = 0; i < components.length; i++) {
        let color = colors[i];
        for (let j = 0; j < components[i].length; j++) {
            changeColor(components[i][j], color);
        }
    }
}

export function fillStates() {
    let visited = new Array(numNodes).fill(false);
    let stack = [];
    for (let i = 0; i < numNodes; i++) {
        if (!visited[i]) {
            appendState(1, i, componentsList.slice(), stack.slice(), "DFS on node " + i.toString() + " is started");
            dfs(i, visited, stack);
        } else {
            appendState(1, i, componentsList.slice(), stack.slice(), "Node " + i.toString() + " is already visited");
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
    appendState(2, -1, [], stack.slice(), "Reverse graph is created, now we will call DFS2 on nodes in stack");
    while (stack.length > 0) {
        let node = stack.pop();
        console.log(node);
        if (!visited[node]) {
            let component = [];
            appendState(2, node, componentsList.slice(), stack.slice(), "DFS2 on node " + node.toString() + " is started, the node is popped from stack");
            dfs2(node, visited, component, reverseGraph, stack);
            componentsList.push(component);
            // convert component to string
            let componentString = "";
            for (let i = 0; i < component.length; i++) {
                componentString += component[i].toString() + " ";
            }
            appendState(2, node, componentsList.slice(), stack.slice(), "DFS2 on node " + node.toString() + " is complete and component is pushed to componentsList. The nodes in the component are colored with same color. The component is/are " + componentString + ".");
        } else {
            appendState(2, node, componentsList.slice(), stack.slice(), "Node " + node.toString() + " is already visited, the node is popped from stack");
        }
    }
    console.log(states);
}


function run(key) {
    restoreColor("Pink")
    let state = states[key];
    observ.innerHTML = state.observation;
    if (state.node !== -1) {
        changeColor(state.node, "red");
    }
    if (state.graphState !== currentGraphState) {
        currentGraphState = state.graphState;
        if (state.graphState === 1) {
            document.getElementById("dfs1").classList.add("is-active");
            document.getElementById("dfs2").classList.remove("is-active");
            cy.remove(cy.edges());
            addEdges();
        } else {
            document.getElementById("dfs2").classList.add("is-active");
            document.getElementById("dfs1").classList.remove("is-active");
            cy.remove(cy.edges());
            addReverseEdges();
        }
    }
    if (currentStackSize !== state.stack.length) {
        if (currentStackSize < state.stack.length) {
            appendStack(state.stack[currentStackSize]);
        }
        else {
            removeStack();
        }
    }
    colorComponents(state.component);
}

function disableInput(){
    document.getElementById("dfs1").disabled = true;
    document.getElementById("dfs2").disabled = true;
}

export function newGraph() {
    document.getElementById("dfs2").classList.remove("is-active");
    pointer = 0;
    decide = true;
    numStates = 0;
    currentStackSize = 0;
    currentGraphState = 1;
    componentsList = [];
    removeNodes();
    removeEdges();
    observ.innerHTML = EMPTY;
    restoreColor("pink");
    refreshWorkingArea();
}

export function nextSimulation() {
    if (decide) {
        run(pointer);
        decide = false;
    }
    else {
        if (pointer < numStates - 1) {
            pointer++;
            run(pointer);
        }
        else {
            observ.innerHTML = "The simulation is finished <br>";
            // print the components
            let componentString = "";
            for (let i = 0; i < componentsList.length; i++) {
                componentString += "Component " + (i + 1).toString() + ": ";
                for (let j = 0; j < componentsList[i].length; j++) {
                    componentString += componentsList[i][j].toString() + " ";
                }
                componentString += "<br>";
            }
            observ.innerHTML += componentString;
        }
    }
}

export function previousSimulation() {

    // to check if the last simulation was next or previous
    if (decide) {
        observ.innerHTML = "Cannot go back";
    }
    else {
        if (pointer > 0) {
            pointer--;
            run(pointer);
        }
        else {
            observ.innerHTML = "Cannot go back";
        }
    }
}

export function refreshWorkingArea() {
    disableInput();
    document.getElementById("dfs1").classList.add("is-active");
    makeGraph();
    addNodes();
    addEdges();
    fillStates();
}
refreshWorkingArea();