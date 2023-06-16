import "./style.css";
import axios from "axios";
import { useState, useContext } from "react";
import { User } from "../../context/User";
function LoginRegister() {
  const [registerOrLogin, setRegisterOrLogin] = useState("Register");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState(0);
  const { setUserName: setLoggingUser, setId } = useContext(User);

  async function handleSubmit(event) {
    event.preventDefault();
    const url = registerOrLogin === "Register" ? "register" : "login";
    try {
      if (userName && password) {
        const { data } = await axios.post("users/" + url, {
          userName,
          password,
        });
        setLoggingUser(userName);
        setId(data.id);
      }

      console.log(data, "++++++++++");
    } catch (error) {
      console.log(error);
      setValidation(1);
    }
  }

  return (
    <div className="bg">
      <div className="bgForm">
        <div className="containerTitle">
          {registerOrLogin === "Register" ? "Register" : "Log in"}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="containerFields">
            <input
              onChange={(ev) => setUserName(ev.target.value)}
              type="text"
              placeholder="Enter username"
            />
          </div>
          <div className="containerFields">
            <input
              onChange={(ev) => setPassword(ev.target.value)}
              type="password"
              placeholder="Enter password"
            />
          </div>
          <div
            className={
              "validationMessage " + (validation === 0 ? "visible" : "")
            }
          >
            {registerOrLogin === "Register"
              ? "Fields are mandatory"
              : "user or password incorrect"}
          </div>
          <button type="submit" className={"btnSubmit "}>
            Enter
          </button>
          <div className="">
            {registerOrLogin === "Register" && (
              <div className="containerSwitch">
                Have an account?
                <button
                  onClick={() => {
                    setRegisterOrLogin("Login");
                    setValidation(0);
                  }}
                >
                  Log in
                </button>
              </div>
            )}
            {registerOrLogin === "Login" && (
              <div className="containerSwitch">
                Dont have an account?
                <button
                  className={" "}
                  onClick={() => {
                    setRegisterOrLogin("Register");
                    setValidation(0);
                  }}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginRegister;
