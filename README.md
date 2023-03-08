# STATS 401 Final Project

By Sichang He, Neil Kelly, Gezhi Wang, Yuxuan Wang for STATS 401 @DKU.

## [Poster](https://sichanghe.github.io/STATS401_final_project/)

## [Video demo](https://www.youtube.com/watch?v=O3lZ8QfCdi4)

## Roles and Responsibilities

Steven:

- Set up the Svelte development infrastructure.
- Acquired the GeoJSON data for the earthquake distribution map.
- Visualized the earthquake distribution map and added all the interactions to it.
- Tokenized the Twitter posts with the tokenizer and visualized the word cloud.
- Made the hover tooltip cards for the map and the word cloud.
- Created the layout for the poster and themed the poster.
- Added the QR code to the webpage into the poster.
- Formatted the report and did a grammar check, added figures and labeled the screenshot of interactions.

Neil:

- Scraped tweets for initial sentiment analysis vis
- Generated final dataset of sentiment analysis box plots
- Generated dataset for histogram of magnitude vs frequency
- Generated dataset for scatterplot + built proof of concept vis and regression model (but not included on poster)
- Helped teammates debug/push code to repository
- Wrote description of box plots, histogram, frequency graph, report discussion, report conclusion
- Implemented hover interaction for histogram

Yuxuan

- Scraped tweets for initial frequency of tweets vis
- Generated final dataset of frequency of tweets vis
- Visualized the sentiment analysis box plot and added all the interactions
- Visualized the frequency of tweets line graph and added all the interactions
- Modify report

Gezhi

- Suggested the Turkey-Syria earthquake to be the topic of the project
- Get the data on the earthquake from the USGS website
- Visualized the frequency-magnitude histogram
- Implemented interaction for histogram
- Implemented zooming interaction for line graph
- Helped to do grammar checking and modify the report.

## Developing

1. Make sure you have Node.js installed.
1. `cd` into the root of this project.
1. run

    ```bash
    npm i
    ```

1. Start a development server:

    ```bash
    npm run dev

    # or start the server and open the app in a new browser tab
    npm run dev -- --open
    ```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an
> [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Copying notice

All rights reserved.
Libraries, copied code, and fonts used follow their own licenses.

However, feel free to copy portions of code and use it in your own project.
