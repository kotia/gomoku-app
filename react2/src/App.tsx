import './App.css'
import {useSocketEvents} from "./hooks/useSocketEvents.ts";
import Game from "./components/Game.tsx";

function App() {
  useSocketEvents();

  return (
      <Game />
  )
}

export default App
