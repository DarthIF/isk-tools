<script lang="ts">
    import type { Item } from "../../scripts/utils/item";
    import SlotView from "./slot-view.svelte";
    import { Crystals } from "../../scripts/utils/crystal";

    export let crystal: Item | null;
    export let count = 0;
    export let onChanged: ((count: number) => void) | null;
</script>

<div class="layout">
    <SlotView item={crystal} />
    <input
        type="number"
        min="0"
        bind:value={count}
        on:change={(value) => {
            if (onChanged === null) return;

            const num = Number.parseInt(value.currentTarget.value || "0");
            onChanged(num);
        }}
    />
</div>

<style>
    .layout {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    input {
        width: 56px;
        text-align: center;
    }
</style>
