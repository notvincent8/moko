import { ArrowLeftIcon, ExternalLinkIcon } from "@radix-ui/react-icons"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Ressources · Moko",
  description: "Ressources d'aide et de soutien en santé mentale en France, en Europe et dans le monde.",
}

type Resource = {
  name: string
  description: string
  phone?: string
  url?: string
  available?: string
}

type ResourceSection = {
  title: string
  description?: string
  resources: Resource[]
}

const frenchResources: ResourceSection = {
  title: "France",
  resources: [
    {
      name: "Numéro national de prévention du suicide",
      description: "Ligne d'écoute gratuite et confidentielle pour les personnes en détresse.",
      phone: "3114",
      available: "24h/24, 7j/7",
    },
    {
      name: "SOS Amitié",
      description: "Écoute et soutien pour les personnes en souffrance ou isolées.",
      phone: "09 72 39 40 50",
      url: "https://www.sos-amitie.com",
      available: "24h/24, 7j/7",
    },
    {
      name: "Fil Santé Jeunes",
      description: "Écoute, information et orientation pour les 12-25 ans.",
      phone: "0 800 235 236",
      url: "https://www.filsantejeunes.com",
      available: "Tous les jours 9h-23h",
    },
    {
      name: "SOS Dépression",
      description: "Accompagnement pour les personnes souffrant de dépression.",
      phone: "01 45 39 40 00",
      available: "24h/24, 7j/7",
    },
    {
      name: "Nightline France",
      description: "Service d'écoute nocturne par et pour les étudiants.",
      url: "https://www.nightline.fr",
      available: "Soirs en semaine",
    },
  ],
}

const europeanResources: ResourceSection = {
  title: "Europe",
  description: "Lignes d'écoute dans d'autres pays européens",
  resources: [
    {
      name: "Belgique - Centre de Prévention du Suicide",
      phone: "0800 32 123",
      description: "Ligne gratuite de prévention du suicide.",
      url: "https://www.preventionsuicide.be",
    },
    {
      name: "Suisse - La Main Tendue",
      phone: "143",
      description: "Écoute et aide en cas de crise.",
      url: "https://www.143.ch",
    },
    {
      name: "Luxembourg - SOS Détresse",
      phone: "454545",
      description: "Aide en cas de détresse émotionnelle.",
      url: "https://www.454545.lu",
    },
    {
      name: "Numéro d'urgence européen",
      phone: "112",
      description: "Numéro d'urgence valable dans toute l'Union européenne.",
    },
  ],
}

const globalResources: ResourceSection = {
  title: "International",
  resources: [
    {
      name: "International Association for Suicide Prevention",
      description: "Répertoire mondial des centres de crise.",
      url: "https://www.iasp.info/resources/Crisis_Centres/",
    },
    {
      name: "Befrienders Worldwide",
      description: "Réseau international de lignes d'écoute.",
      url: "https://www.befrienders.org",
    },
    {
      name: "Crisis Text Line",
      description: "Support par SMS (disponible dans plusieurs pays).",
      url: "https://www.crisistextline.org",
    },
  ],
}

const ResourceCard = ({ resource }: { resource: Resource }) => (
  <div className="p-4 bg-surface-elevated border border-border rounded-lg">
    <h4 className="font-semibold text-foreground mb-1">{resource.name}</h4>
    <p className="text-sm text-foreground/80 mb-3">{resource.description}</p>
    <div className="flex flex-wrap gap-3 text-sm">
      {resource.phone && (
        <a
          href={`tel:${resource.phone.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-1.5 text-flame hover:underline font-medium"
        >
          {resource.phone}
        </a>
      )}
      {resource.url && (
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-flame hover:underline"
        >
          Site web
          <ExternalLinkIcon className="w-3 h-3" />
        </a>
      )}
      {resource.available && <span className="text-muted-foreground">{resource.available}</span>}
    </div>
  </div>
)

const ResourceSection = ({ section }: { section: ResourceSection }) => (
  <section className="mb-10">
    <h2 className="font-display text-xl font-semibold mb-2 text-flame">{section.title}</h2>
    {section.description && <p className="text-muted-foreground text-sm mb-4">{section.description}</p>}
    <div className="grid gap-4">
      {section.resources.map((resource) => (
        <ResourceCard key={resource.name} resource={resource} />
      ))}
    </div>
  </section>
)

export default function ResourcesPage() {
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

        <h1 className="font-display text-3xl font-bold mb-4">Ressources d'aide</h1>

        {/* Important notice */}
        <div className="p-4 bg-flame/10 border border-flame/20 rounded-lg mb-10">
          <p className="text-sm text-foreground leading-relaxed">
            <strong className="text-flame">En cas d'urgence vitale,</strong> appelle immédiatement le{" "}
            <a href="tel:15" className="font-bold text-flame hover:underline">
              15
            </a>{" "}
            (SAMU) ou le{" "}
            <a href="tel:112" className="font-bold text-flame hover:underline">
              112
            </a>{" "}
            (urgences européennes).
          </p>
        </div>

        <p className="text-foreground/90 leading-relaxed mb-10">
          Moko n'est pas un professionnel et ne peut pas fournir d'aide en cas de crise. Si tu traverses une période
          difficile, voici des ressources avec de vraies personnes formées pour t'écouter et t'aider.
        </p>

        <ResourceSection section={frenchResources} />
        <ResourceSection section={europeanResources} />
        <ResourceSection section={globalResources} />

        {/* Encouragement */}
        <section className="mt-12 p-6 bg-surface border border-border rounded-lg text-center">
          <p className="text-foreground/90 leading-relaxed">
            Demander de l'aide est un signe de force, pas de faiblesse.
            <br />
            <span className="text-muted-foreground text-sm">Tu n'es pas seul·e.</span>
          </p>
        </section>

        {/* Footer */}
        <footer className="pt-8 mt-10 border-t border-border text-sm text-muted-foreground">
          <p>
            Ces ressources sont fournies à titre informatif. Pour toute correction ou ajout, contacte-moi via GitHub.
          </p>
        </footer>
      </div>
    </main>
  )
}
