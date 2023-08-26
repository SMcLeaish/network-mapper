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
    },
    cise: {
        name: "cise",
        animate: false,

        // number of ticks per frame; higher is faster but more jerky
        refresh: 10,

        // Animation duration used for animate:'end'
        animationDuration: undefined,

        // Easing for animate:'end'
        animationEasing: undefined,

        // Whether to fit the viewport to the repositioned graph
        // true : Fits at end of layout for animate:false or animate:'end'
        fit: true,

        // Padding in rendered co-ordinates around the layout
        padding: 30,

        // separation amount between nodes in a cluster
        // note: increasing this amount will also increase the simulation time 
        nodeSeparation: 12.5,

        // Inter-cluster edge length factor 
        // (2.0 means inter-cluster edges should be twice as long as intra-cluster edges)
        idealInterClusterEdgeLengthCoefficient: 1.4,

        // Whether to pull on-circle nodes inside of the circle
        allowNodesInsideCircle: false,

        // Max percentage of the nodes in a circle that can move inside the circle
        maxRatioOfNodesInsideCircle: 0.1,

        // - Lower values give looser springs
        // - Higher values give tighter springs
        springCoeff: 0.45,

        // Node repulsion (non overlapping) multiplier
        nodeRepulsion: 4500,

        // Gravity force (constant)
        gravity: 0.25,

        // Gravity range (constant)
        gravityRange: 3.8,
    }
}
export const RenderDefaults = {


}