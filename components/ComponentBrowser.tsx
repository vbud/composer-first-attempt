import classnames from 'classnames'

import { ComponentId, rootComponentId, SavedComponentConfigs } from 'types'
import { drawableComponents } from 'components/libraryComponents'

import styles from 'styles/ComponentBrowser.module.css'

export const ComponentBrowser = ({
  componentConfigs,
  selectedComponentIds,
  setSelectedComponents,
  onKeyDown,
  onClickComponent,
}: {
  componentConfigs: SavedComponentConfigs
  selectedComponentIds: Array<ComponentId>
  setSelectedComponents: (componentIds: Array<ComponentId>) => void
  onClickComponent: (componentId: ComponentId, event: React.MouseEvent) => void
  onKeyDown: (event: React.KeyboardEvent) => void
}) => {
  const selectComponent = (componentId: ComponentId) => {
    setSelectedComponents([componentId])
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

    const parentConfig = componentConfigs[parentComponentId]

    // All parents of children by definition have children, so just keeping typescript happy here
    if (!parentConfig.childComponentIds) return

    const index = parentConfig.childComponentIds.indexOf(startingComponentId)

    if (direction === 'up') {
      if (index === 0 && parentComponentId !== rootComponentId) {
        // If no previous siblings available, and not at the root level, move to the parent
        selectComponent(parentComponentId)
      } else if (index > 0) {
        const previousSiblingId = parentConfig.childComponentIds[index - 1]
        const previousSiblingChildIds =
          componentConfigs[previousSiblingId].childComponentIds
        if (previousSiblingChildIds && previousSiblingChildIds.length > 0) {
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
      if (
        componentConfig.childComponentIds &&
        componentConfig.childComponentIds.length > 0
      ) {
        // If component has children, go down a level to the first child
        selectComponent(componentConfig.childComponentIds[0])
      } else if (index < parentConfig.childComponentIds.length - 1) {
        // Otherwise, if next sibling exists, go to it
        selectComponent(parentConfig.childComponentIds[index + 1])
      } else if (
        // Otherwise, if this is the last child of its siblings
        index === parentConfig.childComponentIds.length - 1 &&
        parentComponentId !== rootComponentId
      ) {
        const grandparentId =
          componentConfigs[parentComponentId].parentComponentId
        // Move to the parent's next sibling, unless the parent is the root component, in which case do nothing
        if (grandparentId !== rootComponentId) {
          const grandparentConfig = componentConfigs[grandparentId]

          // All parents of children by definition have children, so just keeping typescript happy here
          if (grandparentConfig.childComponentIds) {
            const parentIndex =
              grandparentConfig.childComponentIds.indexOf(parentComponentId)
            selectComponent(
              grandparentConfig.childComponentIds[parentIndex + 1]
            )
          }
        }
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
            className={classnames(styles.component, {
              [styles.selected]: isSelected,
            })}
            onClick={(event) => {
              onClickComponent(componentId, event)
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
        if (event.code === 'ArrowUp') move('up')
        else if (event.code === 'ArrowDown') move('down')
        else onKeyDown(event)
      }}
      className={styles.root}
    >
      {componentConfigs[rootComponentId] &&
        renderComponents(componentConfigs[rootComponentId].childComponentIds)}
    </div>
  )
}
