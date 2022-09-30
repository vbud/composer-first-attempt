import { nanoid } from 'nanoid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import {
  rootComponentId,
  ComponentConfig,
  ComponentId,
  SavedComponentConfig,
  SavedComponentConfigs,
} from 'types'
import { drawableComponents } from 'components/libraryComponents'

import styles from 'styles/AddComponent.module.css'

export const AddComponent = ({
  componentConfigs,
  selectedComponentIds,
  setAndSaveComponentConfigs,
}: {
  componentConfigs: SavedComponentConfigs
  selectedComponentIds: Array<ComponentId>
  setAndSaveComponentConfigs: (
    setComponentConfigs: SavedComponentConfigs
  ) => void
}) => {
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

        const componentType = event.target.value as keyof ComponentConfig

        const parentComponentId =
          selectedComponentIds.length === 1 &&
          componentConfigs[selectedComponentIds[0]].childComponentIds
            ? selectedComponentIds[0]
            : rootComponentId

        const newComponentId = nanoid()
        const newComponentConfig: SavedComponentConfig = {
          componentType,
          config: drawableComponents[componentType].defaultConfig,
          parentComponentId,
        }
        if (drawableComponents[componentType].isLayoutComponent) {
          newComponentConfig.childComponentIds = []
        }

        componentConfigs[newComponentId] = newComponentConfig

        componentConfigs[parentComponentId].childComponentIds?.push(
          newComponentId
        )

        setAndSaveComponentConfigs(componentConfigs)
      }}
    >
      {Object.keys(drawableComponents)
        .filter(
          (componentName) =>
            !drawableComponents[componentName as keyof ComponentConfig]
              .isLayoutComponent
        )
        .map((componentName) => (
          <MenuItem value={componentName} key={componentName}>
            {componentName}
          </MenuItem>
        ))}
    </Select>
  )
}
