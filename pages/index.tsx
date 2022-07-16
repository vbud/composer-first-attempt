import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import styles from 'styles/Home.module.css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import {
  muiComponentName,
  muiComponents,
  muiComponentDefaultProps,
} from 'components/libraryComponents'

type SerializedComponent = {
  name: muiComponentName
  props: { [key: string]: string | number }
}

type SerializedComponents = {
  [key: string]: SerializedComponent
}

const localStorageComponentsKey = 'components'

const Home: NextPage = () => {
  const serializedComponents = localStorage.getItem(localStorageComponentsKey)
  console.log('serializedComponents', serializedComponents)
  const initialState =
    typeof serializedComponents === 'string'
      ? JSON.parse(serializedComponents)
      : {}

  const [components, setComponents] =
    useState<SerializedComponents>(initialState)

  console.log('components', components)

  return (
    <div className={styles.app}>
      <Head>
        <title>composition</title>
        <meta name="description" content="Design with your design system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.header}>
        composition
        <Select
          className={styles.addComponent}
          size="small"
          value=""
          onChange={(event) => {
            // TODO: is there a cleaner way to do this? The selected value will always be a valid muiComponentName.
            const componentName = event.target.value as muiComponentName
            const newComponents = {
              ...components,
              [nanoid()]: {
                name: componentName,
                props: muiComponentDefaultProps[componentName],
              },
            }
            setComponents(newComponents)
            localStorage.setItem(
              localStorageComponentsKey,
              JSON.stringify(newComponents)
            )
          }}
        >
          {Object.values(muiComponentName).map((componentName) => (
            <MenuItem value={componentName} key={componentName}>
              {componentName}
            </MenuItem>
          ))}
        </Select>
      </div>

      <main className={styles.main}>
        {Object.keys(components).map((componentId) => {
          const Component = muiComponents[components[componentId].name]
          return (
            <Component key={componentId} {...components[componentId].props} />
          )
        })}
      </main>
    </div>
  )
}

export default Home
