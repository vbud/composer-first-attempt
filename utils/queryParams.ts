import queryString from 'query-string'

export const queryParamKeys = {
  selectedComponentIds: 'selected',
}

export const getQueryParam = (param: string) => {
  return queryString.parse(window.location.search)[param]
}

export const changeQueryParam = (param: string, value?: string) => {
  const url = new URL(window.location.href)
  if (value) {
    url.searchParams.set(param, value)
  } else {
    url.searchParams.delete(param)
  }
  window.history.pushState({}, '', url)
}
