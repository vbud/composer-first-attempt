import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import classnames from 'classnames'

import {
  ComponentId,
  ComponentConfig,
  SavedComponentConfigs,
  RootComponentConfig,
  SavedComponentConfig,
} from 'types'
import { drawableComponents } from 'components/libraryComponents'
import { ComponentBrowser } from 'components/componentBrowser'
import { ComponentConfigEditor } from 'components/componentConfigEditor'
import {
  readComponentConfigs,
  saveComponentConfigs,
  readRootComponentConfig,
  saveRootComponentConfig,
} from 'utils/localStorage'

import styles from 'styles/Home.module.css'

const Home: NextPage = () => {
  const [componentConfigs, setComponentConfigs] =
    useState<SavedComponentConfigs>(readComponentConfigs())

  const [rootComponentConfig, setRootComponentConfig] =
    useState<RootComponentConfig>(readRootComponentConfig())

  const [selectedComponentIds, setSelectedComponentIds] = useState<
    Array<ComponentId>
  >([])

  const setAndSaveRootComponentConfig = (
    updatedRootComponentConfig: RootComponentConfig
  ) => {
    setRootComponentConfig(updatedRootComponentConfig)
    saveRootComponentConfig(updatedRootComponentConfig)
  }

  const setAndSaveComponentConfigs = (
    updatedComponentConfigs: SavedComponentConfigs
  ) => {
    setComponentConfigs(updatedComponentConfigs)
    saveComponentConfigs(updatedComponentConfigs)
  }

  const deleteSelectedComponents = () => {
    const selectedComponentIdsToDelete = [...selectedComponentIds]
    setSelectedComponentIds([])

    const updatedRootComponentConfig = { ...rootComponentConfig }
    const updatedComponentConfigs = {
      ...componentConfigs,
    }

    selectedComponentIdsToDelete.forEach((componentId) => {
      const { parentComponentId } = updatedComponentConfigs[componentId]

      // If the component has already been deleted, do nothing
      if (updatedComponentConfigs[componentId] === undefined) return

      // Remove the component from the parent's `childComponentIds`
      // The parent can be the root component or a regular component
      if (parentComponentId === null) {
        updatedRootComponentConfig.childComponentIds =
          updatedRootComponentConfig.childComponentIds.filter(
            (id) => id !== componentId
          )
      } else {
        updatedComponentConfigs[parentComponentId].childComponentIds =
          updatedComponentConfigs[parentComponentId].childComponentIds.filter(
            (id) => id !== componentId
          )
      }

      const descendantComponentIds: Array<ComponentId> = []
      const findDescendantComponentIds = (componentId: ComponentId) => {
        updatedComponentConfigs[componentId].childComponentIds.forEach((id) => {
          // Queue component for deletion
          descendantComponentIds.unshift(id)
          // Find remaining descendant components
          findDescendantComponentIds(id)
        })
      }
      findDescendantComponentIds(componentId)
      descendantComponentIds.forEach((id) => delete updatedComponentConfigs[id])

      delete updatedComponentConfigs[componentId]
    })

    setAndSaveRootComponentConfig(updatedRootComponentConfig)
    setAndSaveComponentConfigs(updatedComponentConfigs)
  }

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
            if (event.metaKey) {
              setSelectedComponentIds([...selectedComponentIds, componentId])
            } else {
              setSelectedComponentIds([componentId])
            }
            event.stopPropagation()
          }}
          // Allows element to be focused, which in turn allows the element to capture key presses
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.code === 'Backspace') {
              deleteSelectedComponents()
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
    <div className={styles.root}>
      <Head>
        <title>composition</title>
        <meta name="description" content="Design with your design system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.header}>
        composition
        <Select
          className={styles.addComponent}
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
              updatedComponentConfigs[
                selectedComponentIds[0]
              ].childComponentIds = [
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
      </div>

      <div className={styles.componentBrowser}>
        <ComponentBrowser
          rootComponentConfig={rootComponentConfig}
          componentConfigs={componentConfigs}
          selectedComponentIds={selectedComponentIds}
          setSelectedComponentIds={setSelectedComponentIds}
          deleteSelectedComponents={deleteSelectedComponents}
        />
      </div>

      <div
        className={styles.main}
        onClick={() => {
          // If the click gets here, a component was not clicked because `stopPropagation` is called whenever a component is clicked.
          setSelectedComponentIds([])
        }}
      >
        {renderComponents(rootComponentConfig.childComponentIds)}
      </div>

      <div className={styles.componentEditor}>
        <ComponentConfigEditor
          componentIds={selectedComponentIds}
          componentConfigs={componentConfigs}
          onChangeComponentConfigs={setAndSaveComponentConfigs}
        />
      </div>
    </div>
  )
}

export default Home
