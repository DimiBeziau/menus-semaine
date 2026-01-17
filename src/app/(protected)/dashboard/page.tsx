import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import WeekView from "@/components/WeekView";
import { LogOut, UtensilsCrossed } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-white to-sky-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-mint-400 to-sky-400 rounded-lg shadow-md">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Meal Planner</h1>
              <p className="text-xs text-gray-500">
                Bienvenue, {session.user?.name || session.user?.email}
              </p>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <WeekView />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-400">
        <p>Planifiez vos repas, simplifiez votre vie 🍽️</p>
      </footer>
    </div>
  );
}
