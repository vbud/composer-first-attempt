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
  muiDrawableComponents,
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
            const componentName = event.target
              .value as keyof typeof muiDrawableComponents
            const updatedComponents = {
              ...components,
              [nanoid()]: muiDrawableComponents[componentName],
            }
            setComponents(updatedComponents)
            localStorage.setItem(
              localStorageComponentsKey,
              JSON.stringify(updatedComponents)
            )
          }}
        >
          {Object.keys(muiDrawableComponents).map((componentName) => (
            <MenuItem value={componentName} key={componentName}>
              {componentName}
            </MenuItem>
          ))}
        </Select>
      </div>

      <main className={styles.main}>
        {Object.keys(components).map((componentId) => {
          const deserializedComponent = deserializeComponent(
            components[componentId],
            componentId
          )
          return deserializedComponent
        })}
      </main>
    </div>
  )
}

export default Home
