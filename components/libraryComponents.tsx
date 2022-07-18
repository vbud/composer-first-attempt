import React from 'react'
import Alert, { AlertProps } from '@mui/material/Alert'
// import Autocomplete from '@mui/material/Autocomplete'
import Button, { ButtonProps } from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
// import Checkbox from '@mui/material/Checkbox'
// import RadioGroup from '@mui/material/RadioGroup'
// import Rating from '@mui/material/Rating'
import Select, { SelectProps } from '@mui/material/Select'
// import Slider from '@mui/material/Slider'
// import Switch from '@mui/material/Switch'
// import TextField from '@mui/material/TextField'
// import ToggleButton from '@mui/material/ToggleButton'

// TODO: namespace these component enums so that they are unique (e.g. muiAlert). This will affect serialization (we pull the name off of the rendered component), so we will need to prefix rendered components when serializing, and un-prefix them when deserializing.
export enum muiComponentName {
  Alert = 'Alert',
  Button = 'Button',
  Select = 'Select',
}

export const muiComponents = {
  [muiComponentName.Alert]: Alert,
  [muiComponentName.Button]: Button,
  [muiComponentName.Select]: Select,
}

export const muiDefaultComponents = {
  [muiComponentName.Alert]: <Alert>New Alert!</Alert>,
  [muiComponentName.Button]: <Button>New Button!</Button>,
  [muiComponentName.Select]: (
    <Select value="" onChange={() => {}}>
      <MenuItem value="1">Option 1</MenuItem>
      <MenuItem value="2">Option 2</MenuItem>
      <MenuItem value="3">Option 3</MenuItem>
    </Select>
  ),
}

const IS_SERIALIZED_COMPONENT_IDENTIFIER = '__isSerializedComponent__'

export type SerializedComponent = {
  // TODO: maybe something more elegant?
  [IS_SERIALIZED_COMPONENT_IDENTIFIER]: boolean
  name: muiComponentName
  // TODO: can make `any` more specific to any valid JSON type (string, number, boolean, null, array, object)
  props: { [key: string]: any }
}

export function serializeComponent(
  component: React.ReactElement
): SerializedComponent {
  const props = { ...component.props }

  Object.keys(props).forEach((propKey) => {
    if (React.isValidElement(props[propKey])) {
      props[propKey] = serializeComponent(props[propKey])
    }

    if (
      Array.isArray(props[propKey]) &&
      React.isValidElement(props[propKey][0])
    ) {
      props[propKey] = props[propKey].map(serializeComponent)
    }
  })

  return {
    __isSerializedComponent__: true,
    // TODO: what if top-level component is not the "component" we are drawing?
    name: component.type.render.name,
    props,
  }
}

function isSerializedComponent(input: React.ReactNode): boolean {
  return (
    input != null && input.hasOwnProperty(IS_SERIALIZED_COMPONENT_IDENTIFIER)
  )
}

export function deserializeComponent(
  component: SerializedComponent,
  key?: string // TODO: this ugly, maybe return the Component and props instead so callers can add whatever props they want
): React.ReactElement {
  const Component = muiComponents[component.name]
  const props = { ...component.props }

  Object.keys(props).forEach((propKey) => {
    if (isSerializedComponent(props[propKey])) {
      props[propKey] = deserializeComponent(props[propKey])
    }

    if (
      Array.isArray(props[propKey]) &&
      isSerializedComponent(props[propKey][0])
    ) {
      props[propKey] = props[propKey].map(deserializeComponent)
    }
  })

  if (typeof key === 'string') {
    props.key = key
  }

  return <Component {...props} />
}
