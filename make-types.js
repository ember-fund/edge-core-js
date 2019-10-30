#!/usr/bin/env node

const flowgen = require('flowgen')
const fs = require('fs')
const prettier = require('prettier')
const sucrase = require('sucrase')

// Assemble the Flow types:
let flowTypes = flowgen.compiler.compileDefinitionFile('./src/types/types.ts', {
  inexact: false,
  interfaceRecords: true
})
const header = '// @flow\n' + '/* eslint-disable no-use-before-define */\n'
flowTypes = prettier.format(header + flowTypes, {
  parser: 'babel',
  semi: false,
  singleQuote: true
})
flowTypes = flowTypes.replace(/import { Subscriber/, 'import { type Subscriber')
flowTypes = flowTypes.replace(/declare export {/, 'export {')
fs.writeFileSync('./src/types/types.js', flowTypes)

// Assemble the Error constructors file:
const code = fs.readFileSync('src/types/error.js', 'utf8')
const output = sucrase.transform(code, { transforms: ['flow', 'imports'] }).code
fs.writeFileSync('types.js', output)
