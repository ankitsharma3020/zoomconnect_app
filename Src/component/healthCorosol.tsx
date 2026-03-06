import React, { useState } from 'react';
import { 
  View, 
  FlatList, 
  Image, 
  StyleSheet, 
  Dimensions, 
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';
import { wp, hp } from '../utilites/Dimension'; 

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_SPACING = wp(2.5);

const HealthCarousel = ({ bannerData }) => {
  const data = bannerData || [];
  
  const [activeIndex, setActiveIndex] = useState(0);
  const isSingleItem = data.length === 1;
  const itemWidth = isSingleItem ? SCREEN_WIDTH : wp(90);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / itemWidth);
    setActiveIndex(index);
  };

  const handleBannerPress = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => handleBannerPress(item.banner_link)}
        style={[
          styles.cardContainer, 
          { width: itemWidth, marginHorizontal: isSingleItem ? 0 : ITEM_SPACING / 2 }
        ]}
      >
        {/* Background Image */}
        <Image 
          source={{ uri: item.banner_image }} 
          style={styles.bannerImage} 
          resizeMode="cover" 
        />
        
        {/* Dark Overlay for Text Readability */}
        <View style={styles.overlay}>
          <Text style={styles.bannerTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          {/* Visual Button */}
          {item.button_text ? (
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{item.button_text}</Text>
            </View>
          ) : null}
        </View>

      </TouchableOpacity>
    );
  };

  if (data.length === 0) return null;

  return (
    <View style={styles.container}>
        <Text style={styles.headerTitle}>Personal Health Benefit</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        pagingEnabled={isSingleItem} 
        snapToInterval={isSingleItem ? null : itemWidth + ITEM_SPACING} 
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: isSingleItem ? 0 : (SCREEN_WIDTH - itemWidth) / 2 - (ITEM_SPACING / 2)
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16} 
      />

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
    marginVertical: hp(3.5), 
  },
  headerTitle: {
    fontSize: hp(2),
    fontFamily: 'Montserrat-Bold', 
    color: '#1F2937',
    marginLeft: wp(5), 
    marginBottom: hp(1.5), 
  },
  cardContainer: {
    height: hp(16.5), 
    borderRadius: wp(3), 
    overflow: 'hidden',
    backgroundColor: '#f3f4f6', 
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Required to let the overlay sit on top
  },
  // --- New Overlay Styles ---
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark tint so white text pops
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: wp(5),
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: hp(2.2),
    fontFamily: 'Montserrat-Bold',
    marginBottom: hp(1.5),
    width: '80%', // Prevents text from stretching edge-to-edge
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionButton: {
    backgroundColor: '#007BFF', // ZoomConnect Blue
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    borderRadius: wp(1.5),
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: hp(1.4),
    fontFamily: 'Montserrat-SemiBold',
  },
  // --------------------------
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(1.2), 
  },
  dot: {
    height: wp(2), 
    width: wp(2), 
    borderRadius: wp(1), 
    marginHorizontal: wp(1), 
  },
  activeDot: {
    backgroundColor: '#007BFF', 
    width: wp(5), 
  },
  inactiveDot: {
    backgroundColor: '#C4C4C4', 
  },
});

export default HealthCarousel;