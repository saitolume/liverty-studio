const { notarize } = require('electron-notarize')
const config = require('../electron-builder.json')

exports.default = async ({ appOutDir, packager }) => await notarize({
  appBundleId: config.appId,
  appPath: `${appOutDir}/${packager.appInfo.productFilename}.app`,
  appleId: process.env.APPLE_ID,
  appleIdPassword: process.env.APPLE_PASSWORD,
  ascProvider: process.env.ASC_PROVIDER
})
