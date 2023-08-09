import React, { useEffect, useState, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import CytoscapeComponent from 'react-cytoscapejs';
import fcose from 'cytoscape-fcose';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import cise from 'cytoscape-cise';
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
import SettingsPopup from './SettingsPopup';
import { degreeCentrality } from 'graphology-metrics/centrality/degree';
import Popover from '@mui/material/Popover';
import DetailsPage from '../DetailsPage/DetailsPage';
cytoscape.use(fcose);
cytoscape.use(cola);
cytoscape.use(cise);
function Graph({ name }) {
	console.log(name)
	const [layoutSettings, setLayoutSettings] = useContext(LayoutSettingsContext);
	const cyRef = useRef();
	const [elements, setElements] = useState([]);
	const [loading, setLoading] = useState(true);
	// const [selectedLayout, setSelectedLayout] = useState(layoutSettings);
	const person = 'data:image/svg+xml;utf8,' + encodeURIComponent(personSvg);
	const corporation = 'data:image/svg+xml;utf8,' + encodeURIComponent(corporationSvg);
	const [currentMetric, setCurrentMetric] = useState('degreeCentrality');
	const [anchorPosition, setAnchorPosition] = useState({ top: 0, left: 0 });
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [availableMetrics, setAvailableMetrics] = useState({});

	const cytoStyle = {
		width: '100%',
		height: '100%',
		position: 'absolute',
		fit: true,
	};
	console.log(layoutSettings)
	useEffect(() => {
		if (cyRef.current) {
			const layout = cyRef.current.layout(layoutSettings);
			layout.stop();
			layout.run();
		}
	}, []);
	// const handleNodeTap = (event) => {
	// 	const node = event.target;
	// 	const renderedPosition = node.renderedPosition();
	// 	const cyContainer = cyRef.current.container();
	// 	const boundingBox = cyContainer.getBoundingClientRect();

	// 	setAnchorPosition({
	// 	  top: renderedPosition.y + boundingBox.top,
	// 	  left: renderedPosition.x + boundingBox.left,
	// 	});
	// 	setPopoverOpen(true);
	//   };


	useEffect(() => {
		fetch(`http://localhost:8000/process-network/${name}`)
			.then((response) => response.json())
			.then((data) => {
				let cytoscapeElements = [];
				data.nodes.forEach((node) => {
					cytoscapeElements.push({
						data: {...node}
					});
				});
				data.links.forEach((edge) => {
					cytoscapeElements.push({
						data: { id: `edge${edge.source}-${edge.target}`, source: edge.source, target: edge.target },
					});
				});
				setAvailableMetrics(data.availableMetrics);
				setElements(cytoscapeElements);
				setLoading(false);
			})
			.catch((err) => console.error(err));
	}, []);


	// const graphMetrics = {
	// 	degreeCentrality: 'Degree Centrality',
	// 	closenessCentrality: 'Closeness Centrality',
	// 	betweennessCentrality: 'Betweenness Centrality',
	// };

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
				<CircularProgress />
			</Box>
		);
	} else {
		return (
			<div style={{ position: 'relative', height: '100%', width: '100%' }}>
				<Popover
					open={popoverOpen}
					anchorReference="anchorPosition"
					anchorPosition={anchorPosition}
					onClose={() => setPopoverOpen(false)}
				>
					<div style={{ padding: '10px' }}>Hello, World!</div>
				</Popover>
				<FormControl style={{ position: 'absolute', top: '10px', left: '1px', zIndex: 1, width: '120px' }}>
					<InputLabel id="layout-label" shrink>Layout</InputLabel>
					<Select
						labelId="layout-label"
						value={layoutSettings}
						onChange={(event) => setLayoutSettings(layoutDefaults[event.target.value])}
						style={{ height: '30px' }}
					>
						<MenuItem value="fcose">fcose</MenuItem>
						<MenuItem value="circle">circle</MenuItem>
						<MenuItem value="cise">cise</MenuItem>
					</Select>
				</FormControl>
				<FormControl style={{ position: 'absolute', top: '10px', left: '130px', zIndex: 1, width: '120px' }}>
					<InputLabel id="metric-label" shrink>Metric</InputLabel>
					<Select
						labelId="metric-label"
						value={degreeCentrality}
						onChange={(event) => setCurrentMetric(event.target.value)}
						style={{ height: '30px' }}
					>
						{Object.entries(availableMetrics).map(([metricKey, metricValue]) =>
							<MenuItem key={metricKey} value={metricKey}>{metricValue}</MenuItem>
						)}
					</Select>
				</FormControl>
				<CytoscapeComponent
					key={layoutSettings.name}
					cy={(cy) => {
						cyRef.current = cy;
						// cy.on('tap', 'node', handleNodeTap);
					}}
					elements={CytoscapeComponent.normalizeElements(elements)}
					layout={layoutSettings}
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
