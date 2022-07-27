export type ComponentId = string

type ComponentConfigDefinition =
  | {
      type: 'string'
    }
  | {
      type: 'number'
    }
  | {
      type: 'boolean'
    }
  | {
      type: 'customList'
    }
  | {
      type: 'predefinedList'
      options: ReadonlyArray<string>
    }
  | {
      type: 'customListOfLists'
    }

const ComponentConfigDefinitions: {
  [P1 in keyof ComponentConfig]: {
    [P2 in keyof ComponentConfig[P1]]: ComponentConfigDefinition
  }
} = {
  muiAlert: {
    severity: {
      type: 'predefinedList',
      options: ['success', 'info', 'warning', 'error'] as const,
    },
    content: {
      type: 'string',
    },
  },
  muiAutocomplete: {
    textFieldLabel: {
      type: 'string',
    },
    options: {
      type: 'customList',
    },
  },
  muiButton: {
    content: {
      type: 'string',
    },
  },
  muiCheckbox: {
    defaultChecked: {
      type: 'boolean',
    },
  },
  muiList: {
    dense: {
      type: 'boolean',
    },
    items: {
      type: 'customList',
    },
  },
  muiSelect: {
    value: {
      type: 'string',
    },
    options: {
      type: 'customList',
    },
  },
  muiStack: {
    direction: {
      type: 'predefinedList',
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
    },
    alignItems: {
      type: 'predefinedList',
      options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    },
    justifyContent: {
      type: 'predefinedList',
      options: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
    },
    spacing: {
      type: 'number',
    },
  },
  muiTable: {
    columnNames: {
      type: 'customList',
    },
    rows: {
      type: 'customListOfLists',
    },
  },
}

export type ComponentConfig = {
  muiAlert: {
    severity: typeof ComponentConfigDefinitions.muiAlert.severity.options[number]
    content: string
  }
  muiAutocomplete: {
    textFieldLabel: string
    options: ReadonlyArray<string>
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
    direction: typeof ComponentConfigDefinitions.muiStack.direction.options[number]
    alignItems: typeof ComponentConfigDefinitions.muiStack.alignItems.options[number]
    justifyContent: typeof ComponentConfigDefinitions.muiStack.justifyContent.options[number]
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
