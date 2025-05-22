export const IframeUtil = {
    querySelector: (iframeSelector: string, selectors: string) => {
        const iframe: HTMLIFrameElement | null = document.querySelector(iframeSelector)
        if (!iframe)
            return null

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc)
            return null

        return iframeDoc.querySelector(selectors)
    }
}

