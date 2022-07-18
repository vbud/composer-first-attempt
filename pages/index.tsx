import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import styles from 'styles/Home.module.css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// TODO: import-ordering prettier or eslint
import {
  deserializeComponent,
  serializeComponent,
  muiComponentName,
  muiDefaultComponents,
  SerializedComponent,
} from 'components/libraryComponents'

type SerializedComponents = {
  [key: string]: SerializedComponent
}

const localStorageComponentsKey = 'components'

const Home: NextPage = () => {
  const serializedComponents = localStorage.getItem(localStorageComponentsKey)
  const initialState =
    typeof serializedComponents === 'string'
      ? JSON.parse(serializedComponents)
      : {}

  const [components, setComponents] =
    useState<SerializedComponents>(initialState)

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
              [nanoid()]: serializeComponent(
                muiDefaultComponents[componentName]
              ),
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
          return deserializeComponent(components[componentId], componentId)
        })}
      </main>
    </div>
  )
}

export default Home
