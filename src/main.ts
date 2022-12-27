import { setupLoading } from "./components/Loading"
import { setupPlayButton } from "./components/PlayButton"

const setLoading = setupLoading(
  document.querySelector<HTMLButtonElement>("#loading")!
)

setLoading(true, 0)
// SCREEN 1
setupPlayButton(document.querySelector("#screen1")!)
// SCREEN 2
setTimeout(() => setLoading(false), 1000)
