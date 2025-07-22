// Script de test pour débugger la connexion
// À exécuter dans la console du navigateur

async function testLogin() {
  try {
    console.log('🧪 Test direct de l\'API de connexion...');
    
    const response = await fetch('https://backend-truenumber-3dc2.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'VOTRE_EMAIL_ICI',
        password: 'VOTRE_PASSWORD_ICI'
      })
    });
    
    console.log('📊 Status:', response.status);
    const data = await response.json();
    console.log('📦 Data:', data);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Pour utiliser : testLogin();
