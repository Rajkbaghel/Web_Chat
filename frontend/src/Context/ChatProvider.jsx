import { createContext, useContext, useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setuser] = useState();
  const [selectedChat, setselectedChat] = useState();
  const [Chats, setChats] = useState();
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //console.log(userInfo);
    setuser(userInfo);
    if (!userInfo) history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <ChatContext.Provider
      value={{ user, setuser, selectedChat, setselectedChat, Chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
