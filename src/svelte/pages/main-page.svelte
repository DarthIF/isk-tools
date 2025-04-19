<script lang="ts">
    import CommonLayout from "../layout/common-layout.svelte";
    import { xref } from "../../scripts/isk";
</script>

<CommonLayout style="display: flex;">
    <div>
        <h1>ISK TOOLS</h1>
        <a href={xref("about")}>About</a>
    </div>
</CommonLayout>

<style>
    @import "../css/a.css";

    div {
        margin: auto;

        display: flex;
        flex-direction: column;
        align-items: center;

        user-select: none;
    }
</style>
