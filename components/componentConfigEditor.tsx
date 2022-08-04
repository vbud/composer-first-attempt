import {
  ComponentId,
  SavedComponentConfigs,
  ComponentConfig,
  componentConfigDefinitions,
} from 'types'

import styles from 'styles/ComponentEditor.module.css'

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
  if (componentConfigDefinition.type === 'predefinedList') {
    return (
      <div>
        {configItemKey}:
        <select
          value={configItemValue}
          onChange={(event) => onChange(event.target.value as ConfigItemValue)}
        >
          {componentConfigDefinition.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    )
  }

  return null
}

type ComponentEditorProps = {
  componentId: ComponentId | null
  componentConfigs: SavedComponentConfigs
  onChangeComponentConfigs: (configs: SavedComponentConfigs) => void
}

export const ComponentConfigEditor = ({
  componentId,
  componentConfigs,
  onChangeComponentConfigs,
}: ComponentEditorProps) => {
  let content: React.ReactNode = null

  if (componentId === null) {
    content = 'No component selected.'
  } else {
    const { config, componentType } = componentConfigs[componentId]
    content = Object.keys(config).map((configItemKey) => (
      <ConfigItemEditor
        key={configItemKey}
        componentType={componentType}
        configItemKey={configItemKey}
        configItemValue={config[configItemKey]}
        onChange={(value) => {
          onChangeComponentConfigs({
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
  }

  return <div className={styles.root}>{content}</div>
}
