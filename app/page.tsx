export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10 dark:opacity-20" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              <span className="text-gradient">Read Less.</span>{' '}
              <span className="text-gradient-accent">Know More.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Brevity saves articles with one click and transforms them into 
              concise AI summaries. Perfect for busy professionals who need to 
              stay informed without the time commitment.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#waitlist"
                className="rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200 hover:scale-105"
              >
                Join the Waitlist
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - StoryBrand Framework */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              The Problem with Information Overload
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              You find dozens of interesting articles daily, but reading them all 
              is impossible. Important insights get lost in your endless "read later" 
              list that never actually gets read.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white/50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How Brevity Works
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Three simple steps to stay informed without the overwhelm
            </p>
          </div>
          
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Step 1 */}
            <div className="glass rounded-2xl p-8 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary text-white font-bold text-xl">
                1
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-8 text-gray-900 dark:text-white">
                Save with One Click
              </h3>
              <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
                Install our browser extension and save any article instantly while browsing. 
                No need to leave the page or interrupt your flow.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="glass rounded-2xl p-8 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-accent text-white font-bold text-xl">
                2
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-8 text-gray-900 dark:text-white">
                AI Summarizes Content
              </h3>
              <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
                Our AI analyzes the article and extracts key insights, main points, 
                and actionable takeaways in seconds.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="glass rounded-2xl p-8 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary text-white font-bold text-xl">
                3
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-8 text-gray-900 dark:text-white">
                Read or Listen Anytime
              </h3>
              <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
                Access your personalized dashboard to read summaries or listen to 
                AI-generated audio digests during your commute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Transform Your Reading Experience
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Join thousands of professionals who stay informed in minutes, not hours
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Save 80% Reading Time
                </dt>
                <dd className="mt-1 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Get the essential information from any article in under 2 minutes. 
                  Perfect for busy schedules.
                </dd>
              </div>
              
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  Never Miss Key Insights
                </dt>
                <dd className="mt-1 text-base leading-7 text-gray-600 dark:text-gray-300">
                  AI extracts and highlights the most important points, ensuring you 
                  never miss critical information.
                </dd>
              </div>
              
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                  </div>
                  Audio Digests On-the-Go
                </dt>
                <dd className="mt-1 text-base leading-7 text-gray-600 dark:text-gray-300">
                  Listen to your daily article summaries while commuting, exercising, 
                  or doing chores.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-16 sm:py-24 bg-gradient-primary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Be the First to Experience Brevity
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/90">
              Join our exclusive waitlist and get early access when we launch. 
              Limited spots available for beta testers.
            </p>
            <form className="mt-10 flex gap-x-4 justify-center">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-w-0 flex-auto rounded-full border-0 bg-white/10 backdrop-blur px-6 py-3 text-white shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-white/70 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className="flex-none rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
              >
                Join Waitlist
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}