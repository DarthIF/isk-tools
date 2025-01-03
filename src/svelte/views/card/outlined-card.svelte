<script lang="ts">
    export function getElement(): HTMLDivElement {
        return element;
    }

    export let style = "";
    let element: HTMLDivElement;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={element} class="outlined-card" {style} on:click on:keypress>
    <slot />
</div>

<style>
    .outlined-card {
        width: auto;
        height: auto;
        position: relative;

        border-color: var(--md-sys-color-outline);
        border-style: solid;
        border-width: 1px;
        border-radius: 12px;

        background-color: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);
    }
    .outlined-card:before {
        /* https://stackoverflow.com/a/26483978/16081650 */
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;

        border-color: transparent;
        border-style: solid;
        border-width: 0px;
        border-radius: 12px;

        background-color: transparent;
        opacity: 0;
        content: "\A";

        user-select: none;
        pointer-events: none;

        /* ANIMAÇÃO */
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        transition: all 0.5s;
    }
    .outlined-card:hover:before {
        background-color: var(--md-sys-color-on-surface);
        opacity: calc(var(--state_hover_opacity));
    }
    .outlined-card:active:before {
        background-color: var(--md-sys-color-on-surface);
        opacity: calc(var(--state_pressed_opacity));
    }
</style>
