import { AlertProps } from '@mui/material/Alert'
import { ButtonProps } from '@mui/material/Button'
import { CheckboxProps } from '@mui/material/Checkbox'
import { ListProps } from '@mui/material/List'
import { SelectProps } from '@mui/material/Select'
import { TextFieldProps } from '@mui/material/TextField'

export type ComponentId = string

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
  muiStack: {
    direction: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
    justifyContent:
      | 'flex-start'
      | 'center'
      | 'flex-end'
      | 'space-between'
      | 'space-around'
      | 'space-evenly'
    spacing: number
  }
  muiTable: {
    columnNames: Array<string>
    rows: Array<Array<string | number>>
  }
}

export type SavedComponentConfig<Key extends keyof ComponentConfig> = {
  type: Key
  config: ComponentConfig[Key]
  childComponentIds: Array<ComponentId>
}

export type SavedComponentConfigs = {
  [key: ComponentId]: SavedComponentConfig<keyof ComponentConfig>
}

export type RootComponentConfig = {
  config: {}
  childComponentIds: Array<ComponentId>
}
