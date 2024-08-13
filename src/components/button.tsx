import { useContext, createContext } from "react";
import { 
    ActivityIndicator,
    Text, 
    TextProps, 
    TouchableOpacity, 
    TouchableOpacityProps, 
    View 
} from "react-native";
import { clsx } from "clsx";

type variants = "primary" | "secondary" | "terceary"

type buttonProps = TouchableOpacityProps & {
    variant? : variants
    isLoading? : boolean
}

const ThemeContext = createContext<{variant?: variants}>({});

function Button({children, isLoading, variant = "primary", ...rest}: buttonProps){
    return(
        <TouchableOpacity activeOpacity={0.7} disabled={isLoading} {...rest} >
            <View className={clsx("w-full h-11 flex-row justify-center items-center rounded-lg gap-2",
            {
                "bg-lime-300 ": variant === "primary",
                "bg-zinc-800": variant === "secondary",
                "bg-lime-300": variant === "terceary",
            })}>
                <ThemeContext.Provider value={{variant}}>

                    {isLoading? <ActivityIndicator className="text-lime-950"/> : children}
                
                </ThemeContext.Provider>
            </View>
        </TouchableOpacity>
    )
}

function Tittle({children}: TextProps){
    const {variant}= useContext(ThemeContext);
    return <Text className={clsx( "text-base font-semibold",
        {
            "text-lime-950": variant === "primary",
            "text-zinc-200": variant === "secondary",
            "text-lime-950 font-bold text-lg ": variant === "terceary",
        })}>
        {children}
    </Text>
}

Button.Tittle= Tittle

export {Button}
