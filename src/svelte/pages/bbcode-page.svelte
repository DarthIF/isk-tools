<script lang="ts">
    import { onMount } from "svelte";
    import CommonLayout from "../layout/common-layout.svelte";
    import FilledButton from "../views/material/filled-button.svelte";
    import { xref } from "../../scripts/isk";

    function getEditorContent() {
        const textarea = document.getElementById("editor-text-area");
        // @ts-ignore
        const instance = window.sceditor.instance(textarea);

        return instance.val();
    }

    function handleConvert(event: MouseEvent) {
        const bbcode = getEditorContent();
        el_output.textContent = bbcode;
    }

    function load_stylesheet() {
        // Adicionar o stylesheet
        const css = document.createElement("link");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute(
            "href",
            xref("static/sceditor-3.2.0/minified/themes/defaultdark.min.css"),
        );
        document.head.appendChild(css);
    }
    function load_sceditor() {
        // Adicionar o script principal
        const script_1 = document.createElement("script");
        script_1.src = xref("static/sceditor-3.2.0/minified/sceditor.min.js");
        script_1.onload = load_monocons;
        document.head.appendChild(script_1);
    }
    function load_monocons() {
        // Adicionar o script monocons
        const monocons = document.createElement("script");
        monocons.src = xref("static/sceditor-3.2.0/minified/icons/monocons.js");
        monocons.onload = load_bbcode;
        document.head.appendChild(monocons);
    }
    function load_bbcode() {
        // Adicionar o script bbcode
        const bbcode = document.createElement("script");
        bbcode.src = xref("static/sceditor-3.2.0/minified/formats/bbcode.js");
        bbcode.onload = start_editor;
        document.head.appendChild(bbcode);
    }
    function start_editor() {
        const textarea = document.getElementById("editor-text-area");

        // @ts-ignore
        window.sceditor.create(textarea, {
            toolbar: "bold,italic,underline|size,color,removeformat|source",
            format: "bbcode",
            icons: "monocons",
            style: xref(
                "static/sceditor-3.2.0/minified/themes/defaultdark.min.css",
            ),
            parserOptions: {
                fixInvalidNesting: false,
            },
            resizeEnabled: false,
        });
    }

    onMount(() => {
        load_stylesheet();
        load_sceditor();
    });

    let el_editor: HTMLDivElement;
    let el_output: HTMLDivElement;
</script>

<CommonLayout>
    <div class="main">
        <div class="editor-root" bind:this={el_editor}>
            <textarea id="editor-text-area" />
        </div>

        <FilledButton
            on:click={handleConvert}
            text="Convert"
            style="margin-top: 12px;"
        />

        <div bind:this={el_output} class="bbcode"></div>
    </div>
</CommonLayout>

<style>
    @import "quill/dist/quill.snow.css";

    textarea {
        width: 100%;
        height: 100%;
        resize: none;
    }

    .main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .editor-root {
        width: 320px;
        height: 220px;
    }
    .bbcode {
        width: 320px;
        height: auto;
        min-height: 24px;
        margin-top: 12px;
        padding-left: 12px;
        padding-right: 12px;

        border-color: var(--md-sys-color-outline);
        border-style: solid;
        border-width: 1px;
        border-radius: 12px;

        background-color: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);

        user-select: all;
        word-wrap: anywhere;
    }
</style>
