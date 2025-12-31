import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { COLORS } from '../../constants/theme';

export default function AnimatedSplashScreen() {
    const navigation = useNavigation();
    const { isAuthenticated } = useSelector(state => state.auth);

    // Animation Values
    const fadeAnim = useRef(new Animated.Value(0)).current; // Opacity 0 -> 1
    const scaleAnim = useRef(new Animated.Value(0.5)).current; // Scale 0.5 -> 1 (Zoom In Effect)

    useEffect(() => {
        // Lancer l'animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000, // 1 seconde d'apparition
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5, // Effet de rebond léger
                tension: 10,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Une fois l'animation finie, on attend un tout petit peu et on navigue
            setTimeout(() => {
                // Redirection intelligente
                if (isAuthenticated) {
                    navigation.replace('Home');
                } else {
                    navigation.replace('Login');
                }
            }, 1000); // Reste affiché 1 seconde de plus
        });
    }, [isAuthenticated]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
                <Image
                    source={require('../../../assets/splash.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A2540', // Même couleur que le splash natif pour transition invisible
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.6, // Image prend 60% de la largeur
        height: width * 0.6,
    }
});
