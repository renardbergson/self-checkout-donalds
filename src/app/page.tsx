import Link from "next/link";

import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="grid h-screen place-content-center">
      <div className="m-5 p-5">
        <h1 className="pb-5 text-red-500">
          Bem-vindo ao self-checkout donalds!
        </h1>
        <p className="text-center">Seu restaurante fast food favorito</p>
      </div>
      <Button className="text-black" variant={"default"} asChild>
        <Link href={"/fsw-donalds"}>Iniciar</Link>
      </Button>
    </div>
  );
};

export default HomePage;
