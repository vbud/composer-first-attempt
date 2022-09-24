import { muiIcons } from 'components/icons'

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
  muiButtonGroup: {
    variant: {
      type: 'predefinedList',
      options: ['outlined', 'contained', 'text'] as const,
    },
    buttons: {
      type: 'customList',
    },
  },
  muiCheckbox: {
    checked: {
      type: 'boolean',
    },
  },
  muiIcon: {
    name: {
      type: 'predefinedList',
      options: Object.keys(muiIcons),
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
  muiRadioGroup: {
    label: {
      type: 'string',
    },
    value: {
      type: 'string',
    },
    options: {
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
  muiTabs: {
    currentTab: {
      type: 'number',
    },
    labels: {
      type: 'customList',
    },
  },
  muiTextField: {
    label: {
      type: 'string',
    },
    value: {
      type: 'string',
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
  muiButtonGroup: {
    variant: typeof componentConfigDefinitions.muiButtonGroup.variant.options[number]
    buttons: Array<string>
  }
  muiCheckbox: {
    checked: boolean
  }
  muiIcon: {
    name: typeof componentConfigDefinitions.muiIcon.name.options[number]
  }
  muiList: {
    dense: boolean
    items: Array<string>
  }
  muiRadioGroup: {
    label: string
    value: string
    options: Array<string>
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
  muiTabs: {
    currentTab: number
    labels: Array<string>
  }
  muiTextField: {
    label: string
    value: string
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
