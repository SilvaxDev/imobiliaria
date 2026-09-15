import Link from "next/link";
import { ArrowUpRight, BedDouble, Car } from "lucide-react";
import { PropertyPhoto } from "@/components/ui/property-photo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getWhatsAppPhone } from "@/lib/config";
import type { ImovelListItem } from "@/lib/imoveis";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function PropertyCard({ imovel }: { imovel: ImovelListItem }) {
  const whatsappUrl = buildWhatsAppUrl(getWhatsAppPhone(), {
    titulo: imovel.titulo,
    bairro: imovel.bairro,
    valor: imovel.valor,
    taxas: imovel.taxas,
  });

  return (
    <div className="group flex flex-col">
      <Link href={`/imovel/${imovel.id}`} className="block">
        <PropertyPhoto
          src={imovel.fotoCapa}
          alt={`Foto do imóvel em ${imovel.bairro}`}
          className="aspect-[4/3] w-full transition-opacity duration-300 group-hover:opacity-90"
        />
      </Link>

      <div className="mt-5 flex flex-1 flex-col border-t border-line pt-4">
        <span className="text-xs tracking-[0.2em] text-muted uppercase">{imovel.bairro}</span>

        <Link href={`/imovel/${imovel.id}`} className="mt-1 flex items-start justify-between gap-2">
          <h3 className="font-display text-xl text-ink">{imovel.titulo}</h3>
          <ArrowUpRight
            className="mt-1 h-4 w-4 shrink-0 text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </Link>

        <p className="mt-2 text-sm text-ink">
          {formatCurrency(imovel.valor)}
          {imovel.taxas ? <span className="text-muted"> + {formatCurrency(imovel.taxas)} de taxas</span> : null}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs tracking-[0.1em] text-muted uppercase">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5" strokeWidth={1.5} />
            {imovel.quartos} {imovel.quartos === 1 ? "quarto" : "quartos"}
          </span>
          {imovel.temGaragem ? (
            <span className="inline-flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5" strokeWidth={1.5} />
              Garagem
            </span>
          ) : null}
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-fit items-center gap-2 text-xs tracking-[0.2em] text-ink uppercase underline decoration-line underline-offset-4 transition-colors hover:text-gold-dim hover:decoration-gold-dim"
        >
          Tenho interesse
        </a>
      </div>
    </div>
  );
}
