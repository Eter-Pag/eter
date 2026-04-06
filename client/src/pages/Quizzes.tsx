import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
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
  Share2,
  Play,
  History
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

// --- Datos de Ejemplo ---
const QUIZZES: Quiz[] = [
  {
    id: "bts-trivia",
    title: "¿Eres un verdadero ARMY?",
    description: "El examen definitivo sobre la historia y logros de BTS.",
    type: "trivia",
    image: "https://lh3.googleusercontent.com/d/16_3UTSlqrB1VHVIVM4cMMea0n96vm7Is",
    questions: [
      {
        id: 1,
        text: "¿En qué año debutó oficialmente BTS?",
        options: [
          { id: "a", text: "2010" },
          { id: "b", text: "2012" },
          { id: "c", text: "2013" },
          { id: "d", text: "2014" },
        ],
        correctAnswer: "c",
      },
      {
        id: 2,
        text: "¿Cuál fue la primera canción principal (title track) de BTS?",
        options: [
          { id: "a", text: "Boy In Luv" },
          { id: "b", text: "Danger" },
          { id: "c", text: "No More Dream" },
          { id: "d", text: "N.O" },
        ],
        correctAnswer: "c",
      },
      {
        id: 3,
        text: "¿Quién es el líder de BTS?",
        options: [
          { id: "a", text: "Jin" },
          { id: "b", text: "Suga" },
          { id: "c", text: "J-Hope" },
          { id: "d", text: "RM" },
        ],
        correctAnswer: "d",
      },
      {
        id: 4,
        text: "¿Cuál de estas canciones fue completamente en inglés?",
        options: [
          { id: "a", text: "Idol" },
          { id: "b", text: "Fake Love" },
          { id: "c", text: "Dynamite" },
          { id: "d", text: "DNA" },
        ],
        correctAnswer: "c",
      },
      {
        id: 5,
        text: "¿Qué miembro es conocido como 'Worldwide Handsome'?",
        options: [
          { id: "a", text: "Jin" },
          { id: "b", text: "Jimin" },
          { id: "c", text: "V" },
          { id: "d", text: "Jungkook" },
        ],
        correctAnswer: "a",
      },
      {
        id: 6,
        text: "¿Cuál es el nombre del universo ficticio creado por BTS para sus videos musicales?",
        options: [
          { id: "a", text: "SM Universe" },
          { id: "b", text: "BTS Universe (BU)" },
          { id: "c", text: "TXT Universe" },
          { id: "d", text: "ATEEZ World" },
        ],
        correctAnswer: "b",
      },
      {
        id: 7,
        text: "¿Cuál fue el primer álbum de BTS en alcanzar el número 1 en el Billboard 200?",
        options: [
          { id: "a", text: "Love Yourself: Her" },
          { id: "b", text: "Love Yourself: Tear" },
          { id: "c", text: "Map of the Soul: Persona" },
          { id: "d", text: "BE" },
        ],
        correctAnswer: "b",
      },
      {
        id: 8,
        text: "¿Qué canción de BTS tiene el récord de ser el MV más rápido en alcanzar 100M de vistas?",
        options: [
          { id: "a", text: "DNA" },
          { id: "b", text: "Fake Love" },
          { id: "c", text: "Idol" },
          { id: "d", text: "Dynamite" },
        ],
        correctAnswer: "d",
      },
      {
        id: 9,
        text: "¿Cuál es el nombre del personaje de BT21 creado por Jungkook?",
        options: [
          { id: "a", text: "Tata" },
          { id: "b", text: "Chimmy" },
          { id: "c", text: "Cooky" },
          { id: "d", text: "Koya" },
        ],
        correctAnswer: "c",
      },
      {
        id: 10,
        text: "¿En qué ciudad de Corea del Sur nació Jimin?",
        options: [
          { id: "a", text: "Seúl" },
          { id: "b", text: "Busan" },
          { id: "c", text: "Daegu" },
          { id: "d", text: "Gwangju" },
        ],
        correctAnswer: "b",
      },
      {
        id: 11,
        text: "¿Cuál es el nombre artístico de Min Yoongi?",
        options: [
          { id: "a", text: "Suga" },
          { id: "b", text: "Agust D" },
          { id: "c", text: "Ambos" },
          { id: "d", text: "Ninguno" },
        ],
        correctAnswer: "c",
      },
      {
        id: 12,
        text: "¿Qué instrumento toca V (Taehyung)?",
        options: [
          { id: "a", text: "Piano" },
          { id: "b", text: "Saxofón" },
          { id: "c", text: "Violín" },
          { id: "d", text: "Guitarra" },
        ],
        correctAnswer: "b",
      },
      {
        id: 13,
        text: "¿Cuál es el lema de BTS que significa 'A prueba de balas'?",
        options: [
          { id: "a", text: "Bangtan Sonyeondan" },
          { id: "b", text: "Beyond The Scene" },
          { id: "c", text: "Bulletproof Boys" },
          { id: "d", text: "Todas las anteriores" },
        ],
        correctAnswer: "d",
      },
      {
        id: 14,
        text: "¿Qué miembro de BTS lanzó el álbum en solitario 'Jack In The Box'?",
        options: [
          { id: "a", text: "RM" },
          { id: "b", text: "J-Hope" },
          { id: "c", text: "Suga" },
          { id: "d", text: "Jungkook" },
        ],
        correctAnswer: "b",
      },
      {
        id: 15,
        text: "¿Cuál es el color oficial que representa el amor entre BTS y ARMY?",
        options: [
          { id: "a", text: "Azul" },
          { id: "b", text: "Rosa" },
          { id: "c", text: "Morado (Purple)" },
          { id: "d", text: "Dorado" },
        ],
        correctAnswer: "c",
      }
    ],
  },
  {
    id: "bts-personality",
    title: "¿Con qué integrante de BTS compartes tu energía?",
    description: "Descubre qué miembro de BTS se alinea más con tu personalidad.",
    type: "personality",
    image: "https://lh3.googleusercontent.com/d/16_3UTSlqrB1VHVIVM4cMMea0n96vm7Is",
    questions: [
      {
        id: 1,
        text: "¿Cómo prefieres pasar un día libre?",
        options: [
          { id: "rm", text: "Leyendo un libro o en la naturaleza" },
          { id: "jin", text: "Cocinando o contando chistes" },
          { id: "suga", text: "Durmiendo o produciendo música" },
          { id: "jhope", text: "Bailando o saliendo con amigos" },
          { id: "jimin", text: "Cuidando de los demás" },
          { id: "v", text: "Visitando una galería de arte" },
          { id: "jk", text: "Haciendo ejercicio o jugando" },
        ],
      },
      {
        id: 2,
        text: "¿Cuál es tu estilo de moda?",
        options: [
          { id: "rm", text: "Bohemio y cómodo" },
          { id: "jin", text: "Clásico y elegante" },
          { id: "suga", text: "Todo negro y minimalista" },
          { id: "jhope", text: "Colorido y atrevido" },
          { id: "jimin", text: "Sofisticado y chic" },
          { id: "v", text: "Vintage y artístico" },
          { id: "jk", text: "Deportivo y oversized" },
        ],
      },
      {
        id: 3,
        text: "¿Qué valoras más en una amistad?",
        options: [
          { id: "rm", text: "La sabiduría y el apoyo intelectual" },
          { id: "jin", text: "La risa y el buen humor" },
          { id: "suga", text: "La lealtad y el silencio compartido" },
          { id: "jhope", text: "La energía positiva y el optimismo" },
          { id: "jimin", text: "La empatía y el cuidado mutuo" },
          { id: "v", text: "La creatividad y la originalidad" },
          { id: "jk", text: "La aventura y la competitividad sana" },
        ],
      },
      {
        id: 4,
        text: "¿Cuál es tu comida favorita?",
        options: [
          { id: "rm", text: "Algo saludable y equilibrado" },
          { id: "jin", text: "Langosta o platos gourmet" },
          { id: "suga", text: "Carne (especialmente barbacoa)" },
          { id: "jhope", text: "Comida tradicional coreana" },
          { id: "jimin", text: "Cualquier cosa con carne o fruta" },
          { id: "v", text: "Japchae o cualquier plato con carne" },
          { id: "jk", text: "Pizza, pan o cualquier cosa con harina" },
        ],
      },
      {
        id: 5,
        text: "¿Cómo reaccionas ante un desafío?",
        options: [
          { id: "rm", text: "Analizo la situación y busco una solución lógica" },
          { id: "jin", text: "Mantengo la calma y trato de aligerar el ambiente" },
          { id: "suga", text: "Me enfoco y trabajo duro hasta superarlo" },
          { id: "jhope", text: "Mantengo una actitud positiva y motivo a los demás" },
          { id: "jimin", text: "Me esfuerzo al máximo, a veces siendo perfeccionista" },
          { id: "v", text: "Busco una forma creativa y única de resolverlo" },
          { id: "jk", text: "Lo tomo como una competencia y doy mi 100%" },
        ],
      },
      {
        id: 6,
        text: "¿Qué tipo de música prefieres escuchar?",
        options: [
          { id: "rm", text: "Hip-hop con letras profundas" },
          { id: "jin", text: "Baladas emocionales" },
          { id: "suga", text: "Rap crudo y honesto" },
          { id: "jhope", text: "Música animada y bailable" },
          { id: "jimin", text: "Pop contemporáneo y suave" },
          { id: "v", text: "Jazz o música clásica" },
          { id: "jk", text: "Pop moderno y R&B" },
        ],
      },
      {
        id: 7,
        text: "¿Cuál es tu estación del año favorita?",
        options: [
          { id: "rm", text: "Otoño (para reflexionar)" },
          { id: "jin", text: "Invierno (para estar cómodo y abrigado)" },
          { id: "suga", text: "Invierno (prefiero el frío)" },
          { id: "jhope", text: "Primavera (por el renacimiento y la energía)" },
          { id: "jimin", text: "Invierno (me gusta la nieve)" },
          { id: "v", text: "Otoño (es muy artístico)" },
          { id: "jk", text: "Verano (para estar activo)" },
        ],
      },
      {
        id: 8,
        text: "¿Qué superpoder te gustaría tener?",
        options: [
          { id: "rm", text: "Telepatía (para entender a todos)" },
          { id: "jin", text: "Inmortalidad (para disfrutar siempre)" },
          { id: "suga", text: "Teletransportación (para evitar viajes largos)" },
          { id: "jhope", text: "Poder volar (sentir la libertad)" },
          { id: "jimin", text: "Hablar con los animales" },
          { id: "v", text: "Viajar en el tiempo" },
          { id: "jk", text: "Súper fuerza o velocidad" },
        ],
      },
      {
        id: 9,
        text: "¿Cuál es tu pasatiempo creativo?",
        options: [
          { id: "rm", text: "Escribir poesía o diarios" },
          { id: "jin", text: "Cocinar para otros" },
          { id: "suga", text: "Tocar un instrumento o producir" },
          { id: "jhope", text: "Crear coreografías" },
          { id: "jimin", text: "Dibujar o pintar" },
          { id: "v", text: "Fotografía" },
          { id: "jk", text: "Editar videos o dibujar" },
        ],
      },
      {
        id: 10,
        text: "¿Cómo te describirían tus amigos?",
        options: [
          { id: "rm", text: "Inteligente y responsable" },
          { id: "jin", text: "Divertido y protector" },
          { id: "suga", text: "Tranquilo pero apasionado" },
          { id: "jhope", text: "Alegre y trabajador" },
          { id: "jimin", text: "Dulce y dedicado" },
          { id: "v", text: "Único y soñador" },
          { id: "jk", text: "Talentoso y valiente" },
        ],
      },
    ],
  }
];

const PERSONALITY_RESULTS: Record<string, { name: string; description: string; image: string }> = {
  rm: {
    name: "RM",
    description: "¡Felicidades, eres RM! Eres un líder innato, con una mente profunda y una sed insaciable de conocimiento. Tu capacidad para la reflexión y tu amor por la naturaleza te conectan con el mundo de una manera única. Eres el pilar de tu grupo, siempre buscando la verdad y la autenticidad, y no temes guiar a los demás con tu sabiduría y tu ejemplo. Tu inteligencia y tu responsabilidad son tus mayores fortalezas, y siempre estás en constante crecimiento personal.",
    image: "https://m.media-amazon.com/images/M/MV5BNmUzYjVlYTUtNWEyMC00NjBlLTk0Y2UtZjhkY2EwMmY0ZjExXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
  },
  jin: {
    name: "Jin",
    description: "¡Eres Jin, el 'Worldwide Handsome'! Posees un carisma natural y una confianza inquebrantable que ilumina cualquier habitación. Te encanta hacer reír a los demás y eres el alma de la fiesta, pero detrás de esa fachada divertida se esconde una persona trabajadora y profundamente preocupada por sus seres queridos. Tu humor y tu capacidad para mantener la calma en cualquier situación son admirables, y siempre buscas la felicidad, tanto la tuya como la de quienes te rodean.",
    image: "https://i.pinimg.com/originals/90/7e/7c/907e7c150d4b655517b81841296b40ae.jpg"
  },
  suga: {
    name: "Suga",
    description: "¡Tu espíritu es el de Suga! Eres una persona con una mente brillante y un talento innato para la creatividad, especialmente en el ámbito musical. Aunque a veces puedes parecer tranquilo o reservado, por dentro arde una pasión inmensa por lo que haces. Eres honesto, directo y valoras la autenticidad por encima de todo. Tus amigos saben que pueden contar contigo para un consejo sincero y una lealtad inquebrantable, y tu capacidad para transformar tus pensamientos en arte es verdaderamente inspiradora.",
    image: "https://i.pinimg.com/originals/a0/84/b7/a084b7f4da8c3e0bfc46922f2de11ab0.jpg"
  },
  jhope: {
    name: "J-Hope",
    description: "¡Eres J-Hope, la personificación de la esperanza! Tu energía es contagiosa y tu optimismo es una fuente de luz para todos. Siempre buscas el lado positivo de las cosas y tu espíritu trabajador te impulsa a mejorar constantemente. Eres un gran motivador, siempre apoyando a tus amigos y levantando el ánimo con tu alegría. Tu pasión por el baile y la música se refleja en tu personalidad vibrante y tu deseo de ser una fuente de esperanza para el mundo.",
    image: "https://static.wikia.nocookie.net/the_kpop_house/images/9/9c/J_hope.jpg/revision/latest?cb=20200330154441"
  },
  jimin: {
    name: "Jimin",
    description: "¡Te identificas con Jimin! Eres una persona con una gran sensibilidad y empatía, siempre atento a las necesidades de los demás. Te esfuerzas por la perfección en todo lo que haces y tienes un gran sentido de la responsabilidad. Eres amable, cariñoso y tus amigos te valoran por tu apoyo incondicional y tu capacidad para escuchar. Tu dedicación y tu deseo de ser la mejor versión de ti mismo te hacen una persona admirable y querida por todos.",
    image: "https://i0.wp.com/zaloramalaysiablog.wpcomstaging.com/wp-content/uploads/2025/10/JIMIN-FEATURE.jpeg?resize=736%2C768&ssl=1"
  },
  v: {
    name: "V",
    description: "¡Eres V, el alma artística y única! Posees una personalidad distintiva y un espíritu libre que te permite ver el mundo de una manera muy particular. Eres creativo, artístico y no tienes miedo de mostrar tu individualidad. Te encanta la belleza en todas sus formas, desde la música clásica hasta la fotografía, y tu capacidad para soñar y vivir una vida llena de arte y amor es inspiradora. Tus amigos te ven como alguien fascinante y con un encanto especial que te hace inolvidable.",
    image: "https://cokodive.com/cdn/shop/articles/19090942-bts-v-cartier-brand-ambassador-kpop-star-kim-taehyung-jewellery-luxury_cover_1280x1599_0d187aae-7e3b-4f67-9664-1f2b056a64b7_1280x.webp?v=1693273305"
  },
  jk: {
    name: "Jungkook",
    description: "¡Eres el 'Golden Maknae', Jungkook! Eres una persona con múltiples talentos y una sed insaciable de nuevas experiencias. Siempre estás dispuesto a enfrentar desafíos y a aprender cosas nuevas, destacando en todo lo que te propones. Eres competitivo, trabajador y te esfuerzas por ser el mejor en cada área. Tus amigos admiran tu determinación, tu espíritu aventurero y tu capacidad para dominar cualquier habilidad, lo que te convierte en una persona verdaderamente excepcional.",
    image: "https://i.pinimg.com/originals/90/7e/7c/907e7c150d4b655517b81841296b40ae.jpg"
  },
};

export default function Quizzes() {
  const [, navigate] = useLocation();
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [userName, setUserName] = useState("");
  const [tempUserName, setTempUserName] = useState("");
  const [view, setView] = useState<ViewType>("list");
  const resultCardRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const { data: leaderboard = [] } = trpc.quizzes.getLeaderboard.useQuery(
    { quizId: activeQuiz?.id },
    { enabled: view === "leaderboard" || view === "list" }
  );

  const saveScoreMutation = trpc.quizzes.saveScore.useMutation({
    onSuccess: () => {
      toast.success("¡Puntaje guardado en el ranking global!");
      utils.quizzes.getLeaderboard.invalidate();
      setView("leaderboard");
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
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setView("quiz");
  };

  const handleAnswer = (optionId: string) => {
    setAnswers({ ...answers, [currentQuestionIndex]: optionId });
    
    if (currentQuestionIndex < (activeQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      setView("results");
      
      // Auto-save para trivia
      if (activeQuiz?.type === "trivia") {
        const score = calculateScore();
        const total = activeQuiz.questions.length;
        setTimeout(() => {
          saveScoreMutation.mutate({
            name: userName,
            score,
            total,
            quizId: activeQuiz.id || "unknown",
            date: new Date().toLocaleDateString(),
          });
        }, 500);
      }
    }
  };

  const calculateScore = () => {
    if (!activeQuiz || activeQuiz.type !== "trivia") return 0;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  const getPersonalityResult = () => {
    if (!activeQuiz || activeQuiz.type !== "personality") return null;
    const counts: Record<string, number> = {};
    Object.values(answers).forEach(val => {
      counts[val] = (counts[val] || 0) + 1;
    });
    const winner = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    return PERSONALITY_RESULTS[winner];
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="container flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => {
            if (view === "list") navigate("/");
            else setView("list");
          }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h1 className="font-bold text-lg">ETER Challenge</h1>
          <Button variant="ghost" size="sm" onClick={() => setView("leaderboard")}>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </Button>
        </div>
      </header>

      <main className="container py-6 px-4">
        <AnimatePresence mode="wait">
          {/* VISTA: LISTA DE QUIZZES */}
          {view === "list" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6"
            >
              <div className="text-center mb-4">
                <Badge variant="outline" className="mb-2">NUEVO</Badge>
                <h2 className="text-2xl font-bold">Pon a prueba tu pasión</h2>
                <p className="text-muted-foreground">Elige un quiz y demuestra cuánto sabes.</p>
              </div>
              
              {QUIZZES.map((quiz) => (
                <Card key={quiz.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => startQuiz(quiz)}>
                  <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${quiz.image})` }} />
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <Badge>{quiz.type === "trivia" ? "Trivia" : "Personalidad"}</Badge>
                    </div>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Button className="w-full gap-2">
                      <Play className="h-4 w-4" /> Comenzar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {/* VISTA: INGRESO DE NOMBRE */}
          {view === "name-input" && activeQuiz && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white">
                  <CardTitle className="text-2xl">¡Bienvenido!</CardTitle>
                  <CardDescription className="text-purple-100">
                    Antes de comenzar, cuéntanos tu nombre o apodo
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tu nombre o apodo:</label>
                    <Input
                      placeholder="Ej: ARMY123, Mi Nombre..."
                      value={tempUserName}
                      onChange={(e) => setTempUserName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleNameSubmit()}
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Este nombre se mostrará en tus resultados y en el ranking.
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={handleNameSubmit}
                  >
                    Comenzar Quiz
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* VISTA: QUIZ EN CURSO */}
          {view === "quiz" && activeQuiz && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Pregunta {currentQuestionIndex + 1} de {activeQuiz.questions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100)}%</span>
                </div>
                <Progress value={((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100} className="h-2" />
              </div>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl leading-tight">
                    {activeQuiz.questions[currentQuestionIndex].text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {activeQuiz.questions[currentQuestionIndex].options.map((option) => (
                    <Button 
                      key={option.id} 
                      variant="outline" 
                      className="h-auto py-4 px-6 justify-start text-left whitespace-normal hover:bg-purple-50 hover:border-purple-200 transition-all"
                      onClick={() => handleAnswer(option.id)}
                    >
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <Card ref={resultCardRef} className="overflow-hidden border-none shadow-2xl">
                <div className="bg-gradient-to-br from-purple-600 to-fuchsia-500 p-8 text-white">
                  <Trophy className="h-16 w-16 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-3xl font-bold mb-2">
                    {activeQuiz.type === "personality" ? "¡Tu destino ha sido revelado!" : "¡Excelente desempeño!"}
                  </h2>
                  <p className="text-purple-100 mb-4">Hola, {userName}</p>
                  
                  {activeQuiz.type === "trivia" ? (
                    <div>
                      <p className="text-5xl font-black mb-2">{calculateScore()}/{activeQuiz.questions.length}</p>
                      <p className="opacity-90">¡Increíble esfuerzo!</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xl font-medium opacity-80">Tu resultado es:</p>
                      <p className="text-4xl font-black mt-2">{getPersonalityResult()?.name}</p>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6 bg-white">
                  {activeQuiz.type === "personality" && (
                    <div className="space-y-4">
                      {getPersonalityResult()?.image && (
                        <div className="flex justify-center">
                          <img 
                            src={getPersonalityResult()?.image} 
                            alt={getPersonalityResult()?.name}
                            className="max-w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                      )}
                      <p className="text-muted-foreground mb-6 italic">
                        "{getPersonalityResult()?.description}"
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {activeQuiz.type === "trivia" && (
                      <>
                        <Button className="w-full gap-2" onClick={() => setView("leaderboard")}>
                          <Trophy className="h-4 w-4" /> Ver Ranking
                        </Button>
                        <Button variant="outline" className="w-full gap-2" onClick={() => setView("list")}>
                          <History className="h-4 w-4" /> Otros Quizzes
                        </Button>
                      </>
                    )}
                    {activeQuiz.type === "personality" && (
                      <Button variant="outline" className="w-full gap-2" onClick={() => setView("list")}>
                        <History className="h-4 w-4" /> Otros Quizzes
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto"
            >
              <div className="text-center mb-6">
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                <h2 className="text-2xl font-bold">ETER Top Scores</h2>
                <p className="text-muted-foreground">Los mejores puntajes de la comunidad</p>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {leaderboard.length > 0 ? leaderboard.map((s, i) => {
                      let medalColor = "text-white";
                      let medalBgColor = "";
                      let positionLabel = "";
                      
                      if (i === 0) {
                        medalColor = "text-yellow-600";
                        medalBgColor = "bg-yellow-100";
                        positionLabel = "🥇";
                      } else if (i === 1) {
                        medalColor = "text-gray-500";
                        medalBgColor = "bg-gray-100";
                        positionLabel = "🥈";
                      } else if (i === 2) {
                        medalColor = "text-amber-700";
                        medalBgColor = "bg-amber-100";
                        positionLabel = "🥉";
                      } else if (i < 15) {
                        medalColor = "text-purple-600";
                        medalBgColor = "bg-purple-100";
                        positionLabel = `${i + 1}`;
                      } else if (i < 50) {
                        medalColor = "text-blue-600";
                        medalBgColor = "bg-blue-100";
                        positionLabel = `${i + 1}`;
                      } else if (i < 100) {
                        medalColor = "text-gray-600";
                        medalBgColor = "bg-gray-100";
                        positionLabel = `${i + 1}`;
                      } else {
                        medalColor = "text-gray-500";
                        medalBgColor = "bg-gray-50";
                        positionLabel = `${i + 1}`;
                      }
                      
                      return (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-purple-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${medalBgColor} ${medalColor}`}>
                            {positionLabel}
                          </div>
                          <div>
                            <p className="font-bold">{s.name}</p>
                            <p className="text-xs text-muted-foreground">{s.date}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-lg">
                          {s.score}/{s.total}
                        </Badge>
                      </div>
                    );
                    }) : (
                      <div className="p-8 text-center text-muted-foreground">
                        Aún no hay puntajes. ¡Sé el primero!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Button className="w-full mt-6" variant="outline" onClick={() => setView("list")}>
                Volver a los Quizzes
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
