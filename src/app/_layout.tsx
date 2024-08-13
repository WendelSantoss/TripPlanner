import "@/styles/global.css"

import { View, StatusBar } from "react-native"
import { Slot } from "expo-router"
import { colors } from "@/styles/colors";

import{ 
    useFonts,
    Inter_500Medium,
    Inter_400Regular,
    Inter_600SemiBold
} from "@expo-google-fonts/inter"

import  Loading  from '@/components/loading'
import Toast, { BaseToast, ErrorToast }  from "react-native-toast-message"
import { UserContextProvider } from "@/serer/userContext";

export default function Layout(){

    const [fontsLoaded]= useFonts({
        Inter_500Medium,
        Inter_400Regular,
        Inter_600SemiBold
    })

    const toastConfig = {
   
        success: (props: any) => (
          <BaseToast
            {...props}
            
            style={{ backgroundColor: colors.zinc[800], borderLeftColor: colors.lime[300]  }}
            text1Style={{
                color: colors.zinc[300],
                fontSize: 15,
              }}
            text2Style={{
                color: colors.zinc[300],
                fontSize: 12,
            
            }}
          />
        ),
    
        error: (props: any) => (
          <ErrorToast
            {...props}
            style={{ backgroundColor: colors.zinc[800], borderLeftColor: 'red' }}
            text1Style={{
                color: colors.zinc[300],
                fontSize: 15,
              }}
            text2Style={{
                color: colors.zinc[300],
                fontSize: 12,
            
            }}
          />
        )
    }

    if(!fontsLoaded){
        return <Loading />
    }

    return (
        <UserContextProvider>
          <View className=" flex-1 bg-zinc-950">
              <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
              />
              <Slot/>
              <Toast config={toastConfig}/>
          </View>
        </UserContextProvider>
    )
    
}