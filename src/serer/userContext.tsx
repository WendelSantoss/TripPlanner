import { createContext, useContext, useState,  } from "react";

interface UserInterface {
    user: any;
    token: string;
    setToken: (dataToken: string) => void;
    setUser: (dataUser: any) => void;
}

const UserContext = createContext<UserInterface>({
    user: null,
    token: "",
    setToken: () => {},
    setUser: () => {}
});



export function UserContextProvider (props: any) {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string>("");

    return (
        <UserContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};

// Hook para acessar o contexto
export const useUserContext = () => {
    return useContext(UserContext);
};
