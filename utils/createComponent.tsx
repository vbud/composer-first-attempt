import { nanoid } from 'nanoid'

import {
  ComponentId,
  ComponentProps,
  componentPropTypes,
  ComponentType,
  rootComponentId,
  SavedComponentConfigs,
} from 'types'

type ComponentTemplate = {
  componentType: ComponentType
  props?: ComponentProps
  children?: Array<ComponentTemplate>
}

const componentTemplates: Partial<Record<ComponentType, ComponentTemplate>> = {
  Select: {
    componentType: 'FormControl',
    children: [
      {
        componentType: 'InputLabel',
        children: [{ componentType: 'Text', props: { value: 'Item' } }],
      },
      {
        componentType: 'Select',
        props: {
          value: 'Item 1',
        },
        children: [
          {
            componentType: 'MenuItem',
            props: {
              value: 'Item 1',
            },
            children: [{ componentType: 'Text', props: { value: 'Item 1' } }],
          },
          {
            componentType: 'MenuItem',
            props: {
              value: 'Item 2',
            },
            children: [{ componentType: 'Text', props: { value: 'Item 2' } }],
          },
          {
            componentType: 'MenuItem',
            props: {
              value: 'Item 3',
            },
            children: [{ componentType: 'Text', props: { value: 'Item 3' } }],
          },
        ],
      },
    ],
  },
}

const hydrateComponent = (
  componentTemplate: ComponentTemplate,
  parentComponentId: ComponentId,
  componentConfigs: SavedComponentConfigs,
  knownComponentId?: ComponentId
): ComponentId => {
  const componentId = knownComponentId ?? nanoid()

  componentConfigs[componentId] = {
    componentType: componentTemplate.componentType,
    props: {},
    parentComponentId,
    childComponentIds: [],
  }

  const { props, children } = componentTemplate
  if (props) {
    componentConfigs[componentId].props = { ...props }
  }
  if (children) {
    componentConfigs[componentId].childComponentIds = children.map(
      (childComponentTemplate) =>
        hydrateComponent(childComponentTemplate, componentId, componentConfigs)
    )
  }

  return componentId
}

export const createComponent = (
  componentType: ComponentType,
  selectedComponentIds: Array<ComponentId>,
  componentConfigs: SavedComponentConfigs
): ComponentId => {
  // Initialize root component if it does not exist
  if (componentConfigs[rootComponentId] === undefined) {
    componentConfigs[rootComponentId] = {
      childComponentIds: [],
      parentComponentId: '__null__',
    }
  }

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
      const siblingIds = componentConfigs[parentComponentId].childComponentIds
      const selectedIdIndex = siblingIds.indexOf(selectedId)
      siblingIds.splice(selectedIdIndex + 1, 0, newComponentId)
    }
  } else {
    // If 0 or more than 1 components are selected, add the new component at the top level
    parentComponentId = rootComponentId
    componentConfigs[rootComponentId].childComponentIds.push(newComponentId)
  }

  const componentTemplate = componentTemplates[componentType]
  if (componentTemplate) {
    hydrateComponent(
      componentTemplate,
      parentComponentId,
      componentConfigs,
      newComponentId
    )
  } else {
    componentConfigs[newComponentId] = {
      componentType,
      props: {},
      parentComponentId,
      childComponentIds: [],
    }
  }

  return newComponentId
}
