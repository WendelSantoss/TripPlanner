import { RootStackParamList } from "@/app"; 

//Type sendo compartilhado globalmente para toda aplicação
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
