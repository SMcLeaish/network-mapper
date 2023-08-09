import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Graph from './Graph';
import SettingsPopup from './SettingsPopup';
import { layoutDefaults } from './CytoScapeDefaults';

export const GraphContext = React.createContext();

function GraphDialog({ open, onClose, name }) {
  let [layoutSettings, setLayoutSettings] = useState(layoutDefaults.circle);
  const [detailsPageOpen, setDetailsPageOpen] = useState(false);
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableMetrics, setAvailableMetrics] = useState({});
  const [currentMetric, setCurrentMetric] = useState('degreeCentrality');

  const handleNodeTap = () => {
    onClose(); // Close the current dialog
    setDetailsPageOpen(true); // Open the DetailsPage dialog
  };

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
  }, [name]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={'lg'} PaperProps={{ style: { height: '100vh', overflowY: 'unset' } }}>
      <DialogContent dividers>
        <GraphContext.Provider value={{
          layoutSettings, setLayoutSettings,
          detailsPageOpen, setDetailsPageOpen,
          elements, setElements,
          loading,
          availableMetrics, setAvailableMetrics,
          currentMetric, setCurrentMetric
        }}>
          <Graph name={name} />
          <SettingsPopup />
        </GraphContext.Provider>
      </DialogContent>
    </Dialog>
  );
}

export default GraphDialog;
