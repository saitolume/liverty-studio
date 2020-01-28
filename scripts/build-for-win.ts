import { build } from 'electron-builder'

const buildForWin = async () => {
  await build({
    win: ['nsis'],
    config: {
      appId: 'dev.saitoeku3.liverty-studio',
      productName: 'Liverty Studio',
      files: ['dist/**/*', 'package.json']
    }
  })
}

buildForWin().catch(err => {
  console.error(err)
})
