import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/styles/colors";

import { useUserContext } from "@/server/userContext";
import { useNavigation } from '@react-navigation/native';
import useAuthentication from "@/server/userAuthentication";

import {Eye, EyeOff} from "lucide-react-native"
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { RecoverSenhaModal } from "@/components/recoverSenhaModal";
import { CreateCount } from "@/components/createCount";
import { notifications } from "@/components/notifications";


export default function Login(){
    
    const [email, setEmail]= useState("")
    const [senha, setSenha]= useState("")
    const [passwordVisible, setPasswordVisible]= useState(true)

    const [stepForm, setStepForm]= useState(false)
    const [modal, setModal]= useState(false)

    const { handleLogin }= useAuthentication()
    const {setUser, setToken} = useUserContext()

    const navigation = useNavigation()

    function validacaoErros(message: string){
    
        if(message === "Firebase: Error (auth/invalid-credential)."){
            const type = "error"
            const tittle= "Email ou Senha inválidos"
            const message= "Cheque seus dados e tente novamente."
            notifications({type, tittle, message })
        
        }else if (message === "Firebase: Error (auth/invalid-email)."){
            const type = "error"
            const tittle= "Email inválido"
            const message= "Seu email é inválido, cheque seus dados e tente novamente."
            notifications({type, tittle, message })
        
        }else if(message ===
            "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."){
            const type = "error"
            const tittle= "Várias tentativas inválidas"
            const message= "Sua conta está temporariamente bloqueada, tente novamente mais tarde."
            notifications({type, tittle, message })

        }else if(message ==="Firebase: Password should be at least 6 characters (auth/weak-password)."){
            const type = "error"
            const tittle= "Número de characters insuficiente"
            const message= "Sua senha deve conter pelo menos 6 characters ou mais."
            notifications({type, tittle, message })
        
        }else if(message ==="Firebase: Error (auth/email-already-in-use)."){
            const type = "error"
            const tittle= "Email já cadastrado"
            const message= "O email informado é vinculado a uma conta no nosso sistema."
            notifications({type, tittle, message })
        }
    }
    
    const fazerLogin = async () => {
        if(!email && !senha){
            const type = "error"
            const tittle= "Email e Senha não digitados"
            const message= "Por favor digite o email e a senha para efetuar o login."
            notifications({type, tittle, message })
        }else if(email && !senha){
            const type = "error"
            const tittle= "Senha não digitada"
            const message= "Por favor digite a senha para efetuar o login."
            notifications({type, tittle, message })
        }else if(!email && senha){
            const type = "error"
            const tittle= "Email não digitado"
            const message= "Por favor digite seu email para efetuar o login."
            notifications({type, tittle, message })
        }else{
            try{
                const response = await handleLogin({ email, senha });
                const token = await response?.user.getIdToken();

                if (token) {
                    const type = "success"
                    const tittle= "Login com sucesso"
                    const message= "Seja bem vindo."
                    notifications({type, tittle, message })
                    setUser(response?.user)
                    setToken(token)
                    console.log("Login com sucesso");
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'HomePage' }],
                    })
                    
                }
            }catch(error: any){
                validacaoErros(error.message)
                console.log("Console tela login>", error.message);
            }
        }

    };

    return (
        <>
            <View className=" flex-1 px-5 justify-center items-center bg-zinc-950 ">
                
                <Image source={require("@/assets/logo.png")}
                    className="h-8 mb-9"
                    resizeMode="contain"
                />

                {stepForm?
                    <CreateCount 
                        setStepForm={setStepForm}
                        validacaoErros={validacaoErros}
                    />
                :
                    <>
                    {!modal?
                        <>
                            <View className=" bg-zinc-900 gap-3 rounded-xl py-6 px-2">

                            <Input variant="secondary">
                                <Input.Field 
                                    placeholder="Digite seu Email"
                                    value={email}
                                    onChange={(event) => setEmail(event.nativeEvent.text)}
                                />
                            </Input>
                            <Input variant="secondary">
                                <Input.Field 
                                    placeholder="Digite sua senha"
                                    value={senha}
                                    onChange={(event) => setSenha(event.nativeEvent.text)}
                                    secureTextEntry={passwordVisible}
                                />
                                <TouchableOpacity onPress={()=> setPasswordVisible(prev=> !prev)}>
                                    {passwordVisible?
                                        <Eye color={colors.zinc[400]} size={20}/>
                                    :
                                        <EyeOff color={colors.zinc[400]} size={20} />
                                    }
                                </TouchableOpacity>
                            </Input>
                            <TouchableOpacity onPress={()=> setModal(true)}>

                                <Text className="text-zinc-400 font-regular ml-2 mb-5">
                                    Esqueceu sua senha ? 
                                </Text>
                                
                            </TouchableOpacity>

                            <Button variant="terceary" onPress={fazerLogin}>
                                <Button.Tittle>
                                    Login
                                </Button.Tittle>
                            </Button>
                        </View> 

                        </>
                    
                    :
                        <RecoverSenhaModal
                            setModal={setModal}
                            validacaoErros={validacaoErros}
                        />
                    }
                    
                    <View className=" absolute bottom-10">
                        <Button variant="secondary" onPress={()=> setStepForm(true)}>
                            <Button.Tittle>
                                Crie sua conta
                            </Button.Tittle>
                        </Button>
                    </View>
                </>
                }

            </View>
        </>
    )
}