import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumptionMethod } from "@prisma/client";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useContext, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
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
import { CartContext } from "@/contexts/cartContext";

import { createOrder } from "../../actions/createOrder";
import { createStripeCheckout } from "../../actions/createStripeCheckout";
import { isValidCpf } from "../../helpers/cpf";

// Form control and validation
const formSchema = z.object({
  name: z.string().trim().min(3, {
    error: "Insira um nome com pelo menos 3 dígitos",
  }),
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

const FinishOrder = () => {
  const router = useRouter();

  const { clearCart } = useContext(CartContext);

  const { slug } = useParams<{ slug: string }>(); // url parameter

  const consumptionMethod = useSearchParams() // query parameter
    .get("consumptionMethod")
    ?.toLocaleUpperCase() as ConsumptionMethod;

  const [isPending, startTransition] = useTransition();

  const { products } = useContext(CartContext); // products in the cart

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cpf: "",
    },
  });

  function handleToggleDrawer() {
    form.clearErrors();
    setDrawerIsOpen((prev) => !prev);
  }

  function handleResetForm() {
    handleToggleDrawer();
    form.reset();
  }

  async function submitForm(data: FormSchema) {
    // Let's call the server action here,
    // so we can call our database
    try {
      startTransition(async () => {
        // isPending is true while this action is being executed
        const order = await createOrder({
          customerName: data.name,
          customerCpf: data.cpf,
          consumptionMethod,
          products,
          slug,
          // the other necessary data is obtained
          // in the server action (createOrder)!!
        });

        /* if (order.success) {
          toast.success("Pedido realizado com sucesso!");
          handleToggleDrawer();
          form.reset();

          setTimeout(() => {
            clearCart();
            router.push(order.url);
          }, 1000);
        } */

        // STRIPE
        const { sessionId } = await createStripeCheckout({
          products,
          orderId: order.orderId,
          slug,
          consumptionMethod,
        });
        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
          throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
        }

        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
        );

        stripe?.redirectToCheckout({ sessionId: sessionId });
      });
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  return (
    <Drawer open={drawerIsOpen}>
      <Button
        disabled={!products.length && true}
        className="w-full rounded-full"
        onClick={handleToggleDrawer}
      >
        Finalizar pedido
      </Button>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Finalizar Pedido</DrawerTitle>
          <DrawerDescription>
            Por favor, preencha os campos a seguir
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Insira seu nome..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  disabled={isPending}
                >
                  {isPending && <Loader2 className="animate-spin" />}
                  Pagamento
                </Button>

                <Button
                  className="rounded-full"
                  variant="outline"
                  onClick={handleResetForm}
                >
                  Cancelar
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FinishOrder;
