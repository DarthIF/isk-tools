// https://github.com/EMH333/esbuild-svelte/blob/ff4c069a541752f9f33203f011035fd44591455c/example-ts/buildscript.js#L1

import fs, { stat } from 'fs'
import fse from 'fs-extra'
import path from 'path'
import crypto from 'crypto'
import esbuild from 'esbuild'
import esbuildSvelte from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'


// Arquivos de entrada e saída
const FILES = {
    Output: {
        dir: './docs',
        html: './docs/index.html',
        static: './docs/static'
    },
    Source: {
        script: './src/index.ts',
        html: './src/index.html',
        staic: './static',
    }
}



/**
 * Função para calcular o SHA1 de um arquivo
 * 
 * @param {string} filePath 
 * @returns {Promise<string>}
 */
function calculateSHA1(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash("sha1")
        const stream = fse.createReadStream(filePath)

        stream.on("data", (chunk) => hash.update(chunk))
        stream.on("end", () => resolve(hash.digest("hex")))
        stream.on("error", (err) => reject(err))
    })
}

/**
 * Função principal para copiar os arquivos estaticos
 * 
 * @param {string} sourceDir 
 * @param {string} targetDir 
 */
async function copyIfDifferent(sourceDir, targetDir) {
    const files = await fse.readdir(sourceDir, { withFileTypes: true })

    for (const file of files) {
        const sourcePath = path.join(sourceDir, file.name)
        const targetPath = path.join(targetDir, file.name)

        if (file.isDirectory()) {
            // Criar a pasta no destino e chamar recursivamente
            await fse.ensureDir(targetPath)
            await copyIfDifferent(sourcePath, targetPath)
        } else {
            // Verificar se o arquivo de destino existe
            if (await fse.pathExists(targetPath)) {
                const [sourceHash, targetHash] = await Promise.all([
                    calculateSHA1(sourcePath),
                    calculateSHA1(targetPath),
                ])

                if (sourceHash !== targetHash) {
                    // Copiar arquivo se os hashes forem diferentes
                    await fse.copy(sourcePath, targetPath)

                    console.log(`Arquivo atualizado: ${file.name}`)
                }
            } else {
                // Copiar arquivo se não existir no destino
                await fse.copy(sourcePath, targetPath)

                console.log(`Arquivo copiado: ${file.name}`)
            }
        }
    }
}



/**
 * Função para construir o Svelte
 */
function build_svelte() {
    esbuild.build({
        entryPoints: [FILES.Source.script],
        bundle: true,
        outdir: FILES.Output.dir,
        mainFields: ['svelte', 'browser', 'module', 'main'],
        conditions: ['svelte', 'browser'],
        logLevel: 'info',
        minify: false,
        sourcemap: 'external',
        splitting: true,
        write: true,
        format: 'esm',
        plugins: [
            esbuildSvelte({
                preprocess: sveltePreprocess(),
            }),
        ],
    }).catch((error, location) => {
        console.error('Errors: ', error, location)
        process.exit(1)
    })
}

/**
 * Função para construir o HTML
 */
function build_html() {
    function create_node_css(file) {
        return `<link rel="stylesheet" type="text/css" href="${file}" />`

    }
    function create_node_js(file) {
        return `<script type="module" src="${file}"></script>`
    }

    const css_filter = new RegExp('.+(\.css)$', 'g')
    const js_filter = new RegExp('.+(\.js)$', 'g')
    const css = new Array()
    const js = new Array()

    for (const file of fs.readdirSync(FILES.Output.dir, { withFileTypes: true })) {
        if (!file.isFile())
            continue

        const name = file.name
        if (css_filter.test(name)) {
            const node = create_node_css(name)
            css.push(node)
        }
        if (js_filter.test(name)) {
            const node = create_node_js(name)
            js.push(node)
        }
    }

    // Ler o HTML e adicionar os nodes
    const REPLACE_CSS = '<!-- replace css -->'
    const REPLACE_JS = '<!-- replace javascript -->'
    const html = fs.readFileSync(FILES.Source.html, { encoding: 'utf-8' })
        .replace(REPLACE_CSS, css.join('\n    '))
        .replace(REPLACE_JS, js.join('\n    '))

    fs.writeFileSync(FILES.Output.html, html, { encoding: 'utf-8' })
}


async function main() {
    // Verificar se o diretório existe
    if (!fs.existsSync(FILES.Output.dir)) {
        console.log('Criando diretório de saída...')
        fs.mkdirSync(FILES.Output.dir)
    }


    build_svelte()
    build_html()

    await copyIfDifferent(FILES.Source.staic, FILES.Output.static)

    console.log('Build finalizado!')
}
main()
