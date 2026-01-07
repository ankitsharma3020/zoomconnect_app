import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  Animated,
  Easing,
  Platform,
  TextInput,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const { height, width } = Dimensions.get('window');

// --- THEME COLORS ---
const COLORS = {
  gradColor1: '#1e022eff', 
  gradColor2: '#581C5C',   
  gradColor3: '#934790',   

  cardBg: '#FFFFFF',       
  
  text: '#2D3436',
  textLight: '#A4B0BE',
  success: '#00E096',      
  
  starActive: '#FFA502',
  starInactive: '#DFE4EA',
  optionBorder: '#EAEAEA',
  optionSelectedBg: '#E9F9EE',
  optionSelectedBorder: '#2ED573',
  primary: '#934790',
  white: '#FFFFFF',
};

// --- DATA ---
const DUMMY_DATA = [
  {
    id: 1,
    focus_area: "General Knowledge",
    question: "Who among the following doesn't have the record of playing the most World Cup?",
    type: "multiplechoice",
    options: ["Antonio Carbajal", "Lothar Matthaus", "Franz Beckenbauer", "Rafael Marquez"]
  },
  {
    id: 2,
    focus_area: "Workplace",
    question: "How satisfied are you with the current office ergonomics?",
    type: "rating",
    options: null
  },
  {
    id: 3,
    focus_area: "Tools",
    question: "Which of the following tools do you use on a daily basis?",
    type: "checkbox",
    options: ["Jira", "Slack", "VS Code", "Figma"]
  },
  {
    id: 4,
    focus_area: "Feedback",
    question: "Please share any other suggestions for improvement.",
    type: "text",
    options: null
  }
];

// --- BACKGROUND PATTERN ---
const BackgroundPattern = () => {
  const SHAPE_COLOR = 'rgba(88, 28, 92, 0.5)';
  
  const PlusShape = ({ style }) => (
    <View style={style}>
        <View style={{ position: 'absolute', width: 20, height: 4, backgroundColor: SHAPE_COLOR, borderRadius: 2, top: 8 }} />
        <View style={{ position: 'absolute', width: 4, height: 20, backgroundColor: SHAPE_COLOR, borderRadius: 2, left: 8 }} />
    </View>
  );

  const HollowCircle = ({ style, size = 30 }) => (
    <View style={[{ 
        width: size, height: size, 
        borderRadius: size / 2, 
        borderWidth: 3, 
        borderColor: SHAPE_COLOR 
    }, style]} />
  );

  const Triangle = ({ style }) => (
    <View style={[{
        width: 0, height: 0, 
        backgroundColor: 'transparent', 
        borderStyle: 'solid', 
        borderLeftWidth: 10, borderRightWidth: 10, borderBottomWidth: 20, 
        borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: SHAPE_COLOR,
        transform: [{ rotate: '45deg' }]
    }, style]} />
  );

  const Planet = ({ style }) => (
    <View style={[{ width: 90, height: 130, justifyContent: 'center', alignItems: 'center' }, style]}>
        <View style={{ width: 44, height: 44, borderRadius: 32, backgroundColor: SHAPE_COLOR }} />
        <View style={{ position: 'absolute', width: 76, height: 4, backgroundColor: SHAPE_COLOR, borderRadius: 2, transform: [{ rotate: '-20deg' }] }} />
    </View>
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Planet style={{ position: 'absolute', top: '8%', }} />
        <Triangle style={{ position: 'absolute', top: '4%',  right: '20%', transform: [{rotate: '-10deg'}] }} />
        <PlusShape style={{ position: 'absolute', top: '18%', right: '20%', transform: [{rotate: '15deg'}] }} />
        <Triangle style={{ position: 'absolute', top: '22%', right: '35%', opacity: 0.6 }} />
        <HollowCircle style={{ position: 'absolute', top: '15%', left: '45%' }} size={20} />
        <PlusShape style={{ position: 'absolute', top: '35%', left: '15%' }} />
        <HollowCircle style={{ position: 'absolute', top: '40%', right: '10%' }} size={40} />
        <Triangle style={{ position: 'absolute', top: '32%', right: '55%', transform: [{rotate: '90deg'}] }} />
        <Planet style={{ position: 'absolute', top: '55%', right: -15, transform: [{ scale: 1.3 }] }} />
        <PlusShape style={{ position: 'absolute', top: '50%', left: '30%', transform: [{rotate: '45deg'}] }} />
        <HollowCircle style={{ position: 'absolute', top: '60%', left: '10%' }} size={29} />
        <Triangle style={{ position: 'absolute', top: '75%', left: '20%', transform: [{rotate: '180deg'}] }} />
        <PlusShape style={{ position: 'absolute', top: '83%', right: '25%' }} />
        <HollowCircle style={{ position: 'absolute', top: '85%', right: '5%' }} size={29} />
        <Planet style={{ position: 'absolute', bottom: '5%', left: -5, opacity: 0.7 }} />
    </View>
  );
};

// --- CARD CONTENT COMPONENT ---
// Kept outside to prevent re-renders inside the main component loop
const RenderCardContent = ({ question, answers, handleAnswer, isInteractive = true }) => {
    if (!question) return null;
    const myAnswer = answers[question.id];

    // Helper for Options
    const renderOption = (opt, isSelected, onPress) => (
      <TouchableOpacity 
        key={opt} 
        activeOpacity={0.8} 
        onPress={isInteractive ? onPress : null}
        style={[styles.optionRow, isSelected && styles.optionSelected]}
      >
        <Text style={[styles.optionText, isSelected && { fontWeight: '700' }]}>{opt}</Text>
        <View style={[styles.checkCircle, isSelected && {backgroundColor: COLORS.success, borderColor: COLORS.success}]}>
             {isSelected && <Text style={{color: 'white', fontSize: 12}}>✓</Text>}
        </View>
      </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.cardBg, borderRadius: 24, padding: 24 }}>
            <Text style={styles.focusLabel}>{question.focus_area}</Text>
            {/* Simple Text component without keys ensures stability */}
            <Text style={styles.qText}>{question.question}</Text>
            <View style={styles.divider} />
            
            <View style={{flex: 1}}>
                {question.type === 'multiplechoice' && 
                    <View style={styles.optList}>{question.options.map(opt => renderOption(opt, myAnswer === opt, () => handleAnswer(opt, 'single')))}</View>
                }
                
                {question.type === 'checkbox' && 
                    <View style={styles.optList}>{question.options.map(opt => {
                        const selected = (myAnswer || []).includes(opt);
                        return renderOption(opt, selected, () => handleAnswer(opt, 'multi'));
                    })}</View>
                }
                
                {question.type === 'rating' && 
                    <View style={styles.ratingBox}>
                        <View style={styles.starsRow}>
                            {[1,2,3,4,5].map(star => (
                                <TouchableOpacity 
                                    key={star} 
                                    activeOpacity={0.7}
                                    onPress={isInteractive ? () => handleAnswer(star, 'single') : null}
                                    style={{ padding: 8 }} 
                                >
                                    <Text style={[styles.starText, { color: (myAnswer || 0) >= star ? COLORS.starActive : COLORS.starInactive }]}>★</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.helperText}>{myAnswer ? `${myAnswer} Stars` : 'Tap to rate'}</Text>
                    </View>
                }
                
                {question.type === 'text' && 
                    <TextInput style={styles.textInput} multiline placeholder="Type answer..." 
                        value={myAnswer || ''} editable={isInteractive} onChangeText={t => handleAnswer(t, 'single')}
                    />
                }
            </View>
        </View>
    );
};

// --- CONFIG ---
const CARD_HEIGHT = height * 0.55; 
const CARD_WIDTH = width * 0.85;
const STACK_SCALE = 0.08;
const STACK_OFFSET = 35;
// Tuned duration for smoothness
const ANIMATION_DURATION = 600; 

const SurveyPage = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  
  // Animation lock
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation Values
  const slideAnim = useRef(new Animated.Value(0)).current; 
  const stackAnim = useRef(new Animated.Value(0)).current;

  const totalQuestions = DUMMY_DATA.length;
  const remainingCards = totalQuestions - 1 - currentIndex; 
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  // --- TRANSITION LOGIC ---
  const handleNext = () => {
    if (isAnimating) return;

    // 1. Validate Answer
    const qId = DUMMY_DATA[currentIndex].id;
    const currentAnswer = answers[qId];
    
    let isValid = false;
    if (Array.isArray(currentAnswer)) {
        isValid = currentAnswer.length > 0;
    } else {
        isValid = currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== '';
    }

    if (!isValid) {
        Alert.alert('Required', 'Please select an answer to continue.');
        return;
    }

    if (currentIndex < totalQuestions - 1) {
        setIsAnimating(true);
        
        Animated.parallel([
            // 1. Slide Top Card Away
            Animated.timing(slideAnim, {
                toValue: -width * 1.5,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic), // Smooth curve
            }),
            // 2. Scale Back Card Up
            Animated.timing(stackAnim, {
                toValue: 1, 
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
            }),
        ]).start(() => {
            // 3. Logic: Update Index, then reset animations
            setCurrentIndex(prev => prev + 1);
            
            // Reset animations immediately.
            // Because we changed the key on the main card (see Render), 
            // React mounts a FRESH view at position 0, preventing the "snap back" visual glitch.
            slideAnim.setValue(0);
            stackAnim.setValue(0);
            
            setIsAnimating(false);
        });
    } else {
        setModalVisible(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && !isAnimating) {
        setIsAnimating(true);
        
        // 1. Move card off screen instantly
        slideAnim.setValue(-width * 1.5);
        
        // 2. Update data
        setCurrentIndex(prev => prev - 1);
        
        // 3. Animate back in
        requestAnimationFrame(() => {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500, 
                useNativeDriver: true,
                easing: Easing.out(Easing.back(0.8)), 
            }).start(() => {
                setIsAnimating(false);
            });
        });
    }
  };

  const handleAnswer = (val, type) => {
    const qId = DUMMY_DATA[currentIndex].id;
    if (type === 'multi') {
      const current = answers[qId] || [];
      const newAns = current.includes(val) ? current.filter(i => i !== val) : [...current, val];
      setAnswers(prev => ({ ...prev, [qId]: newAns }));
    } else {
      setAnswers(prev => ({ ...prev, [qId]: val }));
    }
  };

  return (
    <LinearGradient 
        colors={[COLORS.gradColor1, COLORS.gradColor2, COLORS.gradColor3]}
        style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradColor1} />
      <BackgroundPattern />

      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.iconBtn}>
                <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={{width: 44}} /> 
        </View>

        {/* PROGRESS */}
        <View style={styles.progContainer}>
            <View style={[styles.progFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={styles.countContainer}>
            <Text style={styles.headerTitle}>
                {String(currentIndex + 1).padStart(2,'0')} of {String(totalQuestions).padStart(2,'0')}
            </Text>
        </View>

        {/* --- CARD STACK --- */}
        <View style={styles.pileWrapper}>
            
            {/* 1. NEXT CARD (Background) 
               - Permanently sits behind top card.
               - ONLY hidden if we are on the very last question.
            */}
            {currentIndex < totalQuestions - 1 && (
                <Animated.View 
                    pointerEvents="none" 
                    style={[styles.cardBase, {
                        zIndex: 1, 
                        transform: [
                            { scale: stackAnim.interpolate({inputRange:[0, 1], outputRange: [1 - STACK_SCALE, 1]}) },
                            { translateY: stackAnim.interpolate({inputRange:[0, 1], outputRange: [STACK_OFFSET, 0]}) }
                        ]
                }]}>
                    <RenderCardContent 
                        question={DUMMY_DATA[currentIndex + 1]} 
                        answers={answers} 
                        handleAnswer={handleAnswer} 
                        isInteractive={false} 
                    />
                </Animated.View>
            )}

            {/* 2. CURRENT CARD (Foreground) 
               - The `key={currentIndex}` is the MAGIC FIX.
               - It forces React to create a NEW component when index changes.
               - This prevents the "old card snaps back" glitch.
            */}
            <Animated.View 
                key={currentIndex} // <--- THIS IS THE FIX FOR GLITCHING
                style={[styles.cardBase, {
                    zIndex: 10,
                    transform: [
                        { translateX: slideAnim },
                        { rotate: slideAnim.interpolate({inputRange: [-width, 0], outputRange: ['-5deg', '0deg']})}
                    ]
            }]}>
                <RenderCardContent 
                    question={DUMMY_DATA[currentIndex]} 
                    answers={answers} 
                    handleAnswer={handleAnswer} 
                    isInteractive={true} 
                />
            </Animated.View>

            {/* 3. DECORATIVE PILE (Bottom) 
               - Purely visual, sits at bottom.
            */}
            {remainingCards > 1 && (
                <Animated.View style={[styles.cardBase, styles.cardPile, {
                    zIndex: 0,
                    opacity: 0.5,
                    transform: [
                        { scale: 1 - STACK_SCALE*2 },
                        { translateY: STACK_OFFSET*2 }
                    ]
                }]} />
            )}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
            <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0 || isAnimating} style={{padding: 10}}>
                <Text style={[styles.prevTxt, {opacity: currentIndex === 0 ? 0 : 1}]}>Previous</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} disabled={isAnimating} activeOpacity={0.8}>
                <Text style={styles.nextBtnTxt}>
                    {currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
                </Text>
                <View style={styles.arrowContainer}>
                    <Text style={styles.arrowText}>→</Text>
                </View>
            </TouchableOpacity>
        </View>

      </SafeAreaView>

      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBg}>
            <View style={styles.modalBox}>
                <View style={styles.chkCircle}><Text style={{fontSize: 24, color: COLORS.success}}>✓</Text></View>
                <Text style={styles.modalTitle}>Survey Completed!</Text>
                <TouchableOpacity style={styles.modalBtn} onPress={() => { setModalVisible(false); navigation?.goBack(); }}>
                    <Text style={{color:'white'}}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default SurveyPage;

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  topBar: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingVertical: 15, marginTop: Platform.OS === 'android' ? 30 : 0 
  },
  
  iconBtn: { 
    width: 44, height: 44, borderRadius: 12, backgroundColor:'rgba(255,255,255,0.2)', 
    alignItems:'center', justifyContent:'center' 
  },
  backArrow: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: -9 },

  progContainer: { 
    height: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    marginHorizontal: 20, borderRadius: 5, marginTop: 10 
  },
  progFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 5 },

  countContainer: { paddingHorizontal: 20, marginTop: 75, alignItems: 'center' },
  headerTitle: { 
    color: COLORS.white, fontSize: 20, fontWeight: '800', letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2,
  },

  pileWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 0 },
  cardBase: {
    position: 'absolute', width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 24, 
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 5,
  },
  cardPile: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F0F0F0' },
  
  focusLabel: { color: '#999', fontSize: 12, textTransform: 'uppercase', fontWeight:'600', marginBottom: 8 },
  qText: { color: COLORS.text, fontSize: 20, fontWeight: 'bold', marginBottom: 15, lineHeight: 28 },
  divider: { height: 1, backgroundColor: '#EEE', marginBottom: 20 },
  
  optList: { gap: 12 },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: COLORS.optionBorder, backgroundColor: '#FFFFFF' },
  optionSelected: { backgroundColor: COLORS.optionSelectedBg, borderColor: COLORS.optionSelectedBorder },
  optionText: { color: COLORS.text, fontSize: 15, flex: 1 },
  checkCircle: { width: 20, height: 20, borderRadius: 10, borderWidth:1, borderColor: '#DDD', alignItems:'center', justifyContent:'center' },
  
  ratingBox: { flex: 1, alignItems: 'center', justifyContent:'center' },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  starText: { fontSize: 36 },
  helperText: { color: '#999' },
  textInput: { backgroundColor: '#F8F8F8', flex: 1, borderRadius: 12, padding: 15, textAlignVertical:'top' },

  footer: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 25, paddingBottom: 50, 
  },
  prevTxt: { color: COLORS.textLight, fontWeight: '600' },
  
  nextBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.success, paddingHorizontal: 32, paddingVertical: 14, 
    borderRadius: 30, minWidth: 140, 
  },
  nextBtnTxt: { color: COLORS.white, fontWeight: 'bold', fontSize: 16, marginRight: 4 },
  
  arrowContainer: {
    width: 20, height: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 6,
    paddingBottom: Platform.OS === 'android' ? 4 : 0, 
  },
  arrowText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 30, alignItems: 'center' },
  chkCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F5E9', alignItems:'center', justifyContent:'center', marginBottom: 15},
  modalTitle: { fontSize: 20, fontWeight:'bold', marginBottom: 20 },
  modalBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20 }
});