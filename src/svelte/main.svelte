<script lang="ts">
    import { onMount } from "svelte";
    import {
        Crystal,
        CRYSTAL_TO_ORE,
        REFINED_TO_ORE,
    } from "../scripts/utils/crystal";
    import { getTranslation, Lang } from "../scripts/utils/lang";
    import CristalView from "./cristal-view/cristal-view.svelte";

    function round(value: number, step: number) {
        // https://stackoverflow.com/a/34591063/16081650

        step || (step = 1.0);

        const inverse = 1.0 / step;
        return Math.round(value * inverse) / inverse;
    }

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

    onMount(() => {
        if (navigator.language.startsWith("pt")) {
            lang = Lang.EN;
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

<main>
    <h1 style="margin: auto;">{getTranslation(lang, "app.header")}</h1>

    <div class="crystal-group">
        <!-- Ore -->
        <CristalView
            crystal={Crystal.CRYSTAL_ORE_RED}
            onChanged={(value) => {
                values.ore.red = value;
                update();
            }}
        />
        <CristalView
            crystal={Crystal.CRYSTAL_ORE_BLUE}
            onChanged={(value) => {
                values.ore.blue = value;
                update();
            }}
        />
        <CristalView
            crystal={Crystal.CRYSTAL_ORE_YELLOW}
            onChanged={(value) => {
                values.ore.yellow = value;
                update();
            }}
        />

        <!-- Crystal -->
        <CristalView
            crystal={Crystal.CRYSTAL_RED}
            onChanged={(value) => {
                values.crystal.red = value;
                update();
            }}
        />
        <CristalView
            crystal={Crystal.CRYSTAL_BLUE}
            onChanged={(value) => {
                values.crystal.blue = value;
                update();
            }}
        />
        <CristalView
            crystal={Crystal.CRYSTAL_YELLOW}
            onChanged={(value) => {
                values.crystal.yellow = value;
                update();
            }}
        />

        <!-- Refined -->
        <CristalView
            crystal={Crystal.REFINED_CRYSTAL_RED}
            onChanged={(value) => {
                values.refined.red = value;
                update();
            }}
        />
        <CristalView
            crystal={Crystal.REFINED_CRYSTAL_BLUE}
            onChanged={(value) => {
                values.refined.blue = value;
                update();
            }}
        />
        <CristalView
            crystal={Crystal.REFINED_CRYSTAL_YELLOW}
            onChanged={(value) => {
                values.refined.yellow = value;
                update();
            }}
        />
    </div>

    <div class="days-group">
        <h2>{getTranslation(lang, "app.days")}</h2>
        <h1>
            {values.days}
        </h1>
    </div>

    <div class="information-group">
        <p>{getTranslation(lang, "app.information")}</p>
        <p>{values.expected_ores_per_day}</p>
    </div>
    <div class="options-group">
        <!-- Trading Post -->
        <div class="input-chip">
            <label for="trading_post">
                {getTranslation(lang, "trading_post")}
            </label>
            <input
                type="checkbox"
                id="trading_post"
                bind:checked={values.trading_post}
                on:change={(e) => {
                    values.trading_post = e.currentTarget.checked;
                    update();
                }}
            />
        </div>

        <!-- Challenge Shop -->
        <div class="input-chip">
            <label for="challenge_shop">
                {getTranslation(lang, "challenge_shop")}
            </label>
            <input
                type="checkbox"
                id="challenge_shop"
                bind:checked={values.challenge_shop}
                on:change={(e) => {
                    values.challenge_shop = e.currentTarget.checked;
                    update();
                }}
            />
        </div>

        <!-- Golemore Mine -->
        <div class="input-chip">
            <label for="golemore_mine">
                {getTranslation(lang, "golemore_mine")}
            </label>
            <input
                type="checkbox"
                id="golemore_mine"
                bind:checked={values.golemore_mine}
                on:change={(e) => {
                    values.golemore_mine = e.currentTarget.checked;
                    update();
                }}
            />
        </div>

        <!-- Guild -->
        <div class="input-chip">
            <label for="guild">
                {getTranslation(lang, "guild")}
            </label>
            <input
                type="checkbox"
                id="guild"
                bind:checked={values.guild}
                on:change={(e) => {
                    values.guild = e.currentTarget.checked;
                    update();
                }}
            />
        </div>

        <!-- Banquet -->
        <div class="input-chip">
            <label for="banquet">
                {getTranslation(lang, "banquet")}
            </label>
            <input
                type="checkbox"
                id="banquet"
                bind:checked={values.banquet}
                on:change={(e) => {
                    values.banquet = e.currentTarget.checked;
                    update();
                }}
            />
        </div>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;

        user-select: none;
    }
    h1,
    h2 {
        text-align: center;
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

    .information-group {
        margin-bottom: 16px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .information-group p {
        margin: 0;
    }

    .options-group {
        width: auto;
        min-width: 80%;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-evenly;
    }

    .input-chip {
        height: 32px;
        padding: 0 16px;

        border-radius: 8px;

        display: flex;
        align-items: center;

        background: var(--md-sys-color-surface-container-low);
        color: var(--md-sys-color-on-surface);
    }
</style>
