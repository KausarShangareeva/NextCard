import { notFound } from "next/navigation";
import ClientDetail from "@/components/dashboard-clients/ClientDetail";
import { CLIENTS, getClientById } from "@/components/dashboard-clients/clientsData";

export function generateStaticParams() {
  return CLIENTS.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const client = getClientById(params.id);
  return { title: client ? `${client.name} · NextCard` : "Client · NextCard" };
}

export default function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const client = getClientById(params.id);
  if (!client) notFound();
  return <ClientDetail client={client} />;
}
