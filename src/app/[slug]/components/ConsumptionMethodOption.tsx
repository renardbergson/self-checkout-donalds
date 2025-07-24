import { ConsumptionMethod } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ConsumptionMethodOptionProps {
  imageSrc: string;
  imageAlt: string;
  buttonText: string;
  option: ConsumptionMethod;
  slug: string;
}

const ConsumptionMethodOption = ({
  imageSrc,
  imageAlt,
  buttonText,
  option,
  slug,
}: ConsumptionMethodOptionProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-8 py-8">
        <div className="relative h-[80px] w-[80px]">
          <Image
            src={imageSrc}
            fill
            alt={imageAlt}
            className="object-contain"
          />
        </div>
        <Button variant="secondary" className="rounded-full">
          <Link href={`${slug}/menu?consumptionMethod=${option}`}>
            {buttonText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConsumptionMethodOption;
