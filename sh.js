const {Pool} = require('pg');

const pool = new Pool({
    connectionString: 'postgres://postgres:$Asuka8955meh@localhost:5432/shakespearu',
    ssl: false
});

(async () => {
    let right = await pool.query('SELECT word FROM quiz WHERE id = 40;');
    let wrong = await pool.query('SELECT word FROM quiz WHERE id = 41;');
    right = right.rows[0].word;
    wrong = wrong.rows[0].word;
    await pool.query('UPDATE quiz SET _right = $1, _wrong = $2 WHERE id = 1;', [right, wrong]);

    for (let i = 1; i < 40; i++) {
        right = await pool.query('SELECT word FROM quiz WHERE id = $1;', [i]);
        wrong = await pool.query('SELECT word FROM quiz WHERE id = $1;', [i+41]);
        right = right.rows[0].word;
        wrong = wrong.rows[0].word;
        await pool.query('UPDATE quiz SET _right = $1, _wrong = $2 WHERE id = $3;', [right, wrong, i+1]);
    }
})();