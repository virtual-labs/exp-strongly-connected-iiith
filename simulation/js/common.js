'use strict';
import { cy } from "./displayGraph.js";
export function appendStack(node, currentStackSize) {
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
}

export function removeStack() {
    let stack = document.getElementById('stack');
    stack.removeChild(stack.lastChild);
    stack.removeChild(stack.lastChild);
}

export function changeColor(node, color) {
    cy.getElementById(node).style('background-color', color);
}

export function restoreColor(nodeColor) {
    cy.nodes().style('background-color', nodeColor);
}

export function colorComponents(components) {
    if(components === []) return;
    let colors = ["green", "violet", "orange", "blue", "yellow", "brown", "black", "grey"]
    for (let i = 0; i < components.length; i++) {
        let color = colors[i];
        for (let j = 0; j < components[i].length; j++) {
            changeColor(components[i][j], color);
        }
    }
}

export function disableInput(){
    document.getElementById("dfs1").disabled = true;
    document.getElementById("dfs2").disabled = true;
}