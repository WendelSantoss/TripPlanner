import auth from "@/utils/firebaseConfig";
import {
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail,
    updateProfile,
    signOut
} from "firebase/auth"

export type UserFormat= {
    email: string,
    senha: string,
}

export default function useAuthentication(){

    const createCount = async ({email, senha}: UserFormat)=>{
        try{
            const signUpResponse=  await createUserWithEmailAndPassword(auth, email, senha);
            console.log(signUpResponse)
            if(signUpResponse){
                console.log("entrou aqui")
     
            }
            return signUpResponse
        }catch(error: any){
            console.log(error)
            throw error; 
        }
    }
    
    const handleLogin = async ({ email, senha }: UserFormat)=>{
        try {
            const signInResponse = await signInWithEmailAndPassword(auth, email, senha);
            console.log(signInResponse);
            return signInResponse;

        }catch(error: any){
            console.log("Console Hook>", error.message);
            throw error; 
           
        }
    }
    // corrigir warming o pq n ta entrando o toast menssager.
    const handleResetPassword = async (email: string)=>{
        try{
            const resetPassword=  await sendPasswordResetEmail(auth, email)
            console.log("Console Hook>",resetPassword);
            return resetPassword

        }catch(error: any){
            
            console.log("Console Hook>", error.message);
            throw error; 
        }
    }
    
    const handleLogout = async ()=>{
        await signOut(auth)
    } 

    const handleUpdateProfile = async (user: any, name: string)=>{
         try{
            const responseName = await updateProfile(user, {displayName: `${name}`}) 
            console.log(responseName)
            return responseName
         }catch(error: any){
            console.log(error.message)
         }
    }

    return {
        createCount,
        handleLogin,
        handleResetPassword,
        handleLogout,
        handleUpdateProfile
    }
}