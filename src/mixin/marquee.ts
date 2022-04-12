import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

declare module 'vue/types/vue' {
  interface Vue {
    domContainer: any
    setTimer(): void
    cleanTimer(): void
  }
}

@Component({
  name: 'marquee'
})
export default class marquee extends Vue {
  @State isScrolling
  @State scrollSpeed

  public domContainer: any = null // dom 容器
  public timer: any = null // interval容器
  public marqueeTimer: any = null // 滚动延时器容器
  public scrollLabel: boolean = false // 滚动标识

  // 在引用组件中mounted domContainer赋值 并执行setTimer函数

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (this.marqueeTimer) {
      clearTimeout(this.marqueeTimer)
    }
  }
  /**
   * @name: setTimer
   * @test: test font
   * @msg: 滚动开关
   * @param {void}
   * @return: void
   */
  public setTimer() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (this.isScrolling) {
      if (this.marqueeTimer) {
        clearTimeout(this.marqueeTimer)
      }
      // 3分钟不操作，自动滚动
      this.marqueeTimer = setTimeout(() => {
        this.startMarquee(1000, 40, 17)
      }, 10000)
    } else {
      clearTimeout(this.marqueeTimer)
    }
  }

  public cleanTimer() {
    clearInterval(this.timer)
    clearTimeout(this.marqueeTimer)
  }

  /**
   * @name: startMarquee
   * @test: test font
   * @msg: 控制滚动函数
   * @param {lh---每行列表的高度,speed---滚动的速度, delay---间隔多久滚动一次}
   * @return: void
   */
  public startMarquee(lh: number, speed: number, delay: number) {
    this.scrollLabel = false
    if (this.domContainer) {
      this.domContainer.onmouseover = () => {
        if (!this.scrollLabel) {
          this.scrollLabel = true
        }
      } //鼠标移入，停止滚动
      this.domContainer.onmouseout = () => {
        if (this.scrollLabel) {
          this.scrollLabel = false
        }
      } //鼠标移出，继续滚动
      setTimeout(() => {
        this.start(lh, speed, delay)
      }, delay)
    }
  }

  /**
   * @name: scrolling
   * @test: test font
   * @msg: 滚动函数
   * @param {void}
   * @return: void
   */
  public scrolling(lh: number, speed: number, delay: number) {
    if (parseInt(this.domContainer.scrollTop) % lh !== 0) {
      this.domContainer.scrollTop =
        parseInt(this.domContainer.scrollTop) + Math.ceil(this.scrollSpeed / 10)
      if (
        Math.abs(
          parseInt(this.domContainer.scrollTop + this.domContainer.offsetHeight)
        ) >= this.domContainer.scrollHeight
      ) {
        this.domContainer.scrollTop = 0
      }
    } else {
      clearInterval(this.timer)
      setTimeout(() => {
        this.start(lh, speed, delay)
      }, delay)
    }
  }

  /**
   * @name: start
   * @test: test font
   * @msg: 是否滚动
   * @param {void}
   * @return: void
   */
  public start(lh: number, speed: number, delay: number) {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.timer = setInterval(() => {
      this.scrolling(lh, speed, delay)
    }, speed) //定时器，自动滚动
    if (!this.scrollLabel) {
      this.domContainer.scrollTop =
        parseInt(this.domContainer.scrollTop) + Math.ceil(this.scrollSpeed / 10)
    }
  }
}
