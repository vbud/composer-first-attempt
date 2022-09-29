import { SavedComponentConfigs } from 'types'

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
  componentConfigs: SavedComponentConfigs
): void {
  localStorage.setItem(
    LOCAL_STORAGE_COMPONENT_CONFIGS_KEY,
    JSON.stringify(componentConfigs)
  )
}
