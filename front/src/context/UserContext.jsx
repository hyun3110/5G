import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // 유저 상태 관리

  // 컴포넌트가 마운트될 때 localStorage에서 유저 정보 불러오기
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 유저 정보가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);  // 다른 컴포넌트에서 유저 정보를 사용할 수 있게
