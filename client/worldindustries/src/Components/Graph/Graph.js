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
import { personSvg } from './SVG/person.js';
import { corporationSvg } from './SVG/corporation';
import { layoutDefaults } from './CytoScapeDefaults';
import SettingsPopup from './SettingsPopup'

cytoscape.use(fcose);
cytoscape.use(cola);

function Graph() {
	const { layoutSettings, setLayoutSettings } = useContext(LayoutSettingsContext);
	const cyRef = useRef();
	const [elements, setElements] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedLayout, setSelectedLayout] = useState(layoutSettings);
	const person = 'data:image/svg+xml;utf8,' + encodeURIComponent(personSvg);
	const corporation = 'data:image/svg+xml;utf8,' + encodeURIComponent(corporationSvg);
	const [currentMetric, setCurrentMetric] = useState('degreeCentrality');
	const cytoStyle = {
		width: '100%',
		height: '100%',
		position: 'absolute',
		fit: true,
	};
	console.log(selectedLayout)
	useEffect(() => {
		if (cyRef.current) {
			const layout = cyRef.current.layout(selectedLayout);
			layout.stop();
			layout.run();
		}
	}, []);

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
				<FormControl style={{ position: 'absolute', top: '10px', left: '1px', zIndex: 1, width: '120px' }}>
					<InputLabel id="layout-label" shrink>Layout</InputLabel>
					<Select
						labelId="layout-label"
						value={selectedLayout}
						onChange={(event) => setSelectedLayout(layoutDefaults[event.target.value])}
						style={{ height: '30px' }}
					>
						<MenuItem value="fcose">Fcose</MenuItem>
						<MenuItem value="circle">Circle</MenuItem>
						<MenuItem value="cose">Cose</MenuItem>
					</Select>

				</FormControl>


				<FormControl style={{ position: 'absolute', top: '10px', left: '130px', zIndex: 1, width: '120px' }}>
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

				<CytoscapeComponent
					key={selectedLayout.name}
					cy={(cy) => {
						cyRef.current = cy;
					}}
					elements={CytoscapeComponent.normalizeElements(elements)}
					layout={selectedLayout}
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
					userPanningEnabled={true}
				/>
			</div>
		);
	}
}

export default Graph;
