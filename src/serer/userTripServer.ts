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
    end_at: string, 
    emails_invitation: string[],
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

    const createTrip= async (dadosViagem: TripFormato)=>{
        try{
            const {data} = await API.post(`/trips`, dadosViagem)
            return data
        }catch(error){
            throw error
        }
    }
    return {
        getTripsByID,
        createTrip
    }
}