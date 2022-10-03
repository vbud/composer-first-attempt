import {
  ComponentProps,
  componentPropTypes,
  ComponentPropValue,
  ComponentType,
} from 'types'

// Provides a value for required props when no explicit value has been saved.
export const getPropValue = (
  componentType: ComponentType,
  propKey: string,
  propValue: ComponentPropValue
): ComponentPropValue => {
  const { type: propType, isRequired } =
    componentPropTypes[componentType][propKey]
  if (propType === 'bool') {
    if (isRequired && propValue === undefined) {
      propValue = false
    }
  } else if (propType === 'string') {
    if (isRequired && propValue === undefined) {
      propValue = '<text>'
    }
  } else if (propType === 'number') {
    if (isRequired && propValue === undefined) {
      propValue = 0
    }
  } else if (propType === 'oneOf') {
    if (isRequired && propValue === undefined) {
      propValue = componentPropTypes[componentType][propKey].values[0]
    }
  } else if (propType === 'array') {
    if (isRequired && propValue === undefined) {
      propValue = ['Item 1', 'Item 2', 'Item 3']
    }
  } else if (propType === 'node') {
    if (isRequired && propValue === undefined) {
      propValue = '<node>'
    }
  }

  return propValue
}

// Fills out component props with values if not all props have saved values.
export const buildProps = (
  componentType: ComponentType,
  props: ComponentProps
): ComponentProps => {
  const newProps = {}
  Object.keys(componentPropTypes[componentType]).forEach((propKey) => {
    newProps[propKey] = getPropValue(componentType, propKey, props[propKey])
  })
  return newProps
}
