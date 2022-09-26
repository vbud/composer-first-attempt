import classnames from 'classnames'

import { ComponentId, RootComponentConfig, SavedComponentConfigs } from 'types'
import { drawableComponents } from 'components/libraryComponents'

import styles from 'styles/ComponentBrowser.module.css'

export const ComponentBrowser = ({
  rootComponentConfig,
  componentConfigs,
  selectedComponentId,
  setSelectedComponentId,
  deleteComponent,
}: {
  rootComponentConfig: RootComponentConfig
  componentConfigs: SavedComponentConfigs
  selectedComponentId: ComponentId | null
  setSelectedComponentId: (componentId: ComponentId | null) => void
  deleteComponent: (componentId: ComponentId) => void
}) => {
  const browseUp = (index: number, parentComponentId?: ComponentId) => {
    const parentComponentConfig =
      parentComponentId === undefined
        ? rootComponentConfig
        : componentConfigs[parentComponentId]
    if (index === 0 && parentComponentId !== undefined) {
      setSelectedComponentId(parentComponentId)
    } else if (index > 0) {
      setSelectedComponentId(parentComponentConfig.childComponentIds[index - 1])
    }
  }

  const browseDown = (
    index: number,
    componentId: ComponentId,
    parentComponentId?: ComponentId
  ) => {
    const parentComponentConfig =
      parentComponentId === undefined
        ? rootComponentConfig
        : componentConfigs[parentComponentId]
    const componentConfig = componentConfigs[componentId]
    if (index < parentComponentConfig.childComponentIds.length - 1) {
      setSelectedComponentId(parentComponentConfig.childComponentIds[index + 1])
    } else if (componentConfig.childComponentIds.length > 0) {
      setSelectedComponentId(componentConfig.childComponentIds[0])
    }
  }

  const renderComponents = (
    componentIds: Array<ComponentId>,
    parentComponentId?: ComponentId
  ) => {
    return componentIds.map((componentId, index) => {
      const { componentType, childComponentIds } = componentConfigs[componentId]

      let children
      if (
        drawableComponents[componentType].canSupportChildren &&
        Array.isArray(childComponentIds) &&
        childComponentIds.length > 0
      ) {
        children = renderComponents(childComponentIds, componentId)
      }

      const isSelected = componentId === selectedComponentId

      return (
        <div key={componentId} className={styles.componentWrapper}>
          <div
            ref={(el) => isSelected && el !== null && el.focus()}
            className={classnames(styles.component, {
              [styles.selected]: isSelected,
            })}
            onClick={() => {
              setSelectedComponentId(componentId)
            }}
            // Allows element to be focused, which in turn allows the element to capture key presses
            tabIndex={-1}
            onKeyDown={(event) => {
              if (event.code === 'Backspace') {
                deleteComponent(componentId)
              } else if (event.code === 'ArrowUp') {
                browseUp(index, parentComponentId)
              } else if (event.code === 'ArrowDown') {
                browseDown(index, componentId, parentComponentId)
              }
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
