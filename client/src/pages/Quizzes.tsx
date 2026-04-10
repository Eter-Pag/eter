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
  },
  {
    id: "blackpink-trivia",
    title: "¿Cuánto sabes de BLACKPINK?",
    description: "El examen definitivo para BLINK sobre las reinas del K-pop.",
    type: "trivia",
    image: "https://media.vogue.es/photos/632997780004f291880436f5/16:9/w_2560%2Cc_limit/GettyImages-1424458514.jpg",
    questions: [
      { id: 1, text: "¿En qué año debutó BLACKPINK?", options: [{ id: "a", text: "2014" }, { id: "b", text: "2015" }, { id: "c", text: "2016" }, { id: "d", text: "2017" }], correctAnswer: "c" },
      { id: 2, text: "¿Cuál fue su canción de debut?", options: [{ id: "a", text: "Boombayah" }, { id: "b", text: "Whistle" }, { id: "c", text: "Playing with Fire" }, { id: "d", text: "A y B son correctas" }], correctAnswer: "d" },
      { id: 3, text: "¿Quién es la integrante mayor (unnie) del grupo?", options: [{ id: "a", text: "Jisoo" }, { id: "b", text: "Jennie" }, { id: "c", text: "Rosé" }, { id: "d", text: "Lisa" }], correctAnswer: "a" },
      { id: 4, text: "¿Cómo se llama el fandom oficial de BLACKPINK?", options: [{ id: "a", text: "Pinkies" }, { id: "b", text: "BLINK" }, { id: "c", text: "Army" }, { id: "d", text: "Reveluv" }], correctAnswer: "b" },
      { id: 5, text: "¿Qué integrante nació en Tailandia?", options: [{ id: "a", text: "Jisoo" }, { id: "b", text: "Jennie" }, { id: "c", text: "Rosé" }, { id: "d", text: "Lisa" }], correctAnswer: "d" },
      { id: 6, text: "¿Cuál fue el primer solo de Jennie?", options: [{ id: "a", text: "Solo" }, { id: "b", text: "You & Me" }, { id: "c", text: "Money" }, { id: "d", text: "Lalisa" }], correctAnswer: "a" },
      { id: 7, text: "¿En qué festival de música estadounidense fueron el primer grupo de K-pop femenino en presentarse?", options: [{ id: "a", text: "Lollapalooza" }, { id: "b", text: "Coachella" }, { id: "c", text: "Tomorrowland" }, { id: "d", text: "Glastonbury" }], correctAnswer: "b" },
      { id: 8, text: "¿Cuál es el color oficial del lightstick de BLACKPINK?", options: [{ id: "a", text: "Rosa y Blanco" }, { id: "b", text: "Rosa y Negro" }, { id: "c", text: "Rojo y Negro" }, { id: "d", text: "Dorado" }], correctAnswer: "b" },
      { id: 9, text: "¿Qué canción de BLACKPINK cuenta con la colaboración de Selena Gomez?", options: [{ id: "a", text: "Ice Cream" }, { id: "b", text: "Sour Candy" }, { id: "c", text: "Kiss and Make Up" }, { id: "d", text: "Bet You Wanna" }], correctAnswer: "a" },
      { id: 10, text: "¿Quién es la embajadora global de la marca Chanel?", options: [{ id: "a", text: "Jisoo" }, { id: "b", text: "Jennie" }, { id: "c", text: "Rosé" }, { id: "d", text: "Lisa" }], correctAnswer: "b" },
      { id: 11, text: "¿Cuál es el nombre real de Rosé?", options: [{ id: "a", text: "Roseanne Park" }, { id: "b", text: "Park Chaeyoung" }, { id: "c", text: "Ambas son correctas" }, { id: "d", text: "Lalisa Manobal" }], correctAnswer: "c" },
      { id: 12, text: "¿Qué canción superó los mil millones de vistas primero en YouTube?", options: [{ id: "a", text: "Kill This Love" }, { id: "b", text: "DDU-DU DDU-DU" }, { id: "c", text: "How You Like That" }, { id: "d", text: "As If It's Your Last" }], correctAnswer: "b" },
      { id: 13, text: "¿Cómo se llama el reality show de BLACKPINK?", options: [{ id: "a", text: "BLACKPINK House" }, { id: "b", text: "Running Man" }, { id: "c", text: "Going BLACKPINK" }, { id: "d", text: "The Show" }], correctAnswer: "a" },
      { id: 14, text: "¿Qué integrante debutó como actriz en el drama 'Snowdrop'?", options: [{ id: "a", text: "Jennie" }, { id: "b", text: "Jisoo" }, { id: "c", text: "Rosé" }, { id: "d", text: "Lisa" }], correctAnswer: "b" },
      { id: 15, text: "¿Cuál es el nombre del primer álbum de estudio completo de BLACKPINK?", options: [{ id: "a", text: "Square Up" }, { id: "b", text: "Kill This Love" }, { id: "c", text: "The Album" }, { id: "d", text: "Born Pink" }], correctAnswer: "c" }
    ]
  },
  {
    id: "straykids-trivia",
    title: "¿Eres un verdadero STAY?",
    description: "Demuestra cuánto sabes sobre Stray Kids y su música auto-producida.",
    type: "trivia",
    image: "https://media.vogue.co.uk/photos/6638a531e0f0656f4e64560d/16:9/w_1280,c_limit/GettyImages-2151336443.jpg",
    questions: [
      { id: 1, text: "¿En qué año debutó Stray Kids?", options: [{ id: "a", text: "2017" }, { id: "b", text: "2018" }, { id: "c", text: "2019" }, { id: "d", text: "2020" }], correctAnswer: "b" },
      { id: 2, text: "¿Cómo se llama el programa de supervivencia donde se formó el grupo?", options: [{ id: "a", text: "Sixteen" }, { id: "b", text: "Stray Kids" }, { id: "c", text: "Produce 101" }, { id: "d", text: "I-LAND" }], correctAnswer: "b" },
      { id: 3, text: "¿Quién es el líder de Stray Kids?", options: [{ id: "a", text: "Bang Chan" }, { id: "b", text: "Lee Know" }, { id: "c", text: "Changbin" }, { id: "d", text: "Hyunjin" }], correctAnswer: "a" },
      { id: 4, text: "¿Cómo se llama el trío de producción dentro del grupo?", options: [{ id: "a", text: "Vocal Racha" }, { id: "b", text: "Dance Racha" }, { id: "c", text: "3RACHA" }, { id: "d", text: "Rap Racha" }], correctAnswer: "c" },
      { id: 5, text: "¿Cuál fue su canción de debut oficial?", options: [{ id: "a", text: "Hellevator" }, { id: "b", text: "District 9" }, { id: "c", text: "My Pace" }, { id: "d", text: "Miroh" }], correctAnswer: "b" },
      { id: 6, text: "¿Qué integrante es conocido por su amor por los gatos?", options: [{ id: "a", text: "Han" }, { id: "b", text: "Felix" }, { id: "c", text: "Lee Know" }, { id: "d", text: "I.N" }], correctAnswer: "c" },
      { id: 7, text: "¿De qué país son originarios Bang Chan y Felix?", options: [{ id: "a", text: "Canadá" }, { id: "b", text: "Estados Unidos" }, { id: "c", text: "Australia" }, { id: "d", text: "Nueva Zelanda" }], correctAnswer: "c" },
      { id: 8, text: "¿Cuál es el nombre del fandom oficial?", options: [{ id: "a", text: "STAY" }, { id: "b", text: "SKZ-L" }, { id: "c", text: "Atiny" }, { id: "d", text: "Choice" }], correctAnswer: "a" },
      { id: 9, text: "¿Qué canción les dio su primera victoria en un programa musical?", options: [{ id: "a", text: "District 9" }, { id: "b", text: "Miroh" }, { id: "c", text: "God's Menu" }, { id: "d", text: "Back Door" }], correctAnswer: "b" },
      { id: 10, text: "¿Cómo se llama el personaje de SKZOO de Hyunjin?", options: [{ id: "a", text: "Wolf Chan" }, { id: "b", text: "Jiniret" }, { id: "c", text: "BbokAri" }, { id: "d", text: "Dwaekki" }], correctAnswer: "b" },
      { id: 11, text: "¿Cuál es el nombre real de I.N?", options: [{ id: "a", text: "Yang Jeongin" }, { id: "b", text: "Kim Seungmin" }, { id: "c", text: "Han Jisung" }, { id: "d", text: "Lee Yongbok" }], correctAnswer: "a" },
      { id: 12, text: "¿Qué integrante es conocido por su voz extremadamente profunda?", options: [{ id: "a", text: "Bang Chan" }, { id: "b", text: "Changbin" }, { id: "c", text: "Felix" }, { id: "d", text: "Seungmin" }], correctAnswer: "c" },
      { id: 13, text: "¿Cuál fue el primer álbum de Stray Kids en debutar en el #1 del Billboard 200?", options: [{ id: "a", text: "NOEASY" }, { id: "b", text: "ODDINARY" }, { id: "c", text: "MAXIDENT" }, { id: "d", text: "5-STAR" }], correctAnswer: "b" },
      { id: 14, text: "¿Quién es el integrante más joven (maknae) de Stray Kids?", options: [{ id: "a", text: "Han" }, { id: "b", text: "Felix" }, { id: "c", text: "Seungmin" }, { id: "d", text: "I.N" }], correctAnswer: "d" },
      { id: 15, text: "¿Cómo se llama la serie de videos semanales donde Bang Chan interactúa con los fans?", options: [{ id: "a", text: "Chan's Room" }, { id: "b", text: "SKZ-Talker" }, { id: "c", text: "Two Kids Room" }, { id: "d", text: "Finding SKZ" }], correctAnswer: "a" }
    ]
  },
  {
    id: "twice-trivia",
    title: "¿Eres un ONCE experto?",
    description: "Pon a prueba tus conocimientos sobre TWICE, el grupo de la nación.",
    type: "trivia",
    image: "https://hips.hearstapps.com/hmg-prod/images/twice-celebrates-at-the-2023-billboard-women-in-music-news-photo-1677764786.jpg?crop=1xw:1xh;center,top&resize=1200:*",
    questions: [
      { id: 1, text: "¿A través de qué programa de supervivencia se formó TWICE?", options: [{ id: "a", text: "Sixteen" }, { id: "b", text: "Produce 48" }, { id: "c", text: "I-LAND" }, { id: "d", text: "Girls Planet 999" }], correctAnswer: "a" },
      { id: 2, text: "¿En qué año debutó TWICE?", options: [{ id: "a", text: "2014" }, { id: "b", text: "2015" }, { id: "c", text: "2016" }, { id: "d", text: "2017" }], correctAnswer: "b" },
      { id: 3, text: "¿Quién es la líder de TWICE?", options: [{ id: "a", text: "Nayeon" }, { id: "b", text: "Jeongyeon" }, { id: "c", text: "Jihyo" }, { id: "d", text: "Momo" }], correctAnswer: "c" },
      { id: 4, text: "¿Cuántas integrantes japonesas tiene el grupo?", options: [{ id: "a", text: "1" }, { id: "b", text: "2" }, { id: "c", text: "3" }, { id: "d", text: "4" }], correctAnswer: "c" },
      { id: 5, text: "¿Cuál fue su canción de debut?", options: [{ id: "a", text: "Cheer Up" }, { id: "b", text: "Like OOH-AHH" }, { id: "c", text: "TT" }, { id: "d", text: "Knock Knock" }], correctAnswer: "b" },
      { id: 6, text: "¿Cómo se llama el fandom oficial?", options: [{ id: "a", text: "Twice-L" }, { id: "b", text: "ONCE" }, { id: "c", text: "Buddy" }, { id: "d", text: "Midzy" }], correctAnswer: "b" },
      { id: 7, text: "¿Qué canción de TWICE se hizo viral por el paso 'Shy Shy Shy'?", options: [{ id: "a", text: "Likey" }, { id: "b", text: "Cheer Up" }, { id: "c", text: "Signal" }, { id: "d", text: "Fancy" }], correctAnswer: "b" },
      { id: 8, text: "¿Quién es la integrante más joven (maknae)?", options: [{ id: "a", text: "Dahyun" }, { id: "b", text: "Chaeyoung" }, { id: "c", text: "Tzuyu" }, { id: "d", text: "Mina" }], correctAnswer: "c" },
      { id: 9, text: "¿Cuál es la subunidad japonesa formada por Momo, Sana y Mina?", options: [{ id: "a", text: "J-Line" }, { id: "b", text: "MISAMO" }, { id: "c", text: "3S" }, { id: "d", text: "T-Unit" }], correctAnswer: "b" },
      { id: 10, text: "¿Qué canción de TWICE fue su primer sencillo completamente en inglés?", options: [{ id: "a", text: "The Feels" }, { id: "b", text: "Moonlight Sunrise" }, { id: "c", text: "I Can't Stop Me" }, { id: "d", text: "Cry For Me" }], correctAnswer: "a" },
      { id: 11, text: "¿Quién es conocida como 'Dubu' (Tofu) por su piel blanca?", options: [{ id: "a", text: "Nayeon" }, { id: "b", text: "Dahyun" }, { id: "c", text: "Mina" }, { id: "d", text: "Jeongyeon" }], correctAnswer: "b" },
      { id: 12, text: "¿Cuál es el color oficial de TWICE?", options: [{ id: "a", text: "Rosa y Morado" }, { id: "b", text: "Albaricoque y Neón Magenta" }, { id: "c", text: "Rojo y Blanco" }, { id: "d", text: "Azul y Amarillo" }], correctAnswer: "b" },
      { id: 13, text: "¿Qué integrante es famosa por su habilidad en el ballet?", options: [{ id: "a", text: "Momo" }, { id: "b", text: "Mina" }, { id: "c", text: "Sana" }, { id: "d", text: "Jihyo" }], correctAnswer: "b" },
      { id: 14, text: "¿Cómo se llama el lightstick oficial de TWICE?", options: [{ id: "a", text: "Candy Bong" }, { id: "b", text: "Twice Light" }, { id: "c", text: "Once Stick" }, { id: "d", text: "Love Bong" }], correctAnswer: "a" },
      { id: 15, text: "¿Qué canción de TWICE tiene el famoso verso 'Is Sana gay?' (que en realidad es 'I wanna say')?", options: [{ id: "a", text: "Heart Shaker" }, { id: "b", text: "Likey" }, { id: "c", text: "What is Love?" }, { id: "d", text: "Yes or Yes" }], correctAnswer: "a" }
    ]
  },
  {
    id: "txt-trivia",
    title: "¿Eres un MOA de corazón?",
    description: "Demuestra cuánto sabes sobre Tomorrow X Together (TXT).",
    type: "trivia",
    image: "https://images.lifestyleasia.com/wp-content/uploads/sites/2/2023/01/26131435/tomorrow-x-together-txt-members-guide-1600x900.jpg",
    questions: [
      { id: 1, text: "¿En qué año debutó TXT?", options: [{ id: "a", text: "2018" }, { id: "b", text: "2019" }, { id: "c", text: "2020" }, { id: "d", text: "2021" }], correctAnswer: "b" },
      { id: 2, text: "¿Qué significan las siglas TXT?", options: [{ id: "a", text: "Together X Tomorrow" }, { id: "b", text: "Tomorrow X Together" }, { id: "c", text: "The X Team" }, { id: "d", text: "Total X Technology" }], correctAnswer: "b" },
      { id: 3, text: "¿Quién es el líder de TXT?", options: [{ id: "a", text: "Yeonjun" }, { id: "b", text: "Soobin" }, { id: "c", text: "Beomgyu" }, { id: "d", text: "Taehyun" }], correctAnswer: "b" },
      { id: 4, text: "¿Cómo se llama el fandom oficial?", options: [{ id: "a", text: "MOA" }, { id: "b", text: "ARMY" }, { id: "c", text: "Choice" }, { id: "d", text: "Engene" }], correctAnswer: "a" },
      { id: 5, text: "¿Cuál fue su canción de debut?", options: [{ id: "a", text: "Crown" }, { id: "b", text: "Run Away" }, { id: "c", text: "Blue Hour" }, { id: "d", text: "Cat & Dog" }], correctAnswer: "a" },
      { id: 6, text: "¿Quién es conocido como el 'Legendary Trainee' de Big Hit?", options: [{ id: "a", text: "Soobin" }, { id: "b", text: "Yeonjun" }, { id: "c", text: "Beomgyu" }, { id: "d", text: "Huening Kai" }], correctAnswer: "b" },
      { id: 7, text: "¿Cuál es la nacionalidad de Huening Kai?", options: [{ id: "a", text: "Coreana" }, { id: "b", text: "Estadounidense" }, { id: "c", text: "Ambas (Coreana-Estadounidense)" }, { id: "d", text: "Canadiense" }], correctAnswer: "c" },
      { id: 8, text: "¿Qué canción de TXT tiene un título muy largo que incluye '5:53'?", options: [{ id: "a", text: "Blue Hour" }, { id: "b", text: "Can't You See Me?" }, { id: "c", text: "Good Boy Gone Bad" }, { id: "d", text: "Sugar Rush Ride" }], correctAnswer: "a" },
      { id: 9, text: "¿Quién es el integrante más joven (maknae)?", options: [{ id: "a", text: "Beomgyu" }, { id: "b", text: "Taehyun" }, { id: "c", text: "Huening Kai" }, { id: "d", text: "Soobin" }], correctAnswer: "c" },
      { id: 10, text: "¿Cuál es el nombre del primer álbum de estudio de TXT?", options: [{ id: "a", text: "The Dream Chapter: STAR" }, { id: "b", text: "The Dream Chapter: MAGIC" }, { id: "c", text: "The Chaos Chapter: FREEZE" }, { id: "d", text: "The Name Chapter: TEMPTATION" }], correctAnswer: "b" },
      { id: 11, text: "¿Qué integrante es conocido por su amor por los peluches?", options: [{ id: "a", text: "Yeonjun" }, { id: "b", text: "Huening Kai" }, { id: "c", text: "Soobin" }, { id: "d", text: "Taehyun" }], correctAnswer: "b" },
      { id: 12, text: "¿Cuál es el nombre del lightstick oficial de TXT?", options: [{ id: "a", text: "Moa Bong" }, { id: "b", text: "Star Stick" }, { id: "c", text: "Together Stick" }, { id: "d", text: "Crown Light" }], correctAnswer: "a" },
      { id: 13, text: "¿En qué ciudad nació Beomgyu?", options: [{ id: "a", text: "Seúl" }, { id: "b", text: "Busan" }, { id: "c", text: "Daegu" }, { id: "d", text: "Incheon" }], correctAnswer: "c" },
      { id: 14, text: "¿Qué canción de TXT trata sobre querer ser un perro para estar con alguien?", options: [{ id: "a", text: "Cat & Dog" }, { id: "b", text: "Puma" }, { id: "c", text: "Anti-Romantic" }, { id: "d", text: "LO$ER=LO♡ER" }], correctAnswer: "a" },
      { id: 15, text: "¿Cómo se llama el programa de variedades propio de TXT?", options: [{ id: "a", text: "Run TXT" }, { id: "b", text: "TO DO X TXT" }, { id: "c", text: "TXT House" }, { id: "d", text: "Going TXT" }], correctAnswer: "b" }
    ]
  },
  {
    id: "babymonster-trivia",
    title: "¿Eres un fan de BABYMONSTER?",
    description: "Demuestra cuánto sabes sobre el nuevo grupo de YG Entertainment.",
    type: "trivia",
    image: "https://img.vogue.com.hk/2024/04/Baby-Monster.jpg",
    questions: [
      { id: 1, text: "¿Cuántas integrantes tiene BABYMONSTER?", options: [{ id: "a", text: "5" }, { id: "b", text: "6" }, { id: "c", text: "7" }, { id: "d", text: "8" }], correctAnswer: "c" },
      { id: 2, text: "¿En qué año lanzaron su sencillo de pre-debut 'Dream'?", options: [{ id: "a", text: "2022" }, { id: "b", text: "2023" }, { id: "c", text: "2024" }, { id: "d", text: "2021" }], correctAnswer: "b" },
      { id: 3, text: "¿Cuál es el nombre de la integrante que regresó para el debut oficial con 'SHEESH'?", options: [{ id: "a", text: "Ahyeon" }, { id: "b", text: "Ruka" }, { id: "c", text: "Chiquita" }, { id: "d", text: "Pharita" }], correctAnswer: "a" },
      { id: 4, text: "¿Qué integrante es la más joven (maknae) y es de Tailandia?", options: [{ id: "a", text: "Chiquita" }, { id: "b", text: "Pharita" }, { id: "c", text: "Asa" }, { id: "d", text: "Rami" }], correctAnswer: "a" },
      { id: 5, text: "¿Cuántas integrantes japonesas hay en el grupo?", options: [{ id: "a", text: "1" }, { id: "b", text: "2" }, { id: "c", text: "3" }, { id: "d", text: "0" }], correctAnswer: "b" },
      { id: 6, text: "¿Cuál fue su primer sencillo oficial como grupo de 6 integrantes?", options: [{ id: "a", text: "Dream" }, { id: "b", text: "Batter Up" }, { id: "c", text: "Stuck In The Middle" }, { id: "d", text: "SHEESH" }], correctAnswer: "b" },
      { id: 7, text: "¿Cómo se llama el programa donde se evaluó a las integrantes antes del debut?", options: [{ id: "a", text: "Last Evaluation" }, { id: "b", text: "YG Treasure Box" }, { id: "c", text: "WIN: Who Is Next" }, { id: "d", text: "Sixteen" }], correctAnswer: "a" },
      { id: 8, text: "¿Quién es la integrante mayor (unnie) de BABYMONSTER?", options: [{ id: "a", text: "Ruka" }, { id: "b", text: "Pharita" }, { id: "c", text: "Asa" }, { id: "d", text: "Ahyeon" }], correctAnswer: "a" },
      { id: 9, text: "¿Cuál es el nombre del fandom oficial anunciado recientemente?", options: [{ id: "a", text: "Monsters" }, { id: "b", text: "Babies" }, { id: "c", text: "MONSTIEZ" }, { id: "d", text: "B-Army" }], correctAnswer: "c" },
      { id: 10, text: "¿Qué integrante es conocida por su potente rap y es japonesa?", options: [{ id: "a", text: "Asa" }, { id: "b", text: "Ruka" }, { id: "c", text: "Ambas son correctas" }, { id: "d", text: "Rora" }], correctAnswer: "c" },
      { id: 11, text: "¿Cuál es el nombre real de Rami (antes conocida como Haram)?", options: [{ id: "a", text: "Shin Haram" }, { id: "b", text: "Lee Haram" }, { id: "c", text: "Park Rami" }, { id: "d", text: "Choi Rami" }], correctAnswer: "a" },
      { id: 12, text: "¿De qué nacionalidad es Pharita?", options: [{ id: "a", text: "Coreana" }, { id: "b", text: "Japonesa" }, { id: "c", text: "Tailandesa" }, { id: "d", text: "Vietnamita" }], correctAnswer: "c" },
      { id: 13, text: "¿Qué canción de BABYMONSTER es una balada lanzada antes de su mini-álbum?", options: [{ id: "a", text: "Batter Up" }, { id: "b", text: "Stuck In The Middle" }, { id: "c", text: "Dream" }, { id: "d", text: "Like That" }], correctAnswer: "b" },
      { id: 14, text: "¿Quién escribió y produjo la canción 'Like That' para ellas?", options: [{ id: "a", text: "Teddy" }, { id: "b", text: "G-Dragon" }, { id: "c", text: "Charlie Puth" }, { id: "d", text: "Zico" }], correctAnswer: "c" },
      { id: 15, text: "¿En qué agencia de entretenimiento debutó BABYMONSTER?", options: [{ id: "a", text: "SM" }, { id: "b", text: "JYP" }, { id: "c", text: "YG" }, { id: "d", text: "HYBE" }], correctAnswer: "c" }
    ]
  },
  {
    id: "ive-trivia",
    title: "¿Cuánto sabes de IVE?",
    description: "Pon a prueba tus conocimientos sobre las reinas del 'Eleven'.",
    type: "trivia",
    image: "https://media.allure.com/photos/643862214300e84489814f85/16:9/w_2560%2Cc_limit/ive%2520k-pop%2520group%2520members.jpg",
    questions: [
      { id: 1, text: "¿En qué año debutó IVE?", options: [{ id: "a", text: "2020" }, { id: "b", text: "2021" }, { id: "c", text: "2022" }, { id: "d", text: "2023" }], correctAnswer: "b" },
      { id: 2, text: "¿Cuál fue su canción de debut?", options: [{ id: "a", text: "Love Dive" }, { id: "b", text: "Eleven" }, { id: "c", text: "After LIKE" }, { id: "d", text: "I AM" }], correctAnswer: "b" },
      { id: 3, text: "¿Qué dos integrantes fueron parte de IZ*ONE?", options: [{ id: "a", text: "Wonyoung y Yujin" }, { id: "b", text: "Rei y Gaeul" }, { id: "c", text: "Liz y Leeseo" }, { id: "d", text: "Wonyoung y Liz" }], correctAnswer: "a" },
      { id: 4, text: "¿Quién es la líder de IVE?", options: [{ id: "a", text: "Wonyoung" }, { id: "b", text: "Yujin" }, { id: "c", text: "Gaeul" }, { id: "d", text: "Rei" }], correctAnswer: "b" },
      { id: 5, text: "¿Cómo se llama el fandom oficial?", options: [{ id: "a", text: "DIVE" }, { id: "b", text: "LOVE" }, { id: "c", text: "IVY" }, { id: "d", text: "STAR" }], correctAnswer: "a" },
      { id: 6, text: "¿Qué canción de IVE ganó el SOTY (Canción del Año) en los MAMA 2022?", options: [{ id: "a", text: "Eleven" }, { id: "b", text: "Love Dive" }, { id: "c", text: "After LIKE" }, { id: "d", text: "Baddie" }], correctAnswer: "b" },
      { id: 7, text: "¿De qué nacionalidad es Rei?", options: [{ id: "a", text: "Coreana" }, { id: "b", text: "Japonesa" }, { id: "c", text: "China" }, { id: "d", text: "Tailandesa" }], correctAnswer: "b" },
      { id: 8, text: "¿Quién es la integrante más joven (maknae)?", options: [{ id: "a", text: "Liz" }, { id: "b", text: "Rei" }, { id: "c", text: "Leeseo" }, { id: "d", text: "Wonyoung" }], correctAnswer: "c" },
      { id: 9, text: "¿Cuál es el nombre real de Liz?", options: [{ id: "a", text: "Kim Jiwon" }, { id: "b", text: "Choi Jiwon" }, { id: "c", text: "Lee Jiwon" }, { id: "d", text: "Park Jiwon" }], correctAnswer: "a" },
      { id: 10, text: "¿Qué canción de IVE utiliza un sample de 'I Will Survive' de Gloria Gaynor?", options: [{ id: "a", text: "Love Dive" }, { id: "b", text: "After LIKE" }, { id: "c", text: "Kitsch" }, { id: "d", text: "Off The Record" }], correctAnswer: "b" },
      { id: 11, text: "¿Cómo se llama el primer álbum de estudio completo de IVE?", options: [{ id: "a", text: "I've IVE" }, { id: "b", text: "I've Mine" }, { id: "c", text: "Love Dive" }, { id: "d", text: "Eleven" }], correctAnswer: "a" },
      { id: 12, text: "¿Qué integrante es conocida por sus icónicos hoyuelos?", options: [{ id: "a", text: "Gaeul" }, { id: "b", text: "Liz" }, { id: "c", text: "Leeseo" }, { id: "d", text: "Yujin" }], correctAnswer: "b" },
      { id: 13, text: "¿Cuál es el eslogan de presentación de IVE?", options: [{ id: "a", text: "I HAVE! Hola, somos IVE" }, { id: "b", text: "DIVE INTO IVE!" }, { id: "c", text: "WE ARE IVE!" }, { id: "d", text: "LOVE IVE!" }], correctAnswer: "b" },
      { id: 14, text: "¿Quién es la integrante mayor (unnie) del grupo?", options: [{ id: "a", text: "Yujin" }, { id: "b", text: "Gaeul" }, { id: "c", text: "Rei" }, { id: "d", text: "Wonyoung" }], correctAnswer: "b" },
      { id: 15, text: "¿En qué agencia debutó IVE?", options: [{ id: "a", text: "JYP" }, { id: "b", text: "Starship Entertainment" }, { id: "c", text: "SM" }, { id: "d", text: "Cube" }], correctAnswer: "b" }
    ]
  },
  {
    id: "kep1er-trivia",
    title: "¿Cuánto sabes de Kep1er?",
    description: "Demuestra que eres un verdadero Kep1ian.",
    type: "trivia",
    image: "https://img.vogue.com.hk/2022/01/Kep1er-1.jpg",
    questions: [
      { id: 1, text: "¿A través de qué programa se formó Kep1er?", options: [{ id: "a", text: "Produce 48" }, { id: "b", text: "Girls Planet 999" }, { id: "c", text: "Sixteen" }, { id: "d", text: "Queendom" }], correctAnswer: "b" },
      { id: 2, text: "¿En qué año debutó Kep1er?", options: [{ id: "a", text: "2021" }, { id: "b", text: "2022" }, { id: "c", text: "2023" }, { id: "d", text: "2020" }], correctAnswer: "b" },
      { id: 3, text: "¿Cuál fue su canción de debut?", options: [{ id: "a", text: "Up!" }, { id: "b", text: "WA DA DA" }, { id: "c", text: "We Fresh" }, { id: "d", text: "Giddy" }], correctAnswer: "b" },
      { id: 4, text: "¿Quién fue la ganadora del primer lugar (P01) en Girls Planet 999?", options: [{ id: "a", text: "Huening Bahiyyih" }, { id: "b", text: "Chaehyun" }, { id: "c", text: "Xiaoting" }, { id: "d", text: "Yujin" }], correctAnswer: "b" },
      { id: 5, text: "¿Quién es la líder de Kep1er?", options: [{ id: "a", text: "Yujin" }, { id: "b", text: "Mashiro" }, { id: "c", text: "Chaehyun" }, { id: "d", text: "Dayeon" }], correctAnswer: "a" },
      { id: 6, text: "¿Cuántas integrantes tenía originalmente el grupo?", options: [{ id: "a", text: "7" }, { id: "b", text: "9" }, { id: "c", text: "12" }, { id: "d", text: "11" }], correctAnswer: "b" },
      { id: 7, text: "¿Cómo se llama el fandom oficial?", options: [{ id: "a", text: "Kep1ian" }, { id: "b", text: "Planet" }, { id: "c", text: "Guardians" }, { id: "d", text: "Star" }], correctAnswer: "a" },
      { id: 8, text: "¿Qué integrante es la hermana menor de Huening Kai de TXT?", options: [{ id: "a", text: "Youngeun" }, { id: "b", text: "Huening Bahiyyih" }, { id: "c", text: "Hikaru" }, { id: "d", text: "Yeseo" }], correctAnswer: "b" },
      { id: 9, text: "¿De qué país es originaria Xiaoting?", options: [{ id: "a", text: "Corea" }, { id: "b", text: "Japón" }, { id: "c", text: "China" }, { id: "d", text: "Tailandia" }], correctAnswer: "c" },
      { id: 10, text: "¿Qué integrante era parte del grupo CLC antes de Kep1er?", options: [{ id: "a", text: "Yujin" }, { id: "b", text: "Mashiro" }, { id: "c", text: "Hikaru" }, { id: "d", text: "Chaehyun" }], correctAnswer: "a" },
      { id: 11, text: "¿Cuáles son los colores oficiales de Kep1er?", options: [{ id: "a", text: "Lavanda y Blanco" }, { id: "b", text: "Lavanda y Amarillo" }, { id: "c", text: "Rosa y Azul" }, { id: "d", text: "Morado y Dorado" }], correctAnswer: "b" },
      { id: 12, text: "¿Qué canción de Kep1er se hizo viral en TikTok por su coreografía energética?", options: [{ id: "a", text: "WA DA DA" }, { id: "b", text: "Up!" }, { id: "c", text: "Wing Wing" }, { id: "d", text: "Galileo" }], correctAnswer: "a" },
      { id: 13, text: "¿Quiénes son las integrantes japonesas del grupo?", options: [{ id: "a", text: "Mashiro y Hikaru" }, { id: "b", text: "Xiaoting y Hikaru" }, { id: "c", text: "Mashiro y Shiro" }, { id: "d", text: "Hikaru y Yeseo" }], correctAnswer: "a" },
      { id: 14, text: "¿Cuál es el nombre del primer mini-álbum de Kep1er?", options: [{ id: "a", text: "FIRST IMPACT" }, { id: "b", text: "DOUBLAST" }, { id: "c", text: "TROUBLESHOOTER" }, { id: "d", text: "LOVSTRUCK!" }], correctAnswer: "a" },
      { id: 15, text: "¿Qué integrante es conocida por ser una 'All-rounder' y excelente rapera?", options: [{ id: "a", text: "Hikaru" }, { id: "b", text: "Dayeon" }, { id: "c", text: "Youngeun" }, { id: "d", text: "Todas las anteriores" }], correctAnswer: "d" }
    ]
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
      <div className="max-w-6xl mx-auto">
        
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {QUIZZES.map((quiz) => (
                <Card key={quiz.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all group h-full flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <img src={quiz.image} alt={quiz.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-white/90 text-slate-900 border-none">
                      {quiz.type === "trivia" ? "Trivia" : "Personalidad"}
                    </Badge>
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">{quiz.title}</h3>
                    <p className="text-slate-500 text-sm mb-6 flex-grow">{quiz.description}</p>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => startQuiz(quiz)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2"
                      >
                        <Play className="size-4" /> Comenzar
                      </Button>
                      {quiz.type === "trivia" && (
                        <Button 
                          onClick={() => {
                            setActiveQuiz(quiz);
                            setView("leaderboard");
                          }}
                          variant="outline"
                          className="px-4 border-purple-600 text-purple-600 hover:bg-purple-50"
                        >
                          <Trophy className="size-4" />
                        </Button>
                      )}
                    </div>
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
                <h2 className="text-2xl font-bold mb-2">¡Hola, Fan!</h2>
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
                        {calculateScore() === activeQuiz.questions.length ? "¡Increíble! Eres un fan de élite. 💜" : 
                         calculateScore() > activeQuiz.questions.length / 2 ? "¡Muy bien! Conoces mucho sobre este grupo. ✨" : 
                         "¡Sigue aprendiendo! Todo fan empezó así. 😊"}
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
          {view === "leaderboard" && activeQuiz && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-none shadow-2xl overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8 text-center">
                  <Trophy className="size-12 text-yellow-400 mx-auto mb-4" />
                  <CardTitle className="text-3xl font-black">Ranking Global</CardTitle>
                  <CardDescription className="text-slate-400 text-lg">{activeQuiz?.title}</CardDescription>
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
