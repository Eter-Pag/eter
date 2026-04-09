import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Brain, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Play,
  History,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

// --- Tipos ---
type QuizType = "trivia" | "personality";
type ViewType = "list" | "name-input" | "quiz" | "results" | "leaderboard";

interface Question {
  id: number;
  text: string;
  options: { id: string; text: string; value?: string }[];
  correctAnswer?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  type: QuizType;
  image: string;
  questions: Question[];
}

interface Score {
  name: string;
  score: number;
  total: number;
  date: string;
}

// --- Datos de los Artistas ---
const PERSONALITY_RESULTS: Record<string, { name: string; description: string; image: string }> = {
  rm: {
    name: "RM (Kim Namjoon)",
    description: "Eres el líder sabio y reflexivo. Te gusta aprender, la naturaleza y tienes una visión profunda de la vida.",
    image: "https://m.media-amazon.com/images/M/MV5BNmUzYjVlYTUtNWEyMC00NjBlLTk0Y2UtZjhkY2EwMmY0ZjExXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
  },
  jin: {
    name: "Jin (Kim Seokjin)",
    description: "Eres divertido, seguro de ti mismo y cuidas de los demás a través del humor y la comida. ¡Worldwide Handsome!",
    image: "https://i.pinimg.com/originals/90/7e/7c/907e7c150d4b655517b81841296b40ae.jpg"
  },
  suga: {
    name: "Suga (Min Yoongi)",
    description: "Eres honesto, trabajador y valoras tu espacio. Detrás de tu apariencia tranquila, hay una gran pasión y sabiduría.",
    image: "https://i.pinimg.com/originals/a0/84/b7/a084b7f4da8c3e0bfc46922f2de11ab0.jpg"
  },
  jhope: {
    name: "J-Hope (Jung Hoseok)",
    description: "Eres la esperanza del grupo. Tu energía positiva y talento iluminan cualquier lugar. Eres disciplinado y alegre.",
    image: "https://static.wikia.nocookie.net/the_kpop_house/images/9/9c/J_hope.jpg/revision/latest?cb=20200330154441"
  },
  jimin: {
    name: "Jimin (Park Jimin)",
    description: "Eres cariñoso, perfeccionista y muy atento con tus amigos. Tienes un encanto natural y un gran corazón.",
    image: "https://i0.wp.com/zaloramalaysiablog.wpcomstaging.com/wp-content/uploads/2025/10/JIMIN-FEATURE.jpeg?resize=736%2C768&ssl=1"
  },
  v: {
    name: "V (Kim Taehyung)",
    description: "Eres único, artístico y ves el mundo de una manera especial. Amas el arte, la fotografía y eres muy leal.",
    image: "https://cokodive.com/cdn/shop/articles/19090942-bts-v-cartier-brand-ambassador-kpop-star-kim-taehyung-jewellery-luxury_cover_1280x1599_0d187aae-7e3b-4f67-9664-1f2b056a64b7_1280x.webp?v=1693273305"
  },
  jk: {
    name: "Jungkook (Jeon Jungkook)",
    description: "Eres el 'Golden Maknae'. Tienes talento para todo lo que te propones, eres competitivo y muy valiente.",
    image: "https://i.pinimg.com/originals/90/7e/7c/907e7c150d4b655517b81841296b40ae.jpg"
  }
};

// --- Datos de los Quizzes ---
const QUIZZES: Quiz[] = [
  {
    id: "bts-trivia",
    title: "¿Eres un verdadero ARMY?",
    description: "El examen definitivo sobre la historia y logros de BTS.",
    type: "trivia",
    image: "https://i.ytimg.com/vi/N6fNBneJ_fg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCKL_lHBLJ2SL4sQXNyRjEbxuRlGg",
    questions: [
      { id: 1, text: "¿En qué año debutó oficialmente BTS?", options: [{ id: "a", text: "2010" }, { id: "b", text: "2012" }, { id: "c", text: "2013" }, { id: "d", text: "2014" }], correctAnswer: "c" },
      { id: 2, text: "¿Cuál fue la primera canción principal (title track) de BTS?", options: [{ id: "a", text: "Boy In Luv" }, { id: "b", text: "Danger" }, { id: "c", text: "No More Dream" }, { id: "d", text: "N.O" }], correctAnswer: "c" },
      { id: 3, text: "¿Quién es el líder de BTS?", options: [{ id: "a", text: "Jin" }, { id: "b", text: "Suga" }, { id: "c", text: "J-Hope" }, { id: "d", text: "RM" }], correctAnswer: "d" },
      { id: 4, text: "¿Cuál de estas canciones fue completamente en inglés?", options: [{ id: "a", text: "Idol" }, { id: "b", text: "Fake Love" }, { id: "c", text: "Dynamite" }, { id: "d", text: "DNA" }], correctAnswer: "c" },
      { id: 5, text: "¿Qué miembro es conocido como 'Worldwide Handsome'?", options: [{ id: "a", text: "Jin" }, { id: "b", text: "Jimin" }, { id: "c", text: "V" }, { id: "d", text: "Jungkook" }], correctAnswer: "a" },
      { id: 6, text: "¿Cuál es el nombre del universo ficticio creado por BTS para sus videos musicales?", options: [{ id: "a", text: "SM Universe" }, { id: "b", text: "BTS Universe (BU)" }, { id: "c", text: "TXT Universe" }, { id: "d", text: "ATEEZ World" }], correctAnswer: "b" },
      { id: 7, text: "¿Cuál fue el primer álbum de BTS en alcanzar el número 1 en el Billboard 200?", options: [{ id: "a", text: "Love Yourself: Her" }, { id: "b", text: "Love Yourself: Tear" }, { id: "c", text: "Map of the Soul: Persona" }, { id: "d", text: "BE" }], correctAnswer: "b" },
      { id: 8, text: "¿Qué canción de BTS tiene el récord de ser el MV más rápido en alcanzar 100M de vistas?", options: [{ id: "a", text: "DNA" }, { id: "b", text: "Fake Love" }, { id: "c", text: "Idol" }, { id: "d", text: "Dynamite" }], correctAnswer: "d" },
      { id: 9, text: "¿Cuál es el nombre del personaje de BT21 creado por Jungkook?", options: [{ id: "a", text: "Tata" }, { id: "b", text: "Chimmy" }, { id: "c", text: "Cooky" }, { id: "d", text: "Koya" }], correctAnswer: "c" },
      { id: 10, text: "¿En qué ciudad de Corea del Sur nació Jimin?", options: [{ id: "a", text: "Seúl" }, { id: "b", text: "Busan" }, { id: "c", text: "Daegu" }, { id: "d", text: "Gwangju" }], correctAnswer: "b" },
      { id: 11, text: "¿Cuál es el nombre artístico de Min Yoongi?", options: [{ id: "a", text: "Suga" }, { id: "b", text: "Agust D" }, { id: "c", text: "Ambos" }, { id: "d", text: "Ninguno" }], correctAnswer: "c" },
      { id: 12, text: "¿Qué instrumento toca V (Taehyung)?", options: [{ id: "a", text: "Piano" }, { id: "b", text: "Saxofón" }, { id: "c", text: "Violín" }, { id: "d", text: "Guitarra" }], correctAnswer: "b" },
      { id: 13, text: "¿Cuál es el lema de BTS que significa 'A prueba de balas'?", options: [{ id: "a", text: "Bangtan Sonyeondan" }, { id: "b", text: "Beyond The Scene" }, { id: "c", text: "Bulletproof Boys" }, { id: "d", text: "Todas las anteriores" }], correctAnswer: "d" },
      { id: 14, text: "¿Qué miembro de BTS lanzó el álbum en solitario 'Jack In The Box'?", options: [{ id: "a", text: "RM" }, { id: "b", text: "J-Hope" }, { id: "c", text: "Suga" }, { id: "d", text: "Jungkook" }], correctAnswer: "b" },
      { id: 15, text: "¿Cuál es el color oficial que representa el amor entre BTS y ARMY?", options: [{ id: "a", text: "Azul" }, { id: "b", text: "Rosa" }, { id: "c", text: "Morado (Purple)" }, { id: "d", text: "Dorado" }], correctAnswer: "c" }
    ],
  },
  {
    id: "bts-personality",
    title: "¿Con qué integrante de BTS compartes tu energía?",
    description: "Descubre qué miembro de BTS se alinea más con tu personalidad.",
    type: "personality",
    image: "https://img.buzzfeed.com/buzzfeed-static/static/2024-12/17/16/enhanced/7893ea4e24d2/original-515-1734451882-11.jpg?fill=1200:675",
    questions: [
      { id: 1, text: "¿Cómo prefieres pasar un día libre?", options: [{ id: "rm", text: "Leyendo un libro o en la naturaleza" }, { id: "jin", text: "Cocinando o contando chistes" }, { id: "suga", text: "Durmiendo o produciendo música" }, { id: "jhope", text: "Bailando o saliendo con amigos" }, { id: "jimin", text: "Cuidando de los demás" }, { id: "v", text: "Visitando una galería de arte" }, { id: "jk", text: "Haciendo ejercicio o jugando" }] },
      { id: 2, text: "¿Cuál es tu estilo de moda?", options: [{ id: "rm", text: "Bohemio y cómodo" }, { id: "jin", text: "Clásico y elegante" }, { id: "suga", text: "Todo negro y minimalista" }, { id: "jhope", text: "Colorido y atrevido" }, { id: "jimin", text: "Sofisticado y chic" }, { id: "v", text: "Vintage y artístico" }, { id: "jk", text: "Deportivo y oversized" }] },
      { id: 3, text: "¿Qué valoras más en una amistad?", options: [{ id: "rm", text: "La sabiduría y el apoyo intelectual" }, { id: "jin", text: "La risa y el buen humor" }, { id: "suga", text: "La lealtad y el silencio compartido" }, { id: "jhope", text: "La energía positiva y el optimismo" }, { id: "jimin", text: "La empatía y el cuidado mutuo" }, { id: "v", text: "La creatividad y la originalidad" }, { id: "jk", text: "La aventura y la competitividad sana" }] },
      { id: 4, text: "¿Cuál es tu comida favorita?", options: [{ id: "rm", text: "Algo saludable y equilibrado" }, { id: "jin", text: "Langosta o platos gourmet" }, { id: "suga", text: "Carne (especialmente barbacoa)" }, { id: "jhope", text: "Comida tradicional coreana" }, { id: "jimin", text: "Cualquier cosa con carne o fruta" }, { id: "v", text: "Japchae o cualquier plato con carne" }, { id: "jk", text: "Pizza, pan o cualquier cosa con harina" }] },
      { id: 5, text: "¿Cómo reaccionas ante un desafío?", options: [{ id: "rm", text: "Analizo la situación y busco una solución lógica" }, { id: "jin", text: "Mantengo la calma y trato de aligerar el ambiente" }, { id: "suga", text: "Me enfoco y trabajo duro hasta superarlo" }, { id: "jhope", text: "Mantengo una actitud positiva y motivo a los demás" }, { id: "jimin", text: "Me esfuerzo al máximo, a veces siendo perfeccionista" }, { id: "v", text: "Busco una forma creativa y única de resolverlo" }, { id: "jk", text: "Lo tomo como una competencia y doy mi 100%" }] },
      { id: 6, text: "¿Qué tipo de música prefieres escuchar?", options: [{ id: "rm", text: "Hip-hop con letras profundas" }, { id: "jin", text: "Baladas emocionales" }, { id: "suga", text: "Rap crudo y honesto" }, { id: "jhope", text: "Música animada y bailable" }, { id: "jimin", text: "Pop contemporáneo y R&B" }, { id: "v", text: "Jazz, soul o música clásica" }, { id: "jk", text: "Pop moderno y EDM" }] },
      { id: 7, text: "¿Cuál es tu pasatiempo favorito?", options: [{ id: "rm", text: "Bonsái o coleccionar figuras" }, { id: "jin", text: "Jugar videojuegos o pescar" }, { id: "suga", text: "Ver películas o leer" }, { id: "jhope", text: "Comprar ropa o bailar" }, { id: "jimin", text: "Hacer ejercicio o relajarse" }, { id: "v", text: "Fotografía o pintura" }, { id: "jk", text: "Dibujar o editar videos" }] }
    ],
  }
];

export default function Quizzes() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  
  const [view, setView] = useState<ViewType>("list");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [userName, setUserName] = useState("");
  const [tempUserName, setTempUserName] = useState("");

  const { data: leaderboard } = trpc.quizzes.getLeaderboard.useQuery(
    { quizId: activeQuiz?.id || "" },
    { enabled: view === "leaderboard" || view === "results" }
  );

  const saveScoreMutation = trpc.quizzes.saveScore.useMutation({
    onSuccess: () => {
      toast.success("¡Puntaje guardado en el ranking global!");
      utils.quizzes.getLeaderboard.invalidate();
    },
    onError: () => {
      toast.error("Error al guardar en el ranking global");
    }
  });

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setTempUserName("");
    setView("name-input");
  };

  const handleNameSubmit = () => {
    if (!tempUserName.trim()) {
      toast.error("Por favor ingresa tu nombre o apodo");
      return;
    }
    setUserName(tempUserName);
    setView("quiz");
  };

  const handleAnswer = (optionId: string) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: optionId };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < (activeQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      setView("results");
      
      if (activeQuiz?.type === "trivia") {
        const score = calculateScore(newAnswers);
        const total = activeQuiz.questions.length;
        setTimeout(() => {
          saveScoreMutation.mutate({
            name: tempUserName,
            score,
            total,
            quizId: activeQuiz.id,
            date: new Date().toLocaleDateString(),
          });
        }, 300);
      }
    }
  };

  const calculateScore = (currentAnswers = answers) => {
    if (!activeQuiz) return 0;
    let score = 0;
    activeQuiz.questions.forEach((q, index) => {
      if (currentAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const getPersonalityResult = () => {
    const counts: Record<string, number> = {};
    Object.values(answers).forEach(val => {
      counts[val] = (counts[val] || 0) + 1;
    });
    let maxCount = 0;
    let result = "rm";
    for (const [key, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        result = key;
      }
    }
    return PERSONALITY_RESULTS[result] || PERSONALITY_RESULTS.rm;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return "bg-yellow-400 text-yellow-900 shadow-yellow-200"; // Oro
    if (index === 1) return "bg-slate-300 text-slate-700 shadow-slate-100"; // Plata
    if (index === 2) return "bg-amber-600 text-amber-50 shadow-amber-200"; // Bronce
    if (index < 15) return "bg-purple-500 text-white shadow-purple-100"; // Morado
    if (index < 50) return "bg-blue-500 text-white shadow-blue-100"; // Azul
    return "bg-slate-400 text-white shadow-slate-100"; // Gris
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header de Navegación */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => view === "list" ? setLocation("/") : setView("list")}
            className="gap-2 hover:bg-white"
          >
            <ArrowLeft className="size-4" />
            {view === "list" ? "Volver al Inicio" : "Volver a la Lista"}
          </Button>
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-slate-200 px-4 py-1">
            ETER Quizzes
          </Badge>
        </div>

        <AnimatePresence mode="wait">
          {/* VISTA: LISTA DE QUIZZES */}
          {view === "list" && (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {QUIZZES.map((quiz) => (
                <Card key={quiz.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all group cursor-pointer" onClick={() => startQuiz(quiz)}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={quiz.image} alt={quiz.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-white/90 text-slate-900 border-none">
                      {quiz.type === "trivia" ? "Trivia" : "Personalidad"}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">{quiz.title}</h3>
                    <p className="text-slate-500 text-sm mb-4">{quiz.description}</p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 gap-2">
                      <Play className="size-4" /> Comenzar Test
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {/* VISTA: INGRESO DE NOMBRE */}
          {view === "name-input" && (
            <motion.div 
              key="name"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              <Card className="border-none shadow-2xl p-8 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="size-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">¡Hola, ARMY!</h2>
                <p className="text-slate-500 mb-6">Dinos tu nombre o apodo para personalizar tu resultado.</p>
                <Input 
                  placeholder="Tu nombre aquí..." 
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  className="mb-4 text-center text-lg h-12 rounded-xl border-slate-200 focus:ring-purple-500"
                  onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                />
                <Button onClick={handleNameSubmit} className="w-full h-12 bg-purple-600 hover:bg-purple-700 rounded-xl text-lg font-bold">
                  Empezar Test <ChevronRight className="ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}

          {/* VISTA: QUIZ EN CURSO */}
          {view === "quiz" && activeQuiz && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-purple-600 uppercase tracking-wider">Pregunta {currentQuestionIndex + 1} de {activeQuiz.questions.length}</span>
                  <span className="text-xs text-slate-400">{Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100)}% completado</span>
                </div>
                <Progress value={((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100} className="h-2 bg-slate-200" />
              </div>

              <Card className="border-none shadow-2xl overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                  <CardTitle className="text-2xl leading-tight">{activeQuiz.questions[currentQuestionIndex].text}</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  {activeQuiz.questions[currentQuestionIndex].options.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className="w-full h-auto py-4 px-6 text-left justify-start text-lg border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 transition-all rounded-2xl whitespace-normal"
                      onClick={() => handleAnswer(option.id)}
                    >
                      <div className="bg-slate-100 w-8 h-8 rounded-lg flex items-center justify-center mr-4 text-sm font-bold text-slate-500 group-hover:bg-purple-200 group-hover:text-purple-600">
                        {option.id.toUpperCase()}
                      </div>
                      {option.text}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* VISTA: RESULTADOS */}
          {view === "results" && activeQuiz && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <Card className="border-none shadow-2xl overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-12 px-8 text-white">
                  <Trophy className="size-16 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-3xl font-black mb-2">¡Tu destino ha sido revelado!</h2>
                  <p className="text-purple-100 text-lg">Hola, <span className="font-bold text-white">{userName}</span>. Aquí tienes tu resultado:</p>
                </div>
                
                <CardContent className="p-8">
                  {activeQuiz.type === "trivia" ? (
                    <div className="space-y-6">
                      <div className="text-6xl font-black text-slate-900">
                        {calculateScore()} / {activeQuiz.questions.length}
                      </div>
                      <p className="text-xl text-slate-600 font-medium">
                        {calculateScore() === activeQuiz.questions.length ? "¡Increíble! Eres un ARMY de élite. 💜" : 
                         calculateScore() > activeQuiz.questions.length / 2 ? "¡Muy bien! Conoces mucho sobre BTS. ✨" : 
                         "¡Sigue aprendiendo! Todo ARMY empezó así. 😊"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="relative w-full max-w-xs mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-100">
                        <img 
                          src={getPersonalityResult().image} 
                          alt={getPersonalityResult().name} 
                          className="w-full h-auto object-top"
                        />
                      </div>
                      <h3 className="text-3xl font-black text-purple-600">{getPersonalityResult().name}</h3>
                      <p className="text-lg text-slate-600 leading-relaxed italic">"{getPersonalityResult().description}"</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
                    <Button onClick={() => setView("list")} variant="outline" className="h-14 rounded-2xl text-lg font-bold border-2">
                      <History className="mr-2" /> Otros Quizzes
                    </Button>
                    {activeQuiz.type === "trivia" && (
                      <Button onClick={() => setView("leaderboard")} className="h-14 bg-purple-600 hover:bg-purple-700 rounded-2xl text-lg font-bold">
                        <Trophy className="mr-2" /> Ver Ranking
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* VISTA: LEADERBOARD */}
          {view === "leaderboard" && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-none shadow-2xl overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8 text-center">
                  <Trophy className="size-12 text-yellow-400 mx-auto mb-4" />
                  <CardTitle className="text-3xl font-black">Ranking Global ARMY</CardTitle>
                  <CardDescription className="text-slate-400 text-lg">Los mejores puntajes de {activeQuiz?.title}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {leaderboard?.map((score, index) => (
                      <div key={index} className="flex items-center p-6 hover:bg-slate-50 transition-colors group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm mr-6 shadow-sm ${getRankColor(index)}`}>
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <div className="font-bold text-lg text-slate-900">{score.name}</div>
                          <div className="text-xs text-slate-400 font-medium uppercase tracking-widest">{score.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-purple-600">{score.score}</div>
                          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Puntos</div>
                        </div>
                      </div>
                    ))}
                    {(!leaderboard || leaderboard.length === 0) && (
                      <div className="p-12 text-center text-slate-400">
                        Aún no hay puntajes registrados. ¡Sé el primero!
                      </div>
                    )}
                  </div>
                  <div className="p-8 bg-slate-50 border-t border-slate-100">
                    <Button onClick={() => setView("list")} className="w-full h-12 bg-slate-900 hover:bg-slate-800 rounded-xl font-bold">
                      Volver a los Quizzes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
