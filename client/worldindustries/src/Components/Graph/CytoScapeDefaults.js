import { Slider, Checkbox } from '@mui/material';

export const layoutDefaults = {
  circle: {
    name: "circle",
    animate: true
    }
  ,
  fcose: {
    
        name: 'fcose',
        // Whether to fit the network view after when done
        fit: true,
        // Padding on fit
        padding: 80,
        // Whether to enable incremental mode
        animate: true,
        // Node repulsion (non overlapping) multiplier
        nodeRepulsion: 24500,
        // Ideal edge (non nested) length
        idealEdgeLength: 200,
        // Divisor to compute edge forces
        edgeElasticity: 0.45,
        // Nesting factor (multiplier) to compute ideal edge length for nested edges
        nestingFactor: 0.1,
        // Gravity force (constant)
        gravity: 0.25,
        // Maximum number of iterations to perform
        numIter: 1000,
        // Whether to tile disconnected nodes
        tile: true,
        // Type of layout animation. The option set is {'during', 'end', false}
        animate: 'end',
        // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
        tilingPaddingVertical: 10,
        // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
        tilingPaddingHorizontal: 10,
        // Gravity range (constant)
        gravityRangeCompound: 1.5,
        // Gravity force (constant) for compounds
        gravityCompound: 1.0,
        // Gravity range (constant)
        gravityRange: 3.8
      }

}
export const RenderDefaults = {}