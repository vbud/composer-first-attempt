import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import styles from 'styles/Home.module.css'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { mui } from 'components/libraryComponents'

let componentId = -1
const generateComponentId = () => {
  componentId += 1
  return componentId
}

const Home: NextPage = () => {
  const [components, setComponents] = useState({})

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
            const componentName = event.target.value
            setComponents({
              ...components,
              [generateComponentId()]: mui[componentName],
            })
          }}
        >
          {Object.keys(mui).map((componentName) => (
            <MenuItem value={componentName} key={componentName}>
              {componentName}
            </MenuItem>
          ))}
        </Select>
      </div>

      <main className={styles.main}>
        {Object.values(components).map((component) => {
          const Component = component.component
          return <Component {...component.props} />
        })}
      </main>
    </div>
  )
}

export default Home
