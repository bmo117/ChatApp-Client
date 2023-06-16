import "./App.css";
import Routes from "./components/Routes/Routes";
import { UserProvider } from "./context/User";
import axios from "axios";

function App() {
  axios.defaults.baseURL = "http://localhost:3001/api";
  axios.defaults.withCredentials = true;
  return (
    <UserProvider>
      <Routes />
    </UserProvider>
  );
}

export default App;
