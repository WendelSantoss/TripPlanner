import * as React from "react";
import Toast from 'react-native-toast-message';

type notificationsType= {
    type: string,
    tittle:string,
    message: string
}

export const notifications = ({type, tittle, message} : notificationsType) => {
    return(
        Toast.show({
            type: type, // 'success', 'error', 'info', 'warning'
            text1: tittle,
            text2: message,
            position: "top",
          })
    )
};