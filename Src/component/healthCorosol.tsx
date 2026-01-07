import React, { useState, useRef } from 'react';
import { 
  View, 
  FlatList, 
  Image, 
  StyleSheet, 
  Dimensions, 
  Text 
} from 'react-native';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 1. Define configuration constants
const ITEM_SPACING = wp(2.5); // approx 10

const HealthCarousel = () => {
  // Mock Data
  const data = [
    { id: '1', img: require('../../assets/carebanner.png') }, 
    { id: '2', img: require('../../assets/carebanner.png') }, 
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const isSingleItem = data.length === 1;

  // 2. Calculate Item Width
  // If 1 item: 100% width. If >1: 90% width (wp(90)).
  const itemWidth = isSingleItem ? SCREEN_WIDTH : wp(90);

  // Handle scroll events to update bubbles
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / itemWidth);
    setActiveIndex(index);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[
        styles.cardContainer, 
        { width: itemWidth, marginHorizontal: isSingleItem ? 0 : ITEM_SPACING / 2 }
      ]}>
        <Image 
          source={item.img} 
          style={styles.bannerImage} 
          resizeMode="contain" 
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
        <Text style={styles.headerTitle}>Personal Health Benefit</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        
        // 3. Conditional Snapping & Paging
        pagingEnabled={isSingleItem} 
        snapToInterval={isSingleItem ? null : itemWidth + ITEM_SPACING} 
        decelerationRate="fast"
        
        // 4. Centering Logic
        contentContainerStyle={{
          paddingHorizontal: isSingleItem ? 0 : (SCREEN_WIDTH - itemWidth) / 2 - (ITEM_SPACING / 2)
        }}
        
        onScroll={handleScroll}
        scrollEventThrottle={16} 
      />

      {/* 5. Conditional Bubble/Dots Rendering */}
      {!isSingleItem && (
        <View style={styles.paginationContainer}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(3.5), // approx 20
  },
  headerTitle: {
    fontSize: hp(2), // approx 20
    fontFamily: 'Montserrat-Bold', // Font
    color: '#1F2937',
    marginLeft: wp(5), // approx 20
  },
  cardContainer: {
    height: hp(16.5), // approx 180
    borderRadius: wp(3), // approx 12
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(1.2), // approx 10
  },
  dot: {
    height: wp(2), // approx 8
    width: wp(2), // approx 8
    borderRadius: wp(1), // approx 4
    marginHorizontal: wp(1), // approx 4
  },
  activeDot: {
    backgroundColor: '#007BFF', 
    width: wp(5), // approx 20
  },
  inactiveDot: {
    backgroundColor: '#C4C4C4', 
  },
});

export default HealthCarousel;