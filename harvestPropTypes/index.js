const fs = require('fs')
const reactIs = require('react-is')
const { parse } = require('acorn')
const { fullAncestor } = require('acorn-walk')

const muiFilePath = require.resolve('@mui/material')
const muiDir = muiFilePath.substring(0, muiFilePath.lastIndexOf('/'))

// Save primitive propTypes that will be editable in the config editor
const addPrimitivesIfSimplePropType = (propTypes, node, keyName) => {
  if (node.type === 'MemberExpression') {
    const propType = node.property.name
    if (['string', 'number', 'bool', 'array', 'node'].includes(propType)) {
      propTypes[keyName].type = propType
      return true
    }
  }
  return false
}
// Save literals if node is a oneOf proptype call
const addLiteralsIfOneOfPropType = (propTypes, node, keyName) => {
  if (
    node.type === 'CallExpression' &&
    node.callee.property?.name === 'oneOf' &&
    node.arguments[0]?.elements
  ) {
    const values = []
    node.arguments[0].elements.forEach((element) => {
      if (element.type === 'Literal') {
        values.push(element.value)
      }
    })
    if (values.length > 0) {
      propTypes[keyName].type = 'oneOf'
      propTypes[keyName].values = values
      return true
    }
  }
  return false
}
// Save literals from any oneOf proptype calls inside a oneOfType proptype call
const addLiteralsIfNestedOneOfPropType = (propTypes, node, keyName) => {
  let literalsFound = false
  if (
    node.type === 'CallExpression' &&
    node.callee.property?.name === 'oneOfType' &&
    node.arguments[0]?.elements
  ) {
    // Note: this only looks one level deep right now, may need to add recursion in the future.
    node.arguments[0].elements.forEach((element) => {
      if (addLiteralsIfOneOfPropType(propTypes, element, keyName))
        literalsFound = true
    })
  }
  return literalsFound
}
const parseComponentFile = (componentPath) => {
  const contents = fs.readFileSync(componentPath, 'utf8')
  const ast = parse(contents, {
    ecmaVersion: 'latest',
  })
  const propTypes = {}
  fullAncestor(ast, (node, ancestors) => {
    if (
      node.type === 'MemberExpression' &&
      node.property.name === 'propTypes'
    ) {
      // Last ancestor is the current node, unintuitively, so we have to go to the previous ancestor to find the parent
      const parent = ancestors[ancestors.length - 2]

      if (
        parent.type === 'AssignmentExpression' &&
        parent.right.type === 'ObjectExpression'
      ) {
        parent.right.properties.forEach(({ key, value }) => {
          let node = value
          propTypes[key.name] = {
            isRequired: false,
          }

          // If an isRequired propType, we want to look at the previous node instead.
          if (
            value.type === 'MemberExpression' &&
            value.property.name === 'isRequired'
          ) {
            node = value.object
            propTypes[key.name].isRequired = true
          }

          if (addPrimitivesIfSimplePropType(propTypes, node, key.name)) {
          } else if (addLiteralsIfOneOfPropType(propTypes, node, key.name)) {
          } else if (
            addLiteralsIfNestedOneOfPropType(propTypes, node, key.name)
          ) {
          } else {
            // PropType not yet supported, so delete the propType.
            delete propTypes[key.name]
          }
        })
      }
    }
  })
  return propTypes
}
// Add any proptypes that are not specified in the code
// E.g. material-ui does not always explicitly define proptypes for props that are applied as-is to native DOM elements
const unspecifiedPropTypes = {
  Select: {
    value: {
      isRequired: false,
      type: 'string',
    },
  },
  MenuItem: {
    value: {
      isRequired: false,
      type: 'string',
    },
  },
}
const addUnspecifiedPropTypes = (components, componentType) => {
  if (unspecifiedPropTypes[componentType]) {
    components[componentType] = {
      ...components[componentType],
      ...unspecifiedPropTypes[componentType],
    }
  }
}
const harvestPropTypes = () => {
  const components = {}

  const componentTypes = fs.readdirSync(muiDir)
  componentTypes.forEach((componentType) => {
    // Only parse directories that begin with an uppercase letter. We assume that means the file exports a React component.
    // We assume the directory name represents the componentType (e.g. Select).
    // NOTE: These assumptions only apply to material-ui, we will need to abstract the approach once we start pulling in other libraries.
    if (componentType[0].toLocaleUpperCase() === componentType[0]) {
      const componentPath = `${muiDir}/${componentType}/${componentType}.js`
      if (fs.existsSync(componentPath)) {
        const defaultExport = require(componentPath).default
        if (reactIs.isValidElementType(defaultExport)) {
          components[componentType] = parseComponentFile(componentPath)
          addUnspecifiedPropTypes(components, componentType)
        }
      }
    }
  })

  fs.writeFileSync(
    `${__dirname}/propTypes.ts`,
    `// DO NOT EDIT THIS FILE! It is auto-generated.
const propTypes = ${JSON.stringify(components, null, 2)} as const;
export default propTypes;\n`
  )
}

harvestPropTypes()
