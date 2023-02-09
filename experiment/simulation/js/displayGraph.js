import { graph } from "./randomGraph.js";
import { clearGraph } from "./randomGraph.js";
export let cy = cytoscape({
    container: document.getElementById('diagram'),
    style: [
        {
            selector: 'node',
            style: {
                'background-color': 'pink',
                label: 'data(id)',
                'text-valign': 'center',
                'text-halign': 'center'
            }
        },
        {
            selector: 'edge',
            style: {
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'line-color': "lightgreen",
                'width': 3,
            }
        }
    ]
});
export function addEdges() {
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            cy.add({
                group: "edges",
                data: {
                    source: i,
                    target: graph[i][j]
                }
            });
        }
    }
}

export function addNodes() {
    for (let i = 0; i < graph.length; i++) {
        cy.add({
            group: "nodes",
            data: {
                id: i
            }
        });
    }
    cy.layout({ name: 'circle' }).run();
}

export function addReverseEdges() {
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            cy.add({
                group: "edges",
                data: {
                    source: graph[i][j],
                    target: i
                }
            });
        }
    }
}

export function removeNodes() {
    cy.remove(cy.nodes());
}

export function removeEdges(){
    cy.remove(cy.edges());
    // empty graph
    clearGraph();
}

// change the poistion of node 3
cy.zoomingEnabled(false);