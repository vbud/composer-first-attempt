import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import { nanoid } from 'nanoid'

import {
  ComponentId,
  SavedComponentConfigs,
  SavedComponentConfig,
  rootComponentId,
} from 'types'
import { AddComponent } from 'components/AddComponent'
import { ComponentBrowser } from 'components/ComponentBrowser'
import { Canvas } from 'components/Canvas'
import { ComponentPropsEditor } from 'components/ComponentPropsEditor'
import { readComponentConfigs, saveComponentConfigs } from 'utils/localStorage'
import {
  queryParamKeys,
  getQueryParam,
  changeQueryParam,
} from 'utils/queryParams'

import styles from 'styles/Home.module.css'
import { isLayoutComponent } from 'components/builtInComponents'

const Home: NextPage = () => {
  const [componentConfigs, setComponentConfigs] =
    useState<SavedComponentConfigs>(readComponentConfigs())

  const selectedComponentIdsParam = getQueryParam(
    queryParamKeys.selectedComponentIds
  )
  // Filter out any components without a corresponding saved config
  const validatedIds = (
    typeof selectedComponentIdsParam === 'string'
      ? selectedComponentIdsParam.split(',')
      : []
  ).filter((id) => componentConfigs[id])

  const [selectedComponentIds, setSelectedComponentIds] =
    useState<Array<ComponentId>>(validatedIds)

  const setSelectedComponents = (ids: Array<ComponentId>) => {
    setSelectedComponentIds(ids)

    changeQueryParam(queryParamKeys.selectedComponentIds, ids.join(','))
  }

  const setAndSaveComponentConfigs = (
    componentConfigs: SavedComponentConfigs
  ) => {
    setComponentConfigs({ ...componentConfigs })
    saveComponentConfigs(componentConfigs)
  }

  const groupSelectedComponents = () => {
    if (selectedComponentIds.length === 0) return

    const firstSelectedComponentParentId =
      componentConfigs[selectedComponentIds[0]].parentComponentId

    // Create a new layout component at same level as first child's parent
    const newLayoutComponentId = nanoid()
    const newLayoutComponentType = 'LayoutFlex'
    const newLayoutComponentConfig: SavedComponentConfig = {
      componentType: newLayoutComponentType,
      props: {},
      // Add the selected components to the new layout component
      childComponentIds: [...selectedComponentIds],
      parentComponentId: firstSelectedComponentParentId,
    }
    componentConfigs[newLayoutComponentId] = newLayoutComponentConfig

    const [firstSelectedComponentId, ...remainingSelectedComponentIds] =
      selectedComponentIds

    // Replace the first selected component with the new layout component at the same position in the array
    const siblingIds =
      componentConfigs[firstSelectedComponentParentId].childComponentIds
    // This will always be true in practice, just appeasing typescript
    if (siblingIds) {
      siblingIds[siblingIds.indexOf(firstSelectedComponentId)] =
        newLayoutComponentId
    }

    // Remove the remaining selected components from their parents
    if (remainingSelectedComponentIds.length > 0) {
      remainingSelectedComponentIds.forEach((componentId) => {
        const { parentComponentId } = componentConfigs[componentId]
        componentConfigs[parentComponentId].childComponentIds =
          componentConfigs[parentComponentId].childComponentIds?.filter(
            (id) => id !== componentId
          )
      })
    }

    // Change the components' parents to the group
    selectedComponentIds.forEach((componentId) => {
      componentConfigs[componentId].parentComponentId = newLayoutComponentId
    })

    // Update all react state
    setAndSaveComponentConfigs(componentConfigs)
    setSelectedComponents([newLayoutComponentId])
  }

  const ungroupSelectedComponents = () => {
    const newSelectedComponentIds: Array<ComponentId> = []
    let foundLayoutComponents = false

    selectedComponentIds.forEach((id) => {
      // Only ungroup layout components
      if (isLayoutComponent(componentConfigs[id].componentType)) {
        foundLayoutComponents = true

        const { childComponentIds, parentComponentId } = componentConfigs[id]
        // Move child components to parent of layout component
        childComponentIds.forEach((childId) => {
          componentConfigs[childId].parentComponentId = parentComponentId
        })

        // Replace the layout component with the layout component's children at the same position in the parent's array of children
        const siblingIds = componentConfigs[parentComponentId].childComponentIds
        // This will always be true in practice, just appeasing typescript
        if (siblingIds) {
          const index = siblingIds.indexOf(id)
          siblingIds.splice(index, 1, ...childComponentIds)
        }

        // Ensure all children are selected as a result of ungrouping
        newSelectedComponentIds.push(...childComponentIds)

        delete componentConfigs[id]
      }
    })

    // Only update if any layout components were found to ungroup, otherwise do nothing
    if (foundLayoutComponents) {
      // Update all react state
      setAndSaveComponentConfigs(componentConfigs)
      setSelectedComponents(newSelectedComponentIds)
    }
  }

  const deleteSelectedComponents = () => {
    if (selectedComponentIds.length === 0) return

    let newSelectedComponentId: ComponentId | undefined

    // Delete the components in reverse order
    selectedComponentIds.reverse().forEach((componentId, i) => {
      const { parentComponentId } = componentConfigs[componentId]

      // If the component has already been deleted, do nothing
      if (componentConfigs[componentId] === undefined) return

      // Remove the component from the parent's `childComponentIds`
      const siblingIds = componentConfigs[parentComponentId].childComponentIds
      // This will always be true in practice, just appeasing typescript
      if (siblingIds) {
        const index = siblingIds.indexOf(componentId)
        siblingIds.splice(index, 1)

        // Decide the next selected component based on the location of the first deleted component
        if (i === selectedComponentIds.length - 1) {
          if (siblingIds[index]) {
            // If there is another component at the same location as the first selected component, select it
            newSelectedComponentId = siblingIds[index]
          } else if (siblingIds.length > 0) {
            // Otherwise, if there are still other components at the same level, select last one
            newSelectedComponentId = siblingIds[siblingIds.length - 1]
          } else if (parentComponentId !== rootComponentId) {
            // Otherwise, select the parent, unless that parent is the root component, in which case do nothing
            newSelectedComponentId = parentComponentId
          }
        }
      }

      // Find and delete all descendants
      const descendantComponentIds: Array<ComponentId> = []
      const findDescendantComponentIds = (componentId: ComponentId) => {
        componentConfigs[componentId].childComponentIds?.forEach((id) => {
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
    setAndSaveComponentConfigs(componentConfigs)
    setSelectedComponents(
      newSelectedComponentId ? [newSelectedComponentId] : []
    )
  }

  const onClickComponent = (
    componentId: ComponentId,
    event: React.MouseEvent
  ) => {
    if (selectedComponentIds.includes(componentId)) return

    if (event.metaKey) {
      setSelectedComponents([...selectedComponentIds, componentId])
    } else {
      setSelectedComponents([componentId])
    }
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === 'Backspace') deleteSelectedComponents()
    else if (event.code === 'KeyG' && event.metaKey && event.shiftKey) {
      event.preventDefault()
      ungroupSelectedComponents()
    } else if (event.code === 'KeyG' && event.metaKey) {
      event.preventDefault()
      groupSelectedComponents()
    }
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
          setAndSaveComponentConfigs={setAndSaveComponentConfigs}
          setSelectedComponents={setSelectedComponents}
        />
      </div>

      <ComponentBrowser
        componentConfigs={componentConfigs}
        selectedComponentIds={selectedComponentIds}
        setSelectedComponents={setSelectedComponents}
        onClickComponent={onClickComponent}
        onKeyDown={onKeyDown}
      />

      <Canvas
        componentConfigs={componentConfigs}
        selectedComponentIds={selectedComponentIds}
        setSelectedComponents={setSelectedComponents}
        onClickComponent={onClickComponent}
        onKeyDown={onKeyDown}
      />

      <ComponentPropsEditor
        componentIds={selectedComponentIds}
        componentConfigs={componentConfigs}
        setAndSaveComponentConfigs={setAndSaveComponentConfigs}
      />
    </div>
  )
}

export default Home
