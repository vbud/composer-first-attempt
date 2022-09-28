import { nanoid } from 'nanoid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import {
  ComponentConfig,
  ComponentId,
  RootComponentConfig,
  SavedComponentConfig,
  SavedComponentConfigs,
} from 'types'
import { drawableComponents } from 'components/libraryComponents'

import styles from 'styles/AddComponent.module.css'

export const AddComponent = ({
  componentConfigs,
  rootComponentConfig,
  selectedComponentIds,
  setAndSaveRootComponentConfig,
  setAndSaveComponentConfigs,
}: {
  componentConfigs: SavedComponentConfigs
  rootComponentConfig: RootComponentConfig
  selectedComponentIds: Array<ComponentId>
  setAndSaveRootComponentConfig: (
    rootComponentConfig: RootComponentConfig
  ) => void
  setAndSaveComponentConfigs: (
    rootComponentConfig: SavedComponentConfigs
  ) => void
}) => {
  return (
    <Select
      className={styles.root}
      size="small"
      value=""
      onChange={(event) => {
        const componentType = event.target.value as keyof ComponentConfig

        const newComponentId = nanoid()
        const newComponentConfig: SavedComponentConfig = {
          componentType,
          config: drawableComponents[componentType].defaultConfig,
          childComponentIds: [],
          parentComponentId: null,
        }

        const updatedComponentConfigs = {
          ...componentConfigs,
          [newComponentId]: newComponentConfig,
        }

        if (
          selectedComponentIds.length === 1 &&
          drawableComponents[
            componentConfigs[selectedComponentIds[0]].componentType
          ].isLayoutComponent
        ) {
          updatedComponentConfigs[selectedComponentIds[0]].childComponentIds = [
            ...updatedComponentConfigs[selectedComponentIds[0]]
              .childComponentIds,
            newComponentId,
          ]
          updatedComponentConfigs[newComponentId].parentComponentId =
            selectedComponentIds[0]
        } else {
          const updatedRootComponentConfig: RootComponentConfig = {
            ...rootComponentConfig,
            childComponentIds: [
              ...rootComponentConfig.childComponentIds,
              newComponentId,
            ],
          }
          setAndSaveRootComponentConfig(updatedRootComponentConfig)
        }

        setAndSaveComponentConfigs(updatedComponentConfigs)
      }}
    >
      {Object.keys(drawableComponents)
        .filter(
          (componentName) =>
            !drawableComponents[componentName].isLayoutComponent
        )
        .map((componentName) => (
          <MenuItem value={componentName} key={componentName}>
            {componentName}
          </MenuItem>
        ))}
    </Select>
  )
}
