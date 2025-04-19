<script lang="ts">
    import DrawerView from "../views/drawer-view.svelte";
    import Footer from "../views/footer.svelte";
    import FilledButton from "../views/material/filled-button.svelte";

    export let style: string = "";
    let el_drawer: DrawerView;
</script>

<svelte:head>
    <title>ISK Tools</title>
</svelte:head>

<!-- TROCAR DEPOIS -->
<FilledButton
    text="Menu"
    on:click={(e) => {
        el_drawer.openDrawer();
    }}
/>

<main {style}>
    <slot />
</main>
<Footer />

<DrawerView bind:this={el_drawer} />

<style>
    main {
        height: auto;
        min-height: 100vh;
    }
</style>
