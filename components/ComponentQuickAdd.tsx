import { useState } from 'react'
import Fuse from 'fuse.js'
import classnames from 'classnames'

import { ComponentType, libraryPropTypes } from 'types'
import { primitiveComponentPropTypes } from './builtInComponents'

import styles from 'styles/ComponentQuickAdd.module.css'

const componentTypes = [
  ...Object.keys(libraryPropTypes),
  ...Object.keys(primitiveComponentPropTypes),
] as Array<ComponentType>

const fuse = new Fuse(componentTypes)

export const ComponentQuickAdd = ({
  onAdd,
}: {
  onAdd: (componentType: ComponentType) => void
}) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const matchingComponentTypes = fuse.search(searchValue)

  return (
    <div className={styles.root}>
      <input
        className={styles.search}
        autoFocus
        type="text"
        value={searchValue}
        onChange={(event) => {
          setSearchValue(event.target.value)
          setSelectedIndex(0)
        }}
        onKeyDown={(event: React.KeyboardEvent) => {
          if (event.code === 'Enter') {
            matchingComponentTypes[selectedIndex] &&
              onAdd(matchingComponentTypes[selectedIndex].item)
          } else if (event.code === 'ArrowDown') {
            if (selectedIndex < matchingComponentTypes.length - 1) {
              setSelectedIndex(selectedIndex + 1)
            }
          } else if (event.code === 'ArrowUp') {
            if (selectedIndex > 0) {
              setSelectedIndex(selectedIndex - 1)
            }
          }
        }}
      />
      {searchValue.length > 0 ? (
        <div className={styles.results}>
          {matchingComponentTypes.map(({ item }, i) => (
            <div
              key={item}
              className={classnames(styles.result, {
                [styles.selectedResult]: selectedIndex === i,
              })}
              onClick={() => {
                onAdd(item)
              }}
            >
              {item}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
