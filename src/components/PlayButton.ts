import anime from "animejs"
import { setupCanvasParticles } from "./CanvasParticles"

export function setupPlayButton(parent: HTMLElement) {
  // Setup canvas and particles
  var canvas = document.getElementById("canvas1")
  setupCanvasParticles(canvas as HTMLCanvasElement)

  // Setup button timeline
  let buttonTimeline = anime.timeline({
    autoplay: false,
  })

  buttonTimeline
    .add({
      targets: ".text",
      duration: 1,
      opacity: "0",
    })
    .add({
      targets: ".button",
      duration: 1500,
      height: 0,
      width: 300,
      backgroundColor: "#2B2D2F",
      border: "0",
      borderRadius: 100,
      easing: "easeOutCubic",
    }).complete = () => {
    parent.style.display = "none"
  }

  let button = document.querySelector<HTMLButtonElement>("#screen1 .button")!
  let text = document.querySelector<HTMLButtonElement>("#screen1 .text")!

  button.onclick = function () {
    buttonTimeline.play()
  }

  text.onclick = function () {
    buttonTimeline.play()
  }
}
