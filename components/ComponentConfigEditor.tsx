import {
  ComponentId,
  SavedComponentConfigs,
  ComponentConfig,
  componentConfigDefinitions,
} from 'types'

import styles from 'styles/ComponentConfigEditor.module.css'
import { drawableComponents } from './libraryComponents'

type ConfigItemKey = keyof ComponentConfig[keyof ComponentConfig]
type ConfigItemValue = ComponentConfig[ConfigItemKey]

type ConfigItemEditorProps = {
  componentType: keyof ComponentConfig
  configItemKey: ConfigItemKey
  configItemValue: ConfigItemValue
  onChange: (value: ConfigItemValue) => {}
}

const ConfigItemEditor = ({
  componentType,
  configItemKey,
  configItemValue,
  onChange,
}: ConfigItemEditorProps) => {
  const componentConfigDefinition =
    componentConfigDefinitions[componentType][configItemKey]
  switch (componentConfigDefinition.type) {
    case 'boolean':
      return (
        <div>
          <div>{configItemKey}:</div>
          <select
            value={String(configItemValue)}
            onChange={(event) =>
              onChange((event.target.value === 'true') as ConfigItemValue)
            }
          >
            {['true', 'false'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      )
    case 'string':
      return (
        <div>
          <div>{configItemKey}:</div>
          <input
            onChange={(event) =>
              onChange(event.target.value as ConfigItemValue)
            }
            value={configItemValue}
          />
        </div>
      )
    case 'number':
      return (
        <div>
          <div>{configItemKey}:</div>
          <input
            onChange={(event) =>
              onChange(Number(event.target.value) as ConfigItemValue)
            }
            value={configItemValue}
            type="number"
          />
        </div>
      )
    case 'predefinedList':
      return (
        <div>
          <div>{configItemKey}:</div>
          <select
            value={configItemValue}
            onChange={(event) =>
              onChange(event.target.value as ConfigItemValue)
            }
          >
            {componentConfigDefinition.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      )
    case 'customList':
      return (
        <div>
          <div>{configItemKey}:</div>
          {(configItemValue as Array<string>).map((listItem, i) => (
            <div key={i} className={styles.customListItem}>
              <input
                value={listItem}
                onChange={(event) => {
                  const newValue = [...configItemValue]
                  newValue[i] = event.target.value
                  onChange(newValue)
                }}
              />
              <button
                onClick={() => {
                  const newValue = [...configItemValue]
                  newValue.splice(i, 1)
                  onChange(newValue)
                }}
              >
                -
              </button>
            </div>
          ))}
          <button onClick={() => onChange([...configItemValue, 'New item'])}>
            +
          </button>
        </div>
      )
  }

  return null
}

const layoutComponentTypes = ['layoutFlex', 'layoutGrid'] as const

type ComponentEditorProps = {
  componentIds: Array<ComponentId>
  componentConfigs: SavedComponentConfigs
  setAndSaveComponentConfigs: (configs: SavedComponentConfigs) => void
}

export const ComponentConfigEditor = ({
  componentIds,
  componentConfigs,
  setAndSaveComponentConfigs,
}: ComponentEditorProps) => {
  let content: React.ReactNode = null

  if (componentIds.length === 0) {
    content = 'No component selected.'
  } else if (componentIds.length > 1) {
    content = 'Multiple components selected.'
  } else {
    const componentId = componentIds[0]
    const { config, componentType } = componentConfigs[componentId]
    let itemsToRender: Array<React.ReactNode> = []

    itemsToRender = Object.keys(config).map((configItemKey) => (
      <ConfigItemEditor
        key={configItemKey}
        componentType={componentType}
        configItemKey={configItemKey}
        configItemValue={config[configItemKey]}
        onChange={(value) => {
          setAndSaveComponentConfigs({
            ...componentConfigs,
            [componentId]: {
              ...componentConfigs[componentId],
              config: {
                ...componentConfigs[componentId].config,
                [configItemKey]: value,
              },
            },
          })
        }}
      />
    ))

    if (drawableComponents[componentType].isLayoutComponent) {
      itemsToRender.unshift(
        <div key="__layoutType__">
          <div>type:</div>
          <select
            value={componentType}
            onChange={(event) => {
              const newComponentType = event.target
                .value as typeof layoutComponentTypes[number]
              componentConfigs[componentId].componentType = newComponentType
              componentConfigs[componentId].config =
                drawableComponents[newComponentType].defaultConfig
              setAndSaveComponentConfigs(componentConfigs)
            }}
          >
            {layoutComponentTypes.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      )
    }

    content = itemsToRender
  }

  return <div className={styles.root}>{content}</div>
}
