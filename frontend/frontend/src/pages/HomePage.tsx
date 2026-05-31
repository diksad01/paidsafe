import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PS</span>
            </div>
            <span className="text-white font-semibold text-lg">PaidSafe</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-slate-900 pt-16 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
            <span className="text-slate-300 text-xs font-medium">
              Secure escrow for freelancers & clients
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Get paid.
            <br />
            <span className="text-indigo-400">Stay protected.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            PaidSafe holds funds in escrow until work is delivered and approved.
            No more late payments or disputes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contract/new"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
            >
              Create a contract
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
            >
              View dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            How PaidSafe works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create a contract",
                desc: "Define the scope, milestones, and payment terms with your client.",
              },
              {
                step: "02",
                title: "Funds in escrow",
                desc: "The client deposits payment securely before any work begins.",
              },
              {
                step: "03",
                title: "Release on approval",
                desc: "Once work is accepted, funds are instantly released to you.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200 rounded-2xl p-6"
              >
                <span className="text-indigo-600 font-bold text-sm">{item.step}</span>
                <h3 className="text-slate-900 font-semibold text-lg mt-2 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">PS</span>
            </div>
            <span className="text-slate-400 text-sm">PaidSafe</span>
          </div>
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} PaidSafe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;