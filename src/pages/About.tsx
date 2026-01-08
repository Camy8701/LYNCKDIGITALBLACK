import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About Us - LYNCK DIGITAL"
        description="Learn about Josina and Lynck Digital - Making building a real online business simpler, clearer, and more accessible for people who want independence."
        type="website"
        url={window.location.href}
      />
      <Header />

      <main className="px-5 md:px-20 py-12 md:py-20">
        <article className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter font-sans mb-8">
            About Lynck Digital
          </h1>

          <div className="space-y-6 text-foreground/80 font-serif text-lg leading-relaxed">
            <p>
              My name is Josina, and Lynck Digital was created for one reason: to make building a real online business simpler, clearer, and more accessible for people who want independence.
            </p>

            <p>
              Like most young people in Germany and across Europe, after finishing high school I didn't have a clear plan. I knew I should choose a "safe" path, but I also knew I didn't want my future to be limited to a traditional 9–5 job. I wanted freedom to work for myself, to travel, and to build something of my own.
            </p>

            <p>
              I studied marketing, but quickly realized theory alone was not enough. So I invested heavily in learning through professional courses, hundreds of hours of education, real campaigns, and real client work. That path eventually led me inside Google itself, where I worked for several years managing hundreds of advertising campaigns for businesses across Germany and internationally. I earned multiple internal awards for campaign performance and became one of the top-performing specialists in my team.
            </p>

            <p>
              Over time, I learned how real online businesses are built: how digital products are created, how traffic is generated, how systems are automated, and how consistent income is produced, not through luck, but through structure and strategy.
            </p>

            <p>
              In 2025, I joined forces with my partners and we created our own digital marketing agency. We bring combined expertise across Google Ads strategy, AI implementation, web development, and digital product creation.
            </p>

            <p>
              We left the corporate path to build something better and to help others do the same.
            </p>

            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter font-sans mt-12 mb-6">
              Why Lynck Digital Is Different
            </h2>

            <p>
              Most digital products teach you what to do. Ours show you how to do it and help you actually do it.
            </p>

            <p>
              Every product we sell has been built and tested by us first. And because we know the gap between learning and doing is where most people get stuck, we include ready-to-use AI prompts throughout our products. You don't just read about strategies, you copy a prompt, run it, and have your first draft, your ad copy, or your product outline in minutes.
            </p>

            <p className="font-bold">
              This isn't theory. It's implementation.
            </p>

            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter font-sans mt-12 mb-6">
              This Platform Exists To Save You Time
            </h2>

            <p>
              We combined our real-world experience, tested frameworks, and years of learning into practical digital products that show you exactly how to build and grow an online business without spending years watching random videos, buying scattered courses, or guessing what actually works.
            </p>

            <p>This is for people who want:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Independence and control over their time</li>
              <li>A real, legal, scalable online business</li>
              <li>Income that can support them while studying, traveling, or building their future</li>
              <li>Systems that grow over time instead of trading hours for money</li>
            </ul>

            <p>
              We don't sell hype. We don't promise overnight success. We build realistic businesses that, with consistent effort, can generate €1,000 to €10,000+ per month.
            </p>

            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter font-sans mt-12 mb-6">
              What You'll Find Here
            </h2>

            <p>
              Lynck Digital focuses on high-quality digital products designed to help you build, launch, and scale:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Step-by-step business blueprints</li>
              <li>Mini-courses and structured guides</li>
              <li>Advertising and automation frameworks</li>
              <li>Scalable monetization models</li>
              <li>Self-improvement and mindset resources</li>
            </ul>

            <p>
              We include mindset and personal development products because we've learned that strategy alone isn't enough. Without the right mental framework, discipline, and habits, even the best business blueprint stays unopened. The inner work makes the outer work possible.
            </p>

            <p>
              Everything is practical, structured, and built for action — not just consumption.
            </p>

            <p>
              We also offer Done-For-You solutions for those who want to skip setup and start faster. Learn more:{" "}
              <a href="mailto:info@lynckstudio.pro" className="text-accent-red hover:underline">
                info@lynckstudio.pro
              </a>
            </p>

            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter font-sans mt-12 mb-6">
              This Is For You If…
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>You're tired of your 9–5 or current business situation</li>
              <li>You want to earn a living without a degree or corporate career</li>
              <li>You want to learn real, monetizable skills using AI, not just use it like a browser</li>
              <li>You want to work from anywhere on your own terms</li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter font-sans mt-12 mb-6">
              This Is Not For You If…
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>You're looking for a get-rich-quick scheme</li>
              <li>You're not willing to put in the work</li>
              <li>You're not ready to invest in yourself</li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter font-sans mt-12 mb-6">
              My Promise
            </h2>

            <p>
              You don't need to be lucky. You don't need to be a genius. You need clarity, systems, and consistency.
            </p>

            <p className="font-bold">
              Lynck Digital exists to give you exactly that — so you can build income, freedom, and control over your future.
            </p>

            <div className="mt-12 p-6 bg-foreground/5 rounded-2xl border border-foreground/10">
              <small className="text-sm text-foreground/70">
                Some of the knowledge and frameworks inside our products are built in collaboration with, and inspired by, some of the best minds in the digital business and marketing space. We believe in using proven knowledge to save you time and deliver better results.
              </small>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default About;
