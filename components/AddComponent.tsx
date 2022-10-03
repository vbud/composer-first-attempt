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

        const parentComponentId =
          selectedComponentIds.length === 1 &&
          componentConfigs[selectedComponentIds[0]].childComponentIds
            ? selectedComponentIds[0]
            : rootComponentId

        const newComponentId = nanoid()
        const newComponentConfig: SavedComponentConfig = {
          componentType,
          props: {},
          parentComponentId,
          childComponentIds: [],
        }

        componentConfigs[newComponentId] = newComponentConfig

        componentConfigs[parentComponentId].childComponentIds?.push(
          newComponentId
        )

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
