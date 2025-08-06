"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { isValidCpf, removeCpfPunctuation } from "../../menu/helpers/cpf";

const formSchema = z.object({
  cpf: z
    .string()
    .trim()
    .min(11, {
      error: "Insira um CPF válido",
    })
    .refine((value) => isValidCpf(value), {
      error: "CPF inválido",
    }),
});

type FormSchema = z.infer<typeof formSchema>;

const NoCpf = () => {
  const router = useRouter();
  const url = usePathname();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpf: "",
    },
  });

  function handleCancel() {
    router.back();
  }

  function submitForm(data: FormSchema) {
    router.replace(`${url}?cpf=${removeCpfPunctuation(data.cpf)}`);
    // 📌 Why use router.replace() instead of router.push()?
    // - Because we don't want users to go back to the CPF input
    // screen when clicking the "back" button.
    // - When you use router.replace() the current URL is replaced
    // in the browser history, so the previous page (without the CPF
    // in the URL) is not accessible through router.back() anymore,
    // only the addres before it
  }

  return (
    <>
      <Drawer open onDrag={handleCancel}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Visualizar Pedidos</DrawerTitle>
            <DrawerDescription>
              Insira seu CPF para visualizar os pedidos realizados
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submitForm)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <PatternFormat
                          placeholder="Insira seu cpf..."
                          format="###.###.###-##"
                          customInput={Input}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DrawerFooter className="p-0">
                  <Button
                    type="submit"
                    variant="destructive"
                    className="rounded-full"
                  >
                    Ver Pedidos
                  </Button>

                  <Button
                    className="rounded-full"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NoCpf;
