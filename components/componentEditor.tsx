import { ComponentId, SavedComponentConfigs } from 'types'

import styles from 'styles/ComponentEditor.module.css'

type ComponentEditorProps = {
  componentId: ComponentId | null
  componentConfigs: SavedComponentConfigs
}

export const ComponentEditor = ({
  componentId,
  componentConfigs: savedComponentConfigs,
}: ComponentEditorProps) => {
  let content: React.ReactNode = null

  if (componentId === null) {
    content = 'No component selected.'
  } else {
    const config = savedComponentConfigs[componentId].config
    content = Object.keys(config).map((configKey) => (
      <div key={configKey}>
        {configKey}:{' '}
        {Array.isArray(config[configKey])
          ? config[configKey].join(', ')
          : config[configKey]}
      </div>
    ))
  }

  return <div className={styles.ComponentEditor}>{content}</div>
}
