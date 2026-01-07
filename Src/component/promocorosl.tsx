// PromoCarousel.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.round(width * 0.38);
const CARD_SPACING = 12;

const promos = [
  {
    id: 'p1',
    provider: 'HEALTHIANS',
    title: 'Flat 50% Off',
    subtitle: 'Full body check up at home collection',
    logo: 'https://i.pravatar.cc/80?img=32', // replace with your logos
  },
  {
    id: 'p2',
    provider: 'TATA1MG',
    title: '20% Off*',
    subtitle: 'on prescribed medicines',
    logo: 'https://i.pravatar.cc/80?img=12',
  },
  {
    id: 'p3',
    provider: 'DOCPLUS',
    title: 'Free Teleconsult',
    subtitle: '1 free consult every month',
    logo: 'https://i.pravatar.cc/80?img=28',
  },
  {
    id: 'p4',
    provider: 'WELLNESS',
    title: '₹200 OFF',
    subtitle: 'on wellness packages',
    logo: 'https://i.pravatar.cc/80?img=18',
  },
];

export default function PromoCarousel() {
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const onMomentum = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (CARD_WIDTH + CARD_SPACING));
    setActiveIdx(idx);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}            // we use snapping via contentOffset math
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 16 }}
          onMomentumScrollEnd={onMomentum}
        >
          {promos.map((p, i) => (
            <TouchableOpacity activeOpacity={0.9} key={p.id} style={[styles.card, { marginRight: i === promos.length - 1 ? 0 : CARD_SPACING }]}>
              <View style={styles.cardTop}>
                <View style={styles.logoWrap}>
                  <Image source={{ uri: p.logo }} style={styles.logo} />
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.provider}>{p.provider}</Text>
                <Text style={styles.title}>{p.title}</Text>
                <Text numberOfLines={2} style={styles.subtitle}>{p.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dots}>
          {promos.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIdx ? styles.dotActive : null]} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { width: '100%' },
  container: {
    paddingVertical: 8,
    marginTop: 12,
    height: 250,
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EFEFF1',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    justifyContent: 'space-between',
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 6,
  },

  cardBody: {
    paddingTop: 6,
  },
  provider: {
    fontSize: 11,
    color: '#9AA0A6',
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  dots: {
    flexDirection: 'row',
    marginTop: 12,
    alignSelf:'flex-start',
    marginLeft:26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: '#E6E6E6',
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: '#4B2A7C', // darker purple-like
    width: 20,
    borderRadius: 6,
  },
});
