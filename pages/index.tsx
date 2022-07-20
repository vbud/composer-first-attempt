import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import styles from 'styles/Home.module.css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// TODO: import-ordering prettier or eslint
import {
  drawableComponents,
  ComponentConfig,
} from 'components/libraryComponents'

const localStorageComponentConfigsKey = 'componentConfigs'

type SavedComponentConfigs = {
  [key: string]: {
    type: keyof ComponentConfig
    config: ComponentConfig[keyof ComponentConfig]
  }
}

const Home: NextPage = () => {
  const savedComponentConfigs = localStorage.getItem(
    localStorageComponentConfigsKey
  )
  const initialState =
    typeof savedComponentConfigs === 'string'
      ? JSON.parse(savedComponentConfigs)
      : {}

  const [componentConfigs, setComponentConfigs] =
    useState<SavedComponentConfigs>(initialState)

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
            const componentType = event.target.value as keyof ComponentConfig
            const updatedComponentConfigs = {
              ...componentConfigs,
              [nanoid()]: {
                type: componentType,
                config: drawableComponents[componentType].defaultConfig,
              },
            }
            setComponentConfigs(updatedComponentConfigs)
            localStorage.setItem(
              localStorageComponentConfigsKey,
              JSON.stringify(updatedComponentConfigs)
            )
          }}
        >
          {Object.keys(drawableComponents).map((componentName) => (
            <MenuItem value={componentName} key={componentName}>
              {componentName}
            </MenuItem>
          ))}
        </Select>
      </div>

      <main className={styles.main}>
        {Object.keys(componentConfigs).map((componentId) => {
          const { type, config } = componentConfigs[componentId]
          return (
            <React.Fragment key={componentId}>
              {/* TODO: need typescript magic */}
              {drawableComponents[type].render(config)}
            </React.Fragment>
          )
        })}
      </main>
    </div>
  )
}

export default Home
