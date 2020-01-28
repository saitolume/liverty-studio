import { notarize } from 'electron-notarize'

type Args = {
  appOutDir: string
  packager: {
    appInfo: {
      productFilename: string
    }
  }
}

export default async ({ appOutDir, packager }: Args) =>
  await notarize({
    appBundleId: 'dev.saitoeku3.liverty-studio',
    appPath: `${appOutDir}/${packager.appInfo.productFilename}.app`,
    appleId: process.env.APPLE_ID ?? '',
    appleIdPassword: process.env.APPLE_PASSWORD ?? '',
    ascProvider: process.env.ASC_PROVIDER ?? ''
  })
