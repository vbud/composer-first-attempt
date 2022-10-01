import React from 'react'
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'

import { ComponentConfig } from 'types'
import { muiIcons } from './icons'

export const drawableComponents: {
  [Property in keyof ComponentConfig]: {
    isLayoutComponent?: boolean
    defaultConfig: ComponentConfig[Property]
    render: (
      config: ComponentConfig[Property],
      children?: React.ReactNode
    ) => React.ReactElement
  }
} = {
  layoutFlex: {
    isLayoutComponent: true,
    defaultConfig: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0,
    },
    render: (config, children) => (
      <div style={{ display: 'flex', ...config }}>{children}</div>
    ),
  },
  layoutGrid: {
    isLayoutComponent: true,
    defaultConfig: {
      gridTemplateRows: 'auto',
      gridTemplateColumns: 'auto',
      gridTemplateAreas: 'none',
      alignItems: 'stretch',
      justifyItems: 'start',
      gap: 0,
    },
    render: (config, children) => (
      <div style={{ display: 'grid', ...config }}>{children}</div>
    ),
  },
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
      options: ['Minestrone', 'Chicken noodle', 'Lentil'],
    },
    render: (config) => (
      <Autocomplete
        options={config.options}
        getOptionLabel={(option) => option}
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
  muiButtonGroup: {
    defaultConfig: {
      variant: 'outlined',
      buttons: ['Button 1', 'Button 2', 'Button 3'],
    },
    render: (config) => (
      <ButtonGroup variant={config.variant}>
        {config.buttons.map((button) => (
          <Button key={button}>{button}</Button>
        ))}
      </ButtonGroup>
    ),
  },
  muiCheckbox: {
    defaultConfig: {
      checked: false,
    },
    render: (config) => <Checkbox checked={config.checked} />,
  },
  muiIcon: {
    defaultConfig: {
      name: 'home',
    },
    render: (config) => {
      const IconComponent = muiIcons[config.name]
      return <IconComponent />
    },
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
  muiRadioGroup: {
    defaultConfig: {
      label: 'Color',
      value: 'red',
      options: ['red', 'blue', 'green'],
    },
    render: (config) => (
      <FormControl>
        <RadioGroup value={config.value}>
          <FormLabel>{config.label}</FormLabel>
          {config.options.map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              label={option}
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      </FormControl>
    ),
  },
  muiSelect: {
    defaultConfig: {
      value: 'apple',
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
  muiTable: {
    defaultConfig: {
      columnNames: [
        'Dessert (100g serving)',
        'Calories',
        'Fat (g)',
        'Carbs (g)',
        'Protein (g)',
      ],
      rows: [
        ['Frozen yoghurt', 159, 6.0, 24, 4.0],
        ['Ice cream sandwich', 237, 9.0, 37, 4.3],
        ['Eclair', 262, 16.0, 24, 6.0],
        ['Cupcake', 305, 3.7, 67, 4.3],
        ['Gingerbread', 356, 16.0, 49, 3.9],
      ],
    },
    render: (config) => (
      <Table>
        <TableHead>
          <TableRow>
            {config.columnNames.map((columnName) => (
              <TableCell key={columnName}>{columnName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {config.rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, i) => (
                <TableCell key={i}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
  },
  muiTabs: {
    defaultConfig: {
      currentTab: 0,
      labels: ['Tab 1', 'Tab 2', 'Tab 3'],
    },
    render: (config) => (
      <Tabs value={config.currentTab}>
        {config.labels.map((label, i) => (
          <Tab key={i} label={label} />
        ))}
      </Tabs>
    ),
  },
  muiTextField: {
    defaultConfig: {
      label: 'Phone number',
      value: '(555) 123-4567',
    },
    render: (config) => <TextField label={config.label} value={config.value} />,
  },
}
