import "./App.css";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import Chatpage from "./Components/pages/Chatpage";
import Homepage from "./Components/pages/Homepage";

function App({ value }) {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
    </div>
  );
}

export default App;
