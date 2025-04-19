<script lang="ts">
    import { APP_NAME, xref } from "../../scripts/isk";
    import { onMount } from "svelte";

    export function openDrawer() {
        el_scrim.style.display = "block";
        el_drawer.style.display = "block";
    }

    export function closeDrawer() {
        el_scrim.style.display = "none";
        el_drawer.style.display = "none";
    }

    onMount(() => {
        closeDrawer();
    });

    let el_scrim: HTMLDivElement;
    let el_drawer: HTMLDivElement;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="navigation-drawer-scrim"
    bind:this={el_scrim}
    on:click={closeDrawer}
/>
<div class="navigation-drawer" bind:this={el_drawer}>
    <div class="navigation-drawer-header">{APP_NAME}</div>
    <ul class="navigation-drawer-group">
        <a href={xref('bbcode')}>
            <li class="navigation-drawer-item">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                >
                    <path
                        d="m193-479 155 155q11 11 11 28t-11 28q-11 11-28 11t-28-11L108-452q-6-6-8.5-13T97-480q0-8 2.5-15t8.5-13l184-184q12-12 28.5-12t28.5 12q12 12 12 28.5T349-635L193-479Zm574-2L612-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L668-268q-12 12-28 11.5T612-269q-12-12-12-28.5t12-28.5l155-155Z"
                    />
                </svg>
                <p>Chat BBCode Generator</p>
            </li>
        </a>
        <a href={xref('calculator')}>
            <li class="navigation-drawer-item">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                >
                    <path
                        d="M320-320v50q0 13 8.5 21.5T350-240q13 0 21.5-8.5T380-270v-50h50q13 0 21.5-8.5T460-350q0-13-8.5-21.5T430-380h-50v-50q0-13-8.5-21.5T350-460q-13 0-21.5 8.5T320-430v50h-50q-13 0-21.5 8.5T240-350q0 13 8.5 21.5T270-320h50Zm230 50h140q13 0 21.5-8.5T720-300q0-13-8.5-21.5T690-330H550q-13 0-21.5 8.5T520-300q0 13 8.5 21.5T550-270Zm0-100h140q13 0 21.5-8.5T720-400q0-13-8.5-21.5T690-430H550q-13 0-21.5 8.5T520-400q0 13 8.5 21.5T550-370ZM280-592h140q13 0 21.5-8.5T450-622q0-13-8.5-21.5T420-652H280q-13 0-21.5 8.5T250-622q0 13 8.5 21.5T280-592Zm-80 472q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Zm420 182 35 35q9 9 21 9t21-9q8-8 8.5-20.5T698-585l-36-37 35-35q9-9 9-21t-9-21q-9-9-21-9t-21 9l-35 35-35-35q-9-9-21-9t-21 9q-9 9-9 21t9 21l35 35-36 37q-8 9-8 21t9 21q9 9 21 9t21-9l35-35Z"
                    />
                </svg>
                <p>Crystal Calculator</p>
            </li>
        </a>
    </ul>
    <ul class="navigation-drawer-group">
        <a href={xref('about')}>
            <li class="navigation-drawer-item">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                >
                    <path
                        d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                    />
                </svg>
                <p>About</p>
            </li>
        </a>
    </ul>
</div>

<style>
    a {
        color: inherit;
        text-decoration: none;
    }

    /* Drawer */
    .navigation-drawer {
        z-index: 999;
        height: 100%;
        width: 360px;
        position: fixed;
        top: 0;
        left: 0;

        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;

        background: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);

        user-select: none;
        overflow-x: hidden;
        overflow-y: auto;

        line-height: 20px;
        font-size: 14px;
        font-weight: 500;
    }

    /* Drawer Item */
    .navigation-drawer-item {
        --indicator-width: 336px;
        --padding-horizontal: 16px;

        height: 56px;
        width: calc(var(--indicator-width) - (var(--padding-horizontal) * 2));
        position: relative;
        padding: 0 var(--padding-horizontal);

        border-radius: 28px;

        display: flex;
        align-items: center;
        justify-content: start;

        background: transparent;
        color: inherit;

        /* ANIMAÇÃO */
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        transition: all 0.5s;
    }
    .navigation-drawer-item:hover {
        color: var(--md-sys-color-on-primary-container);
    }
    .navigation-drawer-item::before {
        /* https://stackoverflow.com/a/26483978/16081650 */
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;

        border: transparent solid 0px;
        border-radius: 28px;

        background: transparent;
        opacity: 0;
        content: "\A";

        /* ANIMAÇÃO */
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        transition: all 0.5s;
    }
    .navigation-drawer-item:hover::before {
        background: var(--md-sys-color-primary-container);
        opacity: var(--state_hover_opacity);
    }
    .navigation-drawer-item:active::before {
        background: var(--md-sys-color-primary-container);
        opacity: var(--state_pressed_opacity);
    }

    :global(.navigation-drawer-item > svg + *) {
        margin-left: 16px;
    }

    /* Drawer Group */
    .navigation-drawer-group {
        position: relative;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .navigation-drawer > .navigation-drawer-group ~ .navigation-drawer-group {
        margin-top: 16px;
        padding-top: 17px;
    }
    .navigation-drawer
        > .navigation-drawer-group
        ~ .navigation-drawer-group::before {
        width: auto;
        height: 1px;
        position: absolute;
        top: 0;
        left: 28px;
        right: 28px;

        background: var(--md-sys-color-outline);
        content: "\A";
    }

    .navigation-drawer-header {
        --padding-horizontal: 28px;

        width: calc(100% - (var(--padding-horizontal) * 2));
        height: auto;
        min-height: 88px;
        padding: 0 var(--padding-horizontal);

        display: flex;
        align-items: center;
        justify-content: start;

        color: var(--md-sys-color-primary);

        line-height: 32px;
        font-size: 24px;
        font-weight: 400;
    }

    .navigation-drawer-scrim {
        z-index: 998;
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;

        background: var(--md-sys-color-scrim);
        opacity: 0.38;
    }
</style>
