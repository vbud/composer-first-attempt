import { ComponentId, SavedComponentConfigs } from 'types'

import styles from 'styles/ComponentEditor.module.css'

export const ComponentEditor = ({
  componentId,
  componentConfigs,
}: {
  componentId: ComponentId | null
  componentConfigs: SavedComponentConfigs
}) => {
  let content: React.ReactNode = null

  if (componentId === null) {
    content = 'No component selected.'
  } else {
    const config = componentConfigs[componentId].config
    content = Object.keys(config).map((configKey) => (
      <div key={configKey}>
        {configKey}:{' '}
        {Array.isArray(config[configKey])
          ? config[configKey].join(', ')
          : config[configKey]}
      </div>
    ))
  }

  return <div className={styles.root}>{content}</div>
}
