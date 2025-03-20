import { Header } from "../components/General/Header";

// Dashboard page
export function Dashboard() {

  return (
    <main className="Dashboard">
      <Header />
      <div className="learning">
        Learning
      </div>
      <div className="casting">
        Casting
      </div>
      <div className="quizzes">
        Quizzes
      </div>
    </main>
  )

};