const axios = require('axios');
const fs = require('fs');
const marked = require('marked');

const engine = (template, ...data) =>
    template.map((s, i) => s + (data[i] || '')).join('');


async function* paginate() {
    let url = 'https://swapi.py4e.com/api/people/';

    while (url) {
        const response = await axios.get(url);
        yield response;
        url = response.data.next;
    }
}


const getData = async () => {
    let results = [];

    for await (const response of paginate()) {
        results = results.concat(response.data.results);
    }

    return {
        count: results.length,
        results
    };
};


const render = data => {
    const title = 'Star Wars API';
    const { count, results } = data;

    const markdown = engine`
# ${title}

Tem ${count} personagens na base de dados.

## Lista de personagens

Name | Height | Mass | Hair Color | Skin Color | Eye Color | Birth Year | Gender
---- | ------ | ---- | ---------- | ---------- | --------- | ---------- | -------
${results
            .map(item =>
                [
                    item.name,
                    item.height,
                    item.mass,
                    item.hair_color,
                    item.skin_color,
                    item.eye_color,
                    item.birth_year,
                    item.gender
                ].join(' | ')
            )
            .join('\n')}
`;

    const body = marked.parse(markdown);

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #181616ff; padding: 8px; }
    th { background: #f4f4f4; }
  </style>
</head>
<body>
${body}
</body>
</html>
`;
};


getData()
    .then(render)
    .then(html =>
        fs.writeFileSync('personagens-star-wars.html', html, 'utf-8')
    )
    .then(() => {
        console.log('✅ personagens-star-wars.html gerado com sucesso!');
        process.exit();
    })
    .catch(err => console.error('Erro:', err.message));
