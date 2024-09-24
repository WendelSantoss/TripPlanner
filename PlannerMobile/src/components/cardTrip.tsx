import { colors } from "@/styles/colors"
import dayjs from "dayjs"
import { Plane, X } from "lucide-react-native"
import { View, Text, TouchableOpacity } from "react-native"

type DadosTrip={
    deleteTrip: (tripID: string) => void,
    dataTrips: any
}

export default function CardTrip({dataTrips, deleteTrip}: DadosTrip){
    
    const idaFormatada= dayjs(dataTrips.starts_at).format('DD-MM-YYYY');
    const voltaFormatada= dayjs(dataTrips.ends_at).format('DD-MM-YYYY');
    
    return(
        <>
            {dataTrips &&
            
                <View className=" flex-row bg-zinc-900 mb-4 p-2 relative">
                    <View className=" h-16 w-16 ">
                    <Plane color={colors.lime[300]} size={70}/>
                    </View>
                    <View className=" flex-wrap ml-5">
                        <Text className="text-xl color-zinc-200 ">
                            Destino: {dataTrips.destination}
                        </Text>
                        <Text className="text-base text-zinc-500 ">
                            Ida: {idaFormatada}
                        </Text>
                        <Text className="text-base text-zinc-500 ">
                            Volta: {voltaFormatada}
                        </Text>
                    </View>
                    <View className=" absolute top-0 right-0">
                        <TouchableOpacity onPress={()=>deleteTrip(dataTrips.id)}>
                            <X color={colors.zinc[400]} size={25} />
                        </TouchableOpacity>
                    </View>
                </View>
                
      
            } 
        </>
    )
}