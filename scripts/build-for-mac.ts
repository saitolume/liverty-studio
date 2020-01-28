import { build } from 'electron-builder'

const buildForMac = async () => {
  await build({
    mac: ['dmg'],
    config: {
      appId: 'dev.saitoeku3.liverty-studio',
      productName: 'Liverty Studio',
      mac: {
        hardenedRuntime: true,
        gatekeeperAssess: false,
        entitlements: 'src/build/entitlement.plist',
        entitlementsInherit: 'src/build/entitlement.plist',
        extendInfo: {
          NSCameraUsageDescription: "Track user's face to change VRM facial expression",
          NSMicrophoneUsageDescription: "Send user's voice to a Livestreaming service"
        }
      },
      files: ['dist/**/*', 'package.json'],
      afterSign: 'scripts/notarize.ts'
    }
  })
}

buildForMac().catch(err => {
  console.error(err)
})
