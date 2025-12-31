/* DOCUMENT GÉNÉRÉ AVEC ASSISTANCE IA
   Objectif : Centralisation automatique des textes de l'application (Refactoring).
   But : Éviter le hard-coding conformément aux standards de développement.
*/
export const TEXTS = {
    // --- Général ---
    appName: "SafeWalk",
    loading: "Chargement...",

    // --- Auth (Login & Signup) ---
    auth: {
        loginTitle: "Welcome Back!",
        loginSubtitle: "Sign in to continue",
        signupTitle: "Create Account",
        signupSubtitle: "Join the community",
        emailPlaceholder: "Enter email",
        passwordPlaceholder: "Enter password",
        namePlaceholder: "Enter full name",
        usernamePlaceholder: "Enter username",
        forgotPassword: "Forgot Password?",
        signInButton: "Sign In",
        signUpButton: "Sign Up",
        noAccount: "Don't have an account? ",
        hasAccount: "Already have an account? ",
        agreeTerms: "I agree to the Terms & Conditions",
        logout: "Log Out"
    },

    // --- Validation & Erreurs ---
    errors: {
        network: "Erreur réseau. Vérifiez votre connexion.",
        fillFields: "Please fill in all fields.",
        invalidEmail: "Invalid email format.",
        passwordLength: "Password must be at least 8 characters.",
        passwordCase: "Password needs uppercase & lowercase.",
        passwordNumber: "Password needs a number.",
        passwordSpecial: "Password needs a special character.",
        acceptTerms: "Please agree to the terms.",
        generic: "Une erreur est survenue."
    },

    // --- Écran de Signalement (Report) ---
    report: {
        title: "Report Incident",
        descLabel: "Description",
        descPlaceholder: "Describe what you see...",
        typeLabel: "Incident Type",
        typePlaceholder: "Select a type...",
        zoneLabel: "Zone",
        zonePlaceholder: "Select a zone...",
        photoLabel: "Add Photo",
        emergencyLabel: "High Urgency?",
        submitButton: "Submit Report",
        successTitle: "Succès",
        successMsg: "Signalement envoyé avec succès !",
        successMsg: "Signalement envoyé avec succès !",
        errorTitle: "Erreur"
    },

    // --- Map Screen ---
    map: {
        locating: "Locating...",
        permissionDenied: "Permission to access location was denied",
        searchPlaceholder: "Search location...",
        tapDetails: "Tap for details >"
    },

    // --- Incident Detail Screen ---
    incidentDetail: {
        headerTitle: "Incident Report",
        noPhoto: "No Photo Available",
        labels: {
            description: "Description",
            status: "Status",
            reportedBy: "Reported By",
            comments: "Comments"
        },
        status: {
            pending: "Pending"
        },
        comments: {
            none: "No comments yet.",
            placeholder: "Add a comment...",
            loginRequired: "Login required",
            loginMsg: "You must be logged in to comment.",
            postError: "Could not post comment"
        },
        votes: {
            loginRequired: "Login required",
            loginMsg: "You must be logged in to vote.",
            error: "Network error during voting."
        },
        address: {
            loading: "Loading address...",
            unavailable: "Address unavailable"
        }
    }
};
