import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BedDouble, Car } from "lucide-react";
import { SimpleHeader } from "@/components/layout/simple-header";
import { Footer } from "@/components/layout/footer";
import { PropertyPhoto } from "@/components/ui/property-photo";
import { getImovelAtivoById } from "@/lib/imoveis";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getWhatsAppPhone } from "@/lib/config";

interface ImovelPageProps {
  params: Promise<{ id: string }>;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export async function generateMetadata({ params }: ImovelPageProps): Promise<Metadata> {
  const { id } = await params;
  const imovel = await getImovelAtivoById(id);
  if (!imovel) return { title: "Imóvel não encontrado — Central Imóveis" };
  return { title: `${imovel.titulo} — ${imovel.bairro} — Central Imóveis` };
}

export default async function ImovelPage({ params }: ImovelPageProps) {
  const { id } = await params;
  const imovel = await getImovelAtivoById(id);

  if (!imovel) {
    notFound();
  }

  const whatsappUrl = buildWhatsAppUrl(getWhatsAppPhone(), {
    titulo: imovel.titulo,
    bairro: imovel.bairro,
    valor: imovel.valor,
    taxas: imovel.taxas,
  });

  const [capa, ...demaisFotos] = imovel.fotos;

  return (
    <>
      <SimpleHeader />
      <main>
        <section className="bg-paper px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto w-full max-w-[1600px]">
            <PropertyPhoto
              src={capa?.url ?? null}
              alt={`Foto principal do imóvel em ${imovel.bairro}`}
              className="aspect-[16/9] w-full"
              priority
            />

            {demaisFotos.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {demaisFotos.map((foto) => (
                  <PropertyPhoto
                    key={foto.id}
                    src={foto.url}
                    alt={`Foto do imóvel em ${imovel.bairro}`}
                    className="aspect-square w-full"
                  />
                ))}
              </div>
            ) : null}

            <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-12">
              <div className="md:col-span-8">
                <span className="block text-xs tracking-[0.2em] text-muted uppercase">{imovel.bairro}</span>
                <h1 className="mt-2 font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.12] text-ink">
                  {imovel.titulo}
                </h1>

                <div className="mt-6 flex items-center gap-6 text-sm text-muted uppercase tracking-[0.1em]">
                  <span className="inline-flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4" strokeWidth={1.5} />
                    {imovel.quartos} {imovel.quartos === 1 ? "quarto" : "quartos"}
                  </span>
                  {imovel.temGaragem ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Car className="h-4 w-4" strokeWidth={1.5} />
                      Garagem
                    </span>
                  ) : null}
                </div>

                <p className="mt-10 max-w-2xl text-base leading-relaxed whitespace-pre-line text-ink">
                  {imovel.descricao}
                </p>
              </div>

              <aside className="md:col-span-4">
                <div className="border-t border-line pt-6">
                  <p className="text-2xl text-ink">
                    {formatCurrency(imovel.valor)}
                    {imovel.taxas ? (
                      <span className="block text-sm text-muted">
                        + {formatCurrency(imovel.taxas)} de taxas
                      </span>
                    ) : null}
                  </p>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center bg-ink px-6 py-4 text-xs tracking-[0.25em] text-paper uppercase transition-colors hover:bg-gold-dim"
                  >
                    Tenho interesse
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
