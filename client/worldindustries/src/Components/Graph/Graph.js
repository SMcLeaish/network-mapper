import React, { useEffect, useState, useRef, useContext } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import fcose from 'cytoscape-fcose';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { LayoutSettingsContext } from './GraphDialog';
import constructGraph from './Graphology';
import './Graph.css';
import { personSvg } from './SVG/person.js';
import { corporationSvg } from './SVG/corporation';

cytoscape.use(fcose);
cytoscape.use(cola);

function Graph() {
	const { layoutSettings } = useContext(LayoutSettingsContext);
	const layoutConfig = layoutSettings

	let person = 'data:image/svg+xml;utf8,' + encodeURIComponent(personSvg);
	let corporation = 'data:image/svg+xml;utf8,' + encodeURIComponent(corporationSvg);
	const cyRef = useRef();
	const [elements, setElements] = useState([]);
	const [currentMetric, setCurrentMetric] = useState('degreeCentrality');
	const [loading, setLoading] = useState(true);
	const [layout, setLayout] = useState(layoutConfig);

	const cytoStyle = {
		width: '100%',
		height: '100%',
		position: 'absolute',
		fit: true,
	};

	useEffect(() => {
		fetch('https://localhost:3001/network/John Doe')
			.then((response) => response.json())
			.then((data) => {
				const graphData = constructGraph(data);
				let cytoscapeElements = [];
				graphData.updatedNodes.forEach((node) => {
					cytoscapeElements.push({
						data: {
							id: node.id,
							label: node.name,
							degreeCentrality: node.degreeCentrality,
							closenessCentrality: node.closenessCentrality,
							betweennessCentrality: node.betweennessCentrality,
							party: node.party,
							type: node.type,
						},
					});
				});
				graphData.edges.forEach((edge) => {
					cytoscapeElements.push({
						data: { id: `edge${edge.source}-${edge.target}`, source: edge.source, target: edge.target },
					});
				});

				setElements(cytoscapeElements);
				setLoading(false);
			})
			.catch((err) => console.error(err));
	}, []);

	const graphMetrics = {
		degreeCentrality: 'Degree Centrality',
		closenessCentrality: 'Closeness Centrality',
		betweennessCentrality: 'Betweenness Centrality',
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
				<CircularProgress />
			</Box>
		);
	} else {
		return (
			<div style={{ position: 'relative', height: '100%', width: '100%' }}>
				<FormControl style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1, width: '120px' }}>
					<InputLabel id="metric-label" shrink>Metric</InputLabel>
					<Select
						labelId="metric-label"
						onChange={(event) => setCurrentMetric(event.target.value)}
						style={{ height: '30px' }}
					>
						{Object.entries(graphMetrics).map(([metricKey, metricValue]) =>
							<MenuItem key={metricKey} value={metricKey}>{metricValue}</MenuItem>
						)}
					</Select>
				</FormControl>

				{/* Additional form controls if needed */}
				<CytoscapeComponent
					cy={(cy) => {
						cyRef.current = cy;
					}}
					elements={CytoscapeComponent.normalizeElements(elements)}
					layout={layout}
					style={cytoStyle}
					stylesheet={[
						{
							selector: 'node',
							style: {
								'background-image': (node) => (node.data('type') === 'individual' ? person : corporation),
								'background-fit': 'cover cover',
								'content': 'data(label)',
								'width': (node) => (node.data(currentMetric) !== undefined && !isNaN(node.data(currentMetric))) ? 20 + node.data(currentMetric) * 50 : 20,
								'height': (node) => (node.data(currentMetric) !== undefined && !isNaN(node.data(currentMetric))) ? 20 + node.data(currentMetric) * 50 : 20,
								'background-color': '#3F88C5',
								'color': '#F8F4E3',
								'text-valign': 'bottom',
								'text-halign': 'center',
								'text-background-color': '#3F88C5',
								'text-background-opacity': 0.5,
								'text-background-shape': 'roundrectangle',
								'text-border-width': 1,
								'text-border-color': '#3F88C5',
								'text-border-opacity': 1,
								'text-wrap': 'ellipsis',
								'font-family': 'sans-serif',
								'font-weight': 'normal',
								'font-size': 10,
								'text-opacity': 0.7,
							},
						},
						{
							selector: 'edge',
							style: {
								'line-color': 'black',
								'line-opacity': 0.5,
								'width': 1,
								'curve-style': 'haystack',
							},
						},
					]}
					userPanningEnabled={false}
				/>
			</div>
		);
	}
}

export default Graph;
