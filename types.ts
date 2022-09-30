import { muiIcons } from 'components/icons'

export type ComponentId = string

export const rootComponentId = '__root__'

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

const predefinedListOptions = {
  layoutFlex: {
    flexDirection: ['row', 'row-reverse', 'column', 'column-reverse'] as const,
    alignItems: [
      'flex-start',
      'center',
      'flex-end',
      'stretch',
      'baseline',
    ] as const,
    justifyContent: [
      'flex-start',
      'center',
      'flex-end',
      'space-between',
      'space-around',
      'space-evenly',
    ] as const,
  },
  muiAlert: {
    severity: ['success', 'info', 'warning', 'error'] as const,
  },
  muiButtonGroup: {
    variant: ['outlined', 'contained', 'text'] as const,
  },
  muiIcon: {
    name: Object.keys(muiIcons),
  },
}

export const componentConfigDefinitions: {
  [Property1 in keyof ComponentConfig]: {
    [Property2 in keyof ComponentConfig[Property1]]: ComponentConfigDefinition
  }
} = {
  layoutFlex: {
    flexDirection: {
      type: 'predefinedList',
      options: predefinedListOptions.layoutFlex.flexDirection,
    },
    alignItems: {
      type: 'predefinedList',
      options: predefinedListOptions.layoutFlex.alignItems,
    },
    justifyContent: {
      type: 'predefinedList',
      options: predefinedListOptions.layoutFlex.justifyContent,
    },
    gap: {
      type: 'number',
    },
  },
  muiAlert: {
    severity: {
      type: 'predefinedList',
      options: predefinedListOptions.muiAlert.severity,
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
      options: predefinedListOptions.muiButtonGroup.variant,
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
      options: predefinedListOptions.muiIcon.name,
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
  layoutFlex: {
    flexDirection: typeof predefinedListOptions.layoutFlex.flexDirection[number]
    alignItems: typeof predefinedListOptions.layoutFlex.alignItems[number]
    justifyContent: typeof predefinedListOptions.layoutFlex.justifyContent[number]
    gap: number
  }
  muiAlert: {
    severity: typeof predefinedListOptions.muiAlert.severity[number]
    content: string
  }
  muiAutocomplete: {
    textFieldLabel: string
    options: Array<string>
  }
  muiButton: {
    content: string
  }
  muiButtonGroup: {
    variant: typeof predefinedListOptions.muiButtonGroup.variant[number]
    buttons: Array<string>
  }
  muiCheckbox: {
    checked: boolean
  }
  muiIcon: {
    name: keyof typeof muiIcons
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

export interface SavedComponentConfig<
  T extends keyof ComponentConfig = keyof ComponentConfig
> {
  componentType: T
  config: ComponentConfig[T]
  childComponentIds?: Array<ComponentId>
  parentComponentId: ComponentId
}

export type SavedComponentConfigs = {
  [key: ComponentId]: SavedComponentConfig
} & {
  [rootComponentId]: {
    childComponentIds: Array<ComponentId>
    parentComponentId: '__null__'
  }
}
