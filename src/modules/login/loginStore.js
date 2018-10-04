// @flow

import { mapFiles } from 'disklet'

import { type DiskletFile, type DiskletFolder } from '../../edge-core-index.js'
import { base58, base64 } from '../../util/encoding.js'
import { type ApiInput } from '../root.js'
import { fixUsername } from './login-selectors.js'
import { type LoginStash } from './login-types.js'

export type FileInfo = {
  file: DiskletFile,
  json: Object
}

function loginsFolder (ai: ApiInput) {
  return ai.props.io.folder.folder('logins')
}

function getJsonFiles (folder: DiskletFolder): Promise<Array<FileInfo>> {
  return mapFiles(folder, file =>
    file
      .getText()
      .then(text => ({ file, json: JSON.parse(text) }))
      .catch(e => void 0)
  ).then(files => files.filter(file => file != null))
}

/**
 * Removes any login stash that may be stored for the given username.
 */
export function removeStash (ai: ApiInput, username: string): Promise<mixed> {
  const fixedName = fixUsername(username)
  return getJsonFiles(loginsFolder(ai))
    .then(files => files.find(file => file.json.username === fixedName))
    .then(file => (file != null ? file.file.delete() : void 0))
    .then(() => {
      ai.props.dispatch({
        type: 'LOGIN_STASH_DELETED',
        payload: fixUsername(username)
      })
    })
}

/**
 * Saves a login stash tree to the folder.
 */
export function saveStash (ai: ApiInput, stashTree: LoginStash): Promise<mixed> {
  if (stashTree.appId !== '') {
    throw new Error('Cannot save a login without an appId.')
  }
  if (!stashTree.loginId) {
    throw new Error('Cannot save a login without a loginId.')
  }
  if (stashTree.username == null) {
    throw new Error('Cannot save a login without a username.')
  }
  const loginId = base64.parse(stashTree.loginId)
  if (loginId.length !== 32) {
    throw new Error('Invalid loginId')
  }
  const filename = base58.stringify(loginId) + '.json'
  return loginsFolder(ai)
    .file(filename)
    .setText(JSON.stringify(stashTree))
    .then(() =>
      ai.props.dispatch({ type: 'LOGIN_STASH_SAVED', payload: stashTree })
    )
}
