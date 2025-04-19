<script lang="ts">
    import { onMount } from "svelte";
    import CommonLayout from "../layout/common-layout.svelte";
    import CrystalEditableSlot from "../views/isk-tools/crystal-editable-slot.svelte";
    import OutlinedCard from "../views/material/outlined-card.svelte";
    import {
        CRYSTAL_TO_ORE,
        Crystals,
        REFINED_TO_ORE,
    } from "../../scripts/isk/crystal";
    import { getTranslation, Lang } from "../../scripts/isk/lang";

    type MouseDivEventType = MouseEvent & {
        currentTarget: EventTarget & HTMLDivElement;
    };

    function round(value: number, step: number) {
        // https://stackoverflow.com/a/34591063/16081650

        step || (step = 1.0);

        const inverse = 1.0 / step;
        return Math.round(value * inverse) / inverse;
    }

    function toggleChildCheckbox(e: MouseDivEventType) {
        e.currentTarget.querySelector("input")?.click();
    }

    function stopMouseEvents(e: MouseEvent) {
        e.stopPropagation();
    }

    // ------------------------------------------

    function update() {
        values.expected_ores_per_day = 0;

        if (values.trading_post) {
            DAILY_LIMIT.trading_post.forEach((pack_limit) => {
                values.expected_ores_per_day += pack_limit;
            });
        }
        if (values.challenge_shop) {
            DAILY_LIMIT.challenge_shop.forEach((pack_limit) => {
                values.expected_ores_per_day += pack_limit;
            });
        }
        if (values.golemore_mine) {
            DAILY_LIMIT.golemore_mine.forEach((pack_limit) => {
                values.expected_ores_per_day += pack_limit;
            });
        }
        if (values.guild) {
            DAILY_LIMIT.guild.forEach((pack_limit) => {
                values.expected_ores_per_day += pack_limit;
            });
        }
        if (values.banquet) {
            DAILY_LIMIT.banquet.forEach((pack_limit) => {
                values.expected_ores_per_day += pack_limit;
            });
        }

        const total_red_ores = (() => {
            return (
                values.ore.red +
                values.crystal.red * CRYSTAL_TO_ORE +
                values.refined.red * REFINED_TO_ORE
            );
        })();
        const total_blue_ores = (() => {
            return (
                values.ore.blue +
                values.crystal.blue * CRYSTAL_TO_ORE +
                values.refined.blue * REFINED_TO_ORE
            );
        })();
        const total_yellow_ores = (() => {
            return (
                values.ore.yellow +
                values.crystal.yellow * CRYSTAL_TO_ORE +
                values.refined.yellow * REFINED_TO_ORE
            );
        })();

        const single_max = Math.max(
            total_red_ores,
            total_blue_ores,
            total_yellow_ores,
        );

        let days = round(single_max / values.expected_ores_per_day, 1);
        if (days === 0 && single_max > 0) {
            days = 1;
        }

        values.days = days;

        console.log("---------------------------------");
        console.log("expected_per_day=" + values.expected_ores_per_day);
        console.log("total_red_ores=" + total_red_ores);
        console.log("total_blue_ores=" + total_blue_ores);
        console.log("total_yellow_ores=" + total_yellow_ores);
        console.log("single_max=" + single_max);
        console.log("days=" + days);
    }

    // ------------------------------------------

    onMount(() => {
        if (navigator.language.startsWith("pt")) {
            lang = Lang.PT;
        }

        update();
    });

    const DAILY_LIMIT = {
        trading_post: [5, 5, 10],
        challenge_shop: [5, 5],
        golemore_mine: [10],
        guild: [3, 3],
        banquet: [40],
    };

    let values = {
        trading_post: true,
        challenge_shop: true,
        golemore_mine: false,
        guild: false,
        banquet: false,

        days: 0,
        expected_ores_per_day: 0,

        ore: {
            red: 0,
            blue: 0,
            yellow: 0,
        },
        crystal: {
            red: 0,
            blue: 0,
            yellow: 0,
        },
        refined: {
            red: 0,
            blue: 0,
            yellow: 0,
        },
    };
    let lang = Lang.EN;
</script>

<CommonLayout>
    <div class="fragment">
        <h1 style="margin: auto;">{getTranslation(lang, "app.header")}</h1>

        <div class="crystal-group">
            <!-- Ore -->
            <CrystalEditableSlot
                crystal={Crystals.CRYSTAL_ORE_RED}
                onChanged={(value) => {
                    values.ore.red = value;
                    update();
                }}
            />
            <CrystalEditableSlot
                crystal={Crystals.CRYSTAL_ORE_BLUE}
                onChanged={(value) => {
                    values.ore.blue = value;
                    update();
                }}
            />
            <CrystalEditableSlot
                crystal={Crystals.CRYSTAL_ORE_YELLOW}
                onChanged={(value) => {
                    values.ore.yellow = value;
                    update();
                }}
            />

            <!-- Crystal -->
            <CrystalEditableSlot
                crystal={Crystals.CRYSTAL_RED}
                onChanged={(value) => {
                    values.crystal.red = value;
                    update();
                }}
            />
            <CrystalEditableSlot
                crystal={Crystals.CRYSTAL_BLUE}
                onChanged={(value) => {
                    values.crystal.blue = value;
                    update();
                }}
            />
            <CrystalEditableSlot
                crystal={Crystals.CRYSTAL_YELLOW}
                onChanged={(value) => {
                    values.crystal.yellow = value;
                    update();
                }}
            />

            <!-- Refined -->
            <CrystalEditableSlot
                crystal={Crystals.REFINED_CRYSTAL_RED}
                onChanged={(value) => {
                    values.refined.red = value;
                    update();
                }}
            />
            <CrystalEditableSlot
                crystal={Crystals.REFINED_CRYSTAL_BLUE}
                onChanged={(value) => {
                    values.refined.blue = value;
                    update();
                }}
            />
            <CrystalEditableSlot
                crystal={Crystals.REFINED_CRYSTAL_YELLOW}
                onChanged={(value) => {
                    values.refined.yellow = value;
                    update();
                }}
            />
        </div>

        <div class="days-group">
            <h2>{getTranslation(lang, "app.days")}</h2>
            <h1>
                {Number.isNaN(values.days) === false ? values.days : "∞"}
            </h1>
        </div>

        <OutlinedCard style="margin: 16px; 0">
            <div class="card-stores-container">
                <div class="stores-group">
                    <!-- Trading Post -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="store-chip" on:click={toggleChildCheckbox}>
                        {getTranslation(lang, "trading_post")}
                        <input
                            type="checkbox"
                            id="trading_post"
                            bind:checked={values.trading_post}
                            on:click={stopMouseEvents}
                            on:change={(e) => {
                                values.trading_post = e.currentTarget.checked;
                                update();
                            }}
                        />
                    </div>

                    <!-- Challenge Shop -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="store-chip" on:click={toggleChildCheckbox}>
                        {getTranslation(lang, "challenge_shop")}
                        <input
                            type="checkbox"
                            id="challenge_shop"
                            bind:checked={values.challenge_shop}
                            on:click={stopMouseEvents}
                            on:change={(e) => {
                                values.challenge_shop = e.currentTarget.checked;
                                update();
                            }}
                        />
                    </div>

                    <!-- Golemore Mine -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="store-chip" on:click={toggleChildCheckbox}>
                        {getTranslation(lang, "golemore_mine")}
                        <input
                            type="checkbox"
                            id="golemore_mine"
                            bind:checked={values.golemore_mine}
                            on:click={stopMouseEvents}
                            on:change={(e) => {
                                values.golemore_mine = e.currentTarget.checked;
                                update();
                            }}
                        />
                    </div>

                    <!-- Guild -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="store-chip" on:click={toggleChildCheckbox}>
                        {getTranslation(lang, "guild")}
                        <input
                            type="checkbox"
                            id="guild"
                            bind:checked={values.guild}
                            on:click={stopMouseEvents}
                            on:change={(e) => {
                                values.guild = e.currentTarget.checked;
                                update();
                            }}
                        />
                    </div>

                    <!-- Banquet -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="store-chip" on:click={toggleChildCheckbox}>
                        {getTranslation(lang, "banquet")}
                        <input
                            type="checkbox"
                            id="banquet"
                            bind:checked={values.banquet}
                            on:click={stopMouseEvents}
                            on:change={(e) => {
                                values.banquet = e.currentTarget.checked;
                                update();
                            }}
                        />
                    </div>
                </div>

                <p>{getTranslation(lang, "app.information")}</p>
                <p>{values.expected_ores_per_day}</p>
            </div>
        </OutlinedCard>
    </div>
</CommonLayout>

<style>
    h1,
    h2 {
        text-align: center;
    }

    .fragment {
        width: auto;
        height: auto;
        min-height: 100vh;
        max-width: 960px;
        margin: auto;
        margin-bottom: 24px;

        display: flex;
        flex-direction: column;
        align-items: center;

        user-select: none;
    }

    .crystal-group {
        display: grid;
        grid-template-columns: auto auto auto;
    }

    .days-group {
        margin-top: 64px;
        margin-bottom: 28px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .days-group h1 {
        margin: 0;
    }
    .days-group h2 {
        margin: 0;
    }

    /* Stores */

    .card-stores-container {
        padding: 16px;
    }
    .card-stores-container p {
        margin: 0;
        text-align: center;
    }

    .stores-group {
        width: auto;
        margin-bottom: 16px;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-evenly;
    }

    .store-chip {
        z-index: 1;
        height: 32px;
        padding: 0 16px;

        border-radius: 8px;
        border: 1px solid var(--md-sys-color-outline-variant);

        display: flex;
        align-items: center;

        background: var(--md-sys-color-surface-container-low);
        color: var(--md-sys-color-on-surface);
    }
</style>
