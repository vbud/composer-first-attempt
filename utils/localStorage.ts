import { SavedComponentConfigs } from 'types'

const LOCAL_STORAGE_COMPONENT_CONFIGS_KEY = 'componentConfigs'

export function readComponentConfigs() {
  const savedComponentConfigs = localStorage.getItem(
    LOCAL_STORAGE_COMPONENT_CONFIGS_KEY
  )
  return typeof savedComponentConfigs === 'string'
    ? JSON.parse(savedComponentConfigs)
    : {}
}

export function saveComponentConfigs(
  updatedComponentConfigs: SavedComponentConfigs
) {
  localStorage.setItem(
    LOCAL_STORAGE_COMPONENT_CONFIGS_KEY,
    JSON.stringify(updatedComponentConfigs)
  )
}
