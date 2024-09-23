import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { colors } from "@/styles/colors";

import {
    MapPin, 
    Calendar as IconCalendar, 
    Settings2, 
    UserRoundPlus,
    ArrowRight
} from "lucide-react-native"
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars"; 

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useUserContext } from "@/server/userContext";
import { Modal } from "react-native";
import { notifications } from "@/components/notifications";
import dayjs from 'dayjs';
import { validateInput } from "@/utils/validateInput";
import { ConvidadosEmails } from "@/components/convidadosEmails";
import userTrips from "@/server/userTripServer";




enum StepForm {
    DetalheViagem = 1,
    ADDEmail = 2,
    DateCalendar= 3,
    ModalEmail= 4,
}

export default function AgendeTrip (){
    const [stepForm, setStepForm]= useState(StepForm.DetalheViagem);
    const [dateToShow, setDateToShow] = useState("")
    const [destination, setDestination] = useState("")
    const [emailInvite, setEmailInvite] = useState("")
    const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])
    const [selectedDates, setSelectedDates] = useState<{ start?: string; end?: string }>({
        start: undefined,
        end: undefined,
    });
    const[selecionandoReturn, setSelecionandoReturn]= useState<boolean>(false)

    const { user } = useUserContext();
    const { createTrip }= userTrips();

    const navigation = useNavigation();

    const goBack = ()=> navigation.goBack();

    function alterarStepForm(){
        if(stepForm === StepForm.DetalheViagem && selectedDates.start && selectedDates.end && destination){
            setStepForm(StepForm.ADDEmail)
        }else{
            const type = "error"
            const tittle= "Preencha todos os dados"
            const message= "Preencha destino, a ida e a volta para continuar."
            notifications({type, tittle, message })
        }
    }
    
    function checkDatasTrips(data : string){
        // Converte a data selecionada em num formato para comparar
        const selectedTimestamp = dayjs(data).valueOf(); 
        const todayTimestamp = dayjs().startOf('day').valueOf();

        if(!selecionandoReturn){
            if(selectedTimestamp < todayTimestamp){
                const type = "error"
                const tittle= "Data de Ida Inválida"
                const message= "Data de ida não pode ser anterior ao dia de hoje."
                notifications({type, tittle, message })
                return
            }
            setSelectedDates({start: data})
            setSelecionandoReturn(true)
        
        }else if(data == selectedDates.start){
            setSelectedDates({})
            setSelecionandoReturn(false)
        }else if(data == selectedDates.end){
            setSelectedDates((prevSelectedDates)=>({
                ...prevSelectedDates,
                end: ''
            }))
        }else{
            const selectedIDATimestamp = dayjs(selectedDates.start).valueOf(); 
            if(selectedTimestamp < selectedIDATimestamp){
                const type = "error"
                const tittle= "Data de Volta Inválida"
                const message= "Data de volta não pode ser anterior a data de ida."
                notifications({type, tittle, message })
                return
            }
            setSelectedDates((prevSelectedDates)=>({
                ...prevSelectedDates,
                end: data
            }))
            if(destination){
                setStepForm(StepForm.ADDEmail)
            }else{
                setStepForm(StepForm.DetalheViagem)
            }
        }
    }

    const savingEmailsToInvite= (email: string)=>{
        if(email == user.email){
            const type = "error"
            const tittle= "Email é do usuário"
            const message= "O Email informado é o mesmo do usuário, por favor insira outros dados."
            notifications({type, tittle, message })
            return
        }
        if(validateInput.email(email)){
            const filtroEmails= emailsToInvite.find((convidado)=> convidado === email)
            console.log(filtroEmails)
            
            if(filtroEmails){
                const type = "error"
                const tittle= "Email já incluído"
                const message= "O Email informado já foi incluso na trip, convide outros amigos."
                notifications({type, tittle, message })
                return
            }

            setEmailsToInvite((prevEmailsToInvite)=>(
                [
                    ...prevEmailsToInvite,
                    email
                ]
            ))
            setEmailInvite('');
        }else{
           
            const type = "error"
            const tittle= "Email Inválido"
            const message= "Formato do email informado é inválido, por favor insira um email válido."
            notifications({type, tittle, message })
        }
    }

    const deleteEmailToInvite= (emailToRemove: string)=>{
        const newEmailsToInvite=  emailsToInvite.filter((convidados)=> convidados != emailToRemove)
        setEmailsToInvite(newEmailsToInvite)
    }

    const criarTrip= async ()=>{
        // formatação para cadastro dos dados no banco
        const idaFormatada= dayjs(selectedDates.start).toISOString();
        const voltaFormatada= dayjs(selectedDates.end).toISOString();

        const data= {
            destination: destination,
            starts_at: idaFormatada || '',
            ends_at: voltaFormatada || '', 
            emails_to_invite: emailsToInvite,
            owner_name: user.displayName,
            owner_email: user.email
        }
        // chamada para criação da trip
        const response= await createTrip(data)
        console.log("response: ",response)

        if(response.tripId){
            const type = "success"
            const tittle= "Trip confirmada"
            const message= "A trip foi confirmada com sucesso."
            notifications({type, tittle, message })
        
            navigation.navigate("HomePage")
            
        }else{
          console.log(response.message)
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
                <View className=" gap-2 mb-2">
                    <Input variant="tertiary">
                        <MapPin color={colors.zinc[400]} size={20}/>
                        <Input.Field 
                            placeholder={"Digite seu destino"} 
                            editable={stepForm == StepForm.DetalheViagem || stepForm == StepForm.DateCalendar}
                            onChange={(event)=> setDestination(event.nativeEvent.text)}
                        />
                    </Input>
                
                    <Input variant="tertiary">
                        <IconCalendar color={colors.zinc[400]} size={20}/>
                        <Input.Field 
                            placeholder={dateToShow ? dateToShow : "Quando"}
                            editable={false}
                            onPressIn={()=> {
                                if(stepForm !=StepForm.ADDEmail){
                                    setStepForm(StepForm.DateCalendar)
                                }
                            }}
                            showSoftInputOnFocus={false}
                        />
                    </Input>
                </View>

                {stepForm === StepForm.DateCalendar && (
                
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={stepForm == StepForm.DateCalendar}
                    >
                        
                        <View className="flex-1 justify-center items-center bg-opacity-50">
                      
                            <View className="bg-white p-4 rounded-xl w-11/12 mt-10">

                                <Calendar
                                    onDayPress={(day: any) => {

                                        if(selectedDates.start){
                                            const formatDateToShow= dayjs(selectedDates.start).format('DD-MM-YYYY');
                                            setDateToShow(formatDateToShow)
                                        }
                                        checkDatasTrips(day.dateString)
                    
                                    }}
                                    markedDates={{
                                        [selectedDates.start || '']: {
                                            selected: true,
                                            selectedColor: colors.lime[300],
                                            selectedDayBackgroundColor: colors.lime[950],
                                        },
                                        [selectedDates.end || '']: {
                                            selected: true,
                                            selectedColor: colors.lime[300],
                                            selectedDayBackgroundColor: colors.zinc[800],
                                        },
                                    }}
                                    theme={{
                                        selectedDayBackgroundColor: colors.lime[300],
                                        todayTextColor: colors.lime[300],
                                        arrowColor: colors.lime[950],
                                
                                    }}
                                />
                                <Button onPress={() => setStepForm(StepForm.DetalheViagem)} variant="secondary">
                                    <Button.Tittle>Fechar</Button.Tittle>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                )}


                {stepForm === StepForm.ADDEmail &&
                    <>
                    
                    <View className=" border-b pb-2 border-zinc-800 mb-5">
                        <Button onPress={()=> setStepForm(StepForm.DetalheViagem)} variant="secondary">
                            <Button.Tittle>
                                Alterar local/data 
                            </Button.Tittle>
                            <Settings2 color={colors.zinc[200]} size={20}/>
                        </Button>
                    </View>

                    <View className=" mb-2">
                        <Input variant="tertiary">
                            <UserRoundPlus color={colors.zinc[400]} size={20}/>
                            <Input.Field 
                                placeholder={emailsToInvite.length > 0 ?
                                    `${emailsToInvite.length} pessoa(s) convidada(s)`
                                    :
                                    "Quem estará na viagem?"
                                }
                                // onChange={(event)=> savingEmailsToInvite(event.nativeEvent.text)}
                                //      editable={false}
                                onPressIn={()=> {
                                
                                    setStepForm(StepForm.ModalEmail)
                                    
                                }}
                                showSoftInputOnFocus={false}
                            />
                        </Input>
                    </View>
                    </>
                }
                    {stepForm == StepForm.ModalEmail &&  
                        // terminar essa modal dos emails.
                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={stepForm ==  StepForm.ModalEmail}
                        >
                            
                            <View className="flex-1 justify-center items-center bg-opacity-50">

                                <View className="bg-zinc-900 p-4 pb-5 gap-2 rounded-xl w-11/12 mt-10">

                                    <View className="mb-2 flex-wrap gap-2 border-b border-zinc-800 py-5 items-start">
                                        {emailsToInvite.length > 0 ? (
                                            emailsToInvite.map((email) => (
                                            <ConvidadosEmails
                                                key={email}
                                                email={email}
                                                onRemove={() => deleteEmailToInvite(email)}
                                            />
                                            ))
                                        ) : (
                                            <Text className="text-zinc-600 text-base font-regular">
                                            Nenhum e-mail adicionado.
                                            </Text>
                                        )}
                                    </View>
                                    <View className="mb-2">

                                        <Input variant="tertiary">
                                            <Input.Field 
                                                placeholder={"Digite o email do convidado"} 
                                                value={emailInvite}
                                                onChangeText={(text)=> setEmailInvite(text.toLowerCase())}
                                            />
                                        </Input>
                                    </View>

                                    <Button 
                                        onPress={()=> {savingEmailsToInvite(emailInvite)}} 
                                        variant="primary"
                                    >
                                        <Button.Tittle>
                                            Adicionar
                                        </Button.Tittle>
                                        <ArrowRight color={colors.lime[950]} size={20}/>
                                    </Button>   

                                    <Button onPress={()=> setStepForm(StepForm.ADDEmail)} variant="secondary">
                                        <Button.Tittle>Fechar</Button.Tittle>
                                        <ArrowRight color={colors.lime[950]} size={20}/>
                                    </Button>   

                                </View>
                            </View>
                        </Modal>
                    }

                    <Button onPress={stepForm == StepForm.ADDEmail? criarTrip: alterarStepForm}>
                        <Button.Tittle>
                            {stepForm == StepForm.DetalheViagem?
                                "Continuar"
                                :
                                "Confirmar"
                            } 
                        </Button.Tittle>
                        <ArrowRight color={colors.lime[950]} size={20}/>
                    </Button>
                   
                    <View className="mt-2">
                        <Button onPress={goBack} variant="secondary">
                            <Button.Tittle>
                                Voltar
                            </Button.Tittle>
                            <ArrowRight color={colors.lime[950]} size={20}/>
                        </Button>
                    </View>
            </View>

            <Text className="text-zinc-500 text-base text-center font-regular">
                Ao planejar sua viagem com a plann.er você automaticamente concorda
                com nossos termos de uso e políticas de privacidade. 
            </Text>
            
            
    
        </View>
    )
}