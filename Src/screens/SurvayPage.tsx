import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
  ScrollView
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
// Note: Keeping your spelling 'useSubmitSurvayMutation' as per your import
import { useGetsurvayQuestionMutation, useSubmitSurvayMutation } from '../redux/service/user/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { fetchSurveys } from './Epicfiles/MainEpic';

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

// --- CONFIG ---
const CARD_HEIGHT = height * 0.6; 
const CARD_WIDTH = width * 0.85;

// --- BACKGROUND PATTERN ---
const BackgroundPattern = () => {
  const SHAPE_COLOR = 'rgba(88, 28, 92, 0.5)';
  const PlusShape = ({ style }) => (
    <View style={style}><View style={{ position: 'absolute', width: 20, height: 4, backgroundColor: SHAPE_COLOR, borderRadius: 2, top: 8 }} /><View style={{ position: 'absolute', width: 4, height: 20, backgroundColor: SHAPE_COLOR, borderRadius: 2, left: 8 }} /></View>
  );
  const HollowCircle = ({ style, size = 30 }) => (
    <View style={[{ width: size, height: size, borderRadius: size / 2, borderWidth: 3, borderColor: SHAPE_COLOR }, style]} />
  );
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <PlusShape style={{ position: 'absolute', top: '18%', right: '20%', transform: [{rotate: '15deg'}] }} />
        <HollowCircle style={{ position: 'absolute', top: '15%', left: '45%' }} size={20} />
        <HollowCircle style={{ position: 'absolute', top: '85%', right: '5%' }} size={29} />
    </View>
  );
};

// --- CARD CONTENT COMPONENT ---
const RenderCardContent = ({ question, answers, handleAnswer, isInteractive = true }) => {
    if (!question) return null;
    const myAnswer = answers[question.id];

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
        <View style={styles.cardInner}>
            <Text style={styles.focusLabel}>{question.focus_area}</Text>
            <Text style={styles.qText}>{question.question}</Text>
            <View style={styles.divider} />
            
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
                {question.type === 'multiplechoice' && question.options && 
                    <View style={styles.optList}>
                        {question.options.map(opt => renderOption(opt, myAnswer === opt, () => handleAnswer(opt, 'single')))}
                    </View>
                }
                {question.type === 'checkbox' && question.options && 
                    <View style={styles.optList}>
                        {question.options.map(opt => {
                            // Ensure myAnswer is an array for includes check
                            const selected = (myAnswer || []).includes(opt);
                            return renderOption(opt, selected, () => handleAnswer(opt, 'multi'));
                        })}
                    </View>
                }
                {question.type === 'rating' && 
                    <View style={styles.ratingBox}>
                        <View style={styles.starsRow}>
                            {[1,2,3,4,5].map(star => (
                                <TouchableOpacity key={star} activeOpacity={0.7} onPress={isInteractive ? () => handleAnswer(star, 'single') : null} style={{ padding: 8 }}>
                                    <Text style={[styles.starText, { color: (myAnswer || 0) >= star ? COLORS.starActive : COLORS.starInactive }]}>★</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.helperText}>{myAnswer ? `${myAnswer} Stars` : 'Tap to rate'}</Text>
                    </View>
                }
                {question.type === 'text' && 
                    <TextInput style={styles.textInput} multiline placeholder="Type your answer here..." placeholderTextColor="#999" value={myAnswer || ''} editable={isInteractive} onChangeText={t => handleAnswer(t, 'single')} />
                }
            </ScrollView>
        </View>
    );
};

// --- MAIN SCREEN ---
const SurveyPage = ({ navigation, route }) => {
  const surveyId = route?.params?.surveyId;
  const surveyData = route?.params?.surveyData;
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Stores { questionId: value }
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current; 
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  const [submitSurvey] = useSubmitSurvayMutation();
  const [getSurveyQuestions] = useGetsurvayQuestionMutation();

  // 1. Fetch Questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const body = { survey_id: surveyId, token: token };
        
        const response = await getSurveyQuestions(body).unwrap();
        
        if (response && (response.data?.questions || response.data)) {
            // Handle structure: response.data.questions OR response.data array
            const rawQuestions = response.data.questions || response.data;
            
            const formattedData = rawQuestions.map(q => {
                let parsedOptions = null;
                if (q.options) {
                    try {
                        parsedOptions = JSON.parse(q.options);
                    } catch (e) {
                        parsedOptions = [];
                    }
                }
                return { ...q, options: parsedOptions };
            });
            setQuestions(formattedData);
        }
      } catch (error) {
        Alert.alert("Error", "Could not load survey questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [surveyId]);

  const totalQuestions = questions.length;
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // 2. Handle Answers (Checkbox Logic is here)
  const handleAnswer = (val, type) => {
    const qId = questions[currentIndex].id;
    if (type === 'multi') {
      // Logic: If already selected, filter it out. Else, add it.
      const current = answers[qId] || [];
      const newAns = current.includes(val) 
        ? current.filter(i => i !== val) 
        : [...current, val];
      setAnswers(prev => ({ ...prev, [qId]: newAns }));
    } else {
      setAnswers(prev => ({ ...prev, [qId]: val }));
    }
  };

  // 3. Prepare Payload (Updated to accept token)
 // 3. Prepare Payload
 // 3. Prepare Payload
 const prepareSubmissionPayload = (token) => {
    const formattedResponses = questions.map((q) => {
      const val = answers[q.id];

      // If undefined/null/empty string, consider it unanswered
      if (val === undefined || val === null || val === '') return null;

      // Base entry
      let entry = {
        question_id: q.id,
        rating: null,
        response_text: null,
        response_choice: null,
        response_checkboxes: null,
      };

      switch (q.type) {
        case 'rating':
          entry.rating = val;
          break;
        case 'text':
          entry.response_text = String(val);
          break;
        case 'multiplechoice':
          // ⚠️ FIX: Use JSON.stringify here too!
          // The DB column 'response_choice' is JSON type, so it rejects plain strings.
          entry.response_choice = JSON.stringify(val); 
          break;
        case 'checkbox':
          // This one is already correct from previous fix
          entry.response_checkboxes = JSON.stringify(val); 
          break;
        default:
          entry.response_text = String(val);
      }
      return entry;
    }).filter(Boolean);

    return {
      survey_id: surveyId,
      assigned_survey_id: surveyData?.id,
      responses: formattedResponses,
      token: token, 
    };
  };

  // 4. Submit Logic
  const handleFinalSubmit = async () => {
    try {
      // A. Await the token FIRST
      const token = await AsyncStorage.getItem('token');
      
      if(!token) {
          Alert.alert("Error", "Authentication token not found.");
          return;
      }

      // B. Generate payload with the valid token
      const payload = prepareSubmissionPayload(token);
      

      // C. Call API
      const result = await submitSurvey(payload).unwrap();
      
      setModalVisible(false);
      dispatch(fetchSurveys());
      
      Alert.alert("Success", "Survey submitted successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      console.error("Submission Failed:", error);
      Alert.alert("Error", "Failed to submit survey. Please try again.");
    }
  };

  const handleNext = () => {
    if (isAnimating) return;

    const currentQ = questions[currentIndex];
    const currentAnswer = answers[currentQ.id];
    
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

    if (currentIndex === totalQuestions - 1) {
      // Open modal or submit directly? The UI typically shows 'Finish' button
      // Here we can open modal or trigger submit. 
      // Based on your previous code, 'Finish' triggered handleFinalSubmit logic directly or modal.
      // Let's trigger the modal to confirm/load.
      handleFinalSubmit(); 
      return;
    }

    setIsAnimating(true);
    Animated.timing(slideAnim, {
        toValue: -width, 
        duration: 200,
        useNativeDriver: true,
        easing: Easing.ease
    }).start(() => {
        setCurrentIndex(prev => prev + 1);
        slideAnim.setValue(width);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
            easing: Easing.out(Easing.poly(4))
        }).start(() => {
            setIsAnimating(false);
        });
    });
  };

  const handlePrev = () => {
    if (currentIndex === 0 || isAnimating) return;

    setIsAnimating(true);
    Animated.timing(slideAnim, {
        toValue: width,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.ease
    }).start(() => {
        setCurrentIndex(prev => prev - 1);
        slideAnim.setValue(-width);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
            easing: Easing.out(Easing.poly(4))
        }).start(() => {
            setIsAnimating(false);
        });
    });
  };

  if (loading) {
      return (
        <LinearGradient colors={[COLORS.gradColor1, COLORS.gradColor2, COLORS.gradColor3]} style={styles.container}>
             <ActivityIndicator size="large" color="#FFF" style={{marginTop: 100}} />
        </LinearGradient>
      );
  }

  return (
    <LinearGradient colors={[COLORS.gradColor1, COLORS.gradColor2, COLORS.gradColor3]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.gradColor1} />
      <BackgroundPattern />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.iconBtn}>
                <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.progContainer}>
            <View style={[styles.progFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={styles.countContainer}>
            <Text style={styles.headerTitle}>
                {String(currentIndex + 1).padStart(2,'0')} of {String(totalQuestions).padStart(2,'0')}
            </Text>
        </View>

        <View style={styles.cardContainer}>
            <Animated.View style={[styles.cardBase, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
                <RenderCardContent 
                    question={questions[currentIndex]} 
                    answers={answers} 
                    handleAnswer={handleAnswer} 
                    isInteractive={true} 
                />
            </Animated.View>
        </View>

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
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, marginTop: Platform.OS === 'android' ? 30 : 0 },
  iconBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  backArrow: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: -9 },
  progContainer: { height: 8, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginHorizontal: 20, borderRadius: 5, marginTop: 10 },
  progFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 5 },
  countContainer: { paddingHorizontal: 20, marginTop: 40, alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  cardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  cardBase: { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 8, backgroundColor: COLORS.cardBg },
  cardInner: { flex: 1, padding: 24, borderRadius: 24 },
  focusLabel: { color: '#999', fontSize: 12, textTransform: 'uppercase', fontWeight:'600', marginBottom: 8 },
  qText: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15, lineHeight: 26 },
  divider: { height: 1, backgroundColor: '#EEE', marginBottom: 15 },
  optList: { gap: 10 },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: COLORS.optionBorder, backgroundColor: '#FFFFFF' },
  optionSelected: { backgroundColor: COLORS.optionSelectedBg, borderColor: COLORS.optionSelectedBorder },
  optionText: { color: COLORS.text, fontSize: 14, flex: 1 },
  checkCircle: { width: 20, height: 20, borderRadius: 10, borderWidth:1, borderColor: '#DDD', alignItems:'center', justifyContent:'center' },
  ratingBox: { flex: 1, alignItems: 'center', justifyContent:'center' },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  starText: { fontSize: 36 },
  helperText: { color: '#999' },
  textInput: { backgroundColor: '#F8F8F8', flex: 1, borderRadius: 12, padding: 15, textAlignVertical:'top', color: COLORS.text },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingBottom: 50 },
  prevTxt: { color: COLORS.textLight, fontWeight: '600' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.success, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30, minWidth: 140 },
  nextBtnTxt: { color: COLORS.white, fontWeight: 'bold', fontSize: 16, marginRight: 4 },
  arrowContainer: { width: 20 },
  arrowText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 30, alignItems: 'center' },
  chkCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F5E9', alignItems:'center', justifyContent:'center', marginBottom: 15},
  modalTitle: { fontSize: 20, fontWeight:'bold', marginBottom: 20 },
  modalBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20 }
});