import { listImoveisAtivos } from "@/lib/imoveis";
import { PropertyCard } from "@/components/ui/property-card";
import { PropertyFilters } from "@/components/ui/property-filters";

interface PropertyListingProps {
  quartos: number[];
  temGaragem?: boolean;
}

/**
 * Listagem funcional de imóveis disponíveis — dados reais do banco,
 * filtros combináveis (quartos + garagem) via query string. Substitui a
 * antiga vitrine curada com dados mockados (ver histórico do componente
 * FeaturedProperties).
 */
export async function PropertyListing({ quartos, temGaragem }: PropertyListingProps) {
  const imoveis = await listImoveisAtivos({ quartos, temGaragem });

  return (
    <section id="imoveis" className="bg-paper px-6 py-28 md:px-10 md:py-36" aria-label="Imóveis disponíveis">
      <div className="mx-auto w-full max-w-[1600px]">
        <span className="mb-6 block text-xs tracking-[0.35em] text-muted uppercase">Imóveis disponíveis</span>

        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl font-display text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[1.12] font-normal text-ink">
            Aluguéis com curadoria, prontos para morar.
          </h2>
          <PropertyFilters />
        </div>

        {imoveis.length === 0 ? (
          <p className="mt-16 border-t border-line pt-10 text-sm text-muted">
            Nenhum imóvel disponível para os filtros selecionados.
          </p>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {imoveis.map((imovel) => (
              <PropertyCard key={imovel.id} imovel={imovel} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
