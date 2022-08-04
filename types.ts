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

export const componentConfigDefinitions: {
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
    severity: typeof componentConfigDefinitions.muiAlert.severity.options[number]
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
    direction: typeof componentConfigDefinitions.muiStack.direction.options[number]
    alignItems: typeof componentConfigDefinitions.muiStack.alignItems.options[number]
    justifyContent: typeof componentConfigDefinitions.muiStack.justifyContent.options[number]
    spacing: number
  }
  muiTable: {
    columnNames: Array<string>
    rows: Array<Array<string | number>>
  }
}

export type SavedComponentConfig = {
  componentType: keyof ComponentConfig
  config: ComponentConfig[keyof ComponentConfig]
  childComponentIds: Array<ComponentId>
  parentComponentId: ComponentId | null
}

export type SavedComponentConfigs = {
  [key: ComponentId]: SavedComponentConfig
}

export type RootComponentConfig = {
  config: {}
  childComponentIds: Array<ComponentId>
}
