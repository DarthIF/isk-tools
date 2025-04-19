<script lang="ts">
    import { onMount } from "svelte";
    import {
        SvelteTilt,
        TiltSettings,
    } from "../../../scripts/utils/svelte-tilt";
    import OutlinedCard from "../material/outlined-card.svelte";

    onMount(() => {
        const settings = new TiltSettings();
        settings.glare = true;
        const tilt = new SvelteTilt(el_profile_image, settings);
    });

    export let style: string = "";
    let el_profile_image: HTMLImageElement;
</script>

<div class="container" {style}>
    <div class="background" />
    <img
        bind:this={el_profile_image}
        class="image"
        src="https://github.com/DarthIF.png"
        alt="DarthIF's avatar"
    />
    <div class="title">
        <a href="https://github.com/DarthIF">DarthIF</a>
        <i>Developer for hobby</i>
    </div>
    <div></div>
</div>

<style>
    @import "../../css/a.css";

    .container {
        width: 320px;
        margin: auto;
        position: relative;

        border-color: var(--md-sys-color-outline);
        border-style: solid;
        border-width: 1px;
        border-radius: 12px;

        display: flex;
        flex-direction: column;
        align-items: center;

        background-color: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);

        user-select: none;

        overflow: hidden;
    }
    .container > .image {
        margin-top: 24px;
    }

    .background {
        width: 100%;
        height: 128px;

        position: absolute;

        background-image: url(https://github.com/DarthIF.png);
        background-size: cover;
        background-position: center;

        user-select: none;
        pointer-events: none;

        filter: blur(30px);
        transform: scale(1.2);
        transition: all 0.5s;
        -webkit-filter: blur(30px);
        -webkit-transform: scale(1.2);
        -webkit-transition: all 0.5s;
    }

    .image {
        width: 128px;
        height: 128px;
    }

    .title {
        margin-top: 12px;
        margin-bottom: 24px;

        display: flex;
        flex-direction: column;
        align-items: center;

        font-size: medium;
    }
    .title i {
        font-size: small;
    }
</style>
