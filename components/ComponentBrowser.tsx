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
        const moveToLastDescendant = (componentId: ComponentId) => {
          const childIds = componentConfigs[componentId].childComponentIds
          // If there are children, keep going until the last descendant is found
          if (childIds && childIds.length > 0) {
            moveToLastDescendant(childIds[childIds.length - 1])
          } else {
            // Otherwise, select the component, as it is the last descendant
            selectComponent(componentId)
          }
        }
        // Move to the last descendant of the previous sibling
        moveToLastDescendant(parentConfig.childComponentIds[index - 1])
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
        const tryMoveToNextSibling = (parentId: ComponentId) => {
          // Move to the parent's next sibling, unless the parent is the root component, in which case do nothing
          if (parentId !== rootComponentId) {
            const grandparentId = componentConfigs[parentId].parentComponentId
            const grandparentConfig = componentConfigs[grandparentId]

            // All parents of children by definition have children, so just keeping typescript happy here
            if (grandparentConfig.childComponentIds) {
              const parentIndex =
                grandparentConfig.childComponentIds.indexOf(parentId)
              if (
                parentIndex <
                grandparentConfig.childComponentIds.length - 1
              ) {
                // If there are more siblings remaining, move to the next one.
                selectComponent(
                  grandparentConfig.childComponentIds[parentIndex + 1]
                )
              } else {
                // Otherwise, try moving to the next sibling of the grandparent
                tryMoveToNextSibling(grandparentId)
              }
            }
          }
        }
        tryMoveToNextSibling(parentComponentId)
      }
    }
  }

  const renderComponents = (componentIds: Array<ComponentId>) => {
    return componentIds.map((componentId) => {
      const { componentType, childComponentIds } = componentConfigs[componentId]

      let children
      if (childComponentIds && childComponentIds.length > 0) {
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
