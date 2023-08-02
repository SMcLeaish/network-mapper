import { Slider, Checkbox } from '@mui/material';

export const layoutDefaults = {
  circle: {
    name: "circle",
    animate: true
    }
  ,
  fcose: {
        name: 'fcose',
        animate: false,
        randomize: true,
        nodeRepulsion: 4500,
        idealEdgeLength: 50,
        edgeElasticity: 0.45,
        nestingFactor: 0.1,
        gravity: 0.25,
        numIter: 2500,
        tile: true,
        tilingPaddingVertical: 10,
        tilingPaddingHorizontal: 10,
        gravityRangeCompound: 1.5,
        gravityCompound: 1.0,
        gravityRange: 3.8,
        initialEnergyOnIncremental: 0.5
    
  }, 
  cose: {
    name: 'cose',
  animate: true,
  randomize: false,
  componentSpacing: 100,
  nodeOverlap: 20,
  fit: true,
  padding: 30,
  nodeRepulsion: (node) => 400000,
  idealEdgeLength: (edge) => 100,
  edgeElasticity: (edge) => 100,
  nestingFactor: 5,
  gravity: 80,
  numIter: 1000,
  initialTemp: 200,
  coolingFactor: 0.95,
  minTemp: 1.0,
  }
}
export const RenderDefaults = {}