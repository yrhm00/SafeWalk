import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

export default function useShakeSensor(onShake) {
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    const _subscribe = () => {
        // Intervalle de mise à jour (100ms)
        Accelerometer.setUpdateInterval(100);

        setSubscription(
            Accelerometer.addListener(accelerometerData => {
                const { x, y, z } = accelerometerData;
                // Calcul de la force totale (G-force)
                const totalForce = Math.abs(x) + Math.abs(y) + Math.abs(z);

                // Seuil de détection (ajustable)
                if (totalForce > 2.5) {
                    if (onShake) onShake();
                }
            })
        );
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };
}
