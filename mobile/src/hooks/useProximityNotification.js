import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

// Configuration locale des notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Utilitaire de calcul de distance (Haversine)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Rayon de la terre en km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance en km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

export default function useProximityNotification(userLocation, incidents) {
    useEffect(() => {
        if (!userLocation || !incidents || incidents.length === 0) return;

        incidents.forEach(incident => {
            const dist = getDistanceFromLatLonInKm(
                userLocation.coords.latitude,
                userLocation.coords.longitude,
                parseFloat(incident.latitude),
                parseFloat(incident.longitude)
            );

            // Si moins de 1km (exemple)
            if (dist < 1.0) {
                // On pourrait ajouter une logique pour ne pas spammer (ex: stockage local 'déjà notifié')
                // Pour l'instant on envoie juste si on est proche (attention au spam en boucle si on bouge pas)
                // Idéalement on compare avec un état précédent ou on throttle.

                // Note: Dans une vraie app, on stockerait les ID notifiés.
            }
        });

    }, [userLocation, incidents]); // Se déclenche quand on bouge ou que la liste change

    // Fonction publique si on veut déclencher manuellement
    const checkProximity = (coords, reports) => {
        // ... (Logique identique si besoin d'être appelée ailleurs)
    };

    // On exporte rien de spécial, c'est un hook "effet de bord"
    // Ou on peut exporter un statut.
}
