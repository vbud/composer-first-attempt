import { nanoid } from 'nanoid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import ListSubheader from '@mui/material/ListSubheader'

import {
  rootComponentId,
  ComponentId,
  ComponentType,
  SavedComponentConfig,
  SavedComponentConfigs,
  libraryPropTypes,
  componentPropTypes,
} from 'types'

import styles from 'styles/AddComponent.module.css'
import { primitiveComponents } from './builtInComponents'

export const AddComponent = ({
  componentConfigs,
  selectedComponentIds,
  setAndSaveComponentConfigs,
  setSelectedComponents,
}: {
  componentConfigs: SavedComponentConfigs
  selectedComponentIds: Array<ComponentId>
  setAndSaveComponentConfigs: (
    setComponentConfigs: SavedComponentConfigs
  ) => void
  setSelectedComponents: (componentIds: Array<ComponentId>) => void
}) => {
  const renderMenuItem = (componentName: ComponentType) => (
    <MenuItem value={componentName} key={componentName}>
      {componentName}
    </MenuItem>
  )

  return (
    <Select
      className={styles.root}
      size="small"
      value=""
      onChange={(event) => {
        // Initialize root component if it does not exist
        if (componentConfigs[rootComponentId] === undefined) {
          componentConfigs[rootComponentId] = {
            childComponentIds: [],
            parentComponentId: '__null__',
          }
        }

        const componentType = event.target.value as ComponentType

        const newComponentId = nanoid()

        let parentComponentId: ComponentId
        if (selectedComponentIds.length === 1) {
          const selectedId = selectedComponentIds[0]
          // If there is exactly 1 component selected
          const firstSelectedComponentConfig = componentConfigs[selectedId]
          if (
            componentPropTypes[
              componentConfigs[selectedId].componentType
            ].hasOwnProperty('children')
          ) {
            // If the component allows children, make the new component a child
            parentComponentId = selectedId
            firstSelectedComponentConfig.childComponentIds.push(newComponentId)
          } else {
            // Otherwise, make the new component the next sibling of the selected component
            parentComponentId = componentConfigs[selectedId].parentComponentId
            const siblingIds =
              componentConfigs[parentComponentId].childComponentIds
            const selectedIdIndex = siblingIds.indexOf(selectedId)
            siblingIds.splice(selectedIdIndex + 1, 0, newComponentId)
          }
        } else {
          // If 0 or more than 1 components are selected, add the new component at the top level
          parentComponentId = rootComponentId
          componentConfigs[rootComponentId].childComponentIds.push(
            newComponentId
          )
        }

        const newComponentConfig: SavedComponentConfig = {
          componentType,
          props: {},
          parentComponentId,
          childComponentIds: [],
        }

        componentConfigs[newComponentId] = newComponentConfig

        setAndSaveComponentConfigs(componentConfigs)
        setSelectedComponents([newComponentId])
      }}
    >
      <ListSubheader>Built-in primitives</ListSubheader>
      {Object.keys(primitiveComponents).map(renderMenuItem)}
      <ListSubheader>Material UI</ListSubheader>
      {Object.keys(libraryPropTypes).map(renderMenuItem)}
    </Select>
  )
}
