import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/modules/auth/guard";
import { IntakeForm } from "@/components/requests/intake-form";

export const metadata: Metadata = {
  title: "درخواست سرمایه‌گذاری | دیجی‌ونچرز",
  description: "ثبت درخواست جذب سرمایه از صندوق سرمایه‌گذاری خطرپذیر شرکتی دیجی‌ونچرز",
};

export default async function InvestmentRequestPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?redirect=/investment-request");
  }

  return (
    <div className="pt-[76px]">
      {/* section: page-hero */}
      <section className="hero-bg py-16 lg:py-24">
        <div className="tri-pattern absolute inset-0 opacity-20" aria-hidden="true"></div>
        <div className="hero-accent-line" aria-hidden="true"></div>
        <div className="container-dv relative z-10 text-center">
          <span className="section-label">درخواست سرمایه‌گذاری</span>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">ثبت درخواست جذب سرمایه</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            اگر استارتاپ شما در حوزه‌های فناوری‌محور فعالیت می‌کند، فرم زیر را تکمیل کنید. تیم ارزیابی دیجی‌ونچرز پس از بررسی اولیه، نتیجه را از طریق ایمیل اطلاع خواهد داد.
          </p>
        </div>
      </section>

      {/* section: investment-form */}
      <section className="bg-white py-16 lg:py-24" id="investment-form">
        <div className="container-dv max-w-3xl">
          <IntakeForm />
        </div>
      </section>
    </div>
  );
}
