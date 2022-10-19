import { ComponentProps, ComponentType } from 'types'

export type ComponentTemplate = {
  componentType: ComponentType
  props?: ComponentProps
  children?: Array<ComponentTemplate>
}

export const componentTemplates: Partial<
  Record<ComponentType, ComponentTemplate>
> = {
  Select: {
    componentType: 'FormControl',
    children: [
      {
        componentType: 'InputLabel',
        children: [{ componentType: 'Text', props: { value: 'Item' } }],
      },
      {
        componentType: 'Select',
        props: {
          value: 'Item 1',
        },
        children: [
          {
            componentType: 'MenuItem',
            props: {
              value: 'Item 1',
            },
            children: [{ componentType: 'Text', props: { value: 'Item 1' } }],
          },
          {
            componentType: 'MenuItem',
            props: {
              value: 'Item 2',
            },
            children: [{ componentType: 'Text', props: { value: 'Item 2' } }],
          },
          {
            componentType: 'MenuItem',
            props: {
              value: 'Item 3',
            },
            children: [{ componentType: 'Text', props: { value: 'Item 3' } }],
          },
        ],
      },
    ],
  },
  Table: {
    componentType: 'Table',
    children: [
      {
        componentType: 'TableHead',
        children: [
          {
            componentType: 'TableRow',
            children: [
              {
                componentType: 'TableCell',
                children: [
                  { componentType: 'Text', props: { value: 'Column 1' } },
                ],
              },
              {
                componentType: 'TableCell',
                children: [
                  { componentType: 'Text', props: { value: 'Column 2' } },
                ],
              },
              {
                componentType: 'TableCell',
                children: [
                  { componentType: 'Text', props: { value: 'Column 3' } },
                ],
              },
            ],
          },
        ],
      },
      {
        componentType: 'TableBody',
        children: [
          {
            componentType: 'TableRow',
            children: [
              {
                componentType: 'TableCell',
                children: [{ componentType: 'Text', props: { value: 'A1' } }],
              },
              {
                componentType: 'TableCell',
                children: [{ componentType: 'Text', props: { value: 'A2' } }],
              },
              {
                componentType: 'TableCell',
                children: [{ componentType: 'Text', props: { value: 'A3' } }],
              },
            ],
          },
          {
            componentType: 'TableRow',
            children: [
              {
                componentType: 'TableCell',
                children: [{ componentType: 'Text', props: { value: 'B1' } }],
              },
              {
                componentType: 'TableCell',
                children: [{ componentType: 'Text', props: { value: 'B2' } }],
              },
              {
                componentType: 'TableCell',
                children: [{ componentType: 'Text', props: { value: 'B3' } }],
              },
            ],
          },
          {
            componentType: 'TableRow',
            children: [
              {
                componentType: 'TableCell',
                children: [{ componentType: 'Text', props: { value: 'C1' } }],
              },
              {
                componentType: 'TableCell',
                children: [{ componentType: 'Text', props: { value: 'C2' } }],
              },
              {
                componentType: 'TableCell',
                children: [{ componentType: 'Text', props: { value: 'C3' } }],
              },
            ],
          },
        ],
      },
    ],
  },
}
