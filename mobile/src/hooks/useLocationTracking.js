import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';

export default function useLocationTracking() {
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // Fonction de Reverse Geocoding (Throttle)
    const getAddressFromCoords = async (latitude, longitude) => {
        try {
            // Utilisation de Nominatim (OpenStreetMap)
            // Attention : Limiter les appels (ici on le fait à chaque changement significatif)
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                { headers: { 'User-Agent': 'SafeWalkApp/1.0' } } // Bonnes pratiques OSM
            );
            if (response.data && response.data.display_name) {
                setAddress(response.data.display_name);
            }
        } catch (error) {
            console.log("Erreur de géocodage", error);
        }
    };

    // Tracking en temps réel
    useEffect(() => {
        let subscriber;

        const startWatching = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Récupération initiale rapide
            let initialLoc = await Location.getCurrentPositionAsync({});
            setLocation(initialLoc);
            getAddressFromCoords(initialLoc.coords.latitude, initialLoc.coords.longitude);

            // Abonnement aux déplacements (+10 mètres)
            subscriber = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000, // Min 5 secondes
                    distanceInterval: 10, // Min 10 mètres
                },
                (newLocation) => {
                    setLocation(newLocation);
                    getAddressFromCoords(newLocation.coords.latitude, newLocation.coords.longitude);
                }
            );
        };

        startWatching();

        return () => {
            if (subscriber) subscriber.remove();
        };
    }, []);

    return { location, address, errorMsg };
}
