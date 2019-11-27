/* eslint-disable @typescript-eslint/camelcase */

import { google } from 'googleapis'
import { readFile } from 'fs'
import http from 'http'
import open from 'open'
import { resolve } from 'path'
import url from 'url'
import { promisify } from 'util'
import destroyer from 'server-destroy'

const loadGoogleSecret = async () => {
  const secretPath = resolve('src', 'config', 'google-secret.json')
  const asyncReadFile = promisify(readFile)
  const googleSecret = await asyncReadFile(secretPath, 'utf-8')
  return JSON.parse(googleSecret)
}

export const authenticete = async (scopes: string[]) => {
  const googleSecret = await loadGoogleSecret()
  const { client_id, client_secret, redirect_uris } = googleSecret.web
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' ')
  })

  return new Promise<typeof oauth2Client>((resolve, reject) => {
    const server = http
      .createServer(async (req, res) => {
        if (!req.url) {
          console.error('Cannot find req.url')
          return
        }

        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            const qs = new url.URL(req.url, 'http://localhost:3000').searchParams
            res.end('Authentication successful! Please return to the app.')
            server.destroy()
            const { tokens } = await oauth2Client.getToken(qs.get('code') as string)
            // eslint-disable-next-line require-atomic-updates
            oauth2Client.credentials = tokens
            tokens.refresh_token
            resolve(oauth2Client)
          }
        } catch (e) {
          reject(e)
        }
      })
      .listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        open(authUrl, { wait: false }).then(cp => cp.unref())
      })

    destroyer(server)
  })
}
