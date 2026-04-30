import React, { useEffect, useRef, useState } from 'react';
import { View, BackHandler, Linking, StyleSheet, Animated } from 'react-native';
import { WebView } from 'react-native-webview';

// --> Imported useSafeAreaInsets to handle the bottom cutoff
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '../../component/header';
import { DOMAIN_URI } from '../../redux/apiSlice';

// --- Custom Shimmer Skeleton Component ---
const WebSkeletonShimmer = () => {
    const opacityAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
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
            <View style={styles.skeletonHeader} />
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonLineShort} />
            <View style={styles.skeletonBox} />
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonLineShort} />
        </Animated.View>
    );
};

const WebRendering = ({ route, navigation }) => {
    const { url, label } = route.params;
    const insets = useSafeAreaInsets(); // <-- Get safe area bounds
    
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

        // Handle mailto links
        if (url.startsWith('mailto:')) {
            Linking.openURL(url);
            return false;
        }

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
        // <-- Added paddingBottom: insets.bottom so the webview doesn't hide behind system bars
        <View style={{ flex: 1, backgroundColor: '#fff', paddingBottom: insets.bottom }}>
            <Header
                showBack={true} 
                useCloseIcon={true} // <-- Pass true to show the cross icon
                onBack={() => navigation.goBack()} 
                title={label}
            />
            
            <WebView
                ref={webViewRef}
                source={{ uri: `${DOMAIN_URI}/${url}` }}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                onNavigationStateChange={(navState) => {
                    if (webViewRef.current) {
                        webViewRef.current.canGoBack = navState.canGoBack;
                    }
                }}
                onMessage={onMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                
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

export default WebRendering;