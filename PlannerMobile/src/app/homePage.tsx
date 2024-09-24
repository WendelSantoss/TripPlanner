import { Button } from "@/components/button";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { LogOut, Plane, CalendarArrowDown, UserCircle2} from "lucide-react-native"
import { colors } from "@/styles/colors";

import { useUserContext } from "@/server/userContext";
import useAuthentication from "@/server/userAuthentication";
import { useNavigation } from "@react-navigation/native";
import userTrips from "@/server/userTripServer";
import { useEffect, useState } from "react";
import CardTrip from "@/components/cardTrip";
import Loading from "@/components/loading";
import { notifications } from "@/components/notifications";


export default function HomePage(){
    const [ dataTrips, setDataTrips ]= useState<any[]>([]);
    const [ loading, setLoading ]= useState(true)

    const { user, setUser } = useUserContext()
    const {handleLogout} = useAuthentication()
    const { deleteTrip, getTripsbyEmail }= userTrips();

    const navigation = useNavigation();

    const fetchingData = async ()=>{
        const email= user.email;
        try{
            const response= await getTripsbyEmail(email)
            if(response){
             
                setDataTrips(response.trip)
                console.log("Dados Trip:",response.trip)
                setLoading(false)
            }
            return response

        }catch(error: any){
            setLoading(false)
            console.log("chamou erro no componente",error.response)
            return error
        }
    }

    const logout = ()=>{
        handleLogout()
        setUser(null)
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        })
    }

    const deletingTrip= async(tripID: string)=>{
        const responseDelete= await deleteTrip(tripID)
        // filtro todas as trips menos a que quero deletar.
        const newDatatrips = dataTrips.filter((trip) => trip.id !== tripID);

        if(responseDelete.message === 'Trip deleted successfully'){
            // seto um novo estado com novos dados
            setDataTrips(newDatatrips)
            const type = "error"
            const tittle= "Trip deletada"
            const message= "Trip foi deletada com sucesso."
            notifications({type, tittle, message })
        }else{
            console.log("Response:",responseDelete.message)
        }

    }
    
    const navigateToSchedule = ()=>{
        navigation.navigate("AgendeTrip")
    }

    useEffect(()=>{
        fetchingData()
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
                <View className=" h-16 w-16 ml-1 mb-3">
                    {user.photoURL?
                        <Image source={{ uri:`${user.photoURL}`}} className="h-[60px] w-[60px]"/>
                        :
                        <UserCircle2 color={colors.zinc[300]} size={60} />
                    }
                </View>
                    <TouchableOpacity onPress={logout} className=" w-20 gap-2 flex-col" >
                        <View className=" mt-[9px]">
                            <LogOut color={colors.zinc[300]} size={33}/>
                            
                            <Text className="color-zinc-300">                     
                                Sair
                            </Text>
                        </View>
            
                    </TouchableOpacity>
            </View>

            <Text className=" text-2xl color-zinc-200 mt-1">
                Bem vindo {user.displayName}
            </Text>

            <View className=" h-20 mt-10 flex-1 ">
            
                <Text className="text-xl color-zinc-200">
                    Lista de trips agendadas  <CalendarArrowDown color={colors.zinc[300]} size={20}/>
                </Text>

                <ScrollView className="mt-5 flex-1">
               
                    {loading &&
                        <View className=" mt-9 p-28 ">
                            <Loading/>
                        </View>
                    }

                    {!loading && dataTrips?.length > 0?
                        dataTrips.map((item: any)=>{
                            return(
                                <CardTrip dataTrips={item} key={item.id} deleteTrip={deletingTrip}/>
                            )
                        })

                        :

                        <Text className=" text-zinc-500 text-base mt-1">

                            Não foi encontrada nenhuma trip agendada, por favor agende uma trip.

                        </Text>
                    }
                </ScrollView>
                
                <View className="mb-9 justify-end">
                    <Button onPress={navigateToSchedule} variant="primary">
                        <Button.Tittle>                 
                            Agendar uma Trip
                        </Button.Tittle>
                        <Plane color={colors.lime[950]} size={20}/>
                    </Button>
                </View>
            </View>
            
        </View>
        
    )
}