import { ComponentType, libraryPropTypes } from 'types'
import { primitiveComponentPropTypes } from './builtInComponents'

import styles from 'styles/AddComponent.module.css'

export const AddComponent = ({
  addComponent,
}: {
  addComponent: (componentType: ComponentType) => void
}) => {
  const renderOption = (componentType: ComponentType) => (
    <option value={componentType} key={componentType}>
      {componentType}
    </option>
  )

  const buttonText = 'Add component'

  return (
    <select
      className={styles.root}
      value={buttonText}
      onChange={(event) => {
        addComponent(event.target.value as ComponentType)
      }}
    >
      <option value={buttonText}>{buttonText}</option>
      <optgroup label="Built-in primitives">
        {Object.keys(primitiveComponentPropTypes).map(renderOption)}
      </optgroup>
      <optgroup label="Material UI">
        {Object.keys(libraryPropTypes).map(renderOption)}
      </optgroup>
    </select>
  )
}
