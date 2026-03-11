export type DebugConfig = {
  enabled: boolean
  latency: {
    user: number
    assistant: number
    typing: number
  }
  errors: {
    userSendFails: boolean
    assistantFails: boolean
  }
  populate: {
    userCount: number
    assistantCount: number
  }
}

export const DEFAULT_DEBUG_CONFIG: DebugConfig = {
  enabled: false,
  latency: {
    user: 300,
    assistant: 500,
    typing: 20,
  },
  errors: {
    userSendFails: false,
    assistantFails: false,
  },
  populate: {
    userCount: 3,
    assistantCount: 3,
  },
}

export const MOCK_RESPONSES = {
  short: ["Oui.", "Je comprends.", "Bien sûr.", "D'accord.", "Hmm..."],

  medium: [
    "Je suis là pour t'écouter. Prends ton temps.",
    "C'est tout à fait normal de ressentir ça.",
    "Merci de partager ça avec moi. Comment te sens-tu maintenant?",
    "Je comprends que ce n'est pas facile. Tu veux en parler davantage?",
    "Tes sentiments sont valides. Je suis là pour toi.",
  ],

  long: [
    "C'est vraiment courageux de ta part d'en parler. Les émotions peuvent être complexes et parfois contradictoires. Il n'y a pas de bonne ou de mauvaise façon de ressentir les choses. Ce qui compte, c'est que tu prennes le temps de les reconnaître.",
    "Je perçois beaucoup de choses dans ce que tu partages. Chaque expérience que nous vivons façonne qui nous sommes. Prends le temps qu'il te faut pour explorer ces sentiments - je suis là pour t'accompagner.",
    "Merci pour ta confiance. Ce que tu décris me semble être une situation difficile à naviguer. Parfois, le simple fait de mettre des mots sur nos expériences peut aider à y voir plus clair. Qu'est-ce qui te pèse le plus en ce moment?",
  ],

  withEmoji: [
    "Je t'entends 💙 Prends soin de toi.",
    "C'est tout à fait compréhensible ✨",
    "Tu es plus fort(e) que tu ne le penses 🌱",
  ],

  questions: [
    "Qu'est-ce qui t'a amené à penser à ça?",
    "Comment est-ce que ça se manifeste pour toi au quotidien?",
    "Est-ce que tu as quelqu'un à qui en parler dans ton entourage?",
    "Depuis quand ressens-tu ça?",
    "Qu'est-ce qui t'aiderait le plus en ce moment?",
  ],

  supportive: [
    "Tu n'es pas seul(e) dans cette épreuve. Je suis là.",
    "Chaque petit pas compte. Tu fais de ton mieux, et c'est suffisant.",
    "Il est normal d'avoir des hauts et des bas. L'important est de ne pas rester seul(e) avec ça.",
  ],
} as const

export const MOCK_USER_MESSAGES = [
  "Je me sens un peu perdu(e) aujourd'hui.",
  "J'ai du mal à dormir ces derniers temps.",
  "Parfois je me demande si tout ça vaut la peine.",
  "Je suis stressé(e) par le travail.",
  "Je me sens seul(e).",
  "Comment gérer l'anxiété?",
  "J'ai besoin de parler à quelqu'un.",
  "Merci d'être là.",
]

export type MockResponseType = keyof typeof MOCK_RESPONSES
