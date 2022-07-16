import Alert, { AlertProps } from '@mui/material/Alert'
// import Autocomplete from '@mui/material/Autocomplete'
import Button, { ButtonProps } from '@mui/material/Button'
// import Checkbox from '@mui/material/Checkbox'
// import RadioGroup from '@mui/material/RadioGroup'
// import Rating from '@mui/material/Rating'
// import Select, { SelectProps } from '@mui/material/Select'
// import Slider from '@mui/material/Slider'
// import Switch from '@mui/material/Switch'
// import TextField from '@mui/material/TextField'
// import ToggleButton from '@mui/material/ToggleButton'

export enum muiComponentName {
  muiAlert = 'muiAlert',
  muiButton = 'muiButton',
  // muiSelect = 'muiSelect',
}

export const muiComponents = {
  [muiComponentName.muiAlert]: Alert,
  [muiComponentName.muiButton]: Button,
  // [muiComponentName.muiSelect]: Select,
}

export const muiComponentDefaultProps: {
  [muiComponentName.muiAlert]: AlertProps
  [muiComponentName.muiButton]: ButtonProps
  // [muiComponentName.muiSelect]: SelectProps
} = {
  [muiComponentName.muiAlert]: {
    children: 'New Alert',
  },
  // TODO: need way to serialize function props before we can enable Autocomplete
  // [muiComponentNames.muiAutocomplete]: {
  // options: ['item 1', 'item 2', 'item 3'],
  // renderInput: (params) => <TextField {...params} />,
  // },
  [muiComponentName.muiButton]: {
    children: 'New Button',
  },
  // [muiComponentName.muiSelect]: {
  //   children: 'New Select',
  // },
}
