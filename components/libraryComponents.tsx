import Alert from '@mui/material/Alert'
// import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
// import Checkbox from '@mui/material/Checkbox'
// import RadioGroup from '@mui/material/RadioGroup'
// import Rating from '@mui/material/Rating'
// import Select from '@mui/material/Select'
// import Slider from '@mui/material/Slider'
// import Switch from '@mui/material/Switch'
// import TextField from '@mui/material/TextField'
// import ToggleButton from '@mui/material/ToggleButton'

export enum muiComponentName {
  muiAlert = 'muiAlert',
  muiButton = 'muiButton',
}

export const muiComponents = {
  [muiComponentName.muiAlert]: Alert,
  [muiComponentName.muiButton]: Button,
}

export const muiComponentDefaultProps = {
  [muiComponentName.muiAlert]: {
    children: 'New alert',
  },
  // TODO: need way to serialize function props before we can enable Autocomplete
  // [muiComponentNames.muiAutocomplete]: {
  // options: ['item 1', 'item 2', 'item 3'],
  // renderInput: (params) => <TextField {...params} />,
  // },
  [muiComponentName.muiButton]: {
    children: 'New button',
  },
}
