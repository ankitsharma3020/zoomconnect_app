import React, { useEffect, useRef, useState } from 'react';
import { View, BackHandler, SafeAreaView, Linking, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { useNavigation } from '@react-navigation/native';
import { baseUrl, DOMAIN_URI } from '../../redux/apiSlice';
import Header from '../../component/header';
import Loader from '../../component/Loader';

const WebRendering = ({ route }) => {
    const { url, label } = route.params;
    const [loading, setLoading] = useState(true);
    const webViewRef = useRef(null);
    const navigation = useNavigation();

    const handleBackButtonPress = () => {
        if (webViewRef.current && webViewRef.current.canGoBack) {
            webViewRef.current.goBack();
            return true;
        } else {
            navigation.goBack();
            return true;
        }
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackButtonPress
        );

        return () => backHandler.remove();
    }, []);

    const onShouldStartLoadWithRequest = (event) => {
        const { url } = event;
    
        if (url.includes('.pdf') || url.includes('.jpg') || url.includes('.png') || url.includes('.docx') || url.includes('.xlsx')) {
            Linking.openURL(url);
            return false;
        }
    
        return true;
    };
    
    const onMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.downloadUrl) {
            Linking.openURL(data.downloadUrl);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                showBack={true} 
                onBack={() => navigation.goBack()} 
                title={label}
            />
            
            <View style={styles.webContainer}>
                <WebView
                    ref={webViewRef}
                    onLoadEnd={() => setLoading(false)}
                    source={{ uri: `${DOMAIN_URI}/${url}` }}
                    onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                    onNavigationStateChange={(navState) => {
                        // Store it in a ref variable if you need to access it outside, 
                        // but updating ref.current.canGoBack directly works for your backhandler logic
                        webViewRef.current.canGoBack = navState.canGoBack;
                    }}
                    onMessage={onMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.warn('WebView error: ', nativeEvent);
                        setLoading(false); 
                    }}
                    onLoad={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.log('WebView loaded: ', nativeEvent);
                    }}
                />

                {/* --- FULL SCREEN LOADER OVERLAY --- */}
                {loading && (
                    <View style={styles.loaderOverlay}>
                        <Loader />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default WebRendering;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webContainer: {
        flex: 1, 
        position: 'relative', // Ensures absolute children are bound to this area
    },
   loaderOverlay: {
        ...StyleSheet.absoluteFillObject, 
        backgroundColor: '#FFFFFF',       
        // REMOVED: justifyContent and alignItems
        zIndex: 9999,                     
        elevation: 10,                    
    }
});