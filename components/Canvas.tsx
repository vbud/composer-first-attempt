import classnames from 'classnames'

import { ComponentId, rootComponentId, SavedComponentConfigs } from 'types'
import { drawableComponents } from 'components/libraryComponents'

import styles from 'styles/Canvas.module.css'

export const Canvas = ({
  componentConfigs,
  selectedComponentIds,
  setSelectedComponents,
  onClickComponent,
  onKeyDown,
}: {
  componentConfigs: SavedComponentConfigs
  selectedComponentIds: Array<ComponentId>
  setSelectedComponents: (componentIds: Array<ComponentId>) => void
  onClickComponent: (componentId: ComponentId, event: React.MouseEvent) => void
  onKeyDown: (event: React.KeyboardEvent) => void
}) => {
  const renderComponents = (componentIds: Array<ComponentId>) => {
    return componentIds.map((componentId) => {
      const { componentType, config, childComponentIds } =
        componentConfigs[componentId]

      let children
      if (childComponentIds && childComponentIds?.length > 0) {
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
            onClickComponent(componentId, event)
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
      onKeyDown={onKeyDown}
      onClick={() => {
        // If the click gets here, a component was not clicked because `stopPropagation` is called whenever a component is clicked.
        setSelectedComponents([])
      }}
    >
      {componentConfigs[rootComponentId] &&
        renderComponents(componentConfigs[rootComponentId].childComponentIds)}
    </div>
  )
}
