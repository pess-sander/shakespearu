const port = process.env.PORT || 8000;
const conString = process.env.DATABASE_URL || 'postgres://postgres:$Asuka8955meh@localhost:5432/shakespearu';
const ssl = (process.env.PORT) ? { rejectUnauthorized: false } : false;

const express = require('express');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const ngram = require('google-ngram');
const axios = require('axios').default;
const { Pool } = require('pg');
const { Server } = require('http');
const router = express.Router();
const app = express();

const pool = new Pool({
    connectionString: conString,
    ssl: ssl
});

async function renderPlay(book_src) {
    let f = false;
    let book_content = '';
    while (book_src.length > 0) {
        let firstChar = book_src[0];
        let nextChar = book_src.substr(book_src.indexOf('\n')+1, 1);

        //console.log(nextChar + '\n');

        if (!f) {
        switch (firstChar) {
            case '#':
                book_content += '<p class="book-act">';
                break;
            case '%':
                book_content += '<p class="book-scene">';
                break;
            case '~':
                book_content += '<p class="book-description">';
                break;
            case '*':
                book_content += '<p class="book-character">';
                break;
            case '>':
                book_content += '<p class="book-replica">';
                break;
            default:
                book_content += '<p>';
                break;
        }
        } else {
            book_content += '<br>';
        }

        if (book_src.indexOf('\n') != -1) {
            book_content += book_src.slice(1, book_src.indexOf('\n'));
            book_src = book_src.substring(book_src.indexOf('\n')+1);
        } else {
            book_content += book_src.substring(1);
            book_src = '';
        }

        if (firstChar == '>' && nextChar == '>') {
            f = true;
        } else {
            f = false;
            book_content += '</p>';
        }
    }

    let client = await pool.connect();

    book_content = book_content.replace(/w\{(.*)\}/g, '<a href="/dictionary/$1" class="book-word">$1</a>');
    // let idioms = Array.from(book_content.matchAll(/i\{(.*)\}/g));
    let idioms = book_content.match(/i\{(.*)\}/g);
    for (let i = 0; i < idioms.length; i++) {
        let data =  await pool.query('SELECT * FROM dict WHERE LOWER(title) = LOWER($1::varchar(256))', [idioms[i].slice(2, -1)]);
        //console.log(idioms[i][1]);
        let idiom_href = data.rows[0].link;
        book_content = book_content.replace(/i\{(.*)\}/, '<a href="/dictionary/' + idiom_href + '" class="book-idiom">$1</a>');
    }

    let puns = book_content.match(/p\{(.*)\}/g);
    for (let i = 0; i < puns.length; i++) {
        let data =  await pool.query('SELECT * FROM dict WHERE LOWER(title) = LOWER($1::varchar(256))', [puns[i].slice(2, -1)]);
        let pun_href = data.rows[0].link;
        book_content = book_content.replace(/p\{(.*)\}/, '<a href="/dictionary/' + pun_href + '" class="book-pun">$1</a>');
    }

    client.release();
    return book_content;
}

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());

app.get('/', (req, res) => {
    let current_year = new Date().getFullYear();
    res.render('index', {
        title: 'Главная',
        current_year: current_year
    });
});

app.get('/books', (req, res) => {
    let current_year = new Date().getFullYear();
    res.render('books', {
        title: 'Книги',
        current_year: current_year
    });
});

app.get('/books/:route', async (req, res, next) => {
    // res.sendFile(path.join(__dirname, 'index.html'));
    let current_year = new Date().getFullYear();
    let view = req.query.view || 'contents';
    let book_id = req.params.route;
    let is_contents = false;
    let is_act = false;

    try {
        let book_src = fs.readFileSync(path.join(__dirname, 'static/books/' + book_id + '.sl'), 'utf-8');
        let page_title = book_src.slice(0, book_src.indexOf('\n'));
        book_src = book_src.substring(book_src.indexOf('\n')+1);
        let book_title = book_src.slice(0, book_src.indexOf('\n'));
        book_src = book_src.substring(book_src.indexOf('\n')+1);
        let book_subtitle = book_src.slice(0, book_src.indexOf('\n'));
        book_src = book_src.substring(book_src.indexOf('\n')+1);
        let book_content = '';

        let acts_count = book_src.split('#').length - 1;
        let current_act = 0;

        if (view == 'contents') {
            is_contents = true;
            let i = 1;
            while (book_src.indexOf('#') != -1) {
                book_content += '<a class="contents-item" href="/books/' + book_id + '?view=act' + i++ + '">';
                book_content += book_src.slice(book_src.indexOf('#')+1, book_src.indexOf('\n'));
                book_content += '</a>';
                book_src = book_src.substring(book_src.indexOf('#')+1);
                book_src = book_src.substring(book_src.indexOf('#'));
            }
        } else if (view == 'fulltext') {
            book_content = await renderPlay(book_src);
        } else if (view.match(/^act\d$/).length != 0) {
            is_act = true;
            let act_num = +view.substring(3);
            if (isNaN(act_num) || act_num > acts_count || act_num < 1) next();
            current_act = act_num;
            for (let i = 1; i <= act_num; i++) {
                book_src = book_src.substring(book_src.indexOf('#')+1);
            }
            if (book_src.indexOf('#') != -1)
                book_src = '#' + book_src.substring(0, book_src.indexOf('#')-1);
            else
                book_src = '#' + book_src;

            book_content = await renderPlay(book_src);
        } else {
            next();
        }

        res.render('book', {
            title: page_title,
            current_year: current_year,
            book_title: book_title,
            book_subtitle: book_subtitle,
            book_content: book_content,
            book_id: book_id,
            is_contents: is_contents,
            is_act: is_act,
            current_act: current_act,
            acts_count: acts_count
        });
    } catch (err) {
        console.log(err);
        next();
    }
});

app.get('/dictionary', (req, res) => {
    let current_year = new Date().getFullYear();

    pool.connect()
        .then(client => {
            return client
                .query('SELECT * FROM dict ORDER BY title;')
                .then(db_res => {
                    client.release();

                    let rows_len = db_res.rows.length;
                    let titles = [];
                    let links = [];
                    let sources = [];
                    let descriptions = [];
                    let types = [];

                    for (let i = 0; i < rows_len; i++) {
                        titles[i] = db_res.rows[i].title;
                        links[i] = db_res.rows[i].link;
                        sources[i] = db_res.rows[i].source;
                        descriptions[i] = db_res.rows[i].description;
                        types[i] = db_res.rows[i].type;
                    }

                    res.render('dictionary', {
                        title: 'Словарь',
                        current_year: current_year,
                        ditems_count: rows_len,
                        titles: titles,
                        links: links,
                        sources: sources,
                        descriptions: descriptions,
                        types: types
                    });
                })
                .catch(db_err => {
                    client.release();
                    console.log(db_err);
                    next();
                })
        });
});

app.get('/dictionary/:route', (req, res, next) => {
    let current_year = new Date().getFullYear();

    pool.connect()
        .then(client => {
            return client
                .query('SELECT * FROM dict WHERE link = $1;', [req.params.route])
                .then(async db_res => {
                    client.release();

                    if (db_res.rows.length == 0) next();

                    let source = db_res.rows[0].source;
                    let translation = db_res.rows[0].translation;
                    let idiom = db_res.rows[0].title;
                    let description = db_res.rows[0].description;
                    let ipa = db_res.rows[0].ipa;
                    let type = db_res.rows[0].type;

                    res.render('dictionary_article', {
                        title: 'Словарь: ' + idiom,
                        current_year: current_year,
                        dicart_idiom: idiom,
                        dicart_scene: source,
                        dicart_translation: translation,
                        dicart_ipa: ipa,
                        dicart_link: req.params.route,
                        dicart_description: description,
                        dicart_type: type
                    });
                })
                .catch(err => {
                    client.release();
                    console.log(db_err);
                    next();
                });
        });
});

app.post('/ajax/dictionary-list', (req, res) => {
    let sort_str = req.body.reversed_sort ? ' DESC' : '';
    let search_str = '%' + req.body.search + '%';
    let source_str = req.body.sources_checked.length > 0 ? req.body.sources_checked.join(', ') : '"Hamlet", "Macbeth", "Romeo"';
    source_str = '{' + source_str + '}';
    let type_str = req.body.types_checked.length > 0 ? req.body.types_checked.join(', ') : "'word', 'pun', 'idiom'";

    pool.connect()
        .then(client => {
            return client
                .query("SELECT * FROM dict WHERE LOWER(title) LIKE LOWER($1) AND source_id && $2 AND type IN (" + type_str + ") ORDER BY title" + sort_str + ';', [search_str, source_str])
                .then(db_res => {

                    client.release();

                    let rows_len = db_res.rows.length;
                    let titles = [];
                    let links = [];
                    let sources = [];
                    let descriptions = [];
                    let types = [];

                    for (let i = 0; i < rows_len; i++) {
                        titles[i] = db_res.rows[i].title;
                        links[i] = db_res.rows[i].link;
                        sources[i] = db_res.rows[i].source;
                        descriptions[i] = db_res.rows[i].description;
                        types[i] = db_res.rows[i].type;
                    }

                    res.status(200).send({
                        ditems_count: rows_len,
                        titles: titles,
                        links: links,
                        sources: sources,
                        descriptions: descriptions,
                        types: types
                    });

                }).catch(db_err => {
                    client.release();
                    console.log(db_err);
                });
        });
});

app.post('/ajax/dictionary-chart', (req, res) => {
    let idiom = req.body.idiom;

    ngram.getNGram(idiom, {smoothing: 0, case_insensitive: true}).then(r => {
        let all_cases = r[0].timeseries;

        res.status(200).send({
            chart_data: all_cases
        });
    });
});

app.post('/ajax/dictionary-book', (req, res) => {
    let idiom_req = req.body.idiom_req;

    axios.get('https://www.googleapis.com/books/v1/volumes?q=' + idiom_req + '&key=AIzaSyB4m-regZ6Vc7Ojqar6HGyCuyeDCJQEOew').then((response) => {
        let books_count = response.data.items.length;
        let rand;
        while (true) {
            rand = Math.floor(Math.random() * books_count);
            if (response.data.items[rand].volumeInfo.authors)
                if (response.data.items[rand].volumeInfo.authors[0] != 'William Shakespeare') break;
        }

        let book = response.data.items[rand];
        let text_snippet = book.searchInfo && book.searchInfo.textSnippet;
        let book_title = book.volumeInfo.title;
        let book_author = book.volumeInfo.authors.join(', ');
        if (!book.searchInfo) text_snippet = book_title;

        res.status(200).send({
            text_snippet: text_snippet,
            book_title: book_title,
            book_author: book_author
        });
    }).catch((error) => {
        console.log(error);
    });
});

app.use((req, res) => {
    res.send('<h1>Error 404</h1>');
});

app.use('/', router);
app.listen(port);

console.log('Running at port ' + port + '!');