import Graph from 'graphology';
import closenessCentrality from 'graphology-metrics/centrality/closeness';
import betweennessCentrality from 'graphology-metrics/centrality/betweenness';
import degreeCentrality from 'graphology-metrics/centrality/degree';

function constructGraph(data) {
  let graph = new Graph();
  
  // Create a set to avoid duplicate nodes
  let nodeSet = new Set();
  
  data.forEach(item => {
    nodeSet.add(item.id_entity_1);
    nodeSet.add(item.id_entity_2);
  });

  // Create nodes
  nodeSet.forEach(nodeId => {
    graph.addNode(nodeId, { label: nodeId.toString() });
  });
  
  // Create edges
  data.forEach(edge => {
    graph.addEdge(edge.id_entity_1, edge.id_entity_2);
  });

  let nodeClosenessCentralities = closenessCentrality(graph);
  console.log('Closeness centrality:', nodeClosenessCentralities);
  let nodeBetweennessCentralities = betweennessCentrality(graph);
  console.log('Betweenness centrality:', nodeBetweennessCentralities);
  let nodeDegreeCentralities = degreeCentrality(graph);
  console.log('Degree centrality:', nodeDegreeCentralities);
  
  let updatedNodes = Array.from(nodeSet).map(nodeId => {
    return {
      id: nodeId,
      label: nodeId.toString(),
      degreeCentrality: nodeDegreeCentralities[nodeId],
      closenessCentrality: nodeClosenessCentralities[nodeId],
      betweennessCentrality: nodeBetweennessCentralities[nodeId]
    }
  });

  console.log('Updated nodes:', updatedNodes);
  console.log('Graph:', graph.export())
  return { updatedNodes, edges: data };
}
export default constructGraph;
