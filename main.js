const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const meal = 'Lunch'; // or 'Dinner'

parseMenuWithCategories()

function getMenu() {
    const today = new Date();
    //love javascript dates
    const formattedDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear().toString().slice(-2)}`;
   
    return axios({
        method: 'post',
        url: 'https://www.absecom.psu.edu/menus/user-pages/daily-menu.cfm',
        data: `selMenuDate=${encodeURIComponent(formattedDate)}&selMeal=${meal}&selCampus=46`,
    })
    .then(response => response.data)
    .catch(error => {
        console.error('Error fetching menu:', error);
        throw error;
    });
}

async function parseMenuWithCategories() {

    const html = await getMenu();

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

    console.dir(menu, { depth: null });
    return;
}