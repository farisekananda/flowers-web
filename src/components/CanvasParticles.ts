import anime from "animejs"

interface CircleOptions {
  x: number
  y: number
  color?: string
  r?: number
  stroke?: {
    width: number
    color: string
  }
  opacity?: number
}

class Circle {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  color?: string
  r: number
  stroke?: {
    width: number
    color: string
  }
  opacity: number

  constructor(ctx: CanvasRenderingContext2D, opts: CircleOptions) {
    this.ctx = ctx
    this.x = opts.x
    this.y = opts.y
    this.color = opts.color
    this.r = opts.r || anime.random(24, 48)
    this.stroke = opts.stroke
    this.opacity = opts.opacity || 1
  }

  draw() {
    this.ctx.globalAlpha = this.opacity
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
    if (this.stroke) {
      this.ctx.strokeStyle = this.stroke.color
      this.ctx.lineWidth = this.stroke.width
      this.ctx.stroke()
    }
    if (this.color) {
      this.ctx.fillStyle = this.color
      this.ctx.fill()
    }
    this.ctx.closePath()
    this.ctx.globalAlpha = 1
  }
}

export const setupCanvasParticles = (canvas: HTMLCanvasElement) => {
  var ctx = canvas.getContext("2d")!
  var cH: number
  var cW: number
  var bgColor = "#FF6138"
  var animations: anime.AnimeInstance[] = []

  var colorPicker = (function () {
    var colors = ["#FF6138", "#FFBE53", "#2980B9", "#282741"]
    var index = 0
    function next() {
      index = index++ < colors.length - 1 ? index : 0
      return colors[index]
    }
    function current() {
      return colors[index]
    }
    return {
      next: next,
      current: current,
    }
  })()

  function removeAnimation(animation: anime.AnimeInstance) {
    var index = animations.indexOf(animation)
    if (index > -1) animations.splice(index, 1)
  }

  function calcPageFillRadius(x: number, y: number) {
    var l = Math.max(x - 0, cW - x)
    var h = Math.max(y - 0, cH - y)
    return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2))
  }

  function addClickListeners() {
    document.addEventListener("touchstart", handleEvent)
    document.addEventListener("mousedown", handleEvent)
  }

  function handleEvent(e: MouseEvent | TouchEvent) {
    let interaction = {
      x: 0,
      y: 0,
    }

    if ("touches" in e) {
      e.preventDefault()
      let touch = e.touches[0]
      interaction.x = touch.clientX
      interaction.y = touch.clientY
    } else {
      interaction.x = e.clientX
      interaction.y = e.clientY
    }

    var currentColor = colorPicker.current()
    var nextColor = colorPicker.next()
    var targetR = calcPageFillRadius(interaction.x, interaction.y)
    var rippleSize = Math.min(200, cW * 0.4)
    var minCoverDuration = 750

    var pageFill = new Circle(ctx, {
      x: interaction.x,
      y: interaction.y,
      r: 0,
      color: nextColor,
    })

    var fillAnimation = anime({
      targets: pageFill,
      r: targetR,
      duration: Math.max(targetR / 2, minCoverDuration),
      easing: "easeOutQuart",
      complete: function () {
        bgColor = pageFill.color!
        removeAnimation(fillAnimation)
      },
    })

    var ripple = new Circle(ctx, {
      x: interaction.x,
      y: interaction.y,
      r: 0,
      color: currentColor,
      stroke: {
        width: 3,
        color: currentColor,
      },
      opacity: 1,
    })

    var rippleAnimation = anime({
      targets: ripple,
      r: rippleSize,
      opacity: 0,
      easing: "easeOutExpo",
      duration: 900,
      complete: removeAnimation,
    })

    var particles: Circle[] = []
    for (var i = 0; i < 32; i++) {
      var particle = new Circle(ctx, {
        x: interaction.x,
        y: interaction.y,
        color: currentColor,
        r: anime.random(24, 48),
      })
      particles.push(particle)
    }

    var particlesAnimation = anime({
      targets: particles,
      x: function (particle: Circle) {
        return particle.x + anime.random(rippleSize, -rippleSize)
      },
      y: function (particle: Circle) {
        return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15)
      },
      r: 0,
      easing: "easeOutExpo",
      duration: anime.random(1000, 1300),
      complete: removeAnimation,
    })
    animations.push(fillAnimation, rippleAnimation, particlesAnimation)
  }

  anime({
    duration: Infinity,
    update: function () {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, cW, cH)
      animations.forEach(function (anim) {
        anim.animatables.forEach(function (animatable) {
          ;(animatable.target as any).draw()
        })
      })
    },
  })

  var resizeCanvas = function () {
    cW = window.innerWidth
    cH = window.innerHeight
    canvas.width = cW * devicePixelRatio
    canvas.height = cH * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
  }

  function init() {
    resizeCanvas()

    window.addEventListener("resize", resizeCanvas)
    addClickListeners()
  }

  init()
}
