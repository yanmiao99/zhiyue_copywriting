const client = require('scp2')
const ora = require('ora')
const chalk = require('chalk')
const spinner = ora('正在打包并发布到服务器...')
const { spawn } = require('child_process')
const configList = require('./serverConfig.json')

let projectPFID = 'admin'
let buildConfig

let errors = []

if (projectPFID === 'all') {
  buildConfig = configList
} else {
  buildConfig = {
    [projectPFID]: configList[projectPFID]
  }
}

spinner.start()

const pipLine = Object.keys(buildConfig)
  .map(key => ({ key, config: buildConfig[key] }))
  .reverse()
let pipCount = 0

let pipFlag = false
let currentTime = new Date().getTime()

const pipProcess = () => {
  console.log(chalk.red('当前发布失败的项目 : ' + errors.join(',')))

  if (!pipCount && pipFlag) {
    spinner.stop()
    console.log(chalk.green(`所有项目发布成功.\n`))

    const milliseconds = new Date().getTime() - currentTime
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const seconds = Math.floor((milliseconds - minutes * 1000 * 60) / 1000)
    console.log(`项目打包发布总花费时间: ${minutes} 分钟 ${seconds} 秒`)
    return
  }

  if (pipCount >= 4 || !pipLine.length) return

  const { key, config } = pipLine.pop()

  pipFlag = true
  pipCount++
  const pip = spawn('npm', ['run', `build:${key}`])

  pip.stdout.on('data', data => {
    if (data) console.log(`stdout: ${data}`)
  })

  pip.stderr.on('data', data => {
    if (data) console.log(`stderr: ${data}`)
  })

  pip.stdout.on('close', code => {
    client.scp(`dist/${key}`, config, err => {
      if (!err) {
        // spinner.stop();
        console.log(chalk.green(`${config.platformName}项目发布成功.\n`))
        pipCount--
        pipProcess()
      } else {
        console.log(err)
        console.log(chalk.red(`${config.platformName}项目发布失败.\n`))
        errors.push(config.platformName)
      }
    })
    // pipCount--
    // pipProcess()
  })
  pipProcess()
}

pipProcess()
