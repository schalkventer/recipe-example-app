import { List, Selected, Account } from "./components";
import { supabase } from "./modules";

export const App = () => {
  return (
    <List
      supabase={supabase}
      slots={{
        Selected,
        Account,
      }}
    />
  );
};

export default App;
