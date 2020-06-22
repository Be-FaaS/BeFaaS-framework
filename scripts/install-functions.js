#!/usr/bin/env node

const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const pacote = require('pacote')

async function main () {
  const configFile = _.get(process.argv, 2)
  if (!configFile) return console.log(chalk.red('config file not defined'))

  const installDir = _.get(
    process.argv,
    3,
    path.join(process.cwd(), 'functions')
  )
  console.log(chalk.green(`install path: ${installDir}`))

  console.log(chalk.green('reading config...'))
  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'))

  console.log(chalk.green('reading npm config...'))
  const npmConfigObj = Object.assign(
    require('libnpmconfig')
      .read()
      .toJSON(),
    _.pick(config.defaults, ['registry'])
  )

  const pkgPrefix = _.get(config, 'defaults.prefix', '')
  console.log(chalk.green(`using prefix: ${pkgPrefix}`))
  const fns = _.get(config, 'program.functions')
  const packages = _.compact(
    _.map(fns, (v, k) =>
      v.version
        ? [k, `${pkgPrefix}${k}@${_.get(v, 'version', 'latest')}`]
        : null
    )
  )
  console.log(chalk.green(`fetching ${packages.length} packages`))

  for (const p of packages) {
    const [fName, pkgName] = p
    console.log(chalk.magenta(`resolving ${pkgName}`))
    const pkgInfo = await pacote.manifest(pkgName, npmConfigObj)
    console.log(chalk.magenta(`[+] resolved version: ${pkgInfo.version}`))
    const fnPath = path.join(installDir, fName)
    console.log(chalk.magenta(`[+] extracting to ${fnPath}`))
    await pacote.extract(pkgName, fnPath, npmConfigObj)
    fs.writeFileSync(path.join(fnPath, '.installed'), JSON.stringify(pkgInfo))
  }
  console.log(chalk.green('done.'))
}

main()
