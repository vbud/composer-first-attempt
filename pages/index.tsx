// TODO: import-ordering prettier or eslint
import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import {
  ComponentId,
  ComponentConfig,
  SavedComponentConfigs,
  RootComponentConfig,
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

  const [selectedComponentId, setSelectedComponentId] =
    useState<ComponentId | null>(null)

  const setAndSaveComponentConfigs = (
    updatedComponentConfigs: SavedComponentConfigs
  ) => {
    setComponentConfigs(updatedComponentConfigs)
    saveComponentConfigs(updatedComponentConfigs)
  }

  const renderComponents = (componentIds: Array<ComponentId>) => {
    return componentIds.map((componentId) => {
      const { componentType, config, childComponentIds } =
        componentConfigs[componentId]

      let children
      if (
        drawableComponents[componentType].canSupportChildren &&
        Array.isArray(childComponentIds) &&
        childComponentIds.length > 0
      ) {
        children = renderComponents(childComponentIds)
      }

      return (
        <div
          key={componentId}
          className={
            componentId === selectedComponentId ? styles.selected : undefined
          }
          onClick={(event) => {
            setSelectedComponentId(componentId)
            event.stopPropagation()
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

            const newComponentConfig = {
              componentType,
              config: drawableComponents[componentType].defaultConfig,
              childComponentIds: [],
            }

            const updatedComponentConfigs = {
              ...componentConfigs,
              [newComponentId]: newComponentConfig,
            }

            if (
              selectedComponentId !== null &&
              drawableComponents[
                componentConfigs[selectedComponentId].componentType
              ].canSupportChildren
            ) {
              updatedComponentConfigs[selectedComponentId].childComponentIds = [
                ...updatedComponentConfigs[selectedComponentId]
                  .childComponentIds,
                newComponentId,
              ]
            } else {
              const updatedRootComponentConfig: RootComponentConfig = {
                ...rootComponentConfig,
                childComponentIds: [
                  ...rootComponentConfig.childComponentIds,
                  newComponentId,
                ],
              }
              setRootComponentConfig(updatedRootComponentConfig)
              saveRootComponentConfig(updatedRootComponentConfig)
            }

            setAndSaveComponentConfigs(updatedComponentConfigs)
          }}
        >
          {Object.keys(drawableComponents).map((componentName) => (
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
          selectedComponentId={selectedComponentId}
          setSelectedComponentId={setSelectedComponentId}
        />
      </div>

      <div
        className={styles.main}
        onClick={() => {
          // If the click gets here, a component was not clicked because `stopPropagation` is called whenever a component is clicked.
          setSelectedComponentId(null)
        }}
      >
        {renderComponents(rootComponentConfig.childComponentIds)}
      </div>

      <div className={styles.componentEditor}>
        <ComponentConfigEditor
          componentId={selectedComponentId}
          componentConfigs={componentConfigs}
          onChangeComponentConfigs={setAndSaveComponentConfigs}
        />
      </div>
    </div>
  )
}

export default Home
