import React from 'react';
import { View, StyleSheet, FlatList, StatusBar, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../component/header';
import ClaimCard from '../component/claimscard';
import { wp, hp } from '../utilites/Dimension';
import Submittedclaimscard from '../component/Submittedclaimscard';

const HEADER_HEIGHT = Platform.OS === 'ios' ? hp(14) : hp(13);

const ClaimListScreen = ({ route, navigation }) => {
  // Ye data View More button se yahan pass hoga
  const { type, data } = route.params;

  return (
    <View style={styles.mainContainer}>
      <LinearGradient colors={['#F6DCC5', '#f3f3f3']} style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* FIX: Header ko absolute banaya taaki cards iske peeche scroll ho sakein */}
        <View style={styles.fixedHeaderWrapper}>
          <Header showBack={true} onBack={() => navigation.goBack()} title={`${type} Claims`} />
        </View>
        
        <View style={styles.listContainer}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            renderItem={({ item }) => (

                type === 'Submitted'? (
                  <Submittedclaimscard
                    item={item}
                    onViewDetails={() => console.log('Details', item.id)}
                    isSubmitted={type === 'Submitted'} 
                    onDownload={() => console.log('Download')}
                  />
                ) : (
                  <ClaimCard
                    item={item}
                    // FIX: Type check karke naye card ki theme dynamic kar di
                    isSubmitted={type === 'Submitted'} 
                    onViewDetails={() => console.log('Details', item.id)}
                    onDownload={() => console.log('Download')}
                  />
                )
              )
              }
            
            // FIX: Padding top lagaya taaki pehla card header ke neeche na chhupe
            contentContainerStyle={[styles.flatListContent, { paddingTop: HEADER_HEIGHT + hp(2) }]}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F1F5F9' },
  container: { flex: 1 },
  
  fixedHeaderWrapper: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    zIndex: 100, 
    elevation: 10 
  },
  
  listContainer: {
    flex: 1,
    // FIX: marginTop hata diya taaki list poori screen par faile
  },
  
  flatListContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(5),
  }
});

export default ClaimListScreen;