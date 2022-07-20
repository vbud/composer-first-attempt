import React from 'react'
import Alert, { AlertProps } from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Button, { ButtonProps } from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import List, { ListProps } from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Select, { SelectProps } from '@mui/material/Select'
import TextField, { TextFieldProps } from '@mui/material/TextField'

export type ComponentConfig = {
  muiAlert: {
    severity: AlertProps['severity']
    content: AlertProps['children']
  }
  muiAutocomplete: {
    textFieldLabel: TextFieldProps['label']
    options: ReadonlyArray<{ label: string }>
  }
  muiButton: {
    content: ButtonProps['children']
  }
  muiCheckbox: {
    defaultChecked: CheckboxProps['defaultChecked']
  }
  muiList: {
    dense: ListProps['dense']
    items: Array<string>
  }
  muiSelect: {
    value: SelectProps['value']
    options: Array<string>
  }
}

export const drawableComponents: {
  [Property in keyof ComponentConfig]: {
    defaultConfig: ComponentConfig[Property]
    render: (config: ComponentConfig[Property]) => React.ReactElement
  }
} = {
  muiAlert: {
    defaultConfig: {
      severity: 'success',
      content: 'New alert',
    },
    render: (config) => (
      <Alert severity={config.severity}>{config.content}</Alert>
    ),
  },
  muiAutocomplete: {
    defaultConfig: {
      textFieldLabel: 'Soup',
      options: [
        { label: 'Minestrone' },
        { label: 'Chicken noodle' },
        { label: 'Lentil' },
      ],
    },
    render: (config) => (
      <Autocomplete
        options={config.options}
        renderInput={(params) => (
          <TextField {...params} label={config.textFieldLabel} />
        )}
      />
    ),
  },
  muiButton: {
    defaultConfig: {
      content: 'New button',
    },
    render: (config) => <Button>{config.content}</Button>,
  },
  muiCheckbox: {
    defaultConfig: {
      defaultChecked: false,
    },
    render: (config) => <Checkbox defaultChecked={config.defaultChecked} />,
  },
  muiList: {
    defaultConfig: {
      dense: false,
      items: ['One', 'Two', 'Three'],
    },
    render: (config) => (
      <List dense={config.dense}>
        {config.items.map((item) => (
          <ListItem key={item}>{item}</ListItem>
        ))}
      </List>
    ),
  },
  muiSelect: {
    defaultConfig: {
      value: '',
      options: ['apple', 'orange', 'banana'],
    },
    render: (config) => (
      <Select label="Fruit" value={config.value}>
        {config.options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    ),
  },
}
