import { RootComponentConfig, SavedComponentConfigs } from 'types'

const LOCAL_STORAGE_ROOT_COMPONENT_CONFIG_KEY = 'rootComponentConfig'
const LOCAL_STORAGE_COMPONENT_CONFIGS_KEY = 'componentConfigs'

export function readComponentConfigs(): SavedComponentConfigs {
  const savedComponentConfigs = localStorage.getItem(
    LOCAL_STORAGE_COMPONENT_CONFIGS_KEY
  )
  return typeof savedComponentConfigs === 'string'
    ? JSON.parse(savedComponentConfigs)
    : {}
}

export function saveComponentConfigs(
  updatedComponentConfigs: SavedComponentConfigs
): void {
  localStorage.setItem(
    LOCAL_STORAGE_COMPONENT_CONFIGS_KEY,
    JSON.stringify(updatedComponentConfigs)
  )
}

export function readRootComponentConfig(): RootComponentConfig {
  const savedRootComponentConfig = localStorage.getItem(
    LOCAL_STORAGE_ROOT_COMPONENT_CONFIG_KEY
  )
  return typeof savedRootComponentConfig === 'string'
    ? JSON.parse(savedRootComponentConfig)
    : { config: {}, childComponentIds: [] }
}

export function saveRootComponentConfig(
  updatedRootComponentConfig: RootComponentConfig
): void {
  localStorage.setItem(
    LOCAL_STORAGE_ROOT_COMPONENT_CONFIG_KEY,
    JSON.stringify(updatedRootComponentConfig)
  )
}
