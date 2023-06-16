function Person({
  userId,
  onClick,
  selectedUserId,
  userName,
  firstLetter,
  online,
  id,
}) {
  return (
    <div
      onClick={() => onClick(userId)}
      className={
        "contOnlinePeople " + (id === selectedUserId ? "bgUserSelected" : "")
      }
      key={userId}
    >
      <div className="contAvatar">
        {firstLetter}
        <div className={online === true ? "onlineIndicator" : ""}></div>
      </div>
      {userName}
    </div>
  );
}

export default Person;
