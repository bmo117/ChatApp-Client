import "./style.css";
import ArrowCircleUpSharpIcon from "@mui/icons-material/ArrowCircleUpSharp";
import ForumIcon from "@mui/icons-material/Forum";
import { useContext, useEffect, useRef, useState } from "react";
import { User } from "../../context/User";
import { uniqBy } from "lodash";
import Person from "../Person/Person";
import axios from "axios";

function ChatPage() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { userName, id, setId, setUserName } = useContext(User);
  const [offPeople, setOffPeople] = useState({});
  const divUnderMessages = useRef();

  useEffect(() => {
    //create a new instance to ws  (step 1)

    connectToWebSocket();
  }, []);

  function connectToWebSocket() {
    const ws = new WebSocket("ws://localhost:3001");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        connectToWebSocket();
      }, 1000);
    });
  }
  //(step 3)
  function showOnlinePeople(arrayPeople) {
    const people = {};
    arrayPeople.forEach(({ userId, userName }) => {
      people[userId] = userName;
    });
    setOnlinePeople(people);
  }
  //(step 2)
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function sendMessage(ev) {
    ev.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
      })
    );
    setNewMessageText("");
    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    if (setSelectedUserId) {
      axios.get("users/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    axios.get("users/people").then((res) => {
      const offlineUsers = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offLinePeople = {};
      offlineUsers.forEach((p) => {
        offLinePeople[p._id] = p;
      });
      setOffPeople(offLinePeople);
    });
  }, [onlinePeople]);

  const onlinePeopleExceptMe = { ...onlinePeople };
  delete onlinePeopleExceptMe[id];

  const uniqueMessages = uniqBy(messages, "_id");

  function logout() {
    axios.post("users/logout").then((res) => {
      setWs(null);
      setId(null);
      setUserName(null);
    });
  }

  return (
    <div className="bgChat">
      <div className="bgLeftChat">
        <div className="contLogo">
          <ForumIcon />
          <label>ChatApp</label>
        </div>
        <div className="contContacts">
          {Object.keys(onlinePeopleExceptMe).map((userId) => (
            <Person
              key={userId}
              id={userId}
              online={true}
              userName={onlinePeopleExceptMe[userId]}
              onClick={() => setSelectedUserId(userId)}
              selectedUserId={selectedUserId}
              firstLetter={onlinePeopleExceptMe[userId][0]}
            />
          ))}
          {Object.keys(offPeople).map((userId) => (
            <Person
              key={userId}
              id={userId}
              online={false}
              userName={offPeople[userId].userName}
              onClick={() => setSelectedUserId(userId)}
              selectedUserId={selectedUserId}
              firstLetter={offPeople[userId].userName[0]}
            />
          ))}
        </div>
        <div className="contMyUserLogout">
          <div>{userName}</div>
          <button onClick={logout} className="btnLogout">
            logout
          </button>
        </div>
      </div>
      <div className="bgRightChat">
        <div className="contMessageArea">
          {!!selectedUserId && (
            <div className="messages">
              {uniqueMessages.map((message) => (
                <div
                  key={message._id}
                  className={
                    message.sender === id ? "messageLeft" : "messageRight"
                  }
                >
                  <div
                    className={
                      " " +
                      (message.sender === id
                        ? "contMessagesMe"
                        : "contMessagesOther")
                    }
                    key={message.id}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={divUnderMessages}></div>
            </div>
          )}

          {!selectedUserId && (
            <div className="unselectedChat">&larr; select a conversation</div>
          )}
        </div>
        {!!selectedUserId && (
          <form className="contInputButton" onSubmit={sendMessage}>
            <input
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              type="text"
              placeholder="type something..."
            />
            <button type="submit">
              <ArrowCircleUpSharpIcon fontSize="medium" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
