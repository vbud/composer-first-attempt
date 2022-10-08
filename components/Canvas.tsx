import * as mui from '@mui/material'
import classnames from 'classnames'

import { ComponentId, rootComponentId, SavedComponentConfigs } from 'types'
import {
  primitiveComponents,
  layoutComponents,
} from 'components/builtInComponents'

import styles from 'styles/Canvas.module.css'
import { buildProps } from 'utils/propHelpers'

const allComponents = {
  ...primitiveComponents,
  ...layoutComponents,
  ...mui,
}

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
      const { componentType, props, childComponentIds } =
        componentConfigs[componentId]

      const Component = allComponents[componentType]

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
            {/* TODO: is this a problem? */}
            <Component {...buildProps(componentType, props)}>
              {renderComponents(childComponentIds)}
            </Component>
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
