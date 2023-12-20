## Connectivity
The nodes of the graph are said to be connected or reachable, if there exist a path between them. The graph is said to be connected if all the nodes are connected. If the graph is not connected, then it is said to be disconnected. A graph can be disconnected into multiple components. A component is a subgraph in which all the nodes are connected.

## Strongly Connected Components
A directed graph is said to be strongly connected if there is a path between all pairs of vertices. A strongly connected component (SCC) of a directed graph is a maximal strongly connected subgraph. In other words, a strongly connected component is a subgraph in which all the nodes are strongly connected.

## Why stanadard DFS doesn't work?
A standard single DFS cannot be used to find the strongly connected components. SCCs involve a more intricate relationship among nodes, which cannot be captured by a single DFS. While DFS marks nodes as visited during backtracking, it doesn't inherently provide a way to distinguish between different strongly connected components.

## Kosaraju's algorithm
Kosaraju's algorithm is a linear time algorithm to find the strongly connected components of a directed graph. It makes use of the fact that the transpose of a graph has the same strongly connected components as the original graph. The algorithm is as follows:
1. Run DFS on the graph and store the order in which the nodes are visited in a stack.
2. Reverse the edges of the graph.
3. Run DFS on the graph in the order of the nodes in the stack. Each DFS will give a strongly connected component.
