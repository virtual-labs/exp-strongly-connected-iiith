'use strict';
import { addEdges } from "./displayGraph.js";
import { states, makeGraph, numNodes, graph } from "./randomGraph.js";

const observ = document.getElementById("observations");

export function refreshComponents(){
    document.getElementById("observations").innerHTML = "";
    makeGraph();
    addEdges();
    fillStatesPracticeAndExercise();
}

export function inputBox(val, id) {
    // check if val is either a number or INF
    let inputId = document.getElementById(id);
    if (val !== "INF" && val !== "inf" && isNaN(val)) {
        inputId.classList.add("highlight")
        setTimeout(function () { inputId.classList.remove("highlight") }, 5000);
        document.getElementById(id).value = "";
        observ.innerHTML = "Please enter a number or INF";
    }
}

export function updateTable(distArray){
    for(let i=1;i<=numNodes;i++){
        for(let j=1;j<=numNodes;j++){
            if(distArray[i-1][j-1]<1e5){
                document.getElementById("text"+i.toString()+j.toString()).value = distArray[i-1][j-1];
            }else{
                document.getElementById("text"+i.toString()+j.toString()).value = "INF";
            }
        }
    }
}

export function updateTableExercise(distArray,prevArray){
    for(let i=1;i<=numNodes;i++){
        for(let j=1;j<=numNodes;j++){
            if(distArray[i-1][j-1]>prevArray[i-1][j-1]){
                distArray[i-1][j-1] = prevArray[i-1][j-1];
            }
            if(distArray[i-1][j-1]<1e5){
                document.getElementById("text"+i.toString()+j.toString()).value = distArray[i-1][j-1];
            }else{
                document.getElementById("text"+i.toString()+j.toString()).value = "INF";
            }
        }
    }
    return distArray;
}


export function fillStatesPracticeAndExercise() {
    let dist = new Array(numNodes);
    for (let i = 0; i < numNodes; i++) {
        dist[i] = new Array(numNodes);
        for (let j = 0; j < numNodes; j++) {
            dist[i][j] = 1000000;
        }
        dist[i][i] = 0;
    }
    for (let edge of graph) {
        let src = edge.source - 1;
        let dest = edge.target - 1;
        dist[src][dest] = edge.weight;
    }
    let intialState = {}
    intialState["distance"] = [];
    for (let i = 0; i < numNodes; i++) {
        intialState["distance"].push(dist[i].slice());
    }
    states[0] = intialState;
    for (let k = 0; k < numNodes; k++) {
        let tempState = {};
        for (let i = 0; i < numNodes; i++) {
            for (let j = 0; j < numNodes; j++) {
                if (i !== j && j !== k && i !== k) {
                    if (dist[i][k] + dist[k][j] < dist[i][j] && dist[i][k]+dist[k][j] < 1e5) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
        tempState["distance"] = [];
        for (let i = 0; i < numNodes; i++) {
            tempState["distance"].push(dist[i].slice());
        }
        states[k+1] = tempState;
    }
}