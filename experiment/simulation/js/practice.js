'use strict';
import { graph, makeGraph,makeGraphInput, states, numNodes } from "./randomGraph.js";
import { addNodes, addEdges, cy, removeEdges, addReverseEdges, removeNodes } from "./displayGraph.js";
import {appendStack,removeStack, changeColor, restoreColor, colorComponents, disableInput} from "./common.js";

window.nextSimulation = nextSimulation;
window.previousSimulation = previousSimulation;
window.newGraph = newGraph;
window.refreshWorkingArea = refreshWorkingArea;

let data = {};
const observ = document.getElementById("observations");
const myDiv = document.getElementById("questions");
const quesText = document.getElementById("quesText");
const EMPTY = "";

let componentsList = [];
let numStates = 0;
let pointer = 0;
let decide = true;
let currentStackSize = 0;
let currentGraphState = 1;

export function fillStates() {
    for(let i = 0; i < data.numStates; i++) {
        states[i] = data[i];
    }
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
            appendStack(state.stack[currentStackSize],currentStackSize);
            currentStackSize++;
        }
        else {
            removeStack();
            currentStackSize--;
        }
    }
    colorComponents(state.component);
}

async function importData() {
    let quesFiles = ["./practiceq1.json", "./practiceq2.json", "./practiceq3.json"];
    let filePath = quesFiles[Math.floor(Math.random() * quesFiles.length)];
    // fetch the data from the file
    const response =  await fetch(filePath)
    data = await response.json();
}

async function newGraph() {
    document.getElementById("dfs2").classList.remove("is-active");
    pointer = 0;
    decide = true;
    numStates = 0;
    currentStackSize = 0;
    currentGraphState = 1;
    componentsList = [];
    data = {};
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

async function refreshWorkingArea() {
    await importData();
    makeGraphInput(data.structure.edges);
    disableInput();
    document.getElementById("dfs1").classList.add("is-active");
    addNodes();
    addEdges();
    fillStates();
}
refreshWorkingArea();