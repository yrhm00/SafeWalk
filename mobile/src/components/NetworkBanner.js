import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NetworkBanner() {
    const [isConnected, setIsConnected] = useState(true);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            // state.isConnected est true si internet est dispo
            // (parfois null au démarrage, on considère true pour éviter un flash)
            setIsConnected(state.isConnected !== false);
        });
        return () => unsubscribe();
    }, []);

    if (isConnected) return null;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.text}>Pas de connexion internet</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FF3B30', // Rouge
        width: '100%',
        paddingBottom: 10,
        position: 'absolute',
        top: 0,
        zIndex: 9999, // Au-dessus de tout
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14
    }
});
