import harvestedPropTypes from 'harvestPropTypes/propTypes'
import {
  primitiveComponentPropTypes,
  layoutComponentPropTypes,
} from 'components/builtInComponents'

export const libraryPropTypes = harvestedPropTypes

export const componentPropTypes = {
  ...primitiveComponentPropTypes,
  ...layoutComponentPropTypes,
  ...libraryPropTypes,
} as const

type ComponentPropTypes = typeof componentPropTypes

export type ComponentId = string
export type ComponentType = keyof ComponentPropTypes

export type ComponentPropValue = string | number | boolean | Array<string>
export type ComponentProps = Record<string, ComponentPropValue>

export interface SavedComponentConfig {
  componentType: ComponentType
  props: ComponentProps
  childComponentIds: Array<ComponentId>
  parentComponentId: ComponentId
}

export const rootComponentId = '__root__'

export type SavedComponentConfigs = {
  [key: ComponentId]: SavedComponentConfig
} & {
  [rootComponentId]: {
    childComponentIds: Array<ComponentId>
    parentComponentId: '__null__'
  }
}
