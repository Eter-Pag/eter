import { addQuizScore } from './server/db';
import dotenv from 'dotenv';

// Cargar variables de entorno si es necesario
dotenv.config();

async function seed() {
  console.log('🚀 Iniciando carga de puntajes iniciales...');
  
  const initialScores = [
    { name: 'ara', score: 13, total: 15, quizId: 'bts-trivia', date: '5/4/2026' },
    { name: 'yareli', score: 12, total: 15, quizId: 'bts-trivia', date: '5/4/2026' },
    { name: 'berenice', score: 7, total: 15, quizId: 'bts-trivia', date: '5/4/2026' },
    { name: 'diego', score: 5, total: 15, quizId: 'bts-trivia', date: '5/4/2026' },
  ];

  try {
    for (const scoreData of initialScores) {
      console.log(`📝 Agregando puntaje para: ${scoreData.name}...`);
      await addQuizScore(scoreData);
    }
    console.log('✅ ¡Puntajes iniciales cargados con éxito en Google Sheets!');
  } catch (error) {
    console.error('❌ Error al cargar puntajes:', error);
  }
}

seed();
