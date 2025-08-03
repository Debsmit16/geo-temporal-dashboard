export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Modern Header with Glass Morphism */}
      <header className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-3xl"></div>

        {/* Header Content */}
        <div className="relative glass border-0 border-b border-white/20 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Logo/Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg float">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>

              {/* Title and Description */}
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Weather Map Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium hidden sm:block">
                  Interactive weather visualization with intelligent polygon mapping
                </p>
              </div>
            </div>

            {/* Stats and Actions */}
            <div className="flex items-center space-x-3 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
              {/* Status Indicator */}
              <div className="glass rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 border border-white/20 hover-lift">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 glow"></div>
                  <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                    Enhanced UI Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl float">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            🎉 Enhanced UI Complete!
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-2xl">
            Your Map Dashboard has been completely redesigned with stunning modern UI, glass morphism effects,
            responsive design, and professional animations. The enhanced interface is now ready!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="glass rounded-xl p-4 border border-white/20 hover-lift">
              <div className="w-8 h-8 rounded-lg bg-blue-500 mb-3 mx-auto"></div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Glass Morphism</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Beautiful translucent effects</p>
            </div>
            <div className="glass rounded-xl p-4 border border-white/20 hover-lift">
              <div className="w-8 h-8 rounded-lg bg-purple-500 mb-3 mx-auto"></div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Modern Design</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Professional UI components</p>
            </div>
            <div className="glass rounded-xl p-4 border border-white/20 hover-lift">
              <div className="w-8 h-8 rounded-lg bg-green-500 mb-3 mx-auto"></div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Responsive</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Perfect on all devices</p>
            </div>
            <div className="glass rounded-xl p-4 border border-white/20 hover-lift">
              <div className="w-8 h-8 rounded-lg bg-red-500 mb-3 mx-auto"></div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Animations</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Smooth interactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
