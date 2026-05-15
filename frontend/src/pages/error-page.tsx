import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Oops! 🚧</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{(error as { statusText?: string; message?: string }).statusText || (error as { message?: string }).message}</i>
      </p>
      <Link replace to="/">Return to Safety</Link>
    </div>
  );
}