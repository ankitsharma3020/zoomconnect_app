import React, { useEffect, useRef, useState } from 'react';
import { View, BackHandler, SafeAreaView, Linking, StyleSheet, Animated } from 'react-native';
import { WebView } from 'react-native-webview';

import Header from '../../component/header';

// --- Custom Shimmer Skeleton Component ---
const WebSkeletonShimmer = () => {
    const opacityAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        // Continuous pulsing animation loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 0.8,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [opacityAnim]);

    return (
        <Animated.View style={[styles.skeletonContainer, { opacity: opacityAnim }]}>
            {/* Mock Header */}
            <View style={styles.skeletonHeader} />
            
            {/* Mock Title */}
            <View style={styles.skeletonTitle} />
            
            {/* Mock Text Lines */}
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonLineShort} />
            
            {/* Mock Image/Banner Box */}
            <View style={styles.skeletonBox} />
            
            {/* More Mock Text Lines */}
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonLineShort} />
        </Animated.View>
    );
};

const WellnesswebRendering = ({ route, navigation }) => {
    const { url, label } = route.params;
    
    // Initial load ke liye true rahega
    const [loading, setLoading] = useState(true);
    const webViewRef = useRef(null);

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
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header
                showBack={true} 
                onBack={() => navigation.goBack()} 
                title={label}
            />
            
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                onNavigationStateChange={(navState) => {
                    if (webViewRef.current) {
                        webViewRef.current.canGoBack = navState.canGoBack;
                    }
                }}
                onMessage={onMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                
                // YAHAN FIX KIYA HAI: onLoadStart ko hata diya gaya hai.
                
                // Pehli baar load finish hone ke baad loader hamesha ke liye hide ho jayega
                onLoadEnd={() => setLoading(false)}
                
                onError={(syntheticEvent) => {
                    console.warn('WebView error: ', syntheticEvent.nativeEvent);
                    setLoading(false);
                }}
            />

            {/* Shimmer Effect Overlay */}
            {loading && (
                <View style={[styles.loaderOverlay, { marginTop: 60 }]}>
                    <WebSkeletonShimmer />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FFFFFF',
        zIndex: 10,
    },
    // Skeleton Styles
    skeletonContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 10,
    },
    skeletonHeader: {
        height: 50,
        width: '100%',
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
        marginBottom: 30,
    },
    skeletonTitle: {
        height: 25,
        width: '60%',
        backgroundColor: '#E0E0E0',
        borderRadius: 6,
        marginBottom: 15,
    },
    skeletonLine: {
        height: 15,
        width: '100%',
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 10,
    },
    skeletonLineShort: {
        height: 15,
        width: '80%',
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 25,
    },
    skeletonBox: {
        height: 180,
        width: '100%',
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
        marginBottom: 25,
    },
});

export default WellnesswebRendering;