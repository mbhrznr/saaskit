import Button from "@/components/Button.tsx";
import Head from "@/components/Head.tsx";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import IconListDetails from "tabler-icons/list-details.tsx";
import IconCheckbox from "tabler-icons/checkbox.tsx";
import IconPrompt from "tabler-icons/prompt.tsx";
import type { Handlers, PageProps } from "$fresh/server.ts";
import { stripe } from "@/utils/stripe.ts";
import type { Stripe } from "stripe";

interface HeadingProps {
  title: string;
  subtitle?: string;
}

function Heading(props: HeadingProps) {
  return (
    <div class="text-center space-y-4">
      <h2 id="pricing" class="font-bold md:text-6xl text-4xl text-[#4f06be]">
        {props.title}
      </h2>
      <p class="text-xl text-black">
        {props.subtitle}
      </p>
    </div>
  );
}

function Hero() {
  return (
    <div class="text-center px-8 py-16 max-w-7xl mx-auto text-white space-y-8 flex-1 flex flex-col justify-center">
      <h1 class="font-bold text-3xl md:text-7xl">
        Your SaaS here.
      </h1>
      <p class="text-xl">
        Some details about your SaaS.
      </p>
      <div class="flex justify-center gap-8 flex-wrap">
        <a href="#">
          <Button>Signup</Button>
        </a>
        <a href="#">
          <Button class="!bg-white border-2 border-pink-700 text-pink-700 hover:border-black hover:text-black transition duration-300">
            Learn more
          </Button>
        </a>
      </div>
    </div>
  );
}

function TopSection() {
  return (
    <div
      style="background-image: url('/hero-dark.svg')"
      class="min-h-screen bg-cover flex flex-col"
    >
      <Header class="text-white" />
      <Hero />
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: IconListDetails,
      title: "First feature",
      description: "A little description here.",
    },
    {
      icon: IconCheckbox,
      title: "Second feature",
      description: "A little description here.",
    },
    {
      icon: IconPrompt,
      title: "Third feature",
      description: "A little description here.",
    },
  ];

  return (
    <>
      <div class="bg-[#170139]">
        <div class="px-8 py-16 max-w-7xl space-y-16 mx-auto text-white">
          <div class="flex md:flex-row flex-col gap-8">
            {features.map((feature) => (
              <div class="flex-1 space-y-2 text-center">
                <feature.icon class="h-12 w-auto mx-auto" />
                <h3 class="text-2xl font-bold">
                  {feature.title}
                </h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        class="h-16 bg-cover bg-bottom w-full"
        style="background-image: url('/transition.svg')"
      >
      </div>
    </>
  );
}

function PricingCard(props: { product: Stripe.Product }) {
  return (
    <div class="flex-1 space-y-4 p-4 ring-1 ring-gray-200 shadow-md rounded-xl text-center">
      <div>
        <h3 class="text-2xl font-bold">
          {props.product.name}
        </h3>
        <p>{props.product.description}</p>
      </div>
      <p class="font-bold text-xl">
        ${(props.product.default_price as Stripe.Price).unit_amount! / 100}
        <span class="font-normal">{" "}per month</span>
      </p>
      <div>
        <a href="/signup">
          <Button class="w-full rounded-md">Subscribe</Button>
        </a>
      </div>
    </div>
  );
}

function PricingSection(props: { products: Stripe.Product[] }) {
  return (
    <div class="px-8 py-16 max-w-7xl space-y-16 mx-auto">
      <Heading
        title="Pricing"
        subtitle="Some copy about pricing."
      />
      <div class="flex flex-col md:flex-row gap-8">
        <img src="/pricing.svg" alt="Pricing image" class="flex-1" />
        <div class="flex-1 flex flex-col gap-8">
          {props.products.map((product) => <PricingCard product={product} />)}
        </div>
      </div>
    </div>
  );
}

function TestimonialSection() {
  return (
    <div class="px-8 py-16 max-w-7xl space-y-16 mx-auto">
      <Heading title="Testimonial" />
      <div class="text-center text-lg space-y-8">
        <img
          src="brad.png"
          alt="Brad, CEO of Good Things"
          class="h-16 w-auto rounded-full mx-auto"
        />
        <p class="text-2xl">"This app is a game changer."</p>
        <div>
          <p>
            <strong class="text-[#4f06be]">Brad</strong>
          </p>
          <p>CEO of Good Things</p>
        </div>
      </div>
    </div>
  );
}

function BottomSection() {
  return (
    <div
      style="background-image: url('/hero-light.svg')"
      class="min-h-screen bg-cover flex flex-col justify-end"
    >
      <div class="bg-gradient-to-t from-black to-[#170139]">
        <Footer class="text-white" />
      </div>
    </div>
  );
}

function sortProductsFromLowestPrice(products: Stripe.Product[]) {
  return products.sort((productA, productB) =>
    (productA.default_price as Stripe.Price).unit_amount! -
    (productB.default_price as Stripe.Price).unit_amount!
  );
}

export const handler: Handlers<Stripe.Product[]> = {
  async GET(_request, ctx) {
    const { data } = await stripe.products.list({
      expand: ["data.default_price"],
      active: true,
    });

    return await ctx.render(sortProductsFromLowestPrice(data));
  },
};

export default function HomePage(props: PageProps<Stripe.Product[]>) {
  return (
    <>
      <Head />
      <body class="bg-black">
        <div class="bg-white">
          <TopSection />
          <FeaturesSection />
          <PricingSection products={props.data} />
          <TestimonialSection />
          <BottomSection />
        </div>
      </body>
    </>
  );
}
