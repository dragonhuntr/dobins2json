//for cf worker

const cheerio = require('cheerio');

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = new URL(request.url);
    const meal = url.searchParams.get('meal') || 'Lunch'; //default to lunch

    try {
        const menu = await parseMenuWithCategories(meal);
        return new Response(JSON.stringify(menu), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response('Error fetching menu', { status: 500 });
    }
}

async function getMenu(meal) {
    const today = new Date();
    const formattedDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear().toString().slice(-2)}`;
   
    const response = await fetch('https://www.absecom.psu.edu/menus/user-pages/daily-menu.cfm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `selMenuDate=${encodeURIComponent(formattedDate)}&selMeal=${meal}&selCampus=46`
    });

    if (!response.ok) {
        throw new Error('Error fetching menu');
    }

    return response.text();
}

async function parseMenuWithCategories(meal) {
    const html = await getMenu(meal);
    const $ = cheerio.load(html);
    const menu = [];

    $('h2.category-header').each((index, categoryElement) => {
        const category = {};
        category.name = $(categoryElement).text().trim();
        category.items = [];

        let nextElement = $(categoryElement).next();
        while (nextElement.hasClass('menu-items')) {
            const item = {};
            item.name = nextElement.find('a').text().trim();
            item.attributes = [];
            nextElement.find('img').each((i, img) => {
                const altText = $(img).attr('alt');
                if (altText) {
                    item.attributes.push(altText);
                }
            });

            category.items.push(item);
            nextElement = nextElement.next();
        }

        menu.push(category);
    });

    return menu;
}