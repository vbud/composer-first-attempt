import {
  ComponentId,
  ComponentType,
  SavedComponentConfigs,
  ComponentPropValue,
  componentPropTypes,
} from 'types'
import { isLayoutComponent } from 'components/builtInComponents'

import styles from 'styles/ComponentPropsEditor.module.css'
import { buildProps } from 'utils/propHelpers'

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

export const ComponentPropsEditor = ({
  selectedComponentIds,
  componentConfigs,
  setAndSaveComponentConfigs,
}: {
  selectedComponentIds: Array<ComponentId>
  componentConfigs: SavedComponentConfigs
  setAndSaveComponentConfigs: (configs: SavedComponentConfigs) => void
}) => {
  let content: React.ReactNode = null

  if (selectedComponentIds.length === 0) {
    content = 'No component selected.'
  } else if (selectedComponentIds.length > 1) {
    content = 'Multiple components selected.'
  } else {
    const selectedComponentId = selectedComponentIds[0]
    const { props, componentType } = componentConfigs[selectedComponentId]
    let itemsToRender: Array<React.ReactNode> = []

    itemsToRender = Object.keys(buildProps(componentType, props)).map(
      (propKey) =>
        // Do not show children prop in the editor, as children are set differently
        propKey === 'children' ? null : (
          <ConfigItemEditor
            key={`${selectedComponentId}-${propKey}`}
            componentType={componentType}
            propKey={propKey}
            propValue={props[propKey]}
            onChange={(value) => {
              const props = { ...componentConfigs[selectedComponentId].props }
              if (value === undefined) {
                delete props[propKey]
              } else {
                props[propKey] = value
              }
              setAndSaveComponentConfigs({
                ...componentConfigs,
                [selectedComponentId]: {
                  ...componentConfigs[selectedComponentId],
                  props,
                },
              })
            }}
          />
        )
    )

    if (isLayoutComponent(componentType)) {
      itemsToRender.unshift(
        <div key={`${selectedComponentId}-__layoutType__`}>
          <div>type:</div>
          <select
            value={componentType}
            onChange={(event) => {
              const newComponentType = event.target
                .value as typeof layoutComponentTypes[number]
              componentConfigs[selectedComponentId].componentType =
                newComponentType
              componentConfigs[selectedComponentId].props = {}
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
