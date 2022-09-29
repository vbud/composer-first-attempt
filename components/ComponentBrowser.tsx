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

  const move = (direction: 'up' | 'down') => {
    if (selectedComponentIds.length === 0) return

    // When moving up, start from the first selected component.
    // When moving down, start from the last selected component.
    const startingComponentId =
      direction === 'up'
        ? selectedComponentIds[0]
        : selectedComponentIds[selectedComponentIds.length - 1]

    const componentConfig = componentConfigs[startingComponentId]
    const { parentComponentId } = componentConfig
    const parentConfig =
      parentComponentId === null
        ? rootComponentConfig
        : componentConfigs[parentComponentId]
    const index = parentConfig.childComponentIds.indexOf(startingComponentId)

    if (direction === 'up') {
      if (index === 0 && parentComponentId !== null) {
        // If no previous siblings available, and not at the root level, move to the parent
        selectComponent(parentComponentId)
      } else if (index > 0) {
        const previousSiblingId = parentConfig.childComponentIds[index - 1]
        const previousSiblingChildIds =
          componentConfigs[previousSiblingId].childComponentIds
        if (previousSiblingChildIds.length > 0) {
          // If previous sibling has children, move to its last child
          selectComponent(
            previousSiblingChildIds[previousSiblingChildIds.length - 1]
          )
        } else {
          // Otherwise, move to the previous sibling
          selectComponent(previousSiblingId)
        }
      }
    } else if (direction === 'down') {
      if (componentConfig.childComponentIds.length > 0) {
        // If component has children, go down a level to the first child
        selectComponent(componentConfig.childComponentIds[0])
      } else if (index < parentConfig.childComponentIds.length - 1) {
        // Otherwise, if next sibling exists, go to it
        selectComponent(parentConfig.childComponentIds[index + 1])
      } else if (
        // Otherwise, if this is the last child of its siblings, not at the root level, move to the parent's next sibling
        index === parentConfig.childComponentIds.length - 1 &&
        parentComponentId !== null
      ) {
        const grandparentId =
          componentConfigs[parentComponentId].parentComponentId
        const grandparentConfig =
          grandparentId === null
            ? rootComponentConfig
            : componentConfigs[grandparentId]
        const parentIndex =
          grandparentConfig.childComponentIds.indexOf(parentComponentId)
        selectComponent(grandparentConfig.childComponentIds[parentIndex + 1])
      }
    }
  }

  const renderComponents = (componentIds: Array<ComponentId>) => {
    return componentIds.map((componentId) => {
      const { componentType, childComponentIds } = componentConfigs[componentId]

      let children
      if (
        drawableComponents[componentType].isLayoutComponent &&
        Array.isArray(childComponentIds) &&
        childComponentIds.length > 0
      ) {
        children = renderComponents(childComponentIds)
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
          >
            {componentType}
          </div>
          {children}
        </div>
      )
    })
  }

  return (
    <div
      // Allows element to be focused, which in turn allows the element to capture key presses
      tabIndex={-1}
      onKeyDown={(event) => {
        switch (event.code) {
          case 'Backspace':
            deleteSelectedComponents()
            break
          case 'ArrowUp':
            move('up')
            break
          case 'ArrowDown':
            move('down')
            break
        }
      }}
      className={styles.root}
    >
      {renderComponents(rootComponentConfig.childComponentIds)}
    </div>
  )
}
