import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Kanban from './components/Kanban'
import TaskDetails from './components/TaskDetails'

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Kanban />} />
      <Route path="/task/:taskId" element={<TaskDetails />} /> //Individually view a task in new page ex: /task/3939u4922....
    </Routes>
  </Router>
  );
}

export default App
