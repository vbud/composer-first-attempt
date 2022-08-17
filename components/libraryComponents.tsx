import React from 'react'
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'

import { ComponentConfig } from 'types'

export const drawableComponents: {
  [Property in keyof ComponentConfig]: {
    defaultConfig: ComponentConfig[Property]
    canSupportChildren?: boolean
    render: (
      config: ComponentConfig[Property],
      children?: React.ReactNode
    ) => React.ReactElement
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
  muiCheckbox: {
    defaultConfig: {
      checked: false,
    },
    render: (config) => <Checkbox checked={config.checked} />,
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
  muiStack: {
    defaultConfig: {
      direction: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      spacing: 0,
    },
    canSupportChildren: true,
    render: (config, children) => (
      <Stack {...config}>{children == null ? '<Stack>' : children}</Stack>
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
        {config.labels.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
    ),
  },
}
