import { Text, View } from "react-native";
import { useState } from "react";

import { Input } from "./input";
import { Button } from "./button";
import useAuthentication from "@/server/userAuthentication";
import { notifications } from "./notifications";

type recoverSenhaModal = {
  setModal: (visible: boolean) => void,
  validacaoErros: (message: string) => void,

};

export function RecoverSenhaModal({ setModal, validacaoErros }: recoverSenhaModal) {
  const [recoverEmail, setRecoverEmail] = useState("");

  const { handleResetPassword } = useAuthentication();


  const updateSenha = async () => {
    try{
      const response = await handleResetPassword(recoverEmail);
      console.log("response update", response);
      if(response == undefined){
        const type = "success"
        const tittle= "Email de recuperação enviado"
        const message= "Foi enviado para seu email o link de recuperação da senha."
        notifications({type, tittle, message })
      }

    }catch(error: any){
      console.log("Console recover>", error.message);
      validacaoErros(error.message);
    }
  };

  return (
      
        <View className=" bg-zinc-900 px-2 py-9 rounded-lg items-center gap-4">
          <View className="px-1">
          <Text className= " text-zinc-100 text-xl mb-4">
            Digite o seu email cadastrado, para que possamos enviar a recuperação de senha:
          </Text>
            <Input variant="secondary">
                <Input.Field
                placeholder="Digite seu email"
                value={recoverEmail}
                onChange={(event) => setRecoverEmail(event.nativeEvent.text)}
                />
            </Input>
          </View>
     

          <View className=" gap-3">
            <Button variant="terceary" onPress={updateSenha}>
                <Button.Tittle >
                    Enviar
                </Button.Tittle>
            </Button>
            <Button variant="secondary" onPress={()=> setModal(false)}>
                <Button.Tittle >
                    Voltar
                </Button.Tittle>
            </Button>
          </View>
        
        </View>
 
  );
}
