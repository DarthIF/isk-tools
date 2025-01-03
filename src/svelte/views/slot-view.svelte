<script lang="ts">
    import { Item } from "../../scripts/utils/item";
    import { onMount } from "svelte";

    function update() {
        if (!el_slot) return;

        if (item === null) {
            el_slot.classList.remove("slot-shiny");

            el_slot.style.setProperty("--color-light", "#ffffff");
            el_slot.style.setProperty("--color-dark", "#808080");

            return;
        }

        if (item.isShiny()) {
            el_slot.classList.add("slot-shiny");
        } else {
            el_slot.classList.remove("slot-shiny");
        }

        el_slot.style.setProperty("--color-light", item.getRarityColor().light);
        el_slot.style.setProperty("--color-dark", item.getRarityColor().dark);
    }

    function getImage(item: Item | null): string {
        return item ? item.getImage() : "";
    }

    onMount(() => {
        update();
    });

    $: item, update();

    export let item: Item | null = null;
    let el_slot: HTMLDivElement;
</script>

<div bind:this={el_slot} class="slot slot-shiny">
    <div class="inner-border" />
    <img src={getImage(item)} alt="Item" />
</div>

<style>
    img {
        width: 40px;
        height: 40px;
    }

    .slot {
        --color-light: #ffffff;
        --color-dark: #808080;

        width: 56px;
        height: 56px;
        margin: 36px 24px 12px 24px;
        position: relative;

        border-radius: 10px;

        display: flex;
        justify-content: center;
        align-items: center;

        background: radial-gradient(
            circle,
            var(--color-light) 0%,
            var(--color-dark) 35%,
            rgba(0, 0, 0, 1) 100%
        );
    }
    .slot-shiny {
        position: relative;
    }

    .inner-border {
        z-index: -1;
        width: 56px;
        height: 56px;
        position: absolute;

        border: 3px #5d4037 ridge;
        border-radius: 10px;
    }

    /**
     * BORDA ANIMADA
     */

    @property --angle {
        syntax: "<angle>";
        initial-value: 0deg;
        inherits: false;
    }

    .slot-shiny::after,
    .slot-shiny::before {
        content: "";
        position: absolute;

        z-index: -1;
        height: 100%;
        width: 100%;
        top: 50%;
        left: 50%;
        translate: -50% -50%;

        padding: 3px;

        border-radius: 10px;

        background-image: conic-gradient(
            from var(--angle),
            #ff000000,
            #ffee58,
            #ff000000,
            #ff000000,
            #ffee58,
            #ff000000,
            #ff000000
        );

        animation: 3s spin linear infinite;
    }

    .slot-shiny::before {
        filter: blur(1.5rem);
        opacity: 0.5;
    }

    @keyframes spin {
        from {
            --angle: 0deg;
        }
        to {
            --angle: 360deg;
        }
    }
</style>
