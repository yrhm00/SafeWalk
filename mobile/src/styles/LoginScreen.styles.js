import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 1, justifyContent: 'center' },
    keyboardView: { flex: 1, justifyContent: 'center', padding: 20 },
    header: { alignItems: 'center', marginBottom: 50 },
    logoCircle: {
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
    },
    logoEmoji: { fontSize: 45 },
    title: { fontSize: 36, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 5 },
    formContainer: { width: '100%' },
    inputContainer: { marginBottom: 20 },
    label: { color: COLORS.accent, fontSize: 12, fontWeight: 'bold', marginBottom: 5, marginLeft: 5 },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    button: { marginTop: 20, borderRadius: 12, overflow: 'hidden' },
    buttonGradient: { padding: 18, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
    footerLink: { marginTop: 25, alignItems: 'center' },
    footerText: { color: 'rgba(255,255,255,0.6)' },
    highlight: { color: COLORS.warning, fontWeight: 'bold' }
});
