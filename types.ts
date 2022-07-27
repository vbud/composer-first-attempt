export type ComponentId = string

export type ComponentConfig = {
  muiAlert: {
    severity: 'success' | 'info' | 'warning' | 'error'
    content: string
  }
  muiAutocomplete: {
    textFieldLabel: string
    options: ReadonlyArray<{ label: string }>
  }
  muiButton: {
    content: string
  }
  muiCheckbox: {
    defaultChecked: boolean
  }
  muiList: {
    dense: boolean
    items: Array<string>
  }
  muiSelect: {
    value: string
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
