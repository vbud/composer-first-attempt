import React from 'react'
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
// import RadioGroup from '@mui/material/RadioGroup'
// import Rating from '@mui/material/Rating'
import Select from '@mui/material/Select'
// import Slider from '@mui/material/Slider'
// import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
// import ToggleButton from '@mui/material/ToggleButton'

// TODO: namespace these component names so that they are unique (e.g. "muiAlert" instead of "Alert"). This will affect serialization (we pull the name off of the rendered component), so we will need to prefix rendered components when serializing, and un-prefix them when deserializing.
export const muiComponents = {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
}

type MuiComponentName = keyof typeof muiComponents

const SERIALIZATION_TYPE_PROPERTY = '__serializationType__'
enum SerializationType {
  reactComponent = 'reactComponent',
  renderProp = 'renderProp',
}

export type SerializedComponent = {
  [SERIALIZATION_TYPE_PROPERTY]: SerializationType.reactComponent
  componentName: MuiComponentName
  // TODO: can make `any` more specific to any valid JSON type (string, number, boolean, null, array, object)
  props: { [key: string]: any }
}

export type SerializedRenderProp = {
  [SERIALIZATION_TYPE_PROPERTY]: SerializationType.renderProp
  componentName: MuiComponentName
  // TODO: can make `any` more specific to any valid JSON type (string, number, boolean, null, array, object) or nested SerializedComponents or SerializedRenderProps
  props: { [key: string]: any }
}

export const muiDrawableComponents = {
  Alert: serializeComponent(<Alert>New Alert!</Alert>),
  Autocomplete: {
    [SERIALIZATION_TYPE_PROPERTY]: SerializationType.reactComponent,
    componentName: 'Autocomplete',
    props: {
      options: [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: 'Pulp Fiction', year: 1994 },
        {
          label: 'The Lord of the Rings: The Return of the King',
          year: 2003,
        },
        { label: 'The Good, the Bad and the Ugly', year: 1966 },
        { label: 'Fight Club', year: 1999 },
        {
          label: 'The Lord of the Rings: The Fellowship of the Ring',
          year: 2001,
        },
        {
          label: 'Star Wars: Episode V - The Empire Strikes Back',
          year: 1980,
        },
      ],
      renderInput: {
        [SERIALIZATION_TYPE_PROPERTY]: SerializationType.renderProp,
        // TODO: update `muiComponentName` to `ComponentName` once we support other libraries
        componentName: 'TextField',
        props: {
          label: 'Movie',
        },
      },
    },
  },
  Button: serializeComponent(<Button>New Button!</Button>),
  Checkbox: serializeComponent(<Checkbox />),
  List: serializeComponent(
    <List>
      <ListItem>One</ListItem>
      <ListItem>Two</ListItem>
      <ListItem>Three</ListItem>
    </List>
  ),
  Select: serializeComponent(
    <Select value="">
      <MenuItem value="1">Option 1</MenuItem>
      <MenuItem value="2">Option 2</MenuItem>
      <MenuItem value="3">Option 3</MenuItem>
    </Select>
  ),
}

// TODO: deprecate this and just define all components in serialized form?
// Note: Only supports serializing components with function props. Used internally to make defining drawable components easier.
function serializeComponent(
  // TODO: narrow type so `string` is not a valid component
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
    [SERIALIZATION_TYPE_PROPERTY]: SerializationType.reactComponent,
    // TODO: what if top-level component is not the "component" we are drawing?
    componentName: component.type.render.name,
    props,
  }
}

function isSerializedComponent(input: any): boolean {
  return (
    input != null &&
    input.hasOwnProperty(SERIALIZATION_TYPE_PROPERTY) &&
    input[SERIALIZATION_TYPE_PROPERTY] === SerializationType.reactComponent
  )
}

function isSerializedRenderProp(input: any): boolean {
  return (
    input != null &&
    input.hasOwnProperty(SERIALIZATION_TYPE_PROPERTY) &&
    input[SERIALIZATION_TYPE_PROPERTY] === SerializationType.renderProp
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

    if (isSerializedRenderProp(props[propKey])) {
      props[propKey] = deserializeRenderProp(props[propKey])
    }
  })

  if (typeof key === 'string') {
    props.key = key
  }

  return React.createElement(muiComponents[component.componentName], {
    ...props,
    key,
  })
}

function deserializeRenderProp(
  renderProp: SerializedRenderProp
): (params: AutocompleteRenderInputParams) => React.ReactNode {
  // eslint-disable-next-line react/display-name
  return (params) =>
    React.createElement(muiComponents[renderProp.componentName], {
      ...params,
      ...renderProp.props,
    })
}
