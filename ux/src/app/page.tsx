import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Nutrition Tracking
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Track your meals, monitor your nutrients, and build healthier habits
          with a simple, powerful nutrition tracker.
        </p>
        <Link
          href="/app"
          className="inline-block px-8 py-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
        >
          Log in and use
        </Link>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-4xl mb-4">&#127860;</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Log Meals
            </h3>
            <p className="text-gray-600">
              Quickly record what you eat throughout the day with an intuitive
              interface.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-4xl mb-4">&#128200;</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Track Nutrients
            </h3>
            <p className="text-gray-600">
              See breakdowns of calories, macros, and micronutrients at a
              glance.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-4xl mb-4">&#127919;</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Reach Goals
            </h3>
            <p className="text-gray-600">
              Set personalized nutrition goals and track your progress over
              time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
