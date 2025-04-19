// https://github.com/EMH333/esbuild-svelte/blob/ff4c069a541752f9f33203f011035fd44591455c/example-ts/buildscript.js#L1

import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import crypto from 'crypto'
import esbuild from 'esbuild'
import esbuildSvelte from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'


class Route {
    html
    script

    /**
     * @param {string} html 
     * @param {string} script 
     */
    constructor(html, script) {
        this.html = html
        this.script = script
    }


    /**
     * @param {string} sourceDir 
     */
    getSourcePaths(sourceDir) {
        return {
            html: [sourceDir, this.html].join('/'),
            js: [sourceDir, this.script].join('/')
        }
    }

    /**
     * @param {string} exportDir 
     */
    getExportPaths(exportDir) {
        const targetDir = this.getTargetExportDir(exportDir)
        const targetHtml = Route.ignoreRoutesSourceDir(this.html)
        const targetScript = Route.ignoreRoutesSourceDir(this.script)

        return {
            html: [targetDir, targetHtml].join('/'),
            js: [targetDir, targetScript].join('/')
        }
    }

    /**
     * @param {string} exportDir
     * @returns {string}
     */
    getTargetExportDir(exportDir) {
        const uri = Route.parseUri(this.script)
        if (uri.path.length === 0)
            return exportDir

        const subdir = Route.ignoreRoutesSourceDir(uri.path)
        let join = [exportDir, subdir].join('/')

        if (join.endsWith('/'))
            join = join.substring(0, join.length - 1)

        return join
    }



    /**
     * @param {string} uri 
     * @returns {{path:string; file:string;}}
     */
    static parseUri(uri) {
        const lastSlashIndex = uri.lastIndexOf('/')
        if (lastSlashIndex === -1) {
            return {
                path: '',
                file: uri
            }
        }

        return {
            path: uri.substring(0, lastSlashIndex),
            file: uri.substring(lastSlashIndex + 1)
        }
    }

    /**
     * Retorna uma nova uri contento o caminho original, porem 
     * ignorarndo o diretorio inicial routes/
     * 
     * @param {string} _path
     */
    static ignoreRoutesSourceDir(_path) {
        if (_path.startsWith('routes'))
            _path = _path.substring(6)

        if (_path.startsWith('/'))
            _path = _path.substring(1)

        return _path
    }

}


const BUILD_SOURCE_DIR = './src'
const BUILD_EXPORT_DIR = './docs'
const BUILD_STATIC_SOURCE_DIR = './static'
const BUILD_STATIC_EXPORT_DIR = './docs/static'

const BUILD_ROUTE = [
    new Route('index.html', 'routes/index.ts'),
    new Route('index.html', 'routes/about/index.ts'),
    new Route('index.html', 'routes/bbcode/index.ts'),
    new Route('index.html', 'routes/calculator/index.ts'),
]


// ----------------------------------------------


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

                    print_blue(`Arquivo atualizado: ${file.name}`)
                }
            } else {
                // Copiar arquivo se não existir no destino
                await fse.copy(sourcePath, targetPath)

                print_blue(`Arquivo copiado: ${file.name}`)
            }
        }
    }
}


function print_magenta(msg) {
    console.log(`\x1b[35m${msg}\x1b[0m`)
}
function print_blue(msg) {
    console.log(`\x1b[34m${msg}\x1b[0m`)
}


// ----------------------------------------------


/**
 * Função para construir o Svelte
 */
async function build_svelte() {
    const SOURCE_SCRIPTS = new Array()
    for (const route of BUILD_ROUTE) {
        const subPath = [BUILD_SOURCE_DIR, route.script].join('/')

        SOURCE_SCRIPTS.push(subPath)
    }

    await esbuild.build({
        entryPoints: SOURCE_SCRIPTS,
        bundle: true,
        outdir: BUILD_EXPORT_DIR,
        mainFields: ['svelte', 'browser', 'module', 'main'],
        conditions: ['svelte', 'browser'],
        logLevel: 'info',
        minify: true,
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

    /**
     * @param {number} level
     * @returns {string} 
     */
    function create_javascript_compat(level) {
        return `
        <script>
        (function () {
            window.ISK_COMPAT = {};
            window.ISK_COMPAT.DEPTH_LEVEL = ${level};
        })();
        </script>
        `
    }

    /**
     * Corrige caminhos para arquivos estáticos com base na profundidade
     * @param {string} htmlContent - Conteúdo do HTML
     * @param {number} level - Nível de profundidade (quantos ../ são necessários)
     * @returns {string} HTML com caminhos corrigidos
     */
    function fix_existing_links(htmlContent, level) {
        // Expressão regular melhorada para ignorar http/https e protocolo relativo
        const linkRegex = /<link([^>]*?)href=["']((?!(https?:|)\/\/)[^"']+)["']([^>]*?)>/gi
        const scriptRegex = /<script([^>]*?)src=["']((?!(https?:|)\/\/)[^"']+)["']([^>]*?)>/gi
        const imgRegex = /<img([^>]*?)src=["']((?!(https?:|)\/\/)[^"']+)["']([^>]*?)>/gi

        const prefix = level > 0 ? '../'.repeat(level) : ''

        let fixedHtml = htmlContent.replace(linkRegex, (match, before, href, after) => {
            // Ignora caminhos que já começam com ../ ou são absolutos
            if (href.startsWith('../') || path.isAbsolute(href)) {
                return match
            }

            // Remove barra inicial se existir
            if (href.startsWith('/')) {
                href = href.substring(1)
            }

            // Aplica o prefixo apenas para caminhos relativos
            const newHref = `${prefix}${href}`
            return `<link${before}href="${newHref}"${after}>`
        })

        fixedHtml = fixedHtml.replace(scriptRegex, (match, before, src, after) => {
            if (src.startsWith('../') || path.isAbsolute(src)) {
                return match
            }

            if (src.startsWith('/')) {
                src = src.substring(1)
            }

            const newSrc = `${prefix}${src}`
            return `<script${before}src="${newSrc}"${after}>`
        })

        fixedHtml = fixedHtml.replace(imgRegex, (match, before, src, after) => {
            if (src.startsWith('../') || path.isAbsolute(src)) {
                return match
            }

            if (src.startsWith('/')) {
                src = src.substring(1)
            }

            const newSrc = `${prefix}${src}`;
            return `<img${before}src="${newSrc}"${after}>`
        })

        return fixedHtml
    }
    /**
     * Calcula quantos níveis de profundidade o arquivo está
     * @param {string} exportDir - Diretório de exportação completo
     * @param {string} baseExportDir - Diretório base de exportação (ex: './docs')
     * @returns {number} Nível de profundidade
     */
    function calculate_depth_level(exportDir, baseExportDir) {
        const relativePath = path.relative(baseExportDir, exportDir)
        if (!relativePath)
            return 0

        // Conta quantos separadores de diretório existem
        return relativePath.split(path.sep).length;
    }


    // Executar para cada rota
    for (const route of BUILD_ROUTE) {
        const EXPORT_DIRECTORY = route.getTargetExportDir(BUILD_EXPORT_DIR)
        const SOURCE_LOCATIONS = route.getSourcePaths(BUILD_SOURCE_DIR)
        const EXPORT_LOCATIONS = route.getExportPaths(BUILD_EXPORT_DIR)

        // Calcular nível de profundidade
        const depthLevel = calculate_depth_level(EXPORT_DIRECTORY, BUILD_EXPORT_DIR)

        console.log('    EXPORT_DIRECTORY', EXPORT_DIRECTORY)
        console.log('    SOURCE_LOCATIONS', SOURCE_LOCATIONS)
        console.log('    EXPORT_LOCATIONS', EXPORT_LOCATIONS)


        // Gerar duas arrays com os scripts e css
        const css_filter = new RegExp('.+(\.css)$', 'g')
        const js_filter = new RegExp('.+(\.js)$', 'g')
        const css = new Array()
        const js = new Array()

        for (const file of fs.readdirSync(EXPORT_DIRECTORY, { withFileTypes: true })) {
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

        // Ler o HTML e adicionar as referencias para nodes de estilo e script do esbuil
        const REPLACE_CSS = '<!-- {REPLACE CSS} -->'
        const REPLACE_COMPAT_JS = '<!-- {REPLACE JAVASCRIPT COMPAT} -->'
        const REPLACE_JS = '<!-- {REPLACE JAVASCRIPT} -->'

        const jsCompat = create_javascript_compat(depthLevel)
        let html = fs.readFileSync(SOURCE_LOCATIONS.html, { encoding: 'utf-8' })

        html = fix_existing_links(html, depthLevel)
            .replace(REPLACE_CSS, css.join('\n    '))
            .replace(REPLACE_COMPAT_JS, jsCompat)
            .replace(REPLACE_JS, js.join('\n    '))

        // Gravar o novo HTML
        fs.writeFileSync(EXPORT_LOCATIONS.html, html, { encoding: 'utf-8' })
    }

}


async function main() {
    print_magenta('> Iniciando build...')

    // Verificar se o diretório existe
    if (!fs.existsSync(BUILD_EXPORT_DIR)) {
        print_magenta('> Criando diretório de saída...')

        fs.mkdirSync(BUILD_EXPORT_DIR)

        print_magenta('> Diretório de saida criado!')
    }


    print_magenta('> Construindo Svelte...')
    await build_svelte()

    print_magenta('> Construindo HTML...')
    build_html()

    print_magenta('> Copiando arquivos estaticos...')
    await copyIfDifferent(BUILD_STATIC_SOURCE_DIR, BUILD_STATIC_EXPORT_DIR)

    print_magenta('> Build finalizado!')
}
main()
