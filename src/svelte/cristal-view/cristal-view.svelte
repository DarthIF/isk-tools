<script lang="ts">
    import { onMount } from "svelte";
    import {
        Crystal,
        getCrystalColor,
        getCrystalRarity,
        getCrystalImageURL,
    } from "../../scripts/utils/crystal";
    import { getRarityColor, Rarity } from "../../scripts/utils/rarity";

    onMount(() => {
        const crystal_image = getCrystalImageURL(crystal);
        const crystal_rarity = getCrystalRarity(crystal);
        const rarity_color = getRarityColor(crystal_rarity);

        el_img.src = crystal_image;
        el_card.style.background = `radial-gradient(circle, ${rarity_color.light} 0%, ${rarity_color.dark} 35%, rgba(0,0,0,1) 100%)`;

        if (getCrystalRarity(crystal) === Rarity.SR) {
            el_card.classList.remove("super-card");
        }
    });

    export let crystal: Crystal;
    export let count = 0;
    export let onChanged: (count: number) => void;

    let el_img: HTMLImageElement;
    let el_card: HTMLDivElement;
</script>

<div class="layout">
    <div bind:this={el_card} class="card super-card">
        <div class="card-inner-border" />
        <img bind:this={el_img} alt="Crystal" />
    </div>
    <input
        type="number"
        min="0"
        bind:value={count}
        on:change={(value) => {
            const num = Number.parseInt(value.currentTarget.value || "0");
            onChanged(num);
        }}
    />
</div>

<style>
    img {
        width: 40px;
        height: 40px;
    }

    input {
        width: 56px;
        text-align: center;
    }

    .layout {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .card-inner-border {
        z-index: -1;
        width: 56px;
        height: 56px;
        position: absolute;

        border: 3px #5d4037 ridge;
        border-radius: 10px;
    }

    .card {
        width: 56px;
        height: 56px;
        margin: 36px 24px 12px 24px;
        position: relative;

        border-radius: 10px;

        display: flex;
        justify-content: center;
        align-items: center;
    }
    .super-card {
        position: relative;
    }

    /* Borda Animada */

    @property --angle {
        syntax: "<angle>";
        initial-value: 0deg;
        inherits: false;
    }

    .super-card::after,
    .super-card::before {
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
    .super-card::before {
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
