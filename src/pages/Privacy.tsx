import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Policy - LYNCK DIGITAL"
        description="Lynck Digital respects your privacy and is committed to protecting your personal data. Learn how we collect, use, and protect your information."
        type="website"
        url={window.location.href}
      />
      <Header />

      <main className="px-5 md:px-20 py-12 md:py-20">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter font-sans mb-4">
            Privacy Policy
          </h1>

          <div className="mb-8 text-sm text-foreground/60 font-sans">
            <p>Effective Date: January 2025</p>
            <p>Website: <a href="https://lynckdigital.store" className="text-accent-red hover:underline">https://lynckdigital.store</a></p>
          </div>

          <div className="space-y-8 text-foreground/80 font-serif text-base leading-relaxed">
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter font-sans mb-4 text-foreground">
                Introduction
              </h2>
              <p>
                Lynck Digital ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and protect your information when you visit our website or purchase our Products.
              </p>
              <p className="mt-4">
                By using our website or services, you consent to the practices described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter font-sans mb-4 text-foreground">
                1. Information We Collect
              </h2>
              <p>We may collect the following types of information:</p>

              <div className="mt-4">
                <h3 className="font-bold text-foreground mb-2">Information you provide directly:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Any other information you voluntarily submit through forms or communications</li>
                </ul>
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-foreground mb-2">Information collected automatically:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address</li>
                  <li>Browser type and device information</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referring website or source</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter font-sans mb-4 text-foreground">
                2. How We Use Your Information
              </h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Process and deliver your purchases</li>
                <li>Send transactional emails (order confirmations, access instructions)</li>
                <li>Send marketing communications (if you have opted in)</li>
                <li>Improve our website, products, and services</li>
                <li>Respond to customer support inquiries</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter font-sans mb-4 text-foreground">
                3. Marketing Communications
              </h2>
              <p>
                By providing your email address at checkout, through a lead form, or by engaging with our opt-in campaigns, you consent to receive recurring promotional and marketing emails from Lynck Digital. These may include product updates, exclusive offers, and launch announcements.
              </p>
              <p className="mt-4">
                Consent is not a condition of any purchase. You can unsubscribe at any time by clicking the unsubscribe link in any email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter font-sans mb-4 text-foreground">
                4. Cookies
              </h2>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze site traffic, and understand user behavior.
              </p>
              <p className="mt-4">
                You can control cookie settings through your browser. Disabling cookies may affect certain features of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter font-sans mb-4 text-foreground">
                5. Third-Party Services
              </h2>
              <p>
                We may use third-party services to process payments, deliver emails, or analyze website traffic. These providers have their own privacy policies and handle your data according to their terms.
              </p>
              <p className="mt-4">Examples include:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Payment processors (e.g., Stripe, PayPal)</li>
                <li>Email marketing platforms</li>
                <li>Analytics tools (e.g., Google Analytics)</li>
              </ul>
              <p className="mt-4">
                We do not sell or rent your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter font-sans mb-4 text-foreground">
                6. Data Security
              </h2>
              <p>
                We implement reasonable technical and organizational measures to protect your personal data from unauthorized access, loss, or misuse. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter font-sans mb-4 text-foreground">
                7. Data Retention
              </h2>
              <p>
                We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, or resolve disputes.
              </p>
              <p className="mt-4">
                If you wish to request deletion of your data, contact us at{" "}
                <a href="mailto:info@lynckstudio.pro" className="text-accent-red hover:underline">
                  info@lynckstudio.pro
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter font-sans mb-4 text-foreground">
                8. Your Rights
              </h2>
              <p>Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict certain processing</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:info@lynckstudio.pro" className="text-accent-red hover:underline">
                  info@lynckstudio.pro
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter font-sans mb-4 text-foreground">
                9. Children's Privacy
              </h2>
              <p>
                Our website and Products are not intended for individuals under 18 years of age. We do not knowingly collect personal data from minors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter font-sans mb-4 text-foreground">
                10. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of our website after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter font-sans mb-4 text-foreground">
                11. Contact
              </h2>
              <p>
                If you have questions about this Privacy Policy, contact us at:
              </p>
              <p className="mt-4">
                Email:{" "}
                <a href="mailto:info@lynckstudio.pro" className="text-accent-red hover:underline">
                  info@lynckstudio.pro
                </a>
                <br />
                Website:{" "}
                <a href="https://lynckdigital.store" className="text-accent-red hover:underline">
                  https://lynckdigital.store
                </a>
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
