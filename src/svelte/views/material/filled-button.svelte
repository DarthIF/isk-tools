<script lang="ts">
    export let text = "";
    export let style = "";
    export let cssClass = "";
</script>

<!-- Icone 18px -->

<button class={"filled-button " + cssClass} {style} on:click>
    <slot />
    <span>
        {text}
    </span>
</button>

<style>
    .filled-button {
        width: auto;
        height: 40px;
        padding: 0 24px;
        position: relative;

        border: 0px solid transparent;
        border-radius: 20px;
        outline: none;

        display: flex;
        align-items: center;
        justify-content: center;

        background-color: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);

        /* ELEVAÇÃO */
        --size: var(--elevation_level0);
        -webkit-box-shadow: 0px var(--size) var(--size) 0px rgba(0, 0, 0, 0.3);
        -moz-box-shadow: 0px var(--size) var(--size) 0px rgba(0, 0, 0, 0.3);
        box-shadow: 0px var(--size) var(--size) 0px rgba(0, 0, 0, 0.3);
    }
    .filled-button:hover {
        /* ELEVAÇÃO */
        --size: var(--elevation_level1);
    }
    .filled-button:active {
        /* ELEVAÇÃO */
        --size: var(--elevation_level0);
    }

    .filled-button:before {
        /* https://stackoverflow.com/a/26483978/16081650 */
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;

        border-color: transparent;
        border-style: solid;
        border-width: 0px;
        border-radius: 20px;

        background-color: transparent;
        opacity: 0;
        content: "\A";

        /* ANIMAÇÃO */
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        transition: all 0.5s;
    }
    .filled-button:hover::before {
        background-color: var(--md-sys-color-on-primary);
        opacity: var(--state_hover_opacity);
    }
    .filled-button:active::before {
        background-color: var(--md-sys-color-on-primary);
        opacity: var(--state_pressed_opacity);
    }

    /* Margem quando se tem um icone */
    :global(.filled-button > * + span) {
        margin-left: 8px;
    }
</style>
