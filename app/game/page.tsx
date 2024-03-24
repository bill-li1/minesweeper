import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MinesweeperBoard from "@/components/MinesweeperBoard";

export default async function GamePage() {
	const supabase = createClient();
	const {
		data: { user },
	  } = await supabase.auth.getUser();
	
	  if (!user) {
		return redirect("/login");
	  }
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <MinesweeperBoard />
        </main>
    );
}
