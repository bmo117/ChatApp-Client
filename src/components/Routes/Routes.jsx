import { User } from "../../context/User";
import { useContext } from "react";
import RegisterOrLogin from "../LoginRegister/LoginRegister";
import ChatPage from "../ChatPage/ChatPage";

function Routes() {
  const { userName, id } = useContext(User);
  console.log("se ejecuto routes ");
  if (userName) {
    return <ChatPage />; // if have an authentication token
  }
  return <RegisterOrLogin />; // home
}

export default Routes;
