import React, { useEffect, useState, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import fcose from 'cytoscape-fcose';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import constructGraph from './Graphology';
import './Graph.css'; 
cytoscape.use(fcose);
cytoscape.use(cola);

function Graph() {
	const cyRef = useRef();
	const [elements, setElements] = useState([]);

	const [currentMetric, setCurrentMetric] = useState('degreeCentrality');  
  const [loading, setLoading] = useState(true);



	useEffect(() => {
    fetch('https://localhost:3001/network/John Doe')
			.then(response => response.json())
			.then(data => {
				console.log('Data fetched:', data);
				const graphData = constructGraph(data);
				console.log('Graph data:', graphData);
				let cytoscapeElements = [];
				graphData.updatedNodes.forEach(node => {
					cytoscapeElements.push({
						data: {
							id: node.id,
							label: node.name,
							degreeCentrality: node.degreeCentrality,
							closenessCentrality: node.closenessCentrality,
							betweennessCentrality: node.betweennessCentrality,
							//	eigenvectorCentrality: node.eigenvectorCentrality,
							party: node.party,
						}
					});
				});
        console.log('Edges:', graphData.edges);
				graphData.edges.forEach(edge => {
					cytoscapeElements.push({
						data: { id: `edge${edge.source}-${edge.target}`, source: edge.source, target: edge.target }
					});
				});

				setElements(cytoscapeElements);
        console.log('Elements:', elements);
				setLoading(false);
			})
			.catch(err => console.error(err));
	}, []);

	const graphMetrics = {
		degreeCentrality : "Degree Centrality",
		closenessCentrality : "Closeness Centrality",
		betweennessCentrality : "Betweenness Centrality",
		//	eigenvectorCentrality : "Eigenvector Centrality"
	}


	const layoutConfigs = {
		"grid": { name: 'grid' },
		"circle": { name: 'circle', animate: true,
			animationDuration: 500, },
		"breadthfirst": { name: 'breadthfirst' },
		"cose": { 
			name: 'cose',
			idealEdgeLength: 100,
			nodeOverlap: 20,
			refresh: 20,
			fit: true,
			padding: 30,
			randomize: false,
			componentSpacing: 100,
			nodeRepulsion: 40000000,
			edgeElasticity: 100,
			nestingFactor: 5,
			gravity: 80,
			numIter: 1000,
			initialTemp: 200,
			coolingFactor: 0.95,
			minTemp: 1.0,
			animate: true,
			animationDuration: 500,
		},
		"concentric": { name: 'concentric' },
		"random": { name: 'random' },
		"fcose": { name: 'fcose'}
	};


	const [layout, setLayout] = useState(layoutConfigs.circle);
	const cytoStyle = {
		width: '100%',
		height: '100%',
		position: 'absolute',
    fit:true
	};
	useEffect(() => {
		if (cyRef.current) {
			cyRef.current.ready(function () {
				this.layout({ name: 'circle' }).run();
			});
		}
	}, []);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  } else {
	return (
    <div style={{ position: 'relative', height: '100vh', width: '100%'  }}>

			<select
				value={layout.name}
				onChange={(event) => setLayout(layoutConfigs[event.target.value])}
				style={{
					position: 'absolute',
					top: '10px',
					left: '10px',
					zIndex: 1
				}}
			>
				{Object.keys(layoutConfigs).map(key =>
				<option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
				)}
			</select>

			<select
				style={{
					position: 'absolute',
					top: '10px',
					left: '150px',
					zIndex: 1
				}}
				onChange={(event) => setCurrentMetric(event.target.value)}
			>
				{Object.entries(graphMetrics).map(([metricKey, metricValue]) =>
				<option key={metricKey} value={metricKey}>{metricValue}</option>
				)}
			</select>

			<CytoscapeComponent
				cy={cy => { cyRef.current = cy; }}
				elements={CytoscapeComponent.normalizeElements(elements)}
				layout={layout}
				style={cytoStyle}
				stylesheet={[
					{
						selector: 'node',
							style: {
								'content': 'data(label)',
									'width': node => (node.data(currentMetric) !== undefined && !isNaN(node.data(currentMetric))) ? 20 + (node.data(currentMetric) *50) : 20,
									'height': node => (node.data(currentMetric) !== undefined && !isNaN(node.data(currentMetric))) ? 20 + (node.data(currentMetric) *50): 20,
									'background-color': node => {
										switch(node.data('party')) {
											case 'Red': return 'red';
											case 'Blue': return 'blue';
											case 'Green': return 'green';
											default: return 'grey';
										}
									},
							},
					},
					{
						selector: 'edge',
						style: {
							'curve-style': 'bezier',
						},
					},
				]}

			/>

		</div>
	);
}
} 
export default Graph;
