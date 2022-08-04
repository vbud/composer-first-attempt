import classnames from 'classnames'

import { ComponentId, RootComponentConfig, SavedComponentConfigs } from 'types'
import { drawableComponents } from 'components/libraryComponents'

import styles from 'styles/ComponentBrowser.module.css'

export const ComponentBrowser = ({
  rootComponentConfig,
  componentConfigs,
  selectedComponentId,
  setSelectedComponentId,
}: {
  rootComponentConfig: RootComponentConfig
  componentConfigs: SavedComponentConfigs
  selectedComponentId: ComponentId | null
  setSelectedComponentId: (componentId: ComponentId | null) => void
}) => {
  const renderComponents = (componentIds: Array<ComponentId>) => {
    return componentIds.map((componentId) => {
      const { componentType, childComponentIds } = componentConfigs[componentId]

      let children
      if (
        drawableComponents[componentType].canSupportChildren &&
        Array.isArray(childComponentIds) &&
        childComponentIds.length > 0
      ) {
        children = renderComponents(childComponentIds)
      }

      return (
        <div key={componentId} className={styles.componentWrapper}>
          <div
            className={classnames(styles.component, {
              [styles.selected]: componentId === selectedComponentId,
            })}
            onClick={() => {
              setSelectedComponentId(componentId)
            }}
          >
            {componentType}
          </div>
          {children}
        </div>
      )
    })
  }

  return (
    <div className={styles.root}>
      {renderComponents(rootComponentConfig.childComponentIds)}
    </div>
  )
}
