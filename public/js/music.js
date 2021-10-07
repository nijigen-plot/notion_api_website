const contentsEl = document.querySelector('#contents')
const loadingEl = document.querySelector('#loading')
let loading = false

// ------------------------------- Musicページコンテンツ
// music_contentsのデータを読み込む
const getMusicContentsFromBackend = async() => {
    loading = true
    const res = await fetch('https://quark-hardcore.com/music_contents')
    const data = await res.json()
    loading = false
    return data
}

const addMusicContentsToDom = async() => {
    const contents = await getMusicContentsFromBackend()

    if (!loading){
        loadingEl.innerHTML = ''
    }

    for (const i of contents[1]){
        const div = document.createElement('div')
        div.innerHTML = `
        <a href=${contents[0][i].properties.URL.url} class="list-group-item list-group-item-action py-3 lh-tight" aria-current="true" style="border-width:0cm" target="blank" rel="noopener noreferrer">
            <div class="d-flex w-100 align-items-center justify-content-between">
                <h3 class="mb-1">・${contents[0][i].properties.Name.title[0].plain_text}</h3>
                <p>${contents[0][i].properties.Column.date.start}</p>
            </div>
        <div class="badge bg-secondary">${contents[0][i].properties.Tags.select.name}</div>
        </a>
        `
        contentsEl.appendChild(div)
    }
}

addMusicContentsToDom()
