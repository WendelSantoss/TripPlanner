import { View, Text, Image } from "react-native";
import { useState } from "react";
import { colors } from "@/styles/colors";

import {
    MapPin, 
    Calendar as IconCalendar, 
    Settings2, 
    UserRoundPlus,
    ArrowRight
} from "lucide-react-native"

import { Button } from "@/components/button";
import { Input } from "@/components/input";



enum StepForm {
    DetalheViagem = 1,
    ADDEmail = 2,
}


export default function AgendeTrip (){
    const [stepForm, setStepForm]= useState(StepForm.DetalheViagem)

   

    function alterarStepForm(){
        if(stepForm === StepForm.DetalheViagem){
            setStepForm(StepForm.ADDEmail)
            
        }
    }

    return(
        <View className=" flex-1 items-center justify-center px-5  bg-zinc-950" >
            
            <Image source={require("@/assets/logo.png")}
            className="h-8"
            resizeMode="contain"/>

            <Text className="text-zinc-400 font-regular text-center text-lg mt-3">
                Convide seus amigos e planeje sua{'\n'}próxima viagem
            </Text>

            <View className=" w-full bg-zinc-900 p-4 rounded-xl my-8 border-zinc-800 ">
                <Input>
                    <MapPin color={colors.zinc[400]} size={20}/>
                    <Input.Field 
                        placeholder={"Digite seu destino"} 
                        editable={stepForm == StepForm.DetalheViagem}
                    />
                </Input>
                <Input>
                    <IconCalendar color={colors.zinc[400]} size={20}/>
                    <Input.Field 
                        placeholder={"Quando"}
                        editable={stepForm == StepForm.DetalheViagem}
                    />
                </Input>

                {stepForm === StepForm.ADDEmail &&
                    <>
                    
                    <View className=" border-b py-3 border-zinc-800">
                    <Button onPress={()=> setStepForm(StepForm.DetalheViagem)} variant="secondary">
                        <Button.Tittle>
                            Alterar local/data 
                        </Button.Tittle>
                        <Settings2 color={colors.zinc[200]} size={20}/>
                    </Button>
                    </View>

                    <Input>
                    <UserRoundPlus color={colors.zinc[400]} size={20}/>
                    <Input.Field placeholder={"Quem estará na viagem?"}/>
                    </Input>
                    </>
                }
                    <Button onPress={alterarStepForm}>
                        <Button.Tittle>
                            {stepForm == StepForm.DetalheViagem?
                                "Continuar"
                                :
                                "Confirmar"
                            } 
                        </Button.Tittle>
                        <ArrowRight color={colors.lime[950]} size={20}/>
                    </Button>
            </View>

            <Text className="text-zinc-500 text-base text-center font-regular">
                Ao planejar sua viagem com a plann.er você automaticamente concorda
                com nossos termos de uso e políticas de privacidade. 
            </Text>
            
            
    
        </View>
    )
}