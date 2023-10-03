import { Html, Head, Main, NextScript } from "next/document";
import { getInitColorSchemeScript } from "@mui/material/styles";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Effortlessly manage projects with our powerful 
                        project management app. Stay organized, 
                        collaborate with your team, and track progress all
                        in one place. Increase productivity, communication,
                        and never miss a deadline again. Try our project 
                        management app today and experience project 
                        execution from start to finish."
        />
      </Head>
      <body>
        {getInitColorSchemeScript()}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
