import { API } from "./api";

export type TripsDetails= {
    id_viajem: string,
    destination: string,
    starts_at: string,
    end_at: string, 
    is_confirmed: boolean
}

export type TripFormato= {
    destination: string,
    starts_at: string,
    ends_at: string, 
    emails_to_invite: string[],
    owner_name: string,
    owner_email: string
}

export default function userTrips(){

    const getTripsByID= async (id:string)=> {
        try{
            const {data} = await API.get<{trip: TripsDetails}>(`/trips/${id}`)
            return data
        }catch(error){
            throw error
        }
    }

    const getTripsbyEmail= async (email: String)=> {
        try{
            const {data} = await API.get(`/trips`,{
                params: {
                    email: email, // Passa o email como query parameter
                },
            });
            
            return data
        }catch(error: any){
            console.log("Error na chamada:",error.message)
            return error.response.data.message
        }
    }

    const createTrip= async ( {
        destination,
        starts_at,
        ends_at, 
        emails_to_invite,
        owner_name,
        owner_email}: TripFormato)=>{
  
        try{
            const {data} = await API.post(`/trips`, {
                destination,
                starts_at,
                ends_at, 
                emails_to_invite,
                owner_name,
                owner_email
            })
          
            return data
        }catch(error: any){
            console.log("Console aqui:",error.message)
            return error
        }
    }
    return {
        getTripsByID,
        createTrip,
        getTripsbyEmail
    }
}