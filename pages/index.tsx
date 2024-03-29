import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import { Modal } from '@mui/material'

import {
  ComponentId,
  ComponentType,
  SavedComponentConfigs,
  SavedComponentConfig,
  rootComponentId,
} from 'types'
import { AddComponent } from 'components/AddComponent'
import { ComponentExplorer } from 'components/ComponentExplorer'
import { Canvas } from 'components/Canvas'
import { ComponentPropsEditor } from 'components/ComponentPropsEditor'
import { isLayoutComponent } from 'components/builtInComponents'
import { ComponentQuickAdd } from 'components/ComponentQuickAdd'
import { readComponentConfigs, saveComponentConfigs } from 'utils/localStorage'
import {
  queryParamKeys,
  getQueryParam,
  changeQueryParam,
} from 'utils/queryParams'
import { createComponent } from 'utils/createComponent'

import styles from 'styles/Home.module.css'

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

  const explorerRef = React.createRef<HTMLDivElement>()
  const canvasRef = React.createRef<HTMLDivElement>()
  const editorRef = React.createRef<HTMLDivElement>()

  const addComponent = (componentType: ComponentType) => {
    const newComponentId = createComponent(
      componentType,
      selectedComponentIds,
      componentConfigs
    )

    setAndSaveComponentConfigs(componentConfigs)
    setSelectedComponents([newComponentId])
    canvasRef.current && canvasRef.current.focus()
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
    siblingIds[siblingIds.indexOf(firstSelectedComponentId)] =
      newLayoutComponentId

    // Remove the remaining selected components from their parents
    if (remainingSelectedComponentIds.length > 0) {
      remainingSelectedComponentIds.forEach((componentId) => {
        const { parentComponentId } = componentConfigs[componentId]
        componentConfigs[parentComponentId].childComponentIds =
          componentConfigs[parentComponentId].childComponentIds.filter(
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
        const index = siblingIds.indexOf(id)
        siblingIds.splice(index, 1, ...childComponentIds)

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

  const handleKeyDownInBrowserOrCanvas = (event: React.KeyboardEvent) => {
    if (event.code === 'Backspace') deleteSelectedComponents()
    else if (event.code === 'KeyG' && event.metaKey && event.shiftKey) {
      event.preventDefault()
      ungroupSelectedComponents()
    } else if (event.code === 'KeyG' && event.metaKey) {
      event.preventDefault()
      groupSelectedComponents()
    } else if (event.code === 'Enter') {
      editorRef.current && editorRef.current.focus()
    }
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleClose = () => setIsModalOpen(false)

  const handleAdd = (componentType: ComponentType) => {
    addComponent(componentType)
    handleClose()
    canvasRef.current && canvasRef.current.focus()
  }

  return (
    <div
      // Allows element to be focused, which in turn allows the element to capture key presses
      tabIndex={-1}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (event.code === 'KeyP' && event.metaKey) {
          event.preventDefault()
          setIsModalOpen(true)
        } else if (event.code === 'KeyC' && event.metaKey && event.shiftKey) {
          event.preventDefault()
          canvasRef.current && canvasRef.current.focus()
        } else if (event.code === 'KeyE' && event.metaKey && event.shiftKey) {
          event.preventDefault()
          explorerRef.current && explorerRef.current.focus()
        }
      }}
      className={styles.root}
    >
      <Head>
        <title>composer</title>
        <meta name="description" content="Design with your design system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.header}>
        composer
        <AddComponent addComponent={addComponent} />
      </div>

      <ComponentExplorer
        ref={explorerRef}
        componentConfigs={componentConfigs}
        selectedComponentIds={selectedComponentIds}
        setSelectedComponents={setSelectedComponents}
        onClickComponent={onClickComponent}
        onKeyDown={handleKeyDownInBrowserOrCanvas}
      />

      <Canvas
        ref={canvasRef}
        componentConfigs={componentConfigs}
        selectedComponentIds={selectedComponentIds}
        setSelectedComponents={setSelectedComponents}
        onClickComponent={onClickComponent}
        onKeyDown={handleKeyDownInBrowserOrCanvas}
      />

      <ComponentPropsEditor
        ref={editorRef}
        selectedComponentIds={selectedComponentIds}
        componentConfigs={componentConfigs}
        setAndSaveComponentConfigs={setAndSaveComponentConfigs}
      />

      <Modal
        componentsProps={{ backdrop: () => ({ invisible: true }) }}
        open={isModalOpen}
        onClose={handleClose}
      >
        {/* Using a fragment here to work around material-ui ref issue. See https://mui.com/material-ui/guides/composition/#caveat-with-refs */}
        <>
          <ComponentQuickAdd onAdd={handleAdd} />
        </>
      </Modal>
    </div>
  )
}

export default Home
