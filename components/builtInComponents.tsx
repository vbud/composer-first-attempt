import { ComponentType } from 'types'

export const primitiveComponentPropTypes = {
  Text: {
    value: {
      isRequired: true,
      type: 'string',
    },
  },
} as const

const Text = ({ value }: { value: string }) => {
  return value
}

export const primitiveComponents = {
  Text,
}

export const layoutComponentPropTypes = {
  LayoutFlex: {
    flexDirection: {
      isRequired: false,
      type: 'oneOf',
      values: ['row', 'row-reverse', 'column', 'column-reverse'],
    },
    alignItems: {
      isRequired: false,
      type: 'oneOf',
      values: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    },
    justifyContent: {
      isRequired: false,
      type: 'oneOf',
      values: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
    },
    gap: {
      isRequired: false,
      type: 'number',
    },
    children: {
      isRequired: false,
      type: 'node',
    },
  },
  LayoutGrid: {
    gridTemplateRows: {
      isRequired: false,
      type: 'string',
    },
    gridTemplateColumns: {
      isRequired: false,
      type: 'string',
    },
    gridTemplateAreas: {
      isRequired: false,
      type: 'string',
    },

    alignItems: {
      isRequired: false,
      type: 'oneOf',
      values: ['stretch', 'start', 'end', 'center', 'baseline'],
    },
    justifyItems: {
      isRequired: false,
      type: 'oneOf',
      values: ['start', 'end', 'center', 'stretch'],
    },
    gap: {
      isRequired: false,
      type: 'number',
    },
    children: {
      isRequired: false,
      type: 'node',
    },
  },
} as const

const LayoutFlex = (props: {
  flexDirection: typeof layoutComponentPropTypes.LayoutFlex.flexDirection.values[number]
  alignItems: typeof layoutComponentPropTypes.LayoutFlex.alignItems.values[number]
  justifyContent: typeof layoutComponentPropTypes.LayoutFlex.justifyContent.values[number]
  gap: number
  children?: React.ReactNode
}) => {
  const { children, ...style } = props
  return <div style={{ display: 'flex', ...style }}>{children}</div>
}

const LayoutGrid = (props: {
  gridTemplateRows: string
  gridTemplateColumns: string
  gridTemplateAreas: string
  alignItems: typeof layoutComponentPropTypes.LayoutGrid.alignItems.values[number]
  justifyItems: typeof layoutComponentPropTypes.LayoutGrid.justifyItems.values[number]
  gap: number
  children?: React.ReactNode
}) => {
  const { children, ...style } = props
  return <div style={{ display: 'grid', ...style }}>{children}</div>
}

export const layoutComponents = {
  LayoutFlex,
  LayoutGrid,
}

export const isLayoutComponent = (componentType: ComponentType): boolean => {
  return layoutComponentPropTypes.hasOwnProperty(componentType)
}
