import { Text, Modal, View } from "react-native";
import { useState } from "react";

import { Input } from "./input";
import { Button } from "./button";
import useAuthentication from "@/server/userAuthentication";
import { notifications } from "./notifications";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "@/server/userContext";

type ModalCreateCount = {
  setStepForm: (visible: boolean) => void,
  validacaoErros: (message: string) => void,
};

export function CreateCount({ setStepForm, validacaoErros}: ModalCreateCount) {
    const [email, setEmail]= useState("")
    const [senha, setSenha]= useState("")
    const [reSenha, setReSenha]= useState("")
    const [name, setName]= useState("")
    const [modalName, setModalName]= useState(false)
    
    const { createCount, handleUpdateProfile }= useAuthentication();
    const { user, setUser } = useUserContext();

    const navigation = useNavigation()

  const handleCreateCount = async () => {
    if(senha != reSenha){      
        const type = "error"
        const tittle= "As duas senhas não conferem"
        const message= "As duas senhas devem ser iguais para criação da conta, cheque seus dados e tente novamente."
        notifications({type, tittle, message })

    }else{
        try{
            const response = await createCount({email, senha})
            console.log("response update", response.user);
            if(response.user != null){
                setUser(response.user)
                setModalName(true)   
            }
            
        }catch(error: any){
            console.log("Console recover>", error.message);
            validacaoErros(error.message);
        }
    }
  };

  const goNavigation = async ()=>{
    if(name == "" ){      
        const type = "error"
        const tittle= "Por favor insira seu nome"
        const message= "Insira um nome para poder prosseguir com a criação da conta."
        notifications({type, tittle, message })
    }else{
        try{
            const response = await handleUpdateProfile(user, name)
            console.log("Name check:",  user.displayName)
            handleUpdateProfile
            const type = "success"
            const tittle= "Conta criada com sucesso"
            const message= "Seja bem vindo, volte e efetue o login."
            notifications({type, tittle, message })
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomePage' }],
              })

        }catch(error: any){
            console.log("Console recover>", error.message);
            validacaoErros(error.message);
        }
    }
  }

  return (
      
    <View className=" bg-zinc-900 gap-3 rounded-xl py-6 px-2">

        {modalName?
            <>        
            <Input variant="secondary">
                <Input.Field
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={(event) => setName(event.nativeEvent.text)}
                />
            </Input>

            <View className=" mt-4 px-1 gap-4">

                <Button variant="terceary" onPress={goNavigation}>
                <Button.Tittle>
                    Criar Conta
                </Button.Tittle>
                </Button>
                
            </View>
            </>   
        :
            <>
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

                    />
                </Input>
                <Input variant="secondary">
                    <Input.Field 
                        placeholder="Confirme sua senha"
                        value={reSenha}
                        onChange={(event) => setReSenha(event.nativeEvent.text)}

                    />
                </Input>

                <View className=" mt-4 px-1 gap-4">

                    <Button variant="terceary" onPress={handleCreateCount}>
                        <Button.Tittle>
                           Avançar
                        </Button.Tittle>
                    </Button>
                    <Button variant="secondary" onPress={()=> setStepForm(false)}>
                        <Button.Tittle>
                            Voltar
                        </Button.Tittle>
                    </Button>
                </View>
            </>
        }
    </View> 

  );
}
