import {
  ComponentId,
  ComponentType,
  SavedComponentConfigs,
  ComponentPropValue,
  componentPropTypes,
} from 'types'
import { isLayoutComponent } from 'components/builtInComponents'

import styles from 'styles/ComponentPropsEditor.module.css'
import { getPropValue } from 'utils/propHelpers'

type ConfigItemEditorProps = {
  componentType: ComponentType
  propKey: string
  propValue: ComponentPropValue
  onChange: (value: ComponentPropValue | undefined) => void
}

const ConfigItemEditor = ({
  componentType,
  propKey,
  propValue,
  onChange,
}: ConfigItemEditorProps) => {
  const { type: propType, isRequired } =
    componentPropTypes[componentType][propKey]
  propValue = getPropValue(componentType, propKey, propValue)
  const noValue = '-'

  if (propType === 'bool') {
    const options = ['true', 'false']
    if (!isRequired) {
      options.unshift(noValue)
    }
    return (
      <div>
        <div>{propKey}:</div>
        <select
          value={propValue}
          onChange={(event) => {
            let value: boolean | undefined
            if (event.target.value === 'true') {
              value = true
            } else if (event.target.value === 'false') {
              value = false
            } else if (event.target.value === noValue) {
              value = undefined
            }
            onChange(value)
          }}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    )
  } else if (propType === 'string' || propType === 'node') {
    return (
      <div>
        <div>{propKey}:</div>
        <input
          onChange={(event) =>
            onChange(event.target.value as ComponentPropValue)
          }
          value={propValue}
        />
      </div>
    )
  } else if (propType === 'number') {
    return (
      <div>
        <div>{propKey}:</div>
        <input
          onChange={(event) =>
            onChange(Number(event.target.value) as ComponentPropValue)
          }
          value={propValue}
          type="number"
        />
      </div>
    )
  } else if (propType === 'oneOf') {
    const options = [...componentPropTypes[componentType][propKey].values]
    if (!isRequired) {
      options.unshift(noValue)
    }
    return (
      <div>
        <div>{propKey}:</div>
        <select
          value={propValue === undefined ? noValue : propValue}
          onChange={(event) => {
            let value: string | undefined = event.target.value
            if (value === noValue) value = undefined
            onChange(value as ComponentPropValue)
          }}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    )
  } else if (propType === 'array') {
    return (
      <div>
        <div>{propKey}:</div>
        {propValue.map((listItem, i) => (
          <div key={i} className={styles.customListItem}>
            <input
              value={listItem}
              onChange={(event) => {
                const newValue = [...propValue]
                newValue[i] = event.target.value
                onChange(newValue)
              }}
            />
            <button
              onClick={() => {
                const newValue = [...propValue]
                newValue.splice(i, 1)
                onChange(newValue)
              }}
            >
              -
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...propValue, `Item ${propValue.length}`])}
        >
          +
        </button>
      </div>
    )
  } else {
    return null
  }
}

const layoutComponentTypes = ['LayoutFlex', 'LayoutGrid'] as const

type ComponentEditorProps = {
  componentIds: Array<ComponentId>
  componentConfigs: SavedComponentConfigs
  setAndSaveComponentConfigs: (configs: SavedComponentConfigs) => void
}

export const ComponentPropsEditor = ({
  componentIds,
  componentConfigs,
  setAndSaveComponentConfigs,
}: ComponentEditorProps) => {
  let content: React.ReactNode = null

  if (componentIds.length === 0) {
    content = 'No component selected.'
  } else if (componentIds.length > 1) {
    content = 'Multiple components selected.'
  } else {
    const componentId = componentIds[0]
    const { props, componentType } = componentConfigs[componentId]
    let itemsToRender: Array<React.ReactNode> = []

    itemsToRender = Object.keys(componentPropTypes[componentType]).map(
      (propKey) =>
        // Do not show children prop in the editor, as children are set differently
        propKey === 'children' ? null : (
          <ConfigItemEditor
            key={propKey}
            componentType={componentType}
            propKey={propKey}
            propValue={props[propKey]}
            onChange={(value) => {
              const props = { ...componentConfigs[componentId].props }
              if (value === undefined) {
                delete props[propKey]
              } else {
                props[propKey] = value
              }
              setAndSaveComponentConfigs({
                ...componentConfigs,
                [componentId]: {
                  ...componentConfigs[componentId],
                  props,
                },
              })
            }}
          />
        )
    )

    if (isLayoutComponent(componentType)) {
      itemsToRender.unshift(
        <div key="__layoutType__">
          <div>type:</div>
          <select
            value={componentType}
            onChange={(event) => {
              const newComponentType = event.target
                .value as typeof layoutComponentTypes[number]
              componentConfigs[componentId].componentType = newComponentType
              componentConfigs[componentId].props = {}
              setAndSaveComponentConfigs(componentConfigs)
            }}
          >
            {layoutComponentTypes.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      )
    }

    content = itemsToRender
  }

  return <div className={styles.root}>{content}</div>
}
