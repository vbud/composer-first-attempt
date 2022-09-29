import classnames from 'classnames'

import { ComponentId, RootComponentConfig, SavedComponentConfigs } from 'types'
import { drawableComponents } from 'components/libraryComponents'

import styles from 'styles/Canvas.module.css'

export const Canvas = ({
  rootComponentConfig,
  componentConfigs,
  selectedComponentIds,
  setSelectedComponentIds,
  deleteSelectedComponents,
  groupSelectedComponents,
  ungroupSelectedComponents,
}: {
  rootComponentConfig: RootComponentConfig
  componentConfigs: SavedComponentConfigs
  selectedComponentIds: Array<ComponentId>
  setSelectedComponentIds: (componentIds: Array<ComponentId>) => void
  deleteSelectedComponents: () => void
  groupSelectedComponents: () => void
  ungroupSelectedComponents: () => void
}) => {
  const renderComponents = (componentIds: Array<ComponentId>) => {
    return componentIds.map((componentId) => {
      const { componentType, config, childComponentIds } =
        componentConfigs[componentId]

      let children
      if (
        drawableComponents[componentType].isLayoutComponent &&
        Array.isArray(childComponentIds) &&
        childComponentIds.length > 0
      ) {
        children = renderComponents(childComponentIds)
      }

      return (
        <div
          key={componentId}
          className={classnames({
            [styles.selected]: selectedComponentIds.includes(componentId),
          })}
          onClick={(event) => {
            event.stopPropagation()

            if (selectedComponentIds.includes(componentId)) return

            if (event.metaKey) {
              setSelectedComponentIds([...selectedComponentIds, componentId])
            } else {
              setSelectedComponentIds([componentId])
            }
          }}
        >
          {/* Ensure children do not swallow clicks */}
          <div style={{ pointerEvents: 'none' }}>
            {drawableComponents[componentType].render(config, children)}
          </div>
        </div>
      )
    })
  }

  return (
    <div
      className={styles.root}
      // Allows element to be focused, which in turn allows the element to capture key presses
      tabIndex={-1}
      onKeyDown={(event) => {
        event.preventDefault()

        if (event.code === 'Backspace') deleteSelectedComponents()
        else if (event.code === 'KeyG' && event.metaKey && event.shiftKey)
          ungroupSelectedComponents()
        else if (event.code === 'KeyG' && event.metaKey)
          groupSelectedComponents()
      }}
      onClick={() => {
        // If the click gets here, a component was not clicked because `stopPropagation` is called whenever a component is clicked.
        setSelectedComponentIds([])
      }}
    >
      {renderComponents(rootComponentConfig.childComponentIds)}
    </div>
  )
}
