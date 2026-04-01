import * as prismic from "@prismicio/client";

export const repositoryName = "seine-maritimetest-tour";

export const client = prismic.createClient(repositoryName, {
  accessToken: "",
  defaultParams: {
    lang: "*",
  },
});
