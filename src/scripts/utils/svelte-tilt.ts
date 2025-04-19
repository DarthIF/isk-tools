// https://github.com/micku7zu/vanilla-tilt.js/tree/master

interface TiltChangeEvent {
    tiltX: string
    tiltY: string
    percentageX: number
    percentageY: number
    angle: number
}

interface IPosition {
    clientX: number
    clientY: number
}


class ElementData {
    public width: number | null
    public height: number | null
    public clientWidth: number | null
    public clientHeight: number | null
    public left: number | null
    public top: number | null

    constructor() {
        this.width = null
        this.height = null
        this.clientWidth = null
        this.clientHeight = null
        this.left = null
        this.top = null
    }


    public getWidth(): number {
        return this.width !== null ? this.width : 0
    }

    public getHeight(): number {
        return this.height != null ? this.height : 0
    }

    public getClientWidth(): number {
        return this.clientWidth !== null ? this.clientWidth : 0
    }

    public getClientHeight(): number {
        return this.clientHeight !== null ? this.clientHeight : 0
    }

    public getLeft(): number {
        return this.left !== null ? this.left : 0
    }

    public getTop(): number {
        return this.top !== null ? this.top : 0
    }

}

class GyroscopeData {
    public gammazero: number | null
    public betazero: number | null
    public lastGammazero: number | null
    public lastBetazero: number | null

    constructor() {
        this.gammazero = null
        this.betazero = null
        this.lastGammazero = null
        this.lastBetazero = null
    }


    public getGammazero(): number {
        return this.gammazero !== null ? this.gammazero : 0
    }

    public getBetazero(): number {
        return this.betazero !== null ? this.betazero : 0
    }

    public getLastGammazero(): number {
        return this.lastGammazero !== null ? this.lastGammazero : 0
    }

    public getLastBetazero(): number {
        return this.lastBetazero != null ? this.lastBetazero : 0
    }

}


/**
 * Settings interface
 */
export interface ITiltSettings {
    reverse: boolean
    max: number
    startX: number
    startY: number
    perspective: number
    easing: string
    scale: number
    speed: number
    transition: boolean
    axis: string | null
    glare: boolean
    maxGlare: number
    glarePrerender: boolean
    fullPageListening: boolean
    mouseEventElement: string | Element | null
    reset: boolean
    resetToStart: boolean
    gyroscope: boolean
    gyroscopeMinAngleX: number
    gyroscopeMaxAngleX: number
    gyroscopeMinAngleY: number
    gyroscopeMaxAngleY: number
    gyroscopeSamples: number

    getReverseInt(): number

}

/**
 * @see https://github.com/micku7zu/vanilla-tilt.js/blob/48f4ee931d4d91dcdd2f91803db67a9f3a16587e/src/vanilla-tilt.js#L418
 */
export class TiltSettings implements ITiltSettings {
    reverse: boolean = false
    max: number = 15
    startX: number = 0
    startY: number = 0
    perspective: number = 1000
    easing: string = 'cubic-bezier(.03,.98,.52,.99)'
    scale: number = 1
    speed: number = 300
    transition: boolean = true
    axis: string | null = null

    glare: boolean = false
    maxGlare: number = 1
    glarePrerender: boolean = false

    fullPageListening: boolean = false
    mouseEventElement: string | Element | null = null

    reset: boolean = true
    resetToStart: boolean = true

    gyroscope: boolean = true
    gyroscopeMinAngleX: number = -45
    gyroscopeMaxAngleX: number = 45
    gyroscopeMinAngleY: number = -45
    gyroscopeMaxAngleY: number = 45
    gyroscopeSamples: number = 10

    public getReverseInt(): number {
        return this.reverse ? -1 : 1
    }

}


/**
 * @see https://github.com/micku7zu/vanilla-tilt.js/blob/48f4ee931d4d91dcdd2f91803db67a9f3a16587e/src/vanilla-tilt.js#L1
 */
export class SvelteTilt {
    private elementData: ElementData
    private gyroscopeData: GyroscopeData

    private transitionTimeout: number|undefined
    private updateCall: number | null
    private event: IPosition | null

    private element: HTMLElement
    private settings: ITiltSettings

    private elementListener: Node | HTMLElement
    private glareElement: HTMLElement | null = null
    private glareElementWrapper: HTMLElement | null = null

    private updateBind: () => void
    private resetBind: () => void

    private onMouseEnterBind: (() => void) | undefined
    private onMouseMoveBind: ((event: Event | MouseEvent) => void) | undefined
    private onMouseLeaveBind: (() => void) | undefined
    private onWindowResizeBind: (() => void) | undefined
    private onDeviceOrientationBind: ((event: DeviceOrientationEvent) => void) | undefined


    constructor(element: HTMLElement, settings: ITiltSettings = new TiltSettings()) {
        this.elementData = new ElementData()
        this.gyroscopeData = new GyroscopeData()

        this.updateCall = null
        this.event = null

        this.updateBind = this.update.bind(this)
        this.resetBind = this.reset.bind(this)

        this.element = element
        this.settings = settings

        this.elementListener = this.getElementListener()

        if (settings.glare)
            this.prepareGlare()

        if (settings.fullPageListening)
            this.updateClientSize()

        this.addEventListeners()
        this.reset()

        if (settings.resetToStart === false) {
            this.settings.startX = 0
            this.settings.startY = 0
        }
    }


    /**
     * Method returns element what will be listen mouse events
     * 
     * @returns 
     * @see https://github.com/micku7zu/vanilla-tilt.js/blob/48f4ee931d4d91dcdd2f91803db67a9f3a16587e/src/vanilla-tilt.js#L72
     */
    private getElementListener(): Node {
        if (this.settings.fullPageListening)
            return window.document

        if (typeof (this.settings.mouseEventElement) === 'string') {
            const queryElement = document.querySelector(this.settings.mouseEventElement)

            if (queryElement)
                return queryElement
        }

        if (this.settings.mouseEventElement instanceof Element)
            return this.settings.mouseEventElement

        return this.element;
    }

    /**
     * Method set listen methods for this.elementListener
     */
    public addEventListeners(): void {
        this.onMouseEnterBind = this.onMouseEnter.bind(this)
        this.onMouseMoveBind = this.onMouseMove.bind(this)
        this.onMouseLeaveBind = this.onMouseLeave.bind(this)
        this.onWindowResizeBind = this.onWindowResize.bind(this)
        this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this)

        this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind)
        this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind)
        this.elementListener.addEventListener("mousemove", this.onMouseMoveBind)

        if (this.settings.glare || this.settings.fullPageListening)
            window.addEventListener("resize", this.onWindowResizeBind)

        if (this.settings.gyroscope)
            window.addEventListener("deviceorientation", this.onDeviceOrientationBind)
    }

    /**
     * Method remove event listeners from current this.elementListener
     */
    public removeEventListeners(): void {
        if (this.onMouseEnterBind)
            this.elementListener.removeEventListener("mouseenter", this.onMouseEnterBind)
        if (this.onMouseLeaveBind)
            this.elementListener.removeEventListener("mouseleave", this.onMouseLeaveBind)
        if (this.onMouseMoveBind)
            this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind)


        if (this.settings.gyroscope && this.onDeviceOrientationBind)
            window.removeEventListener("deviceorientation", this.onDeviceOrientationBind)

        if ((this.settings.glare || this.settings.fullPageListening) && this.onWindowResizeBind)
            window.removeEventListener("resize", this.onWindowResizeBind)
    }


    public reset() {
        this.onMouseEnter()

        const clientWidth = this.elementData.getClientWidth()
        const clientHeight = this.elementData.getClientHeight()
        const left = this.elementData.getLeft()
        const top = this.elementData.getTop()
        const width = this.elementData.getWidth()
        const height = this.elementData.getHeight()
        const max = this.settings.max
        const startX = this.settings.startX
        const startY = this.settings.startY

        if (this.settings.fullPageListening) {
            this.event = {
                clientX: (startX + max) / (2 * max) * clientWidth,
                clientY: (startY + max) / (2 * max) * clientHeight
            }
        } else {
            this.event = {
                clientX: left + ((startX + max) / (2 * max) * width),
                clientY: top + ((startY + max) / (2 * max) * height)
            }
        }

        const backupScale = this.settings.scale
        this.settings.scale = 1
        this.update()
        this.settings.scale = backupScale
        this.resetGlare()
    }

    public resetGlare() {
        if (this.settings.glare && this.glareElement) {
            this.glareElement.style.transform = 'rotate(180deg) translate(-50%, -50%)'
            this.glareElement.style.opacity = '0'
        }
    }

    public getValues(): TiltChangeEvent {
        const eClientX = this.event ? this.event.clientX : 0
        const eClientY = this.event ? this.event.clientY : 0
        const clientWidth = this.elementData.getClientWidth()
        const clientHeight = this.elementData.getClientHeight()
        const left = this.elementData.getLeft()
        const top = this.elementData.getTop()
        const width = this.elementData.getWidth()
        const height = this.elementData.getHeight()
        const max = this.settings.max
        const reverse = this.settings.getReverseInt()
        let x: number
        let y: number

        if (this.settings.fullPageListening) {
            x = eClientX / clientWidth;
            y = eClientY / clientHeight;
        } else {
            x = (eClientX - left) / width
            y = (eClientY - top) / height
        }

        x = Math.min(Math.max(x, 0), 1)
        y = Math.min(Math.max(y, 0), 1)

        const tiltX = (reverse * (max - x * max * 2)).toFixed(2)
        const tiltY = (reverse * (y * max * 2 - max)).toFixed(2)
        const angle = Math.atan2(eClientX - (left + width / 2), -(eClientY - (top + height / 2))) * (180 / Math.PI)

        return {
            tiltX: tiltX,
            tiltY: tiltY,
            percentageX: x * 100,
            percentageY: y * 100,
            angle: angle
        }
    }

    private updateElementPosition(): void {
        const rect = this.element.getBoundingClientRect()

        this.elementData.width = this.element.offsetWidth
        this.elementData.height = this.element.offsetHeight
        this.elementData.left = rect.left
        this.elementData.top = rect.top
    }


    private update() {
        let values = this.getValues()

        this.element.style.transform = `perspective(${this.settings.perspective}px) ` +
            `rotateX(${this.settings.axis === "x" ? 0 : values.tiltY}deg) ` +
            `rotateY(${this.settings.axis === "y" ? 0 : values.tiltX}deg) ` +
            `scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})`

        if (this.settings.glare && this.glareElement) {
            this.glareElement.style.transform = `rotate(${values.angle}deg) translate(-50%, -50%)`
            this.glareElement.style.opacity = (values.percentageY * this.settings.maxGlare / 100).toString()
        }

        this.element.dispatchEvent(new CustomEvent("tiltChange", {
            "detail": values
        }))

        this.updateCall = null
    }

    /**
     * Appends the glare element (if glarePrerender equals false)
     * and sets the default style
     */
    private prepareGlare() {
        // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.
        if (!this.settings.glarePrerender) {
            // Create glare element
            const jsTiltGlare = document.createElement("div")
            jsTiltGlare.classList.add("js-tilt-glare")

            const jsTiltGlareInner = document.createElement("div")
            jsTiltGlareInner.classList.add("js-tilt-glare-inner")

            jsTiltGlare.appendChild(jsTiltGlareInner)
            this.element.appendChild(jsTiltGlare)
        }

        this.glareElementWrapper = this.element.querySelector(".js-tilt-glare")
        this.glareElement = this.element.querySelector(".js-tilt-glare-inner")

        if (this.settings.glarePrerender)
            return

        if (this.glareElementWrapper) {
            const style = this.glareElementWrapper.style
            style.position = 'absolute'
            style.top = '0'
            style.left = '0'
            style.width = '100%'
            style.height = '100%'
            style.overflow = 'hidden'
            style.pointerEvents = 'none'
            style.borderRadius = 'inherit'
        }

        if (this.glareElement) {
            const style = this.glareElement.style
            style.position = 'absolute'
            style.top = '50%'
            style.left = '50%'
            style.pointerEvents = 'none'
            style.backgroundImage = 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)'
            style.transform = 'rotate(180deg) translate(-50%, -50%)'
            style.transformOrigin = '0% 0%'
            style.opacity = '0'
        }

        this.updateGlareSize()
    }

    private updateGlareSize() {
        if (!this.settings.glare)
            return

        const offsetWidth = this.element.offsetWidth
        const offsetHeight = this.element.offsetHeight
        const glareSize = (offsetWidth > offsetHeight ? offsetWidth : offsetHeight) * 2

        if (this.glareElement) {
            const style = this.glareElement.style
            style.width = glareSize + 'px'
            style.height = glareSize + 'px'
        }
    }

    private updateClientSize() {
        this.elementData.clientWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth

        this.elementData.clientHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight
    }


    setTransition(): void {
        clearTimeout(this.transitionTimeout)

        const speed = this.settings.speed
        const easing = this.settings.easing

        this.element.style.transition = speed + 'ms ' + easing
        if (this.settings.glare && this.glareElement)
            this.glareElement.style.transition = `opacity ${speed}ms ${easing}`


        this.transitionTimeout = setTimeout(() => {
            this.element.style.transition = ''

            if (this.settings.glare && this.glareElement)
                this.glareElement.style.transition = ''
        }, speed)
    }



    // Internal Events --------------------------



    private onDeviceOrientation(event: DeviceOrientationEvent): void {
        if (event.gamma === null || event.beta === null)
            return

        this.updateElementPosition()

        if (this.settings.gyroscopeSamples > 0) {
            this.gyroscopeData.lastGammazero = this.gyroscopeData.gammazero
            this.gyroscopeData.lastBetazero = this.gyroscopeData.betazero

            if (this.gyroscopeData.gammazero === null) {
                this.gyroscopeData.gammazero = event.gamma
                this.gyroscopeData.betazero = event.beta
            } else {
                this.gyroscopeData.gammazero = (event.gamma + this.gyroscopeData.getLastGammazero()) / 2
                this.gyroscopeData.betazero = (event.beta + this.gyroscopeData.getLastBetazero()) / 2
            }

            this.settings.gyroscopeSamples -= 1
        }

        const totalAngleX = this.settings.gyroscopeMaxAngleX - this.settings.gyroscopeMinAngleX
        const totalAngleY = this.settings.gyroscopeMaxAngleY - this.settings.gyroscopeMinAngleY

        const degreesPerPixelX = totalAngleX / this.elementData.getWidth()
        const degreesPerPixelY = totalAngleY / this.elementData.getHeight()

        const angleX = event.gamma - (this.settings.gyroscopeMinAngleX + this.gyroscopeData.getGammazero())
        const angleY = event.beta - (this.settings.gyroscopeMinAngleY + this.gyroscopeData.getBetazero())

        const posX = angleX / degreesPerPixelX
        const posY = angleY / degreesPerPixelY

        if (this.updateCall !== null)
            cancelAnimationFrame(this.updateCall)

        this.event = {
            clientX: posX + this.elementData.getLeft(),
            clientY: posY + this.elementData.getTop(),
        }

        this.updateCall = requestAnimationFrame(this.updateBind)
    }

    private onMouseEnter(): void {
        this.updateElementPosition()
        this.element.style.willChange = 'transform'
        this.setTransition()
    }

    private onMouseMove(event: Event | MouseEvent): void {
        if (this.updateCall !== null)
            cancelAnimationFrame(this.updateCall)

        if (event instanceof MouseEvent)
            this.event = event

        this.updateCall = requestAnimationFrame(this.updateBind)
    }

    private onMouseLeave(): void {
        this.setTransition()

        if (this.settings.reset)
            requestAnimationFrame(this.resetBind)
    }

    private onWindowResize(): void {
        this.updateGlareSize()
        this.updateClientSize()
    }

}