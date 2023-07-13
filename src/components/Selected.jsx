import { useState } from "react";
import { supabase } from "../modules";
import { useMount } from "react-use";

const QUERY = `
    title,
    category,
    cookTime:cook_time,
    prepTime:prep_time,
    published,
    servings,
    description,
    images (
        id,
        url: image
    ),
    ingredients (
        id,
        ingredient,
        quantity
    ),
    instructions (
        id,
        step,
        description
    )
`;

export const Selected = (props) => {
  const [data, setData] = useState(null);

  // eslint-disable-next-line
  const { id, handleBack } = props;

  useMount(async () => {
    const response = await supabase
      .from("recipes")
      .select(QUERY)
      .eq("id", id)
      .maybeSingle();

    setData(response.data);
  });

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleBack}>BACK</button>
      <div>{data.title}</div>
      <div>{data.description}</div>

      <div>
        {data.images.map(({ url, id }) => (
          <img
            key={id}
            src={url}
            alt=""
            style={{ width: "6rem", height: "6rem" }}
          />
        ))}
      </div>

      <div>{data.cookTime}</div>
      <div>{data.prepTime}</div>
      <div>{data.published}</div>

      <ol>
        {data.instructions
          .sort((a, b) => parseInt(b.step) - parseInt(a.step))
          .map(({ description, id, step }) => (
            <li key={id}>
              {description} ({step})
            </li>
          ))}
      </ol>
    </div>
  );
};
