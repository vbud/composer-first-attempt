import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import { nanoid } from 'nanoid'

import {
  ComponentId,
  SavedComponentConfigs,
  RootComponentConfig,
  SavedComponentConfig,
} from 'types'
import { AddComponent } from 'components/AddComponent'
import { ComponentBrowser } from 'components/ComponentBrowser'
import { Canvas } from 'components/Canvas'
import { ComponentConfigEditor } from 'components/ComponentConfigEditor'
import { drawableComponents } from 'components/libraryComponents'
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

  const groupSelectedComponents = () => {
    if (selectedComponentIds.length === 0) return

    const firstSelectedComponentParentId =
      componentConfigs[selectedComponentIds[0]].parentComponentId

    // Create a new layout component at same level as first child's parent
    const newLayoutComponentId = nanoid()
    const newLayoutComponentType = 'layoutFlex'
    const newLayoutComponentConfig: SavedComponentConfig = {
      componentType: newLayoutComponentType,
      config: drawableComponents[newLayoutComponentType].defaultConfig,
      // Add the selected components to the new layout component
      childComponentIds: [...selectedComponentIds],
      parentComponentId: firstSelectedComponentParentId,
    }
    componentConfigs[newLayoutComponentId] = newLayoutComponentConfig

    const [firstSelectedComponentId, ...remainingSelectedComponentIds] =
      selectedComponentIds

    // Replace the first selected component with the new layout component at the same position in the array
    if (firstSelectedComponentParentId === null) {
      const index = rootComponentConfig.childComponentIds.indexOf(
        firstSelectedComponentId
      )
      rootComponentConfig.childComponentIds[index] = newLayoutComponentId
    } else {
      const index = componentConfigs[
        firstSelectedComponentParentId
      ].childComponentIds.indexOf(firstSelectedComponentId)
      componentConfigs[firstSelectedComponentParentId].childComponentIds[
        index
      ] = newLayoutComponentId
    }

    // Remove the remaining selected components from their parents
    if (remainingSelectedComponentIds.length > 0) {
      remainingSelectedComponentIds.forEach((componentId) => {
        const { parentComponentId } = componentConfigs[componentId]
        if (parentComponentId === null) {
          rootComponentConfig.childComponentIds =
            rootComponentConfig.childComponentIds.filter(
              (id) => id !== componentId
            )
        } else {
          componentConfigs[parentComponentId].childComponentIds =
            componentConfigs[parentComponentId].childComponentIds.filter(
              (id) => id !== componentId
            )
        }
      })
    }

    // Change the components' parents to the group
    selectedComponentIds.forEach((componentId) => {
      componentConfigs[componentId].parentComponentId = newLayoutComponentId
    })

    // Update all react state
    setAndSaveRootComponentConfig(rootComponentConfig)
    setAndSaveComponentConfigs(componentConfigs)
    setSelectedComponentIds([newLayoutComponentId])
  }

  const ungroupSelectedComponents = () => {
    const newSelectedComponentIds: Array<ComponentId> = []

    selectedComponentIds.forEach((id) => {
      // Only ungroup layout components
      if (
        !drawableComponents[componentConfigs[id].componentType]
          .isLayoutComponent
      )
        return

      const { parentComponentId } = componentConfigs[id]

      // Move child components to parent of layout component
      componentConfigs[id].childComponentIds.forEach((childId) => {
        componentConfigs[childId].parentComponentId = parentComponentId
      })

      // Replace the layout component with the layout component's children at the same position in the parent's array of children
      if (parentComponentId === null) {
        const index = rootComponentConfig.childComponentIds.indexOf(id)
        rootComponentConfig.childComponentIds.splice(
          index,
          1,
          ...componentConfigs[id].childComponentIds
        )
      } else {
        const index =
          componentConfigs[parentComponentId].childComponentIds.indexOf(id)
        componentConfigs[parentComponentId].childComponentIds.splice(
          index,
          1,
          ...componentConfigs[id].childComponentIds
        )
      }

      // Ensure all children are selected as a result of ungrouping
      newSelectedComponentIds.push(...componentConfigs[id].childComponentIds)

      delete componentConfigs[id]
    })

    // Update all react state
    setAndSaveRootComponentConfig(rootComponentConfig)
    setAndSaveComponentConfigs(componentConfigs)
    setSelectedComponentIds(newSelectedComponentIds)
  }

  const deleteSelectedComponents = () => {
    selectedComponentIds.forEach((componentId) => {
      const { parentComponentId } = componentConfigs[componentId]

      // If the component has already been deleted, do nothing
      if (componentConfigs[componentId] === undefined) return

      // Remove the component from the parent's `childComponentIds`
      // The parent can be the root component or a regular component
      if (parentComponentId === null) {
        rootComponentConfig.childComponentIds =
          rootComponentConfig.childComponentIds.filter(
            (id) => id !== componentId
          )
      } else {
        componentConfigs[parentComponentId].childComponentIds =
          componentConfigs[parentComponentId].childComponentIds.filter(
            (id) => id !== componentId
          )
      }

      // Find and delete all descendants
      const descendantComponentIds: Array<ComponentId> = []
      const findDescendantComponentIds = (componentId: ComponentId) => {
        componentConfigs[componentId].childComponentIds.forEach((id) => {
          // Add component to deletion queue
          descendantComponentIds.unshift(id)
          // Find remaining descendant components
          findDescendantComponentIds(id)
        })
      }
      findDescendantComponentIds(componentId)
      descendantComponentIds.forEach((id) => delete componentConfigs[id])

      delete componentConfigs[componentId]
    })

    // Update all react state
    setSelectedComponentIds([])
    setAndSaveRootComponentConfig(rootComponentConfig)
    setAndSaveComponentConfigs(componentConfigs)
  }

  const onClickComponent = (
    componentId: ComponentId,
    event: React.MouseEvent
  ) => {
    if (selectedComponentIds.includes(componentId)) return

    if (event.metaKey) {
      setSelectedComponentIds([...selectedComponentIds, componentId])
    } else {
      setSelectedComponentIds([componentId])
    }
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    event.preventDefault()

    if (event.code === 'Backspace') deleteSelectedComponents()
    else if (event.code === 'KeyG' && event.metaKey && event.shiftKey)
      ungroupSelectedComponents()
    else if (event.code === 'KeyG' && event.metaKey) groupSelectedComponents()
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
        <AddComponent
          componentConfigs={componentConfigs}
          selectedComponentIds={selectedComponentIds}
          rootComponentConfig={rootComponentConfig}
          setAndSaveComponentConfigs={setAndSaveComponentConfigs}
          setAndSaveRootComponentConfig={setAndSaveRootComponentConfig}
        />
      </div>

      <ComponentBrowser
        rootComponentConfig={rootComponentConfig}
        componentConfigs={componentConfigs}
        selectedComponentIds={selectedComponentIds}
        setSelectedComponentIds={setSelectedComponentIds}
        onClickComponent={onClickComponent}
        onKeyDown={onKeyDown}
      />

      <Canvas
        rootComponentConfig={rootComponentConfig}
        componentConfigs={componentConfigs}
        selectedComponentIds={selectedComponentIds}
        setSelectedComponentIds={setSelectedComponentIds}
        onClickComponent={onClickComponent}
        onKeyDown={onKeyDown}
      />

      <ComponentConfigEditor
        componentIds={selectedComponentIds}
        componentConfigs={componentConfigs}
        onChangeComponentConfigs={setAndSaveComponentConfigs}
      />
    </div>
  )
}

export default Home
