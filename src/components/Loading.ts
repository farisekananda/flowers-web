import anime from "animejs"
import "../style/loading.css"

export function setupLoading(element: HTMLButtonElement) {
  let isLoading = false

  const setLoading = (status: boolean, duration: number = 200) => {
    isLoading = status

    if (isLoading) {
      element.style.display = "flex"
      anime({
        targets: element,
        opacity: [0, 1],
        duration: duration,
        easing: "easeOutQuart",
      })
    } else {
      anime({
        targets: element,
        opacity: [1, 0],
        duration: duration,
        easing: "easeInQuart",
      }).complete = () => {
        element.style.display = "none"
      }
    }
  }

  return setLoading
}
