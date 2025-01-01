// https://github.com/EMH333/esbuild-svelte/blob/ff4c069a541752f9f33203f011035fd44591455c/example-ts/buildscript.js#L1

import fs from "fs"
import esbuild from "esbuild"
import esbuildSvelte from "esbuild-svelte"
import sveltePreprocess from "svelte-preprocess"


// Arquivos de entrada e saída
const FILES = {
    Output: {
        dir: './docs',
        html: './docs/index.html'
    },
    Source: {
        script: './src/index.ts',
        html: './src/index.html'
    }
}


// Funções para gerar os arquivos
function build() {
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


// Verificar se o diretório existe
if (!fs.existsSync(FILES.Output.dir)) {
    console.log('Creating folder...')
    fs.mkdirSync(FILES.Output.dir)
}


build()
build_html()
