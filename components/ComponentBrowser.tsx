import classnames from 'classnames'

import { ComponentId, RootComponentConfig, SavedComponentConfigs } from 'types'
import { drawableComponents } from 'components/libraryComponents'

import styles from 'styles/ComponentBrowser.module.css'

const componentClassPrefix = 'browser-'

export const ComponentBrowser = ({
  rootComponentConfig,
  componentConfigs,
  selectedComponentIds,
  setSelectedComponentIds,
  deleteSelectedComponents,
}: {
  rootComponentConfig: RootComponentConfig
  componentConfigs: SavedComponentConfigs
  selectedComponentIds: Array<ComponentId>
  setSelectedComponentIds: (componentIds: Array<ComponentId>) => void
  deleteSelectedComponents: () => void
}) => {
  const selectComponent = (componentId: ComponentId) => {
    setSelectedComponentIds([componentId])
    document.querySelector(`.${componentClassPrefix}${componentId}`).focus()
  }

  const browseUp = (index: number, parentComponentId?: ComponentId) => {
    const parentComponentConfig =
      parentComponentId === undefined
        ? rootComponentConfig
        : componentConfigs[parentComponentId]
    if (index === 0 && parentComponentId !== undefined) {
      selectComponent(parentComponentId)
    } else if (index > 0) {
      selectComponent(parentComponentConfig.childComponentIds[index - 1])
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
      selectComponent(parentComponentConfig.childComponentIds[index + 1])
    } else if (componentConfig.childComponentIds.length > 0) {
      selectComponent(componentConfig.childComponentIds[0])
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
        drawableComponents[componentType].isLayoutComponent &&
        Array.isArray(childComponentIds) &&
        childComponentIds.length > 0
      ) {
        children = renderComponents(childComponentIds, componentId)
      }

      const isSelected = selectedComponentIds.includes(componentId)

      return (
        <div key={componentId} className={styles.componentWrapper}>
          <div
            className={classnames(
              styles.component,
              `${componentClassPrefix}${componentId}`,
              {
                [styles.selected]: isSelected,
              }
            )}
            onClick={() => {
              selectComponent(componentId)
            }}
            // Allows element to be focused, which in turn allows the element to capture key presses
            tabIndex={-1}
            onKeyDown={(event) => {
              switch (event.code) {
                case 'Backspace':
                  deleteSelectedComponents()
                  break
                case 'ArrowUp':
                  browseUp(index, parentComponentId)
                  break
                case 'ArrowDown':
                  browseDown(index, componentId, parentComponentId)
                  break
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