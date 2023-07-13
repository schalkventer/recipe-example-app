import { useState } from "react";
import { useMount } from "react-use";
import { supabase } from "../modules";
import categoriesList from "./List.categories.json";
import orderingList from "./List.ordering.json";

const QUERY = `
  id, 
  title, 
  category,
  images (
    url:image
  )
`;

const responseHandler = (item) => {
  const {
    images: [{ url }],
  } = item;

  return {
    id: item.id,
    category: item.category,
    title: item.title,
    image: url,
  };
};

/**
 * Gets a list of 100 recipes from the database based on configuration passed as
 * props to this function
 */
const getRecipes = async (props) => {
  const { page, category = "All", ordering = "title", search = "" } = props;

  let request = supabase
    .from("recipes")
    .select(QUERY, { count: "exact" })
    .order(ordering, { ascending: true })
    .range(page * 100, (page + 1) * 100 - 1);

  if (category !== "All") {
    request = request.eq("category", category);
  }

  if (search.trim() !== "") {
    request = request.textSearch("title", search);
  }

  const response = await request;
  const showing = (page + 1) * 100;

  return {
    data: response.data.map(responseHandler),
    remaining: response.count - showing,
  };
};

export const List = (props) => {
  const { slots } = props;

  const [category, setCategory] = useState("All");
  const [ordering, setOrdering] = useState("title");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [remaining, setRemaining] = useState(null);
  const [userName, setUserName] = useState(null);

  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("LOADING");
  const [recipes, setRecipes] = useState([]);

  const updateRecipes = async (props) => {
    const { target = "ADDING" } = props;
    if (phase !== target) setPhase(target);
    const response = await getRecipes(props);
    setPhase("IDLE");
    setRecipes(response.data);
    setRemaining(response.remaining < 0 ? 0 : response.remaining);
  };

  useMount(async () => {
    updateRecipes({ page, category, ordering, search, target: "LOADING" });
  });

  const handleLoadMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    updateRecipes({ page, category, ordering, search });
  };

  if (phase === "LOADING") return <div>Loading...</div>;
  if (selected) return <slots.Selected id={selected} />;

  const handleSumbit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const response = Object.fromEntries(data);

    setCategory(response.category);
    setSearch(response.search);
    setOrdering(response.ordering);

    updateRecipes({
      page: 0,
      category: response.category,
      ordering: response.ordering,
      search: response.search,
    });
  };

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
      <span>{userName}</span>

      <form onSubmit={handleLogin}>
        <input name="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">LOGIN</button>
      </form>

      <hr />

      <form onSubmit={handleCreate}>
        <input name="name" placeholder="Name" />
        <input name="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">CREATE ACCOUTN</button>
      </form>

      <h1>Recipes</h1>

      <form onSubmit={handleSumbit} style={{ background: "#CCC" }}>
        <select name="category" defaultValue={category}>
          <option value="All">All</option>
          {categoriesList.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>

        <select name="ordering" defaultValue={ordering}>
          {orderingList.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>

        <input
          name="search"
          defaultValue={search}
          placeholder="Search..."
        ></input>
        <button type="submit">SUBMIT!!!</button>
      </form>

      <ul>
        {recipes.length === 0 && <li>No recipes found</li>}

        {recipes.length > 0 &&
          recipes.map(({ id, title, category, image }) => {
            return (
              <li key={id}>
                <img src={image} style={{ height: "3rem", width: "3rem" }} />
                <button onClick={() => setSelected(id)}>
                  {title} ({category})
                </button>
              </li>
            );
          })}
      </ul>

      <button
        onClick={handleLoadMore}
        disabled={phase === "ADDING" || remaining < 1}
      >
        Load More {remaining && `(${remaining})`}
      </button>
    </div>
  );
};

export default List;

//   const categoryHandler = (event) => {
//     const { value } = event.target;
//     setCategory(value);
//     updateRecipes({ page, category: value, ordering, search });
//   };

//   const orderingHandler = (event) => {
//     const { value } = event.target;
//     setOrdering(value);
//     updateRecipes({ page, category, ordering: value, search });
//   };

//   const searchHandler = (event) => {

//   }
