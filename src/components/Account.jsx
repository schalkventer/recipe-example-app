import { supabase } from "../modules";

export const Account = () => {
  const handleLogin = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const response = Object.fromEntries(form);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: response.email,
      password: response.password,
    });

    console.log({ data, error });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const response = Object.fromEntries(form);

    const { data, error } = await supabase.auth.signUp({
      email: response.email,
      password: response.password,
      options: {
        data: {
          name: response.name,
        },
      },
    });

    console.log({ data, error });
  };

  return (
    <div>
      <h1>User</h1>

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input name="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">LOGIN</button>
      </form>

      <hr />
      <h2>Login</h2>
      <form onSubmit={handleCreate}>
        <input name="name" placeholder="Name" />
        <input name="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">CREATE ACCOUTN</button>
      </form>
    </div>
  );
};

export default Account;
