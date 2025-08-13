import Image from "next/image";
import { notFound } from "next/navigation";

import { database } from "@/lib/prisma";

import ConsumptionMethodOption from "./components/ConsumptionMethodOption";

interface WelcomePageProps {
  params: Promise<{ slug: string }>;
}

const WelcomePage = async ({ params }: WelcomePageProps) => {
  const { slug } = await params;
  const restaurant = await database.restaurant.findUnique({ where: { slug } });

  if (!restaurant) {
    return notFound();
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center px-6 pt-24">
      {/* LOGO E TÍTULO */}
      <div className="flex flex-col items-center gap-2">
        <Image
          src={restaurant?.avatarImageUrl}
          alt={restaurant?.name}
          width={82}
          height={82}
        />
        <h2 className="font-semibold">{restaurant?.name}</h2>
      </div>
      {/* BEM-VINDO */}
      <div className="space-y-2 pt-24 text-center">
        <h3 className="text-2xl font-semibold">Seja bem-vindo</h3>
        <p className="opacity-55">
          Escolha como prefere aproveitar sua refeição. Estamos aqui para
          oferecer praticidade e sabor em cada detalhe.
        </p>
        <p></p>
      </div>
      {/* ESCOLHA DO MÉTODO DE CONSUMO */}
      <div className="grid grid-cols-2 gap-4 pt-14">
        <ConsumptionMethodOption
          imageSrc="/dine-in.png"
          imageAlt="Para comer aqui"
          option="DINE_IN"
          buttonText="Comer aqui"
          slug={slug}
        />

        <ConsumptionMethodOption
          imageSrc="/takeaway.png"
          imageAlt="Para Levar"
          option="TAKEAWAY"
          buttonText="Para Levar"
          slug={slug}
        />
      </div>
    </div>
  );
};

export default WelcomePage;
