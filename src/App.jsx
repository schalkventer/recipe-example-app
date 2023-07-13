import { List, Selected } from "./components";
import { supabase } from "./modules";

export const App = () => {
  return (
    <List
      supabase={supabase}
      slots={{
        Selected,
      }}
    />
  );
};

export default App;
