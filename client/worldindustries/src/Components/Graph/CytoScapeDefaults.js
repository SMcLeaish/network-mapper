import { Slider, Checkbox } from '@mui/material';

export let circle = {
  name: "circle",
  animate: {
    value: true,
    render: (value, handleChange) => <Checkbox checked={value} onChange={(e) => handleChange(e.target.checked)} />
  }
};

export let fcose = {
  name: "fcose",
  animate: {
    value: true,
    render: (value, handleChange) => <Checkbox checked={value} onChange={(e) => handleChange(e.target.checked)} />
  },
  animationDuration: {
    value: 1000,
    render: (value, handleChange) => (
      <div>
        <Slider min={0} max={5000} step={100} value={value} onChange={(e, val) => handleChange(val)} />
        {value}
      </div>
    )
  }
};
