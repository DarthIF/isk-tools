<script lang="ts">
    import { onMount } from "svelte";
    import { TextMode } from "../../../scripts/isk/text-mode";

    type HTMLInputElementEventTargetType = Event & {
        currentTarget: EventTarget & HTMLInputElement;
    };

    export function setText(bbCode: string, htmlCode: string) {
        el_bbcode.innerText = bbCode;
        el_rendered.innerHTML = htmlCode;
    }

    function checkIfNotChecked(radio: HTMLInputElement) {
        if (radio.checked) return;

        radio.checked = true;
    }

    function updateModeUI() {
        if (!el_rendered) return;

        el_rendered.classList.remove(
            "html-rendered-chat",
            "html-rendered-generic",
            "html-rendered-info-guild",
        );

        switch (mode) {
            case TextMode.CHAT:
                el_rendered.classList.add("html-rendered-chat");
                checkIfNotChecked(el_radio_chat);
                break;
            case TextMode.GENERIC_UI:
                el_rendered.classList.add("html-rendered-generic");
                checkIfNotChecked(el_radio_generic);
                break;
            case TextMode.INFO_GUILD:
                el_rendered.classList.add("html-rendered-info-guild");
                checkIfNotChecked(el_radio_guild);
                break;
        }
    }

    function onCheckedChange(e: HTMLInputElementEventTargetType) {
        // @ts-ignore
        mode = e.currentTarget.value;
    }

    onMount(() => {
        updateModeUI();
    });

    $: mode, updateModeUI();

    export let mode: TextMode = TextMode.CHAT;
    let el_bbcode_layout: HTMLDivElement;
    let el_bbcode: HTMLDivElement;
    let el_rendered: HTMLDivElement;
    let el_radio_chat: HTMLInputElement;
    let el_radio_generic: HTMLInputElement;
    let el_radio_guild: HTMLInputElement;
</script>

<div class="game-text-box">
    <div bind:this={el_rendered} class="html-rendered">TESTE</div>

    <div class="radio-group">
        <input
            bind:this={el_radio_chat}
            type="radio"
            id="radio_chat"
            name="ui_mode"
            value="CHAT"
            on:change={onCheckedChange}
        />
        <label for="radio_chat">Chat</label>

        <input
            bind:this={el_radio_generic}
            type="radio"
            id="radio_generic"
            name="ui_mode"
            value="GENERIC_UI"
            on:change={onCheckedChange}
        />
        <label for="radio_generic">Generic</label>

        <input
            bind:this={el_radio_guild}
            type="radio"
            id="radio_guild"
            name="ui_mode"
            value="INFO_GUILD"
            on:change={onCheckedChange}
        />
        <label for="radio_guild">Info Guild</label>
    </div>

    <div bind:this={el_bbcode_layout} class="bbcode-layout">
        <span class="material-symbols-rounded"> code </span>
        <div bind:this={el_bbcode} class="bbcode-content"></div>
    </div>
</div>

<style>
    .game-text-box {
        width: 360px;
    }
    .game-text-box > div ~ div {
        margin-top: 12px;
    }

    .html-rendered {
        padding: 4px 12px 4px 12px;

        border-radius: 4px;

        background-color: white;
        color: black;

        user-select: none;
    }
    :global(.html-rendered-chat) {
        background-color: #44372f !important;
        color: #d3c7b7 !important;
    }
    :global(.html-rendered-generic) {
        background-color: #f8e7d3 !important;
        color: #64442f !important;
    }
    :global(.html-rendered-info-guild) {
        background-color: #d3c7b7 !important;
        color: #725c44 !important;
    }

    .bbcode-layout {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .bbcode-content {
        width: 320px;
        height: auto;
        min-height: 24px;
        padding-left: 12px;
        padding-right: 12px;
        padding-top: 4px;
        padding-bottom: 4px;

        border-color: var(--md-sys-color-outline);
        border-style: solid;
        border-width: 1px;
        border-radius: 12px;

        background-color: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);

        user-select: all;
        word-wrap: anywhere;
    }

    .radio-group {
        margin-bottom: 12px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        user-select: none;
    }

    .radio-group input {
        appearance: none;

        width: 16px;
        height: 16px;
        margin: 0;
        position: relative;

        border: 2px solid var(--md-sys-color-outline);
        border-radius: 50%;

        transition: 0.2s all linear;
    }
    .radio-group input:checked {
        border: 8px solid var(--md-sys-color-primary);
    }
    .radio-group input ~ label {
        margin-left: 6px;
    }
    .radio-group label ~ input {
        margin-left: 16px;
    }
</style>
