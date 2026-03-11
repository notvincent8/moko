import { ArrowLeftIcon } from "@radix-ui/react-icons"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "À propos · Moko",
  description: "Informations légales, confidentialité et conditions d'utilisation de Moko.",
}

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Retour
        </Link>

        <h1 className="font-display text-3xl font-bold mb-8">À propos de Moko</h1>

        {/* What is Moko */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4 text-flame">Qu'est-ce que Moko ?</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            Moko est une interface de conversation propulsée par l'intelligence artificielle Claude, développée par
            Anthropic. C'est un projet personnel et expérimental, créé avec soin mais sans prétention.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Moko n'est pas un service professionnel. C'est une boîte noire mystérieuse qui aime discuter, rien de plus.
          </p>
        </section>

        {/* What Moko is NOT */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4 text-flame">Ce que Moko n'est pas</h2>
          <ul className="space-y-3 text-foreground/90">
            <li className="flex gap-3">
              <span className="text-flame shrink-0">~</span>
              <span>
                <strong>Pas un professionnel de santé.</strong> Moko ne peut pas diagnostiquer, traiter ou conseiller
                sur des questions médicales ou psychologiques.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-flame shrink-0">~</span>
              <span>
                <strong>Pas un conseiller juridique ou financier.</strong> Les informations fournies sont générales et
                ne constituent pas des conseils professionnels.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-flame shrink-0">~</span>
              <span>
                <strong>Pas infaillible.</strong> L'IA peut se tromper, halluciner des informations ou mal comprendre le
                contexte.
              </span>
            </li>
          </ul>
        </section>

        {/* Privacy & Data */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4 text-flame">Confidentialité & Données</h2>

          <h3 className="font-semibold mb-2">Ce que Moko collecte</h3>
          <p className="text-foreground/90 leading-relaxed mb-4">
            Moko lui-même ne stocke aucune donnée de conversation. Pas de base de données, pas d'historique côté
            serveur, pas de cookies de tracking.
          </p>

          <h3 className="font-semibold mb-2">Ce qu'Anthropic reçoit</h3>
          <p className="text-foreground/90 leading-relaxed mb-4">
            Tes messages sont envoyés à l'API d'Anthropic pour générer les réponses. Anthropic peut traiter et
            conserver ces données selon sa{" "}
            <a
              href="https://www.anthropic.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-flame hover:underline"
            >
              politique de confidentialité
            </a>{" "}
            et ses{" "}
            <a
              href="https://www.anthropic.com/policies/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-flame hover:underline"
            >
              conditions d'utilisation
            </a>
            .
          </p>

          <h3 className="font-semibold mb-2">Tes droits (RGPD)</h3>
          <p className="text-foreground/90 leading-relaxed">
            Si tu es en Europe, tu as des droits sur tes données personnelles (accès, rectification, suppression). Pour
            les données traitées par Anthropic, contacte directement{" "}
            <a href="mailto:privacy@anthropic.com" className="text-flame hover:underline">
              privacy@anthropic.com
            </a>
            .
          </p>
        </section>

        {/* Recommendations */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4 text-flame">Recommandations</h2>
          <ul className="space-y-3 text-foreground/90">
            <li className="flex gap-3">
              <span className="text-flame shrink-0">~</span>
              <span>Ne partage jamais d'informations personnelles sensibles (nom complet, adresse, téléphone, etc.)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-flame shrink-0">~</span>
              <span>Ne partage pas d'informations bancaires ou de mots de passe</span>
            </li>
            <li className="flex gap-3">
              <span className="text-flame shrink-0">~</span>
              <span>
                Si tu traverses une période difficile, consulte la page{" "}
                <Link href="/resources" className="text-flame hover:underline">
                  Ressources
                </Link>{" "}
                pour trouver de l'aide professionnelle
              </span>
            </li>
          </ul>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4 text-flame">Limitation de responsabilité</h2>
          <p className="text-foreground/90 leading-relaxed">
            Moko est fourni "tel quel", sans garantie d'aucune sorte. Le créateur de cette interface ne peut être tenu
            responsable des réponses générées par l'IA, de leur exactitude, ou de toute décision prise sur la base de
            ces réponses. Utilise Moko à ta propre discrétion.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4 text-flame">Contact</h2>
          <p className="text-foreground/90 leading-relaxed">
            Pour toute question concernant Moko, tu peux me contacter via{" "}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-flame hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-border text-sm text-muted-foreground">
          <p>Dernière mise à jour : Mars 2025</p>
        </footer>
      </div>
    </main>
  )
}
