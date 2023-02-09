'use strict';
import { graph, makeGraph,makeGraphInput, states, numNodes } from "./randomGraph.js";
import { addNodes, addEdges, cy, removeEdges, addReverseEdges } from "./displayGraph.js";

let quesFiles = ["./../practiceq1.json", "./../practiceq2.json", "./../practiceq3.json"];
// randomly select a question file
let filePath = quesFiles[Math.floor(Math.random() * quesFiles.length)];
// let filePath = "./../practiceq1.json";
let data = {};
// fetch the json file
// store all the contents of the json file in a variable

console.log(filePath);
 await import(filePath,{ assert: { type: "json" } })
    .then((info) => {
        data = info.default;
    })


window.nextSimulation = nextSimulation;
window.previousSimulation = previousSimulation;
window.newGraph = newGraph;
window.refreshWorkingArea = refreshWorkingArea;

const observ = document.getElementById("observations");
const myDiv = document.getElementById("questions");
const quesText = document.getElementById("quesText");
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
    for(let i = 0; i < data.numStates; i++) {
        states[i] = data[i];
    }
    console.log(states);
    numStates = data.numStates;
}

function disableSimulationButtons() {
    document.getElementById("next").disabled = true;
    document.getElementById("prev").disabled = true;
    document.getElementById("restart").disabled = true;
}

function enableSimulationButtons() {
    document.getElementById("next").disabled = false;
    document.getElementById("prev").disabled = false;
    document.getElementById("restart").disabled = false;
}

function handleQues(state){
    disableSimulationButtons();

    quesText.innerHTML = state.ques;
    let button1 = document.createElement("button");
    button1.innerHTML = state.optiona;
    // add class v-button button-margin
    button1.classList.add("v-button");
    button1.classList.add("ques-button");

    let button2 = document.createElement("button");
    button2.innerHTML = state.optionb;
    button2.classList.add("v-button");
    button2.classList.add("ques-button");

    let button3 = document.createElement("button");
    button3.innerHTML = state.optionc;
    button3.classList.add("v-button");
    button3.classList.add("ques-button");


    myDiv.appendChild(button1);
    myDiv.appendChild(button2);
    myDiv.appendChild(button3);

    // add event listeners
    button1.addEventListener("click", function(){
        if(state.ans === "a"){
            observ.innerHTML = "Correct Answer";
            enableSimulationButtons();
            state.isQues = "False";
        }
        else{
            observ.innerHTML = "Wrong Answer";
        }
        myDiv.removeChild(button1);
        myDiv.removeChild(button2);
        myDiv.removeChild(button3);
        run(pointer);

    }
    );
    button2.addEventListener("click", function(){
        if(state.ans === "b"){
            observ.innerHTML = "Correct Answer";
            enableSimulationButtons();
            state.isQues = "False";
        }
        else{
            observ.innerHTML = "Wrong Answer";
        }
        myDiv.removeChild(button1);
        myDiv.removeChild(button2);
        myDiv.removeChild(button3);
        run(pointer);
    }
    );
    button3.addEventListener("click", function(){
        if(state.ans === "c"){
            observ.innerHTML = "Correct Answer";
            enableSimulationButtons();
            state.isQues = "False";
        }
        else{
            observ.innerHTML = "Wrong Answer";
        }
        myDiv.removeChild(button1);
        myDiv.removeChild(button2);
        myDiv.removeChild(button3);
        run(pointer);
    }
    );

}


function run(key) {
    restoreColor("Pink")
    quesText.innerHTML = "";
    let state = states[key];
    if(state.isQues === "True"){
        handleQues(state);
        return;
    }
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
    for (let iter = 1; iter <= numNodes; iter++) {
        document.getElementById("iteration" + iter.toString()).classList.remove("is-active")
    }
    pointer = 0;
    decide = true;
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
    addNodes();
    addEdges();
    fillStates();
}
// console.log(data[0])
makeGraphInput(data.structure.edges);
refreshWorkingArea();