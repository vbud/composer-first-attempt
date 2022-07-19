import React from 'react'
import Alert, { AlertProps } from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Button, { ButtonProps } from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
// import RadioGroup from '@mui/material/RadioGroup'
// import Rating from '@mui/material/Rating'
import Select, { SelectProps } from '@mui/material/Select'
// import Slider from '@mui/material/Slider'
// import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
// import ToggleButton from '@mui/material/ToggleButton'

// TODO: namespace these component enums so that they are unique (e.g. muiAlert). This will affect serialization (we pull the name off of the rendered component), so we will need to prefix rendered components when serializing, and un-prefix them when deserializing.
enum muiComponentName {
  Alert = 'Alert',
  Autocomplete = 'Autocomplete',
  Button = 'Button',
  Checkbox = 'Checkbox',
  List = 'List',
  ListItem = 'ListItem',
  MenuItem = 'MenuItem',
  Select = 'Select',
  TextField = 'TextField',
}

export const muiComponents = {
  [muiComponentName.Alert]: Alert,
  [muiComponentName.Autocomplete]: Autocomplete,
  [muiComponentName.Button]: Button,
  [muiComponentName.Checkbox]: Checkbox,
  [muiComponentName.List]: List,
  [muiComponentName.ListItem]: ListItem,
  [muiComponentName.MenuItem]: MenuItem,
  [muiComponentName.Select]: Select,
  [muiComponentName.TextField]: TextField,
}
export const muiDrawableComponents = {
  [muiComponentName.Alert]: <Alert>New Alert!</Alert>,
  // [muiComponentName.Autocomplete]: (
  //   <Autocomplete
  //     options={[
  //       { label: 'The Shawshank Redemption', year: 1994 },
  //       { label: 'The Godfather', year: 1972 },
  //       { label: 'The Godfather: Part II', year: 1974 },
  //       { label: 'The Dark Knight', year: 2008 },
  //       { label: '12 Angry Men', year: 1957 },
  //       { label: "Schindler's List", year: 1993 },
  //       { label: 'Pulp Fiction', year: 1994 },
  //       {
  //         label: 'The Lord of the Rings: The Return of the King',
  //         year: 2003,
  //       },
  //       { label: 'The Good, the Bad and the Ugly', year: 1966 },
  //       { label: 'Fight Club', year: 1999 },
  //       {
  //         label: 'The Lord of the Rings: The Fellowship of the Ring',
  //         year: 2001,
  //       },
  //       {
  //         label: 'Star Wars: Episode V - The Empire Strikes Back',
  //         year: 1980,
  //       },
  //     ]}
  //     sx={{ width: 300 }}
  //     renderInput={(params) => <TextField {...params} label="Movie" />}
  //   />
  // ),
  [muiComponentName.Button]: <Button>New Button!</Button>,
  [muiComponentName.Checkbox]: <Checkbox />,
  [muiComponentName.List]: (
    <List>
      <ListItem>One</ListItem>
      <ListItem>Two</ListItem>
      <ListItem>Three</ListItem>
    </List>
  ),
  [muiComponentName.Select]: (
    <Select value="" onChange={() => {}}>
      <MenuItem value="1">Option 1</MenuItem>
      <MenuItem value="2">Option 2</MenuItem>
      <MenuItem value="3">Option 3</MenuItem>
    </Select>
  ),
}

const SERIALIZATION_TYPE_PROPERTY = '__serializationType__'
enum SerializationType {
  reactElement = 'reactElement',
}

export type SerializedComponent = {
  // TODO: maybe something more elegant?
  [SERIALIZATION_TYPE_PROPERTY]: SerializationType
  name: muiComponentName
  // TODO: can make `any` more specific to any valid JSON type (string, number, boolean, null, array, object)
  props: { [key: string]: any }
}

// TODO: should rename "component" to "element"
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
    [SERIALIZATION_TYPE_PROPERTY]: SerializationType.reactElement,
    // TODO: what if top-level component is not the "component" we are drawing?
    name: component.type.render.name,
    props,
  }
}

function isSerializedComponent(input: any): boolean {
  return (
    input != null &&
    input.hasOwnProperty(SERIALIZATION_TYPE_PROPERTY) &&
    input[SERIALIZATION_TYPE_PROPERTY] === SerializationType.reactElement
  )
}

export function deserializeComponent(
  component: SerializedComponent,
  key?: string // TODO: this ugly, maybe return the Component and props instead so callers can add whatever props they want
): React.ReactElement {
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

  return React.createElement(muiComponents[component.name], { ...props, key })
}
