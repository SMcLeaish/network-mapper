import Graph from 'graphology';
import closenessCentrality from 'graphology-metrics/centrality/closeness';
import betweennessCentrality from 'graphology-metrics/centrality/betweenness';
//import eigenvectorCentrality from 'graphology-metrics/centrality/eigenvector';
import {
    degreeCentrality,
    inDegreeCentrality,
    outDegreeCentrality
} from 'graphology-metrics/centrality/degree';

function constructGraph(data) {
  const { nodes, edges } = data;

  let graph = new Graph();

  nodes.forEach(node => {
    graph.addNode(node.id, { 
      label: node.name,
      job: node.job,
      gang: node.gang,
      crimeRecord: node.crimeRecord,
      netWorth: node.netWorth
    });
  });

  edges.forEach(edge => {
    graph.addEdge(edge.source, edge.target, { relationship: edge.relationship });
  });

  let nodeClosenessCentralities = closenessCentrality(graph);
  console.log('Closeness centrality:', nodeClosenessCentralities);
  let nodeBetweennessCentralities = betweennessCentrality(graph);
  console.log('Betweenness centrality:', nodeBetweennessCentralities);
  let nodeDegreeCentralities = degreeCentrality(graph);
  console.log('Degree centrality:', nodeDegreeCentralities);
 // let nodeEigenVectorCentralities = eigenvectorCentrality(graph);
  //  console.log('Degree centrality:', nodeEigenVectorCentralities);
  let updatedNodes = nodes.map(node => {
    return {
      ...node,
      degreeCentrality:nodeDegreeCentralities[node.id],
      closenessCentrality: nodeClosenessCentralities[node.id],
      betweennessCentrality: nodeBetweennessCentralities[node.id],
   //   eigenVectorCentrality: nodeEigenVectorCentralities[node.id],
    }
  });
  console.log('Updated nodes:', updatedNodes);
  console.log('Graph:', graph.export())
  return { updatedNodes, edges };
}
export default constructGraph;
