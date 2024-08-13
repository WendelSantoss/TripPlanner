import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from "./loginScreen";
import AgendeTrip from "./agendeTrip";
import HomePage from './homePage';

// Tipagem para TS reconhecer os parametros e routes como string
// nas props passadas em cada method do navigation
export type RootStackParamList = {
    Login: undefined;
    AgendeTrip: undefined;
    HomePage: undefined;
};

const Stack= createNativeStackNavigator<RootStackParamList>();

export default function Index (){

    return(
          
                <Stack.Navigator
                    initialRouteName="Login"
                    screenOptions={{ headerShown: false }}
                >
                 
                    <Stack.Screen
                        name="Login"
                        component={Login}
                    />
                    
                    <Stack.Screen
                        name="AgendeTrip"
                        component={AgendeTrip}
                    />

                    <Stack.Screen
                        name="HomePage"
                        component={HomePage}
                    />

                </Stack.Navigator>
        
         
    )
}