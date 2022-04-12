import { Component, Vue } from 'vue-property-decorator'

declare module 'vue/types/vue' {
  interface Vue {
    scroll(parentDom, sonDom): void
  }
}

@Component
export default class mousewheel extends Vue {
  private hasAddEvent: boolean = false
  private parentDom: any = null

  beforeDestroy() {
    this.removeScroll()
  }

  public scroll(parentDom: any, sonDom: any): void {
    this.hasAddEvent = false
    if (parentDom && parentDom.offsetWidth <= sonDom.offsetWidth) {
      this.parentDom = parentDom
      parentDom.addEventListener('DOMMouseScroll', this.handler, false)
      parentDom.addEventListener('mousewheel', this.handler, false)
      this.hasAddEvent = true
    }
  }
  private handler(event: any): void {
    let detail = event.wheelDelta || event.detail
    let moveForwardStep = -1
    let moveBackStep = 1
    let step = 0
    if (detail > 0) {
      step = moveForwardStep * 100
    } else {
      step = moveBackStep * 100
    }
    this.parentDom.scrollLeft += step
  }
  removeScroll(): void {
    if (this.hasAddEvent) {
      this.parentDom.removeEventListener('DOMMouseScroll', this.handler)
      this.parentDom.removeEventListener('mousewheel', this.handler)
    }
  }
}
