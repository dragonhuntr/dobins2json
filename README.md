
# dobins2json

Scraper for Penn State's Food Service Menu.
The parsed menu is organized into categories and items, along with any associated attributes (e.g., dietary notes).

## Usage

The script is configured to scrape and parse the daily menu for the current date and the specified meal. Currently its set to Behrend but can be changed by changing the ``selCampus`` query param to the respective ids

Included in this repo is ``main.js``, for running locally, and ``workers.js`` for Cloudflare Workers.

## Worker Deployment
```
1. Create a Cloudflare Worker (https://workers.cloudflare.com/)
2. Upload workers.js to worker
3. ???
4. Profit!
```

## Query Parameters

The Worker accepts the following query parameters:

``meal``: Specifies the meal type, either ``Breakfast``, ``Lunch`` or ``Dinner``. Defaults to ``Lunch`` if not provided.

``date:`` Specifies the date in MM/DD/YY format. Defaults to the current date if not provided.

## Why?
I didn't feel like pressing 5 buttons and waiting 2 minutes to check the menu on the Penn State Go app.

