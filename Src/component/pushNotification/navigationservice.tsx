import { CommonActions } from "@react-navigation/native";

let navigator;

function setToplevelNavigation(navigationRef){
    navigator=navigationRef
}

function navigate(routeName,params){
    navigator.dispatch(
        CommonActions.navigate({
            name:routeName,
            params,
        })
    )
}

function replace(routeName,params){
    navigator.dispatch(
        CommonActions.replace({
            name:routeName,
            params,
        })
    )
}

export default {setToplevelNavigation,navigate,replace}