<script lang="ts">
    import { APP_DESCIPTION, APP_NAME, xref } from "../../scripts/isk";

    function getGithubImageSrc() {
        return xref("static/images/github-mark/github-mark-white.svg");
    }
</script>

<footer class="dark">
    <div class="content">
        <div>
            <h2>{APP_NAME}</h2>
            <p>{APP_DESCIPTION}</p>
        </div>
        <div>
            <a href="https://github.com/DarthIF/isk-calculator">
                <img src={getGithubImageSrc()} alt="GitHub" />
            </a>
        </div>
    </div>

    <p class="content-bottom">
        Develop by <a href="https://github.com/DarthIF">Darth IF</a>
    </p>
</footer>

<style>
    @import "../css/a.css";

    footer {
        padding: 24px 0;

        color: var(--md-sys-color-on-surface);
        background: var(--md-sys-color-surface-container-lowest);
    }

    h2 {
        margin: 0;
    }

    p {
        margin: 0;
        text-align: center;
    }

    img {
        width: 24px;
        height: 24px;
    }

    .content {
        max-width: 960px;
        margin: 0 auto;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .content-bottom {
        margin-top: 24px;
    }

    @media (max-width: 600px) {
        .content {
            margin: auto 16px;
        }
        .content p {
            text-align: start;
        }
    }
</style>
