import { Button } from "@/components/button";
import { Text, View, Image, TouchableOpacity } from "react-native";
import {LogOut, Plane} from "lucide-react-native"
import { colors } from "@/styles/colors";

import { useUserContext } from "@/serer/userContext";
import useAuthentication from "@/serer/userAuthentication";
import { useNavigation } from "@react-navigation/native";
import userTrips from "@/serer/userTripServer";
import { useEffect } from "react";


export default function HomePage(){

    const { user, setUser } = useUserContext()
    const {handleLogout} = useAuthentication()
    const { getTripsByID }= userTrips();
    const navigation = useNavigation();

    const logout = ()=>{
        handleLogout()
        setUser(null)
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        })
    }
    
    const navigateToSchedule = ()=>{
        navigation.navigate("AgendeTrip")
        
    }
    
    console.log("user",user)


    useEffect(()=>{
        const userID= user
        // getTripsByID()
    },[])

    
    
    return (
        <View className=" flex-1 px-3 bg-zinc-950">
            
            <View className=" items-center mt-16">
                <Image source={require("@/assets/logo.png")}
                    className="h-8"
                    resizeMode="contain"
                />
            </View>

            <View className=" h-20 mt-7 flex-row justify-between pr-1 ">
                <View className=" h-14 w-14 mb-3 bg-lime-300">

                </View>
                <TouchableOpacity onPress={logout} className=" w-20 gap-2 flex-col" >
                    
                    <LogOut color={colors.zinc[300]} size={33}/>
                    
                    <Text className="color-zinc-300">                     
                        Sair
                    </Text>
                
                </TouchableOpacity>
            </View>
                <Text className=" text-2xl color-zinc-200 mt-1">
                    Bem vindo {user.displayName}
                </Text>
            <View className=" h-20 mt-10">
            
                <Text className="text-xl color-zinc-200">
                    Lista de trips agendadas  
                </Text>
                
                <Button onPress={navigateToSchedule} variant="primary">
                    <Button.Tittle>                 
                        Agendar uma Trip
                    </Button.Tittle>
                    <Plane color={colors.lime[950]} size={20}/>
                </Button>
            </View>
           
        
        </View>
        
    )
}